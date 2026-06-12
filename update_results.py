#!/usr/bin/env python3
"""
Tự động lấy kết quả từ API-Football và cập nhật vào worldcup2026.html
Chạy bởi GitHub Actions mỗi 30 phút trong suốt giải đấu.
"""

import os
import re
import json
import urllib.request

API_KEY  = os.environ.get("APIFOOTBALL_KEY", "")
HTML_FILE = "worldcup2026.html"

TEAM_MAP = {
    "MEXICO": ["Mexico"],
    "SOUTH AFRICA": ["South Africa"],
    "SOUTH KOREA": ["South Korea", "Korea Republic"],
    "CZECH REPUBLIC": ["Czech Republic", "Czechia"],
    "CANADA": ["Canada"],
    "BOSNIA & HERZEGOVINA": ["Bosnia", "Bosnia and Herzegovina", "Bosnia & Herzegovina"],
    "UNITED STATES": ["United States", "USA"],
    "PARAGUAY": ["Paraguay"],
    "AUSTRALIA": ["Australia"],
    "TÜRKİYE": ["Turkey", "Türkiye"],
    "ARGENTINA": ["Argentina"],
    "ALGERIA": ["Algeria"],
    "GERMANY": ["Germany"],
    "JAPAN": ["Japan"],
    "BELGIUM": ["Belgium"],
    "EGYPT": ["Egypt"],
    "SPAIN": ["Spain"],
    "IRAN": ["Iran"],
    "FRANCE": ["France"],
    "SENEGAL": ["Senegal"],
    "BRAZIL": ["Brazil"],
    "MOROCCO": ["Morocco"],
    "ENGLAND": ["England"],
    "CROATIA": ["Croatia"],
    "PORTUGAL": ["Portugal"],
    "GHANA": ["Ghana"],
    "NETHERLANDS": ["Netherlands", "Holland"],
    "TUNISIA": ["Tunisia"],
    "COLOMBIA": ["Colombia"],
    "QATAR": ["Qatar"],
    "URUGUAY": ["Uruguay"],
    "SAUDI ARABIA": ["Saudi Arabia"],
    "SWITZERLAND": ["Switzerland"],
    "AUSTRIA": ["Austria"],
    "ITALY": ["Italy"],
    "NORWAY": ["Norway"],
    "DENMARK": ["Denmark"],
    "PANAMA": ["Panama"],
    "POLAND": ["Poland"],
    "IVORY COAST": ["Ivory Coast", "Cote d'Ivoire"],
    "HAITI": ["Haiti"],
    "SCOTLAND": ["Scotland"],
    "CURACAO": ["Curacao", "Curaçao"],
    "SWEDEN": ["Sweden"],
    "CAPE VERDE": ["Cape Verde"],
    "NEW ZEALAND": ["New Zealand"],
    "IRAQ": ["Iraq"],
    "JORDAN": ["Jordan"],
    "DR CONGO": ["DR Congo", "Congo DR"],
    "UZBEKISTAN": ["Uzbekistan"],
    "ECUADOR": ["Ecuador"],
}

FINISHED = {"FT", "AET", "PEN", "AWD", "WO"}


def api_get(url):
    req = urllib.request.Request(url, headers={"x-apisports-key": API_KEY})
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode())


def team_matches(api_name, our_key):
    variants = TEAM_MAP.get(our_key, [our_key])
    api_lower = api_name.lower()
    return any(v.lower() == api_lower or v.lower() in api_lower for v in variants)


def find_fixture(fixtures, home_key, away_key):
    for f in fixtures:
        if team_matches(f["teams"]["home"]["name"], home_key) and \
           team_matches(f["teams"]["away"]["name"], away_key):
            return f
    return None


def shorten_name(full_name):
    parts = full_name.strip().split()
    if len(parts) > 1:
        return parts[0][0] + ". " + " ".join(parts[1:])
    return full_name


def parse_events(events, home_team_id):
    goals, reds = [], []
    for ev in events:
        side   = "home" if ev["team"]["id"] == home_team_id else "away"
        elapsed = ev["time"]["elapsed"]
        extra   = ev["time"].get("extra")
        suffix  = ("+" + str(extra)) if extra else ""
        min_str = str(elapsed) + suffix + "'"
        player  = (ev.get("player") or {}).get("name") or "?"
        short   = shorten_name(player)
        t, d    = ev.get("type", ""), ev.get("detail", "")
        if t == "Goal" and d != "Missed Penalty":
            goals.append({"team": side, "player": short, "min": min_str})
        elif t == "Card" and d in ("Red Card", "Yellow-Red Card"):
            reds.append({"team": side, "player": short, "min": min_str})
    return goals, reds


def escape_js(s):
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("'", "\\'")


def result_to_js(result):
    def ev_js(lst):
        return ", ".join(
            '{{ team: "{}", player: "{}", min: "{}" }}'.format(
                g["team"], escape_js(g["player"]), escape_js(g["min"])
            )
            for g in lst
        )
    ht = result.get("ht")
    ht_part = 'ht: "{}", '.format(ht) if ht else ""
    return (
        '{{ homeScore: {}, awayScore: {}, {}goals: [{}], reds: [{}] }}'.format(
            result["homeScore"], result["awayScore"],
            ht_part,
            ev_js(result.get("goals", [])),
            ev_js(result.get("reds", []))
        )
    )


def find_obj_end(text, start):
    """Tìm vị trí kết thúc của JS object bắt đầu từ `start`."""
    depth = 0
    for i, ch in enumerate(text[start:]):
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                return start + i + 1
    return len(text)


def main():
    if not API_KEY:
        print("APIFOOTBALL_KEY chưa được set")
        raise SystemExit(1)

    print("Đọc file HTML...")
    with open(HTML_FILE, "r", encoding="utf-8") as f:
        html = f.read()

    print("Lấy fixtures từ API-Football...")
    resp = api_get("https://v3.football.api-sports.io/fixtures?league=1&season=2026")
    if resp.get("errors"):
        print("Lỗi API:", resp["errors"])
        raise SystemExit(1)

    all_fixtures = resp.get("response", [])
    print(f"Tải được {len(all_fixtures)} fixtures")

    # Xác định vùng DATA array trong HTML
    data_start = html.find("var DATA = [")
    data_end   = find_obj_end(html, html.find("[", data_start)) + 1

    # Tìm từng match object chưa có result
    item_re = re.compile(
        r'\{\s*\n\s*id:\s*(\d+),.*?'
        r'home:\s*"([^"]+)".*?'
        r'away:\s*"([^"]+)".*?'
        r'round:\s*"[^"]+"',
        re.DOTALL
    )

    updated = 0
    search_from = data_start

    for m in item_re.finditer(html, data_start, data_end):
        match_id = int(m.group(1))
        home_key = m.group(2).strip()
        away_key = m.group(3).strip()

        obj_start = m.start()
        obj_end   = find_obj_end(html, obj_start)
        obj_text  = html[obj_start:obj_end]

        if "result:" in obj_text:
            continue  # đã có kết quả

        fixture = find_fixture(all_fixtures, home_key, away_key)
        if not fixture:
            print(f"  Không tìm thấy fixture: {home_key} vs {away_key}")
            continue

        status = fixture["fixture"]["status"]["short"]
        if status not in FINISHED:
            print(f"  Chưa kết thúc ({status}): {home_key} vs {away_key}")
            continue

        # Lấy events
        fid      = fixture["fixture"]["id"]
        ev_resp  = api_get(f"https://v3.football.api-sports.io/fixtures/events?fixture={fid}")
        goals, reds = parse_events(ev_resp.get("response", []), fixture["teams"]["home"]["id"])

        ht_h = fixture["score"]["halftime"]["home"]
        ht_a = fixture["score"]["halftime"]["away"]
        ht   = (str(ht_h) + " - " + str(ht_a)) if ht_h is not None else None

        result = {
            "homeScore": fixture["goals"]["home"],
            "awayScore": fixture["goals"]["away"],
            "ht": ht, "goals": goals, "reds": reds,
        }

        print(f"  {home_key} {result['homeScore']}-{result['awayScore']} {away_key}"
              + (f" (HT: {ht})" if ht else ""))

        # Chèn result: trước dấu } đóng cuối obj
        result_js   = result_to_js(result)
        # Tìm indent của dòng round
        round_match = re.search(r'(\s+)round:\s*"[^"]+"', obj_text)
        indent      = round_match.group(1) if round_match else "          "
        new_obj     = re.sub(
            r'(round:\s*"[^"]+"),(?\s*)\n(\s*\})',
            lambda x: x.group(0).rstrip("}").rstrip() +
                      f',\n{indent}result: {result_js},\n' +
                      x.group(2) + "}",
            obj_text, count=1
        )

        # Fallback đơn giản nếu regex phức tạp không match
        if new_obj == obj_text:
            close_pos = obj_text.rfind("}")
            new_obj = (obj_text[:close_pos].rstrip() +
                       f',\n          result: {result_js},\n        ' + "}")

        html = html[:obj_start] + new_obj + html[obj_end:]
        # Cập nhật data_end vì html đã thay đổi độ dài
        data_end += len(new_obj) - len(obj_text)
        updated += 1

    if updated:
        with open(HTML_FILE, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"\nĐã cập nhật {updated} trận vào {HTML_FILE}")
    else:
        print("\nKhông có trận mới cần cập nhật.")


if __name__ == "__main__":
    main()
