// ═══════════════════════════════════════════════
      // World Cup 2026 – Schedule & Results
      // ═══════════════════════════════════════════════
      // Sections:
      //   1. Utilities (time conversion, date helpers)
      //   2. Team data (FLAGS, VN_NAMES, EN_NAMES)
      //   3. Match Data (DATA array)
      //   4. Language & Theme
      //   5. Team Multi-Select Filter
      //   6. Match Card Expand State
      //   7. Render
      //   8. Custom Select Dropdowns
      //   9. Auto-Update (worldcup26.ir)
      //  10. View Counter
      //  11. Init
      // ═══════════════════════════════════════════════
      const SVG_SUN =
        '<path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"/>';
      const SVG_MOON =
        '<path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454l0 .008"/>';
      const VN_OFFSET_MIN = 420,
        PDT_OFFSET_MIN = -420;

      function vnTimeToPDT(t) {
        let p = t.split(":"),
          h = +p[0],
          m = +p[1];
        let pdt =
          (((h * 60 + m - VN_OFFSET_MIN + PDT_OFFSET_MIN) % 1440) + 1440) %
          1440;
        let ph = Math.floor(pdt / 60),
          pm = pdt % 60,
          ap = ph >= 12 ? "PM" : "AM";
        ph = ph % 12 || 12;
        return ph + ":" + (pm < 10 ? "0" : "") + pm + " " + ap;
      }

      // Returns day offset when converting VN time to PDT: -1, 0, or +1
      function pdtDayOffset(t) {
        let p = t.split(":"),
          h = +p[0],
          m = +p[1];
        let utcMin = h * 60 + m - VN_OFFSET_MIN;
        let pdtMin = utcMin + PDT_OFFSET_MIN;
        if (pdtMin < 0) return -1;
        if (pdtMin >= 1440) return 1;
        return 0;
      }

      // Add days to a DD/MM date string, returns {date:'DD/MM', day:vnDayName}
      const DATE_SEQUENCE = [
        { date: "11/06", day: "Thứ Năm" },
        { date: "12/06", day: "Thứ Sáu" },
        { date: "13/06", day: "Thứ Bảy" },
        { date: "14/06", day: "Chủ Nhật" },
        { date: "15/06", day: "Thứ Hai" },
        { date: "16/06", day: "Thứ Ba" },
        { date: "17/06", day: "Thứ Tư" },
        { date: "18/06", day: "Thứ Năm" },
        { date: "19/06", day: "Thứ Sáu" },
        { date: "20/06", day: "Thứ Bảy" },
        { date: "21/06", day: "Chủ Nhật" },
        { date: "22/06", day: "Thứ Hai" },
        { date: "23/06", day: "Thứ Ba" },
        { date: "24/06", day: "Thứ Tư" },
        { date: "25/06", day: "Thứ Năm" },
        { date: "26/06", day: "Thứ Sáu" },
        { date: "27/06", day: "Thứ Bảy" },
      ];
      function shiftDate(dateStr, offset) {
        let idx = DATE_SEQUENCE.findIndex(function (d) {
          return d.date === dateStr;
        });
        let newIdx = idx + offset;
        if (newIdx < 0 || newIdx >= DATE_SEQUENCE.length)
          return { date: dateStr, day: "?" };
        return DATE_SEQUENCE[newIdx];
      }
      function vnTimeToAMPM(t) {
        let p = t.split(":"),
          h = +p[0],
          m = +p[1];
        let ap = h >= 12 ? "CH" : "SA",
          h12 = h % 12 || 12;
        return h12 + ":" + (m < 10 ? "0" : "") + m + " " + ap;
      }

      const VN_DAYS_MAP = {
        "Thứ Năm": "Thứ Năm",
        "Thứ Sáu": "Thứ Sáu",
        "Thứ Bảy": "Thứ Bảy",
        "Chủ Nhật": "Chủ Nhật",
        "Thứ Hai": "Thứ Hai",
        "Thứ Ba": "Thứ Ba",
        "Thứ Tư": "Thứ Tư",
      };
      const EN_DAYS_MAP = {
        "Thứ Hai": "Monday",
        "Thứ Ba": "Tuesday",
        "Thứ Tư": "Wednesday",
        "Thứ Năm": "Thursday",
        "Thứ Sáu": "Friday",
        "Thứ Bảy": "Saturday",
        "Chủ Nhật": "Sunday",
      };
      const EN_DAY_SHORT = {
        "Thứ Hai": "Mon",
        "Thứ Ba": "Tue",
        "Thứ Tư": "Wed",
        "Thứ Năm": "Thu",
        "Thứ Sáu": "Fri",
        "Thứ Bảy": "Sat",
        "Chủ Nhật": "Sun",
      };

      function rebuildDateFilter() {
        let seen = {},
          order = [];
        DATA.forEach(function (m) {
          let dispDate = getMatchDisplayDate(m);
          if (!seen[dispDate]) {
            seen[dispDate] = true;
            let ds = DATE_SEQUENCE.find(function (d) {
              return d.date === dispDate;
            });
            order.push({ date: dispDate, dayVN: ds ? ds.day : "" });
          }
        });
        order.sort(function (a, b) {
          let ai = DATE_SEQUENCE.findIndex(function (d) {
            return d.date === a.date;
          });
          let bi = DATE_SEQUENCE.findIndex(function (d) {
            return d.date === b.date;
          });
          return ai - bi;
        });
        let sel = document.getElementById("dateFilter");
        let prev = sel.value;
        let allLabel = currentLang === "vi" ? "Tất cả ngày" : "All dates";
        sel.innerHTML = '<option value="">' + allLabel + "</option>";
        order.forEach(function (o) {
          let label =
            currentLang === "vi"
              ? o.dayVN + " " + o.date
              : (EN_DAY_SHORT[o.dayVN] || "") + " " + o.date;
          let opt = document.createElement("option");
          opt.value = o.date;
          opt.textContent = label;
          sel.appendChild(opt);
        });
        if (prev) sel.value = prev;
        // Rebuild custom date dropdown
        let currentVal = sel.value;
        let currentText = currentVal
          ? (function() {
              let o = order.find(function(x){ return x.date === currentVal; });
              if (!o) return allLabel;
              return currentLang === "vi" ? o.dayVN + " " + o.date : (EN_DAY_SHORT[o.dayVN] || "") + " " + o.date;
            })()
          : allLabel;
        document.getElementById("dateSelectLabel").textContent = currentText;
        let dd = document.getElementById("dateSelectDropdown");
        dd.innerHTML = "";
        let allOpt = document.createElement("div");
        allOpt.className = "cs-option" + (currentVal === "" ? " selected" : "");
        allOpt.setAttribute("data-value", "");
        allOpt.textContent = allLabel;
        dd.appendChild(allOpt);
        order.forEach(function (o) {
          let label = currentLang === "vi"
            ? o.dayVN + " " + o.date
            : (EN_DAY_SHORT[o.dayVN] || "") + " " + o.date;
          let div = document.createElement("div");
          div.className = "cs-option" + (currentVal === o.date ? " selected" : "");
          div.setAttribute("data-value", o.date);
          div.textContent = label;
          dd.appendChild(div);
        });
        // Attach click handlers
        dd.querySelectorAll(".cs-option").forEach(function(opt) {
          opt.addEventListener("click", function() {
            let val = this.getAttribute("data-value");
            document.getElementById("dateFilter").value = val;
            document.getElementById("dateSelectLabel").textContent = this.textContent;
            dd.querySelectorAll(".cs-option").forEach(function(o){ o.classList.remove("selected"); });
            this.classList.add("selected");
            closeDateDropdown();
            render();
          });
        });
      }

      function rebuildGroupFilter() {
        let groups = ["A","B","C","D","E","F","G","H","I","J","K","L"];
        let allLabel = currentLang === "vi" ? "Tất cả bảng" : "All groups";
        let currentVal = document.getElementById("groupFilter").value;
        let currentText = currentVal
          ? (currentLang === "vi" ? currentVal.replace("BẢNG ","Bảng ") : currentVal.replace("BẢNG ","Group "))
          : allLabel;
        document.getElementById("groupSelectLabel").textContent = currentText;
        let dd = document.getElementById("groupSelectDropdown");
        dd.innerHTML = "";
        let allOpt = document.createElement("div");
        allOpt.className = "cs-option" + (currentVal === "" ? " selected" : "");
        allOpt.setAttribute("data-value", "");
        allOpt.textContent = allLabel;
        dd.appendChild(allOpt);
        groups.forEach(function(g) {
          let val = "BẢNG " + g;
          let label = currentLang === "vi" ? "Bảng " + g : "Group " + g;
          let div = document.createElement("div");
          div.className = "cs-option" + (currentVal === val ? " selected" : "");
          div.setAttribute("data-value", val);
          div.textContent = label;
          dd.appendChild(div);
        });
        dd.querySelectorAll(".cs-option").forEach(function(opt) {
          opt.addEventListener("click", function() {
            let val = this.getAttribute("data-value");
            document.getElementById("groupFilter").value = val;
            document.getElementById("groupSelectLabel").textContent = this.textContent;
            dd.querySelectorAll(".cs-option").forEach(function(o){ o.classList.remove("selected"); });
            this.classList.add("selected");
            closeGroupDropdown();
            render();
          });
        });
      }
      const ROUND_LABELS_VI = {
        group: "Vòng bảng",
        "round-of-32": "Vòng 1/16",
        "round-of-16": "Vòng 1/8",
        quarter: "Tứ kết",
        semi: "Bán kết",
        third: "Tranh hạng Ba",
        final: "Chung kết",
      };
      const ROUND_LABELS_EN = {
        group: "Group Stage",
        "round-of-32": "Round of 32",
        "round-of-16": "Round of 16",
        quarter: "Quarter-final",
        semi: "Semi-final",
        third: "3rd Place",
        final: "Final",
      };
      const ROUND_KNOCKOUT = {
        "round-of-32": true,
        "round-of-16": true,
        quarter: true,
        semi: true,
        third: true,
        final: true,
      };

      function removeAccents(s) {
        return s
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/đ/g, "d")
          .replace(/Đ/g, "D");
      }
      function getTeamName(k) {
        return currentLang === "vi" ? (VN_NAMES[k] || k) : (EN_NAMES[k] || k);
      }
      function getRoundLabel(r) {
        return currentLang === "vi"
          ? ROUND_LABELS_VI[r] || r
          : ROUND_LABELS_EN[r] || r;
      }
      function getGroupLabel(g) {
        if (currentLang === "en") return g.replace("BẢNG ", "Group ");
        return g.replace("BẢNG ", "Bảng ");
      }
      function getDayLabel(d) {
        return currentLang === "vi" ? d : EN_DAYS_MAP[d] || d;
      }

            const FLAGS = {
        MEXICO: "🇲🇽",
        "SOUTH AFRICA": "🇿🇦",
        "SOUTH KOREA": "🇰🇷",
        "CZECH REPUBLIC": "🇨🇿",
        CANADA: "🇨🇦",
        "BOSNIA & HERZEGOVINA": "🇧🇦",
        "UNITED STATES": "🇺🇸",
        PARAGUAY: "🇵🇾",
        AUSTRALIA: "🇦🇺",
        TÜRKİYE: "🇹🇷",
        ARGENTINA: "🇦🇷",
        ALGERIA: "🇩🇿",
        GERMANY: "🇩🇪",
        JAPAN: "🇯🇵",
        BELGIUM: "🇧🇪",
        EGYPT: "🇪🇬",
        SPAIN: "🇪🇸",
        IRAN: "🇮🇷",
        FRANCE: "🇫🇷",
        SENEGAL: "🇸🇳",
        BRAZIL: "🇧🇷",
        MOROCCO: "🇲🇦",
        ENGLAND: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        CROATIA: "🇭🇷",
        PORTUGAL: "🇵🇹",
        GHANA: "🇬🇭",
        NETHERLANDS: "🇳🇱",
        TUNISIA: "🇹🇳",
        COLOMBIA: "🇨🇴",
        QATAR: "🇶🇦",
        URUGUAY: "🇺🇾",
        "SAUDI ARABIA": "🇸🇦",
        SWITZERLAND: "🇨🇭",
        AUSTRIA: "🇦🇹",
        ITALY: "🇮🇹",
        NORWAY: "🇳🇴",
        DENMARK: "🇩🇰",
        PANAMA: "🇵🇦",
        POLAND: "🇵🇱",
        "IVORY COAST": "🇨🇮",
        HAITI: "🇭🇹",
        SCOTLAND: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
        CURACAO: "🇨🇼",
        SWEDEN: "🇸🇪",
        "CAPE VERDE": "🇨🇻",
        "NEW ZEALAND": "🇳🇿",
        IRAQ: "🇮🇶",
        JORDAN: "🇯🇴",
        "DR CONGO": "🇨🇩",
        UZBEKISTAN: "🇺🇿",
        ECUADOR: "🇪🇨",
      };
      const VN_NAMES = {
        MEXICO: "Mexico",
        "SOUTH AFRICA": "Nam Phi",
        "SOUTH KOREA": "Hàn Quốc",
        "CZECH REPUBLIC": "Cộng hòa Séc",
        CANADA: "Canada",
        "BOSNIA & HERZEGOVINA": "Bosnia & Herzegovina",
        "UNITED STATES": "Mỹ",
        PARAGUAY: "Paraguay",
        AUSTRALIA: "Úc",
        TÜRKİYE: "Thổ Nhĩ Kỳ",
        ARGENTINA: "Argentina",
        ALGERIA: "Algeria",
        GERMANY: "Đức",
        JAPAN: "Nhật Bản",
        BELGIUM: "Bỉ",
        EGYPT: "Ai Cập",
        SPAIN: "Tây Ban Nha",
        IRAN: "Iran",
        FRANCE: "Pháp",
        SENEGAL: "Senegal",
        BRAZIL: "Brazil",
        MOROCCO: "Maroc",
        ENGLAND: "Anh",
        CROATIA: "Croatia",
        PORTUGAL: "Bồ Đào Nha",
        GHANA: "Ghana",
        NETHERLANDS: "Hà Lan",
        TUNISIA: "Tunisia",
        COLOMBIA: "Colombia",
        QATAR: "Qatar",
        URUGUAY: "Uruguay",
        "SAUDI ARABIA": "Ả Rập Xê Út",
        SWITZERLAND: "Thụy Sĩ",
        AUSTRIA: "Áo",
        ITALY: "Ý",
        NORWAY: "Na Uy",
        DENMARK: "Đan Mạch",
        PANAMA: "Panama",
        POLAND: "Ba Lan",
        "IVORY COAST": "Bờ Biển Ngà",
        HAITI: "Haiti",
        SCOTLAND: "Scotland",
        CURACAO: "Curacao",
        SWEDEN: "Thụy Điển",
        "CAPE VERDE": "Cabo Verde",
        "NEW ZEALAND": "New Zealand",
        IRAQ: "Iraq",
        JORDAN: "Jordan",
        "DR CONGO": "CHDC Congo",
        UZBEKISTAN: "Uzbekistan",
        ECUADOR: "Ecuador",
      };
      const EN_NAMES = {
        MEXICO: "Mexico",
        "SOUTH AFRICA": "South Africa",
        "SOUTH KOREA": "South Korea",
        "CZECH REPUBLIC": "Czech Republic",
        CANADA: "Canada",
        "BOSNIA & HERZEGOVINA": "Bosnia & Herz.",
        "UNITED STATES": "USA",
        PARAGUAY: "Paraguay",
        AUSTRALIA: "Australia",
        TÜRKİYE: "Türkiye",
        ARGENTINA: "Argentina",
        ALGERIA: "Algeria",
        GERMANY: "Germany",
        JAPAN: "Japan",
        BELGIUM: "Belgium",
        EGYPT: "Egypt",
        SPAIN: "Spain",
        IRAN: "Iran",
        FRANCE: "France",
        SENEGAL: "Senegal",
        BRAZIL: "Brazil",
        MOROCCO: "Morocco",
        ENGLAND: "England",
        CROATIA: "Croatia",
        PORTUGAL: "Portugal",
        GHANA: "Ghana",
        NETHERLANDS: "Netherlands",
        TUNISIA: "Tunisia",
        COLOMBIA: "Colombia",
        QATAR: "Qatar",
        URUGUAY: "Uruguay",
        "SAUDI ARABIA": "Saudi Arabia",
        SWITZERLAND: "Switzerland",
        AUSTRIA: "Austria",
        ITALY: "Italy",
        NORWAY: "Norway",
        DENMARK: "Denmark",
        PANAMA: "Panama",
        POLAND: "Poland",
        "IVORY COAST": "Ivory Coast",
        HAITI: "Haiti",
        SCOTLAND: "Scotland",
        CURACAO: "Curaçao",
        SWEDEN: "Sweden",
        "CAPE VERDE": "Cape Verde",
        "NEW ZEALAND": "New Zealand",
        IRAQ: "Iraq",
        JORDAN: "Jordan",
        "DR CONGO": "DR Congo",
        UZBEKISTAN: "Uzbekistan",
        ECUADOR: "Ecuador",
      };


      // ─────────────────────────────────────────────
      // SECTION: Match Data
      // result: { homeScore, awayScore, ht, goals:[{team, player, min}], reds:[...] }
      // ─────────────────────────────────────────────
      const DATA = [
        // --- 12/06 Lượt 1 ---
        {
          id: 1,
          day: "Thứ Sáu",
          date: "12/06",
          time: "02:00",
          home: "MEXICO",
          away: "SOUTH AFRICA",
          group: "BẢNG A",
          round: "group",
          result: {
            homeScore: 2,
            awayScore: 0,
            ht: "1 - 0",
            goals: [
              { team: "home", player: "J. Quiñones", min: "9'" },
              { team: "home", player: "R. Jiménez", min: "67'" },
            ],
            reds: [
              { team: "home", player: "C. Montes", min: "90'" },
              { team: "away", player: "Y. Sithole", min: "49'" },
              { team: "away", player: "T. Zwane", min: "84'" },
            ],
          },
        },
        {
          id: 2,
          day: "Thứ Sáu",
          date: "12/06",
          time: "09:00",
          home: "SOUTH KOREA",
          away: "CZECH REPUBLIC",
          group: "BẢNG A",
          round: "group",
          result: {
            homeScore: 2,
            awayScore: 1,
            ht: "0 - 0",
            goals: [
              { team: "away", player: "L. Krejci", min: "59'" },
              { team: "home", player: "Hwang In-Beom", min: "67'" },
              { team: "home", player: "Oh Hyeon-Gyu", min: "80'" },
            ],
          },
        },
        {
          id: 3,
          day: "Thứ Bảy",
          date: "13/06",
          time: "02:00",
          home: "CANADA",
          away: "BOSNIA & HERZEGOVINA",
          group: "BẢNG B",
          round: "group",
        },
        {
          id: 4,
          day: "Thứ Bảy",
          date: "13/06",
          time: "08:00",
          home: "UNITED STATES",
          away: "PARAGUAY",
          group: "BẢNG D",
          round: "group",
        },
        {
          id: 5,
          day: "Chủ Nhật",
          date: "14/06",
          time: "02:00",
          home: "QATAR",
          away: "SWITZERLAND",
          group: "BẢNG B",
          round: "group",
        },
        {
          id: 6,
          day: "Chủ Nhật",
          date: "14/06",
          time: "05:00",
          home: "BRAZIL",
          away: "MOROCCO",
          group: "BẢNG C",
          round: "group",
        },
        {
          id: 7,
          day: "Chủ Nhật",
          date: "14/06",
          time: "08:00",
          home: "HAITI",
          away: "SCOTLAND",
          group: "BẢNG C",
          round: "group",
        },
        {
          id: 8,
          day: "Chủ Nhật",
          date: "14/06",
          time: "11:00",
          home: "AUSTRALIA",
          away: "TÜRKİYE",
          group: "BẢNG D",
          round: "group",
        },
        {
          id: 9,
          day: "Thứ Hai",
          date: "15/06",
          time: "00:00",
          home: "GERMANY",
          away: "CURACAO",
          group: "BẢNG E",
          round: "group",
        },
        {
          id: 10,
          day: "Thứ Hai",
          date: "15/06",
          time: "03:00",
          home: "NETHERLANDS",
          away: "JAPAN",
          group: "BẢNG F",
          round: "group",
        },
        {
          id: 11,
          day: "Thứ Hai",
          date: "15/06",
          time: "06:00",
          home: "IVORY COAST",
          away: "ECUADOR",
          group: "BẢNG E",
          round: "group",
        },
        {
          id: 12,
          day: "Thứ Hai",
          date: "15/06",
          time: "09:00",
          home: "SWEDEN",
          away: "TUNISIA",
          group: "BẢNG F",
          round: "group",
        },
        {
          id: 13,
          day: "Thứ Hai",
          date: "15/06",
          time: "23:00",
          home: "SPAIN",
          away: "CAPE VERDE",
          group: "BẢNG H",
          round: "group",
        },
        {
          id: 14,
          day: "Thứ Ba",
          date: "16/06",
          time: "02:00",
          home: "BELGIUM",
          away: "EGYPT",
          group: "BẢNG G",
          round: "group",
        },
        {
          id: 15,
          day: "Thứ Ba",
          date: "16/06",
          time: "05:00",
          home: "SAUDI ARABIA",
          away: "URUGUAY",
          group: "BẢNG H",
          round: "group",
        },
        {
          id: 16,
          day: "Thứ Ba",
          date: "16/06",
          time: "08:00",
          home: "IRAN",
          away: "NEW ZEALAND",
          group: "BẢNG G",
          round: "group",
        },
        {
          id: 17,
          day: "Thứ Tư",
          date: "17/06",
          time: "02:00",
          home: "FRANCE",
          away: "SENEGAL",
          group: "BẢNG I",
          round: "group",
        },
        {
          id: 18,
          day: "Thứ Tư",
          date: "17/06",
          time: "05:00",
          home: "IRAQ",
          away: "NORWAY",
          group: "BẢNG I",
          round: "group",
        },
        {
          id: 19,
          day: "Thứ Tư",
          date: "17/06",
          time: "08:00",
          home: "ARGENTINA",
          away: "ALGERIA",
          group: "BẢNG J",
          round: "group",
        },
        {
          id: 20,
          day: "Thứ Tư",
          date: "17/06",
          time: "11:00",
          home: "AUSTRIA",
          away: "JORDAN",
          group: "BẢNG J",
          round: "group",
        },
        {
          id: 21,
          day: "Thứ Năm",
          date: "18/06",
          time: "00:00",
          home: "PORTUGAL",
          away: "DR CONGO",
          group: "BẢNG K",
          round: "group",
        },
        {
          id: 22,
          day: "Thứ Năm",
          date: "18/06",
          time: "03:00",
          home: "ENGLAND",
          away: "CROATIA",
          group: "BẢNG L",
          round: "group",
        },
        {
          id: 23,
          day: "Thứ Năm",
          date: "18/06",
          time: "06:00",
          home: "GHANA",
          away: "PANAMA",
          group: "BẢNG L",
          round: "group",
        },
        {
          id: 24,
          day: "Thứ Năm",
          date: "18/06",
          time: "09:00",
          home: "UZBEKISTAN",
          away: "COLOMBIA",
          group: "BẢNG K",
          round: "group",
        },
        // --- Lượt 2 ---
        {
          id: 25,
          day: "Thứ Năm",
          date: "18/06",
          time: "23:00",
          home: "CZECH REPUBLIC",
          away: "SOUTH AFRICA",
          group: "BẢNG A",
          round: "group",
        },
        {
          id: 26,
          day: "Thứ Sáu",
          date: "19/06",
          time: "02:00",
          home: "SWITZERLAND",
          away: "BOSNIA & HERZEGOVINA",
          group: "BẢNG B",
          round: "group",
        },
        {
          id: 27,
          day: "Thứ Sáu",
          date: "19/06",
          time: "05:00",
          home: "CANADA",
          away: "QATAR",
          group: "BẢNG B",
          round: "group",
        },
        {
          id: 28,
          day: "Thứ Sáu",
          date: "19/06",
          time: "08:00",
          home: "MEXICO",
          away: "SOUTH KOREA",
          group: "BẢNG A",
          round: "group",
        },
        {
          id: 29,
          day: "Thứ Bảy",
          date: "20/06",
          time: "02:00",
          home: "UNITED STATES",
          away: "AUSTRALIA",
          group: "BẢNG C",
          round: "group",
        },
        {
          id: 30,
          day: "Thứ Bảy",
          date: "20/06",
          time: "05:00",
          home: "SCOTLAND",
          away: "MOROCCO",
          group: "BẢNG D",
          round: "group",
        },
        {
          id: 31,
          day: "Thứ Bảy",
          date: "20/06",
          time: "07:30",
          home: "BRAZIL",
          away: "HAITI",
          group: "BẢNG D",
          round: "group",
        },
        {
          id: 32,
          day: "Thứ Bảy",
          date: "20/06",
          time: "10:00",
          home: "TÜRKİYE",
          away: "PARAGUAY",
          group: "BẢNG C",
          round: "group",
        },
        {
          id: 33,
          day: "Chủ Nhật",
          date: "21/06",
          time: "00:00",
          home: "NETHERLANDS",
          away: "SWEDEN",
          group: "BẢNG F",
          round: "group",
        },
        {
          id: 34,
          day: "Chủ Nhật",
          date: "21/06",
          time: "03:00",
          home: "GERMANY",
          away: "IVORY COAST",
          group: "BẢNG E",
          round: "group",
        },
        {
          id: 35,
          day: "Chủ Nhật",
          date: "21/06",
          time: "07:00",
          home: "ECUADOR",
          away: "CURACAO",
          group: "BẢNG E",
          round: "group",
        },
        {
          id: 36,
          day: "Chủ Nhật",
          date: "21/06",
          time: "11:00",
          home: "TUNISIA",
          away: "JAPAN",
          group: "BẢNG F",
          round: "group",
        },
        {
          id: 37,
          day: "Chủ Nhật",
          date: "21/06",
          time: "23:00",
          home: "SPAIN",
          away: "SAUDI ARABIA",
          group: "BẢNG G",
          round: "group",
        },
        {
          id: 38,
          day: "Thứ Hai",
          date: "22/06",
          time: "02:00",
          home: "BELGIUM",
          away: "IRAN",
          group: "BẢNG H",
          round: "group",
        },
        {
          id: 39,
          day: "Thứ Hai",
          date: "22/06",
          time: "05:00",
          home: "URUGUAY",
          away: "CAPE VERDE",
          group: "BẢNG G",
          round: "group",
        },
        {
          id: 40,
          day: "Thứ Hai",
          date: "22/06",
          time: "08:00",
          home: "NEW ZEALAND",
          away: "EGYPT",
          group: "BẢNG H",
          round: "group",
        },
      ];

      // ─────────────────────────────────────────────
      // SECTION: Language & Theme
      // ─────────────────────────────────────────────
      let currentLang = "vi";

      let htmlEl = document.documentElement;
      let toggleIcon = document.getElementById("toggleIcon");
      let currentTheme = "light";
      function applyTheme(t) {
        currentTheme = t;
        htmlEl.setAttribute("data-theme", t);
        toggleIcon.innerHTML = t === "dark" ? SVG_MOON : SVG_SUN;
      }
      applyTheme("light");
      document
        .getElementById("themeToggle")
        .addEventListener("click", function () {
          applyTheme(currentTheme === "dark" ? "light" : "dark");
        });

      document
        .getElementById("langTzToggle")
        .addEventListener("click", function () {
          currentLang = currentLang === "vi" ? "en" : "vi";
          document
            .getElementById("btnVN")
            .classList.toggle("active", currentLang === "vi");
          document
            .getElementById("btnUS")
            .classList.toggle("active", currentLang === "en");
          applyI18n();
          rebuildDateFilter();
          rebuildGroupFilter();
          renderChips();
          renderTeamList(document.getElementById("teamSearchInput").value);
          render();
        });
      function applyI18n() {
        document.querySelectorAll(".i18n").forEach(function (el) {
          let v = el.getAttribute("data-" + currentLang);
          if (v !== null) el.textContent = v;
        });
        document.getElementById("headerTitle").textContent =
          currentLang === "vi"
            ? "LỊCH THI ĐẤU WORLD CUP 2026"
            : "FIFA WORLD CUP 2026 SCHEDULE";
        document.getElementById("headerTz").innerHTML =
          currentLang === "vi"
            ? "Giờ Việt Nam 🇻🇳 &nbsp;"
            : "California Time 🇺🇸 &nbsp;";
        document.getElementById("teamSearchInput").placeholder =
          currentLang === "vi"
            ? "Tìm đội (tiếng Việt hoặc tiếng Anh)..."
            : "Search team (English or Vietnamese)...";
        document.getElementById("weekLabel").textContent =
          currentLang === "vi" ? "— Lịch thi đấu —" : "— Match Schedule —";
      }

      // ─────────────────────────────────────────────
      // SECTION: Team Multi-Select Filter
      // ─────────────────────────────────────────────
      let selectedTeams = [];
      const ALL_TEAMS = Object.keys(FLAGS).sort(function (a, b) {
        return ((VN_NAMES[a] || a)).localeCompare((VN_NAMES[b] || b), "vi");
      });
      let dropdownOpen = false;
      let _skipClose = false;
      function openDropdown() {
        dropdownOpen = true;
        document.getElementById("teamDropdown").classList.add("open");
        document.getElementById("teamSelectTrigger").classList.add("open");
        document.getElementById("triggerChevron").classList.add("open");
        document.getElementById("teamSearchInput").value = "";
        renderTeamList("");
        setTimeout(function () {
          document.getElementById("teamSearchInput").focus();
        }, 50);
      }
      function closeDropdown() {
        dropdownOpen = false;
        document.getElementById("teamDropdown").classList.remove("open");
        document.getElementById("teamSelectTrigger").classList.remove("open");
        document.getElementById("triggerChevron").classList.remove("open");
      }
      document
        .getElementById("teamSelectTrigger")
        .addEventListener("click", function (e) {
          if (e.target.classList.contains("chip-remove")) return;
          if (dropdownOpen) closeDropdown();
          else openDropdown();
        });
      document.addEventListener("click", function (e) {
        if (!dropdownOpen) return;
        if (_skipClose) {
          _skipClose = false;
          return;
        }
        if (!document.getElementById("teamSelectWrapper").contains(e.target))
          closeDropdown();
      });
      document
        .getElementById("teamSearchInput")
        .addEventListener("input", function () {
          renderTeamList(this.value);
        });
      function clearAll() {
        selectedTeams = [];
        updateClearLabelBtn();
        renderChips();
        renderTeamList(document.getElementById("teamSearchInput").value);
        render();
      }
      document
        .getElementById("clearAllBtn")
        .addEventListener("click", function (e) {
          e.stopPropagation();
          clearAll();
        });
      document
        .getElementById("clearLabelBtn")
        .addEventListener("click", function (e) {
          e.stopPropagation();
          clearAll();
        });
      function updateClearLabelBtn() {
        document
          .getElementById("clearLabelBtn")
          .classList.toggle("visible", selectedTeams.length > 0);
      }
      function toggleTeam(k) {
        _skipClose = true;
        let i = selectedTeams.indexOf(k);
        if (i === -1) selectedTeams.push(k);
        else selectedTeams.splice(i, 1);
        updateClearLabelBtn();
        renderChips();
        renderTeamList(document.getElementById("teamSearchInput").value);
        render();
      }
      function removeTeam(k) {
        selectedTeams = selectedTeams.filter(function (t) {
          return t !== k;
        });
        updateClearLabelBtn();
        renderChips();
        render();
      }
      function renderChips() {
        let el = document.getElementById("teamChips");
        if (!selectedTeams.length) {
          el.innerHTML =
            '<span class="trigger-placeholder">' +
            (currentLang === "vi" ? "Chọn đội bóng..." : "Select teams...") +
            "</span>";
          return;
        }
        el.innerHTML = selectedTeams
          .map(function (k) {
            return (
              '<span class="team-chip"><span class="chip-flag">' +
              ((FLAGS[k] || "🏳") || "🏳") +
              "</span><span>" +
              getTeamName(k) +
              '</span><span class="chip-remove" data-key="' +
              k +
              '">×</span></span>'
            );
          })
          .join("");
        el.querySelectorAll(".chip-remove").forEach(function (e) {
          e.addEventListener("click", function (ev) {
            ev.stopPropagation();
            removeTeam(this.getAttribute("data-key"));
          });
        });
      }
      function renderTeamList(q) {
        let ql = q.trim().toLowerCase(),
          qna = removeAccents(ql);
        let f = ALL_TEAMS.filter(function (k) {
          if (!ql) return true;
          let vn = VN_NAMES[k] || "",
            en = (EN_NAMES[k] || k);
          return (
            vn.toLowerCase().indexOf(ql) !== -1 ||
            en.toLowerCase().indexOf(ql) !== -1 ||
            removeAccents(vn.toLowerCase()).indexOf(qna) !== -1 ||
            removeAccents(en.toLowerCase()).indexOf(qna) !== -1
          );
        });
        let el = document.getElementById("teamList");
        if (!f.length) {
          el.innerHTML =
            '<div class="team-option-none">' +
            (currentLang === "vi"
              ? "Không tìm thấy đội bóng"
              : "No team found") +
            "</div>";
          return;
        }
        el.innerHTML = f
          .map(function (k) {
            let s = selectedTeams.indexOf(k) !== -1;
            return (
              '<div class="team-option' +
              (s ? " selected" : "") +
              '" data-key="' +
              k +
              '"><span class="opt-flag">' +
              ((FLAGS[k] || "🏳") || "🏳") +
              '</span><span class="opt-name">' +
              getTeamName(k) +
              '</span><span class="opt-check"></span></div>'
            );
          })
          .join("");
        el.querySelectorAll(".team-option").forEach(function (e) {
          e.addEventListener("click", function () {
            toggleTeam(this.getAttribute("data-key"));
          });
        });
      }

      // ─────────────────────────────────────────────
      // SECTION: Match Card Expand State
      // ─────────────────────────────────────────────
      let expandedId = null;

      // ─────────────────────────────────────────────
      // SECTION: Render
      // ─────────────────────────────────────────────
      function getMatchDisplayDate(m) {
        // Returns the date string that this match appears under in the current lang/tz
        if (currentLang === "en") {
          let off = pdtDayOffset(m.time);
          if (off !== 0) return shiftDate(m.date, off).date;
        }
        return m.date;
      }

      function getFiltered() {
        let d = document.getElementById("dateFilter").value,
          g = document.getElementById("groupFilter").value;
        return DATA.filter(function (m) {
          if (d && getMatchDisplayDate(m) !== d) return false;
          if (g && m.group !== g) return false;
          if (
            selectedTeams.length > 0 &&
            selectedTeams.indexOf(m.home) === -1 &&
            selectedTeams.indexOf(m.away) === -1
          )
            return false;
          return true;
        });
      }

      function buildResultDetail(m) {
        let r = m.result;
        if (!r) return "";

        let homeN = getTeamName(m.home),
          awayN = getTeamName(m.away);
        let finishedLabel = currentLang === "vi" ? "Kết thúc" : "Full Time";
        let htLabel = currentLang === "vi" ? "Hiệp một:" : "HT:";

        // Hero: status badge + score box + HT
        let htHtml = "";
        if (r.ht !== undefined) {
          htHtml = '<div class="rd-ht">' + htLabel + " " + r.ht + "</div>";
        }
        let hero =
          '<div class="rd-hero">' +
          '<div class="rd-team-name">' +
          homeN +
          "</div>" +
          '<div class="rd-score-box">' +
          '<div class="rd-status-badge">' +
          finishedLabel +
          "</div>" +
          '<div class="rd-score-main"><span class="rd-score-num">' +
          r.homeScore +
          '</span><span class="rd-score-sep">-</span><span class="rd-score-num">' +
          r.awayScore +
          "</span></div>" +
          htHtml +
          "</div>" +
          '<div class="rd-team-name">' +
          awayN +
          "</div>" +
          "</div>";

        // Events: interleave home/away goals and reds in one unified list
        let allEvents = [];
        (r.goals || []).forEach(function (g) {
          allEvents.push({
            team: g.team,
            icon: "⚽",
            player: g.player,
            min: g.min,
            sort: parseInt(g.min),
          });
        });
        (r.reds || []).forEach(function (g) {
          allEvents.push({
            team: g.team,
            icon: "🟥",
            player: g.player,
            min: g.min,
            sort: parseInt(g.min),
          });
        });
        allEvents.sort(function (a, b) {
          return a.sort - b.sort;
        });

        let evRows = "";
        allEvents.forEach(function (ev) {
          let txt =
            '<span class="rd-event-icon">' +
            ev.icon +
            "</span>" +
            '<span class="rd-event-text">' +
            ev.player +
            "</span>" +
            '<span class="rd-event-min">(' +
            ev.min +
            ")</span>";
          if (ev.team === "home") {
            evRows += '<div class="rd-event-home">' + txt + "</div><div></div>";
          } else {
            evRows += '<div></div><div class="rd-event-away">' + txt + "</div>";
          }
        });

        let events = evRows
          ? '<div class="rd-events">' + evRows + "</div>"
          : "";
        return (
          '<div class="result-detail' +
          (expandedId === m.id ? " open" : "") +
          '" id="detail-' +
          m.id +
          '">' +
          hero +
          events +
          "</div>"
        );
      }

      function matchCard(m) {
        let hf = (FLAGS[m.home] || "🏳") || "🏳",
          af = (FLAGS[m.away] || "🏳") || "🏳";
        let homeN = getTeamName(m.home),
          awayN = getTeamName(m.away);
        let primaryTime =
          currentLang === "vi" ? vnTimeToAMPM(m.time) : vnTimeToPDT(m.time);
        let isKnockout = !!ROUND_KNOCKOUT[m.round];
        let roundBadge =
          '<span class="round-badge' +
          (isKnockout ? " knockout" : "") +
          '">' +
          getRoundLabel(m.round) +
          "</span>";
        let badgeHtml =
          m.round === "group"
            ? '<span class="group-badge">' +
              getGroupLabel(m.group) +
              "</span>" +
              roundBadge
            : roundBadge;

        let centerHtml,
          hasResult = !!m.result;
        if (hasResult) {
          let hint =
            currentLang === "vi" ? "Nhấn để xem chi tiết" : "Tap for details";
          centerHtml =
            '<div style="text-align:center;">' +
            '<div class="score-block" style="justify-content:center;"><span class="score-num">' +
            m.result.homeScore +
            '</span><span class="score-dash">-</span><span class="score-num">' +
            m.result.awayScore +
            "</span></div>" +
            '<div class="result-hint"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4m0 4h.01"/><circle cx="12" cy="12" r="9"/></svg>' +
            hint +
            "</div>" +
            "</div>";
        } else {
          centerHtml = '<div class="vs">VS</div>';
        }

        return (
          '<div class="match-card' +
          (hasResult ? " has-result" : "") +
          '" data-id="' +
          m.id +
          '">' +
          '<div class="card-top"><div class="card-top-left"><span class="match-time">' +
          primaryTime +
          '</span></div><div class="card-top-right">' +
          badgeHtml +
          "</div></div>" +
          '<div class="card-body">' +
          '<div class="team team-left"><span class="team-name">' +
          homeN +
          '</span><span class="flag">' +
          hf +
          "</span></div>" +
          centerHtml +
          '<div class="team team-right"><span class="flag">' +
          af +
          '</span><span class="team-name">' +
          awayN +
          "</span></div>" +
          "</div>" +
          buildResultDetail(m) +
          "</div>"
        );
      }

      function render() {
        let filtered = getFiltered();
        let sched = document.getElementById("schedule");
        let days = {},
          teams = {},
          groups = {};
        filtered.forEach(function (m) {
          days[m.date] = 1;
          teams[m.home] = 1;
          teams[m.away] = 1;
          groups[m.group] = 1;
        });
        document.getElementById("statMatches").textContent = filtered.length;
        document.getElementById("statDays").textContent =
          Object.keys(days).length;
        document.getElementById("statGroups").textContent =
          Object.keys(groups).length;
        document.getElementById("statTeams").textContent =
          Object.keys(teams).length;
        if (!filtered.length) {
          sched.innerHTML =
            '<div class="empty"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.039 5.062a7 7 0 0 0 9.91 9.89m1.584 -2.434a7 7 0 0 0 -9.038 -9.057"/><path d="M3 3l18 18"/></svg>' +
            (currentLang === "vi"
              ? "Không tìm thấy trận đấu phù hợp.<br>Thử thay đổi bộ lọc khác."
              : "No matches found.<br>Try changing your filters.") +
            "</div>";
          return;
        }
        let byDate = {},
          dateOrder = [];
        filtered.forEach(function (m) {
          let useDate = m.date,
            useDay = m.day;
          if (currentLang === "en") {
            let off = pdtDayOffset(m.time);
            if (off !== 0) {
              let shifted = shiftDate(m.date, off);
              useDate = shifted.date;
              useDay = shifted.day;
            }
          }
          if (!byDate[useDate]) {
            byDate[useDate] = { day: useDay, matches: [] };
            dateOrder.push(useDate);
          }
          byDate[useDate].matches.push(m);
        });
        // Sort dateOrder chronologically
        dateOrder.sort(function (a, b) {
          let ai = DATE_SEQUENCE.findIndex(function (d) {
            return d.date === a;
          });
          let bi = DATE_SEQUENCE.findIndex(function (d) {
            return d.date === b;
          });
          return ai - bi;
        });
        sched.innerHTML = dateOrder
          .map(function (date) {
            let block = byDate[date];
            return (
              '<div class="day-block"><div class="day-header"><span class="day-label">' +
              getDayLabel(block.day) +
              '</span><span class="day-date">' +
              date +
              '/2026</span></div><div class="matches">' +
              block.matches.map(matchCard).join("") +
              "</div></div>"
            );
          })
          .join("");

        // Click handlers for cards with results
        sched
          .querySelectorAll(".match-card.has-result")
          .forEach(function (card) {
            card.addEventListener("click", function () {
              let id = parseInt(this.getAttribute("data-id"), 10);
              let detail = this.querySelector(".result-detail");
              if (expandedId === id) {
                expandedId = null;
                if (detail) detail.classList.remove("open");
              } else {
                // close previous
                let prev = sched.querySelector(".result-detail.open");
                if (prev) prev.classList.remove("open");
                expandedId = id;
                if (detail) detail.classList.add("open");
              }
            });
          });
      }

      document.getElementById("dateFilter").addEventListener("change", render);
      document.getElementById("groupFilter").addEventListener("change", render);

      // ─────────────────────────────────────────────
      // SECTION: Custom Select Dropdowns (Date & Group)
      // ─────────────────────────────────────────────
      let dateDropOpen = false;
      let groupDropOpen = false;

      // Generic open/close for custom select dropdowns
      function openCustomSelect(prefix) {
        window["_" + prefix + "Open"] = true;
        document.getElementById(prefix + "SelectDropdown").classList.add("open");
        document.getElementById(prefix + "SelectTrigger").classList.add("open");
      }
      function closeCustomSelect(prefix) {
        window["_" + prefix + "Open"] = false;
        document.getElementById(prefix + "SelectDropdown").classList.remove("open");
        document.getElementById(prefix + "SelectTrigger").classList.remove("open");
      }
      function openDateDropdown()  { openCustomSelect("date"); }
      function closeDateDropdown() { closeCustomSelect("date"); }
      function openGroupDropdown()  { openCustomSelect("group"); }
      function closeGroupDropdown() { closeCustomSelect("group"); }
      document.getElementById("dateSelectTrigger").addEventListener("click", function(e) {
        e.stopPropagation();
        if (groupDropOpen) closeGroupDropdown();
        if (dateDropOpen) closeDateDropdown(); else openDateDropdown();
      });
      document.getElementById("groupSelectTrigger").addEventListener("click", function(e) {
        e.stopPropagation();
        if (dateDropOpen) closeDateDropdown();
        if (groupDropOpen) closeGroupDropdown(); else openGroupDropdown();
      });
      document.addEventListener("click", function(e) {
        if (dateDropOpen && !document.getElementById("dateSelectWrapper").contains(e.target)) closeDateDropdown();
        if (groupDropOpen && !document.getElementById("groupSelectWrapper").contains(e.target)) closeGroupDropdown();
      });

      // Init
      rebuildDateFilter();
      rebuildGroupFilter();
      renderTeamList("");
      render();

      // ─────────────────────────────────────────────
      // SECTION: View Counter
      // ─────────────────────────────────────────────
      const COUNTER_LS_KEY   = 'wc2026_last_view';   // timestamp lần xem cuối
      const COUNTER_OWNER_KEY = 'wc2026_is_owner';   // flag chủ sở hữu
      const COUNTER_COOLDOWN  = 60 * 60 * 1000;      // 1 tiếng (ms)

      function formatCount(count) {
        if (count >= 1000000) return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        if (count >= 1000)    return Math.floor(count / 1000) + 'K';
        return count.toString();
      }

      async function fetchCountOnly() {
        // Chỉ đọc, không tăng (dùng endpoint /info hoặc /up nhưng đọc count hiện tại)
        let r = await fetch('https://api.counterapi.dev/v1/hunglehien1012/worldcup2026/');
        if (!r.ok) throw new Error();
        return (await r.json()).count || 0;
      }

      async function fetchAndIncrement() {
        let r = await fetch('https://api.counterapi.dev/v1/hunglehien1012/worldcup2026/up');
        if (!r.ok) throw new Error();
        return (await r.json()).count || 0;
      }

      async function initViewCounter() {
        let numEl   = document.getElementById('viewCountNum');
        let labelEl = document.getElementById('viewCountLabel');
        try {
          let isOwner = false;
          let shouldCount = false;

          try { isOwner = !!localStorage.getItem(COUNTER_OWNER_KEY); } catch(e) {}

          if (isOwner) {
            // Chủ sở hữu: chỉ đọc số, không tăng
            let count = await fetchCountOnly();
            numEl.textContent = formatCount(count);
          } else {
            // Kiểm tra cooldown 1 tiếng
            let lastView = 0;
            try { lastView = parseInt(localStorage.getItem(COUNTER_LS_KEY) || '0'); } catch(e) {}
            let now = Date.now();
            shouldCount = (now - lastView) >= COUNTER_COOLDOWN;

            let count;
            if (shouldCount) {
              count = await fetchAndIncrement();
              try { localStorage.setItem(COUNTER_LS_KEY, now.toString()); } catch(e) {}
            } else {
              count = await fetchCountOnly();
            }
            numEl.textContent = formatCount(count);
          }

          labelEl.textContent = currentLang === 'vi' ? 'lượt xem' : 'views';
        } catch(e) {
          numEl.textContent = '';
          labelEl.textContent = '';
        }
      }

      // Hàm đánh dấu thiết bị hiện tại là chủ sở hữu (gọi từ console: setOwnerDevice())
      window.setOwnerDevice = function() {
        try {
          localStorage.setItem(COUNTER_OWNER_KEY, '1');
          console.log('%c✅ Thiết bị này đã được đánh dấu là chủ sở hữu. Lượt xem sẽ không được tính.', 'color: green; font-weight: bold');
        } catch(e) { console.error('Không thể lưu vào localStorage'); }
      };
      window.removeOwnerDevice = function() {
        try {
          localStorage.removeItem(COUNTER_OWNER_KEY);
          console.log('%c✅ Đã xóa flag chủ sở hữu.', 'color: orange; font-weight: bold');
        } catch(e) {}
      };

      initViewCounter();

      // Sticky shadow on scroll
      window.addEventListener("scroll", function () {
        let sticky = document.querySelector(".sticky-top");
        if (sticky) sticky.classList.toggle("scrolled", window.scrollY > 10);
      });
    