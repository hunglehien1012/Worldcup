#!/usr/bin/env python3
"""
Lấy kết quả World Cup 2026 từ worldcup26.ir (miễn phí, không cần key, realtime)
và cập nhật vào worldcup2026.html
Chạy bởi GitHub Actions mỗi 30 phút.
"""

import re
import json
import urllib.request

SOURCE_URL = "https://worldcup26.ir/get/games"
HTML_FILE  = "worldcup2026.js"

# Map tên đội API -> key trong HTML
TEAM_MAP = {
    "Mexico":                 "MEXICO",
    "South Africa":           "SOUTH AFRICA",
    "South Korea":            "SOUTH KOREA",
    "Korea Republic":         "SOUTH KOREA",
    "Czech Republic":         "CZECH REPUBLIC",
    "Czechia":                "CZECH REPUBLIC",
    "Canada":                 "CANADA",
    "Bosnia & Herzegovina":   "BOSNIA & HERZEGOVINA",
    "Bosnia and Herzegovina": "BOSNIA & HERZEGOVINA",
    "Bosnia-Herzegovina":     "BOSNIA & HERZEGOVINA",
    "United States":          "UNITED STATES",
    "USA":                    "UNITED STATES",
    "Paraguay":               "PARAGUAY",
    "Australia":              "AUSTRALIA",
    "Turkey":                 "TÜRKİYE",
    "Türkiye":                "TÜRKİYE",
    "Argentina":              "ARGENTINA",
    "Algeria":                "ALGERIA",
    "Germany":                "GERMANY",
    "Japan":                  "JAPAN",
    "Belgium":                "BELGIUM",
    "Egypt":                  "EGYPT",
    "Spain":                  "SPAIN",
    "Iran":                   "IRAN",
    "France":                 "FRANCE",
    "Senegal":                "SENEGAL",
    "Brazil":                 "BRAZIL",
    "Morocco":                "MOROCCO",
    "England":                "ENGLAND",
    "Croatia":                "CROATIA",
    "Portugal":               "PORTUGAL",
    "Ghana":                  "GHANA",
    "Netherlands":            "NETHERLANDS",
    "Tunisia":                "TUNISIA",
    "Colombia":               "COLOMBIA",
    "Qatar":                  "QATAR",
    "Uruguay":                "URUGUAY",
    "Saudi Arabia":           "SAUDI ARABIA",
    "Switzerland":            "SWITZERLAND",
    "Austria":                "AUSTRIA",
    "Italy":                  "ITALY",
    "Norway":                 "NORWAY",
    "Denmark":                "DENMARK",
    "Panama":                 "PANAMA",
    "Poland":                 "POLAND",
    "Ivory Coast":            "IVORY COAST",
    "Cote d'Ivoire":          "IVORY COAST",
    "Haiti":                  "HAITI",
    "Scotland":               "SCOTLAND",
    "Curacao":                "CURACAO",
    "Curaçao":                "CURACAO",
    "Sweden":                 "SWEDEN",
    "Cape Verde":             "CAPE VERDE",
    "New Zealand":            "NEW ZEALAND",
    "Iraq":                   "IRAQ",
    "Irak":                   "IRAQ",
    "Jordan":                 "JORDAN",
    "DR Congo":               "DR CONGO",
    "Congo DR":               "DR CONGO",
    "Uzbekistan":             "UZBEKISTAN",
    "Ecuador":                "ECUADOR",
}

def normalize(name):
    name = name.strip()
    # Thử exact match trước
    if name in TEAM_MAP:
        return TEAM_MAP[name]
    # Thử case-insensitive
    for k, v in TEAM_MAP.items():
        if k.lower() == name.lower():
            return v
    return name.upper()

def find_obj_end(text, start):
    depth = 0
    for i, ch in enumerate(text[start:]):
        if ch == '{': depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                return start + i + 1
    return len(text)

def escape_js(s):
    return s.replace('\\', '\\\\').replace('"', '\\"')

def result_to_js(home_score, away_score, ht=None, goals=None, reds=None):
    def ev_js(lst):
        return ", ".join(
            '{{ team: "{}", player: "{}", min: "{}" }}'.format(
                g["team"], escape_js(g["player"]), escape_js(g["min"])
            ) for g in (lst or [])
        )
    ht_part = 'ht: "{}", '.format(ht) if ht else ""
    return (
        '{{ homeScore: {}, awayScore: {}, {}goals: [{}], reds: [{}] }}'.format(
            home_score, away_score, ht_part,
            ev_js(goals or []), ev_js(reds or [])
        )
    )

def parse_goals(match, home_key, away_key):
    """Parse danh sách bàn thắng nếu API trả về."""
    goals = []
    # worldcup26.ir trả về scorers trong field "scorers" hoặc "goals"
    for field in ("scorers", "goals", "events"):
        items = match.get(field, [])
        if not items:
            continue
        for item in items:
            # Tìm team side
            team_name = item.get("team") or item.get("team_name") or ""
            side = "home" if normalize(team_name) == home_key else "away"
            player = item.get("player") or item.get("name") or item.get("player_name") or "?"
            # Rút gọn tên
            parts = player.strip().split()
            short = (parts[0][0] + ". " + " ".join(parts[1:])) if len(parts) > 1 else player
            minute = str(item.get("minute") or item.get("time") or item.get("min") or "?")
            if not minute.endswith("'"):
                minute += "'"
            event_type = (item.get("type") or item.get("event_type") or "goal").lower()
            if "goal" in event_type and "missed" not in event_type and "own" not in event_type:
                goals.append({"team": side, "player": short, "min": minute})
            elif "own" in event_type:
                # Own goal tính cho đội đối
                goals.append({"team": "away" if side == "home" else "home",
                              "player": short + " (OG)", "min": minute})
        if goals:
            break
    return goals

def main():
    print("Tải dữ liệu từ worldcup26.ir...")
    req = urllib.request.Request(
        SOURCE_URL,
        headers={"User-Agent": "Mozilla/5.0", "Accept": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        raw = resp.read().decode()

    data = json.loads(raw)

    # worldcup26.ir trả về list hoặc object có key "games"/"matches"
    if isinstance(data, list):
        matches = data
    else:
        matches = (data.get("games") or data.get("matches") or
                   data.get("data") or [])

    print(f"Tải được {len(matches)} trận")

    # Xây dict kết quả: (home_key, away_key) -> info
    results = {}
    for m in matches:
        # Lấy tên đội - API có thể dùng nhiều field khác nhau
        home_raw = (m.get("home_team") or m.get("team1") or
                    m.get("home") or {})
        away_raw = (m.get("away_team") or m.get("team2") or
                    m.get("away") or {})

        # home_raw có thể là dict {"name":...} hoặc string
        if isinstance(home_raw, dict):
            home_name = (home_raw.get("name_en") or home_raw.get("name") or
                         home_raw.get("en") or "")
        else:
            home_name = str(home_raw)

        if isinstance(away_raw, dict):
            away_name = (away_raw.get("name_en") or away_raw.get("name") or
                         away_raw.get("en") or "")
        else:
            away_name = str(away_raw)

        if not home_name or not away_name:
            continue

        home_key = normalize(home_name)
        away_key = normalize(away_name)

        # Kiểm tra trận đã kết thúc
        status = (m.get("status") or m.get("state") or "").upper()
        finished = status in ("FT", "FINISHED", "FULL_TIME", "FULLTIME",
                              "AET", "PEN", "ENDED", "COMPLETED", "3")

        # Điểm số
        score = m.get("score") or m.get("result") or {}
        if isinstance(score, dict):
            home_score = score.get("home") or score.get("ft", [None, None])[0]
            away_score = score.get("away") or score.get("ft", [None, None])[-1]
            ht_raw = score.get("ht") or score.get("halftime")
        else:
            home_score = m.get("home_score") or m.get("score_home")
            away_score = m.get("away_score") or m.get("score_away")
            ht_raw = None

        # Thử field trực tiếp nếu score rỗng
        if home_score is None:
            home_score = m.get("home_score") or m.get("goals_home")
        if away_score is None:
            away_score = m.get("away_score") or m.get("goals_away")

        if not finished or home_score is None or away_score is None:
            continue

        # Half-time
        if isinstance(ht_raw, list) and len(ht_raw) == 2:
            ht_str = f"{ht_raw[0]} - {ht_raw[1]}"
        elif isinstance(ht_raw, dict):
            ht_str = f"{ht_raw.get('home', 0)} - {ht_raw.get('away', 0)}"
        else:
            ht_str = None

        goals = parse_goals(m, home_key, away_key)

        results[(home_key, away_key)] = {
            "homeScore": int(home_score),
            "awayScore": int(away_score),
            "ht": ht_str,
            "goals": goals,
        }

    print(f"Có {len(results)} trận đã kết thúc")

    if not results:
        print("Không có kết quả mới.")
        return

    with open(HTML_FILE, "r", encoding="utf-8") as f:
        html = f.read()

    data_start = html.find("var DATA = [")
    data_end   = find_obj_end(html, html.find("[", data_start)) + 1

    item_re = re.compile(
        r'\{\s*\n\s*id:\s*(\d+),.*?'
        r'home:\s*"([^"]+)".*?'
        r'away:\s*"([^"]+)".*?'
        r'round:\s*"[^"]+"',
        re.DOTALL
    )

    updated = 0
    for m in item_re.finditer(html, data_start, data_end):
        home_key = m.group(2).strip()
        away_key = m.group(3).strip()

        obj_start = m.start()
        obj_end   = find_obj_end(html, obj_start)
        obj_text  = html[obj_start:obj_end]

        if "result:" in obj_text:
            continue

        key = (home_key, away_key)
        if key not in results:
            continue

        r = results[key]
        result_js = result_to_js(
            r["homeScore"], r["awayScore"],
            r.get("ht"), r.get("goals", [])
        )

        print(f"  ✅ {home_key} {r['homeScore']}-{r['awayScore']} {away_key}"
              + (f" (HT: {r['ht']})" if r.get("ht") else ""))

        close_pos = obj_text.rfind("}")
        new_obj = (
            obj_text[:close_pos].rstrip()
            + f',\n          result: {result_js},\n        }}'
        )

        html     = html[:obj_start] + new_obj + html[obj_end:]
        data_end += len(new_obj) - len(obj_text)
        updated  += 1

    if updated:
        with open(HTML_FILE, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"\n🎉 Đã cập nhật {updated} trận vào {HTML_FILE}")
    else:
        print("\nKhông có trận mới cần cập nhật.")

if __name__ == "__main__":
    main()
