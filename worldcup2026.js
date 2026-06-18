var SVG_SUN =
  '<path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"/>';
var SVG_MOON =
  '<path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454l0 .008"/>';
var VN_OFFSET_MIN = 420,
  PDT_OFFSET_MIN = -420;

function vnTimeToPDT(t) {
  var p = t.split(":"),
    h = +p[0],
    m = +p[1];
  var pdt =
    (((h * 60 + m - VN_OFFSET_MIN + PDT_OFFSET_MIN) % 1440) + 1440) % 1440;
  var ph = Math.floor(pdt / 60),
    pm = pdt % 60,
    ap = ph >= 12 ? "PM" : "AM";
  ph = ph % 12 || 12;
  return ph + ":" + (pm < 10 ? "0" : "") + pm + " " + ap;
}

// Returns day offset when converting VN time to PDT: -1, 0, or +1
function pdtDayOffset(t) {
  var p = t.split(":"),
    h = +p[0],
    m = +p[1];
  var utcMin = h * 60 + m - VN_OFFSET_MIN;
  var pdtMin = utcMin + PDT_OFFSET_MIN;
  if (pdtMin < 0) return -1;
  if (pdtMin >= 1440) return 1;
  return 0;
}

// Add days to a DD/MM date string, returns {date:'DD/MM', day:vnDayName}
var DATE_SEQUENCE = [
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
  var idx = DATE_SEQUENCE.findIndex(function (d) {
    return d.date === dateStr;
  });
  var newIdx = idx + offset;
  if (newIdx < 0 || newIdx >= DATE_SEQUENCE.length)
    return { date: dateStr, day: "?" };
  return DATE_SEQUENCE[newIdx];
}
function vnTimeToAMPM(t) {
  var p = t.split(":"),
    h = +p[0],
    m = +p[1];
  var ap = h >= 12 ? "CH" : "SA",
    h12 = h % 12 || 12;
  return h12 + ":" + (m < 10 ? "0" : "") + m + " " + ap;
}

// ===== FLAGS =====
// Inline SVG cờ — hoạt động 100% không cần CDN, không cần internet
var FLAGS = {
  MEXICO: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="1" height="2" fill="#006847"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#ce1126"/></svg>',
  "SOUTH AFRICA": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#007A4D"/><polygon points="0,0 1.2,1 0,2" fill="#FFB612"/><polygon points="0,0.2 1,1 0,1.8" fill="#000"/><rect y="0.7" width="3" height="0.6" fill="#FFB612"/><rect y="0.75" width="3" height="0.5" fill="#fff"/><rect y="0.83" width="3" height="0.34" fill="#DE3831"/></svg>',
  "SOUTH KOREA": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#fff"/><circle cx="1.5" cy="1" r="0.45" fill="#C60C30"/><path d="M1.5,0.55 A0.45,0.45 0 0,1 1.5,1.45" fill="#003478"/></svg>',
  "CZECH REPUBLIC": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#fff"/><rect y="1" width="3" height="1" fill="#D7141A"/><polygon points="0,0 1.5,1 0,2" fill="#11457E"/></svg>',
  CANADA: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#fff"/><rect width="0.75" height="2" fill="#FF0000"/><rect x="2.25" width="0.75" height="2" fill="#FF0000"/><polygon points="1.5,0.3 1.35,0.8 0.85,0.75 1.2,1.05 1,1.5 1.5,1.2 2,1.5 1.8,1.05 2.15,0.75 1.65,0.8" fill="#FF0000"/></svg>',
  "BOSNIA & HERZEGOVINA": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#002395"/><polygon points="0.5,0 2.5,2 0.5,2" fill="#FBDE23"/></svg>',
  "UNITED STATES": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 10"><rect width="19" height="10" fill="#B22234"/><rect y="0.77" width="19" height="0.77" fill="#fff"/><rect y="1.54" width="19" height="0.77" fill="#B22234"/><rect y="2.31" width="19" height="0.77" fill="#fff"/><rect y="3.08" width="19" height="0.77" fill="#B22234"/><rect y="3.85" width="19" height="0.77" fill="#fff"/><rect y="4.62" width="19" height="0.77" fill="#B22234"/><rect y="5.38" width="19" height="0.77" fill="#fff"/><rect y="6.15" width="19" height="0.77" fill="#B22234"/><rect y="6.92" width="19" height="0.77" fill="#fff"/><rect y="7.69" width="19" height="0.77" fill="#B22234"/><rect y="8.46" width="19" height="0.77" fill="#fff"/><rect y="9.23" width="19" height="0.77" fill="#B22234"/><rect width="7.6" height="5.38" fill="#3C3B6E"/></svg>',
  PARAGUAY: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#D52B1E"/><rect y="0.67" width="3" height="0.67" fill="#fff"/><rect y="1.33" width="3" height="0.67" fill="#009B3A"/></svg>',
  AUSTRALIA: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#00008B"/><rect width="1.2" height="1" fill="#C8102E"/><rect x="0.5" width="0.2" height="1" fill="#fff"/><rect y="0.4" width="1.2" height="0.2" fill="#fff"/><rect x="0.1" y="0.1" width="1" height="0.8" fill="none" stroke="#fff" stroke-width="0.3"/></svg>',
  TÜRKİYE: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#E30A17"/><circle cx="1.2" cy="1" r="0.4" fill="#fff"/><circle cx="1.35" cy="1" r="0.32" fill="#E30A17"/><polygon points="1.7,1 1.95,0.88 1.87,1.15 2.05,0.92 1.78,1.08 2.05,1.08 1.78,0.92 1.87,1.08 1.95,1.12 1.7,1" fill="#fff"/></svg>',
  ARGENTINA: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#74ACDF"/><rect y="0.67" width="3" height="0.67" fill="#fff"/><circle cx="1.5" cy="1" r="0.2" fill="#F6B40E"/></svg>',
  ALGERIA: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="1.5" height="2" fill="#fff"/><rect x="1.5" width="1.5" height="2" fill="#006233"/><circle cx="1.35" cy="1" r="0.35" fill="#D21034"/><circle cx="1.45" cy="1" r="0.27" fill="#fff"/></svg>',
  GERMANY: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3"><rect width="5" height="3" fill="#000"/><rect y="1" width="5" height="1" fill="#DD0000"/><rect y="2" width="5" height="1" fill="#FFCE00"/></svg>',
  JAPAN: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#fff"/><circle cx="1.5" cy="1" r="0.4" fill="#BC002D"/></svg>',
  BELGIUM: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="1" height="2" fill="#000"/><rect x="1" width="1" height="2" fill="#FAE042"/><rect x="2" width="1" height="2" fill="#ED2939"/></svg>',
  EGYPT: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#CE1126"/><rect y="0.67" width="3" height="0.67" fill="#fff"/><rect y="1.33" width="3" height="0.67" fill="#000"/><rect x="1.3" y="0.75" width="0.4" height="0.5" fill="#C09300"/></svg>',
  SPAIN: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#AA151B"/><rect y="0.5" width="3" height="1" fill="#F1BF00"/></svg>',
  IRAN: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#239F40"/><rect y="0.67" width="3" height="0.67" fill="#fff"/><rect y="1.33" width="3" height="0.67" fill="#DA0000"/></svg>',
  FRANCE: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="1" height="2" fill="#002395"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#ED2939"/></svg>',
  SENEGAL: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="1" height="2" fill="#00853F"/><rect x="1" width="1" height="2" fill="#FDEF42"/><rect x="2" width="1" height="2" fill="#E31B23"/><polygon points="1.5,0.5 1.6,0.85 1.95,0.85 1.67,1.05 1.77,1.4 1.5,1.2 1.23,1.4 1.33,1.05 1.05,0.85 1.4,0.85" fill="#00853F"/></svg>',
  BRAZIL: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#009C3B"/><polygon points="1.5,0.2 2.9,1 1.5,1.8 0.1,1" fill="#FEDF00"/><circle cx="1.5" cy="1" r="0.35" fill="#002776"/></svg>',
  MOROCCO: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#C1272D"/><polygon points="1.5,0.5 1.62,0.88 2,0.88 1.69,1.1 1.81,1.5 1.5,1.28 1.19,1.5 1.31,1.1 1,0.88 1.38,0.88" fill="none" stroke="#006233" stroke-width="0.06"/></svg>',
  ENGLAND: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#fff"/><rect x="1.3" width="0.4" height="2" fill="#CF111A"/><rect y="0.8" width="3" height="0.4" fill="#CF111A"/></svg>',
  CROATIA: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#FF0000"/><rect y="0.67" width="3" height="0.67" fill="#fff"/><rect y="1.33" width="3" height="0.67" fill="#0000CC"/></svg>',
  PORTUGAL: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="1" height="2" fill="#006600"/><rect x="1" width="2" height="2" fill="#FF0000"/><circle cx="1" cy="1" r="0.3" fill="#FFD700" stroke="#003399" stroke-width="0.05"/></svg>',
  GHANA: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#006B3F"/><rect y="0.67" width="3" height="0.67" fill="#FCD116"/><rect y="1.33" width="3" height="0.67" fill="#CE1126"/><polygon points="1.5,0.67 1.62,1.05 2,1.05 1.69,1.28 1.81,1.67 1.5,1.44 1.19,1.67 1.31,1.28 1,1.05 1.38,1.05" fill="#000"/></svg>',
  NETHERLANDS: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#AE1C28"/><rect y="0.67" width="3" height="0.67" fill="#fff"/><rect y="1.33" width="3" height="0.67" fill="#21468B"/></svg>',
  TUNISIA: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#E70013"/><circle cx="1.5" cy="1" r="0.5" fill="#fff"/><circle cx="1.5" cy="1" r="0.4" fill="#E70013"/><circle cx="1.4" cy="1" r="0.32" fill="#fff"/><circle cx="1.5" cy="1" r="0.25" fill="#E70013"/></svg>',
  COLOMBIA: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#FCD116"/><rect y="1" width="3" height="0.5" fill="#003087"/><rect y="1.5" width="3" height="0.5" fill="#CE1126"/></svg>',
  QATAR: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="0.9" height="2" fill="#fff"/><polygon points="0.9,0 3,0 3,2 0.9,2 1.4,1.75 1.1,1.5 1.4,1.25 1.1,1 1.4,0.75 1.1,0.5 1.4,0.25" fill="#8D1B3D"/></svg>',
  URUGUAY: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#fff"/><rect y="0.22" width="3" height="0.22" fill="#75AADB"/><rect y="0.67" width="3" height="0.22" fill="#75AADB"/><rect y="1.11" width="3" height="0.22" fill="#75AADB"/><rect y="1.56" width="3" height="0.22" fill="#75AADB"/><circle cx="0.6" cy="0.7" r="0.28" fill="#F4C800"/></svg>',
  "SAUDI ARABIA": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#006C35"/><text x="1.5" y="1.2" font-size="0.6" text-anchor="middle" fill="#fff">🌴</text></svg>',
  SWITZERLAND: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><rect width="1" height="1" fill="#FF0000"/><rect x="0.38" y="0.18" width="0.24" height="0.64" fill="#fff"/><rect x="0.18" y="0.38" width="0.64" height="0.24" fill="#fff"/></svg>',
  AUSTRIA: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#ED2939"/><rect y="0.67" width="3" height="0.67" fill="#fff"/></svg>',
  ITALY: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="1" height="2" fill="#009246"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#CE2B37"/></svg>',
  NORWAY: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 16"><rect width="22" height="16" fill="#EF2B2D"/><rect x="6" width="4" height="16" fill="#fff"/><rect y="6" width="22" height="4" fill="#fff"/><rect x="7" width="2" height="16" fill="#002868"/><rect y="7" width="22" height="2" fill="#002868"/></svg>',
  DENMARK: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37 28"><rect width="37" height="28" fill="#C60C30"/><rect x="12" width="5" height="28" fill="#fff"/><rect y="11.5" width="37" height="5" fill="#fff"/></svg>',
  PANAMA: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 2"><rect width="2" height="1" fill="#fff"/><rect x="2" y="1" width="2" height="1" fill="#fff"/><rect x="2" width="2" height="1" fill="#D21034"/><rect y="1" width="2" height="1" fill="#0072C6"/><circle cx="1" cy="1" r="0.35" fill="#0072C6"/><circle cx="3" cy="1" r="0.35" fill="#D21034"/></svg>',
  POLAND: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#fff"/><rect y="1" width="3" height="1" fill="#DC143C"/></svg>',
  "IVORY COAST": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="1" height="2" fill="#F77F00"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#009A44"/></svg>',
  HAITI: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#00209F"/><rect y="1" width="3" height="1" fill="#D21034"/><rect x="1.2" y="0.6" width="0.6" height="0.8" fill="#fff"/></svg>',
  SCOTLAND: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3"><rect width="5" height="3" fill="#005EB8"/><line x1="0" y1="0" x2="5" y2="3" stroke="#fff" stroke-width="0.7"/><line x1="5" y1="0" x2="0" y2="3" stroke="#fff" stroke-width="0.7"/></svg>',
  CURACAO: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#002B7F"/><rect y="1.4" width="3" height="0.3" fill="#F9E814"/><circle cx="0.5" cy="0.6" r="0.15" fill="#fff"/><circle cx="0.8" cy="0.4" r="0.15" fill="#fff"/></svg>',
  SWEDEN: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10"><rect width="16" height="10" fill="#006AA7"/><rect x="5" width="2" height="10" fill="#FECC02"/><rect y="4" width="16" height="2" fill="#FECC02"/></svg>',
  "CAPE VERDE": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#003893"/><rect y="1.1" width="3" height="0.25" fill="#fff"/><rect y="1.4" width="3" height="0.15" fill="#CF2027"/><rect y="1.6" width="3" height="0.25" fill="#fff"/></svg>',
  "NEW ZEALAND": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#00247D"/><rect width="1.2" height="1" fill="#CC142B"/><rect x="0.5" width="0.2" height="1" fill="#fff"/><rect y="0.4" width="1.2" height="0.2" fill="#fff"/></svg>',
  IRAQ: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#CE1126"/><rect y="0.67" width="3" height="0.67" fill="#fff"/><rect y="1.33" width="3" height="0.67" fill="#000"/><text x="1.5" y="1.15" font-size="0.5" text-anchor="middle" fill="#007A3D">نصر</text></svg>',
  JORDAN: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#007A3D"/><rect y="0.67" width="3" height="0.67" fill="#fff"/><rect y="1.33" width="3" height="0.67" fill="#000"/><polygon points="0,0 1,1 0,2" fill="#CE1126"/></svg>',
  "DR CONGO": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#007FFF"/><line x1="0" y1="2" x2="3" y2="0" stroke="#F7D618" stroke-width="0.4"/><circle cx="0.2" cy="1.8" r="0.25" fill="#F7D618"/></svg>',
  UZBEKISTAN: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#1EB53A"/><rect y="0.6" width="3" height="0.8" fill="#fff"/><rect y="0.67" width="3" height="0.07" fill="#CE1126"/><rect y="1.27" width="3" height="0.07" fill="#CE1126"/><rect width="3" height="0.6" fill="#1EBFAF"/></svg>',
  ECUADOR: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="#FFD100"/><rect y="0.5" width="3" height="0.75" fill="#034F8C"/><rect y="1.25" width="3" height="0.75" fill="#EF3340"/></svg>',
};

// Trả về thẻ SVG cờ inline — không cần CDN, hoạt động 100% mọi môi trường
function getFlagImg(teamKey, size) {
  var svg = FLAGS[teamKey];
  if (!svg) return '<span style="font-size:1.2em">🏳</span>';
  var px = size || 32;
  var h = Math.round(px * 0.67);
  return (
    '<span style="display:inline-block;width:' + px + 'px;height:' + h + 'px;' +
    'vertical-align:middle;border-radius:2px;overflow:hidden;border:1px solid rgba(0,0,0,0.1);">' +
    svg.replace('<svg ', '<svg style="width:100%;height:100%;" ') +
    '</span>'
  );
}
var VN_NAMES = {
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
var EN_NAMES = {
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

var VN_DAYS_MAP = {
  "Thứ Năm": "Thứ Năm",
  "Thứ Sáu": "Thứ Sáu",
  "Thứ Bảy": "Thứ Bảy",
  "Chủ Nhật": "Chủ Nhật",
  "Thứ Hai": "Thứ Hai",
  "Thứ Ba": "Thứ Ba",
  "Thứ Tư": "Thứ Tư",
};
var EN_DAYS_MAP = {
  "Thứ Hai": "Monday",
  "Thứ Ba": "Tuesday",
  "Thứ Tư": "Wednesday",
  "Thứ Năm": "Thursday",
  "Thứ Sáu": "Friday",
  "Thứ Bảy": "Saturday",
  "Chủ Nhật": "Sunday",
};
var EN_DAY_SHORT = {
  "Thứ Hai": "Mon",
  "Thứ Ba": "Tue",
  "Thứ Tư": "Wed",
  "Thứ Năm": "Thu",
  "Thứ Sáu": "Fri",
  "Thứ Bảy": "Sat",
  "Chủ Nhật": "Sun",
};

function rebuildDateFilter() {
  var seen = {},
    order = [];
  DATA.forEach(function (m) {
    var dispDate = getMatchDisplayDate(m);
    if (!seen[dispDate]) {
      seen[dispDate] = true;
      var ds = DATE_SEQUENCE.find(function (d) {
        return d.date === dispDate;
      });
      order.push({ date: dispDate, dayVN: ds ? ds.day : "" });
    }
  });
  order.sort(function (a, b) {
    var ai = DATE_SEQUENCE.findIndex(function (d) {
      return d.date === a.date;
    });
    var bi = DATE_SEQUENCE.findIndex(function (d) {
      return d.date === b.date;
    });
    return ai - bi;
  });
  var sel = document.getElementById("dateFilter");
  var prev = sel.value;
  var allLabel = currentLang === "vi" ? "Tất cả ngày" : "All dates";
  sel.innerHTML = '<option value="">' + allLabel + "</option>";
  order.forEach(function (o) {
    var label =
      currentLang === "vi"
        ? o.dayVN + " " + o.date
        : (EN_DAY_SHORT[o.dayVN] || "") + " " + o.date;
    var opt = document.createElement("option");
    opt.value = o.date;
    opt.textContent = label;
    sel.appendChild(opt);
  });
  if (prev) sel.value = prev;
  // Rebuild custom date dropdown
  var currentVal = sel.value;
  var currentText = currentVal
    ? (function () {
        var o = order.find(function (x) {
          return x.date === currentVal;
        });
        if (!o) return allLabel;
        return currentLang === "vi"
          ? o.dayVN + " " + o.date
          : (EN_DAY_SHORT[o.dayVN] || "") + " " + o.date;
      })()
    : allLabel;
  document.getElementById("dateSelectLabel").textContent = currentText;
  var dd = document.getElementById("dateSelectDropdown");
  dd.innerHTML = "";
  var allOpt = document.createElement("div");
  allOpt.className = "cs-option" + (currentVal === "" ? " selected" : "");
  allOpt.setAttribute("data-value", "");
  allOpt.textContent = allLabel;
  dd.appendChild(allOpt);
  order.forEach(function (o) {
    var label =
      currentLang === "vi"
        ? o.dayVN + " " + o.date
        : (EN_DAY_SHORT[o.dayVN] || "") + " " + o.date;
    var div = document.createElement("div");
    var past = isDatePast(o.date);
    div.className =
      "cs-option" +
      (currentVal === o.date ? " selected" : "") +
      (past ? " past-day" : "");
    div.setAttribute("data-value", o.date);
    div.textContent = label;
    dd.appendChild(div);
  });
  // Attach click handlers
  dd.querySelectorAll(".cs-option").forEach(function (opt) {
    opt.addEventListener("click", function () {
      var val = this.getAttribute("data-value");
      document.getElementById("dateFilter").value = val;
      document.getElementById("dateSelectLabel").textContent = this.textContent;
      dd.querySelectorAll(".cs-option").forEach(function (o) {
        o.classList.remove("selected");
      });
      this.classList.add("selected");
      closeDateDropdown();
      render();
    });
  });
}

function rebuildGroupFilter() {
  var groups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  var allLabel = currentLang === "vi" ? "Tất cả bảng" : "All groups";
  var currentVal = document.getElementById("groupFilter").value;
  var currentText = currentVal
    ? currentLang === "vi"
      ? currentVal.replace("BẢNG ", "Bảng ")
      : currentVal.replace("BẢNG ", "Group ")
    : allLabel;
  document.getElementById("groupSelectLabel").textContent = currentText;
  var dd = document.getElementById("groupSelectDropdown");
  dd.innerHTML = "";
  var allOpt = document.createElement("div");
  allOpt.className = "cs-option" + (currentVal === "" ? " selected" : "");
  allOpt.setAttribute("data-value", "");
  allOpt.textContent = allLabel;
  dd.appendChild(allOpt);
  groups.forEach(function (g) {
    var val = "BẢNG " + g;
    var label = currentLang === "vi" ? "Bảng " + g : "Group " + g;
    var div = document.createElement("div");
    div.className = "cs-option" + (currentVal === val ? " selected" : "");
    div.setAttribute("data-value", val);
    div.textContent = label;
    dd.appendChild(div);
  });
  dd.querySelectorAll(".cs-option").forEach(function (opt) {
    opt.addEventListener("click", function () {
      var val = this.getAttribute("data-value");
      document.getElementById("groupFilter").value = val;
      document.getElementById("groupSelectLabel").textContent =
        this.textContent;
      dd.querySelectorAll(".cs-option").forEach(function (o) {
        o.classList.remove("selected");
      });
      this.classList.add("selected");
      closeGroupDropdown();
      render();
    });
  });
}
var ROUND_LABELS_VI = {
  group: "Vòng bảng",
  "round-of-32": "Vòng 1/16",
  "round-of-16": "Vòng 1/8",
  quarter: "Tứ kết",
  semi: "Bán kết",
  third: "Tranh hạng Ba",
  final: "Chung kết",
};
var ROUND_LABELS_EN = {
  group: "Group Stage",
  "round-of-32": "Round of 32",
  "round-of-16": "Round of 16",
  quarter: "Quarter-final",
  semi: "Semi-final",
  third: "3rd Place",
  final: "Final",
};
var ROUND_KNOCKOUT = {
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
  return currentLang === "vi" ? VN_NAMES[k] || k : EN_NAMES[k] || k;
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

// ===== MATCH DATA (corrected per image) =====
// result: { homeScore, awayScore, goals:[{team:'home'|'away', player, min}], reds:[{team, player, min}] }
var DATA = [
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
    result: {
      homeScore: 1,
      awayScore: 1,
      goals: [
        { team: "away", player: "J. Lukić", min: "21'" },
        { team: "home", player: "C. Larin", min: "78'" },
      ],
    },
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
    result: {
      homeScore: 4,
      awayScore: 1,
      goals: [
        { team: "home", player: "D. Bobadilla (OG)", min: "7'" },
        { team: "home", player: "F. Balogun", min: "31'" },
        { team: "home", player: "F. Balogun", min: "45+5'" },
        { team: "away", player: "Maurício", min: "73'" },
        { team: "home", player: "G. Reyna", min: "90+8'" },
      ],
    },
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
    result: { homeScore: 1, awayScore: 1, goals: [{ team: "home", player: "M. Muheim (OG)", min: "90+4'" }, { team: "away", player: "B. Embolo", min: "17'" }] },
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
    result: { homeScore: 1, awayScore: 1, goals: [{ team: "home", player: "Vinícius Jr.", min: "32'" }, { team: "away", player: "I. Saibari", min: "21'" }] },
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
    result: { homeScore: 0, awayScore: 1, goals: [{ team: "away", player: "J. McGinn", min: "28'" }] },
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
    result: { homeScore: 2, awayScore: 0, goals: [{ team: "home", player: "N. Irankunda", min: "27'" }, { team: "home", player: "C. Metcalfe", min: "75'" }], reds: [] },
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
    result: { homeScore: 7, awayScore: 1, goals: [{ team: "home", player: "F. Nmecha", min: "6'" }, { team: "away", player: "L. Comenencia", min: "21'" }, { team: "home", player: "N. Schlotterbeck", min: "38'" }, { team: "home", player: "K. Havertz", min: "45+5' (P)" }, { team: "home", player: "J. Musiala", min: "47'" }, { team: "home", player: "N. Brown", min: "68'" }, { team: "home", player: "D. Undav", min: "78'" }, { team: "home", player: "K. Havertz", min: "88'" }], reds: [] },
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
    result: { homeScore: 2, awayScore: 2, goals: [{ team: "home", player: "V. van Dijk", min: "51'" }, { team: "away", player: "K. Nakamura", min: "57'" }, { team: "home", player: "C. Summerville", min: "64'" }, { team: "away", player: "D. Kamada", min: "89'" }], reds: [] },
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
    result: { homeScore: 1, awayScore: 0, goals: [{ team: "home", player: "A. Diallo", min: "90'" }], reds: [] },
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
    result: { homeScore: 5, awayScore: 1, goals: [{ team: "home", player: "Y. Ayari", min: "7'" }, { team: "home", player: "A. Isak", min: "30'" }, { team: "away", player: "O. Rekik", min: "43'" }, { team: "home", player: "V. Gyökeres", min: "59'" }, { team: "home", player: "M. Svanberg", min: "84'" }, { team: "home", player: "Y. Ayari", min: "90+6'" }], reds: [] },
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
    result: { homeScore: 0, awayScore: 0, goals: [], reds: [] },
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
    result: { homeScore: 1, awayScore: 1, goals: [{ team: "away", player: "E. Ashour", min: "20'" }, { team: "home", player: "M. Hany (OG)", min: "66'" }], reds: [] },
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
    result: { homeScore: 1, awayScore: 1, goals: [{ team: "home", player: "A. Al-Amri", min: "41'" }, { team: "away", player: "M. Araújo", min: "80'" }], reds: [] },
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
    result: { homeScore: 2, awayScore: 2, goals: [{ team: "away", player: "E. Just", min: "7'" }, { team: "home", player: "R. Rezaeian", min: "32'" }, { team: "away", player: "E. Just", min: "55'" }, { team: "home", player: "M. Mohebi", min: "64'" }], reds: [] },
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
    result: { homeScore: 3, awayScore: 1, goals: [{ team: "home", player: "K. Mbappé", min: "66'" }, { team: "home", player: "B. Barcola", min: "82'" }, { team: "away", player: "I. Mbaye", min: "90+5'" }, { team: "home", player: "K. Mbappé", min: "90+6'" }], reds: [] },
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
    result: { homeScore: 1, awayScore: 4, goals: [{ team: "away", player: "E. Haaland", min: "29'" }, { team: "home", player: "A. Hussein", min: "39'" }, { team: "away", player: "E. Haaland", min: "43'" }, { team: "away", player: "L. Østigård", min: "76'" }, { team: "away", player: "A. Hussein (OG)", min: "90+6'" }], reds: [] },
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
    result: { homeScore: 3, awayScore: 0, goals: [{ team: "home", player: "L. Messi", min: "17'" }, { team: "home", player: "L. Messi", min: "60'" }, { team: "home", player: "L. Messi", min: "76'" }], reds: [] },
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
    result: { homeScore: 3, awayScore: 1, goals: [{ team: "home", player: "R. Schmid", min: "21'" }, { team: "away", player: "A. Olwan", min: "50'" }, { team: "home", player: "Y. Al-Arab (OG)", min: "76'" }, { team: "home", player: "M. Arnautović", min: "90+12' (P)" }], reds: [] },
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
    result: { homeScore: 1, awayScore: 1, goals: [{ team: "home", player: "J. Neves", min: "6'" }, { team: "away", player: "Y. Wissa", min: "45+5'" }], reds: [] },
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
    result: { homeScore: 4, awayScore: 2, goals: [{ team: "home", player: "H. Kane", min: "12' (P)" }, { team: "away", player: "M. Baturina", min: "36'" }, { team: "home", player: "H. Kane", min: "42'" }, { team: "away", player: "P. Musa", min: "45+5'" }, { team: "home", player: "J. Bellingham", min: "47'" }, { team: "home", player: "M. Rashford", min: "85'" }], reds: [] },
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
    result: { homeScore: 1, awayScore: 0, goals: [{ team: "home", player: "C. Yirenkyi", min: "90+5'" }], reds: [] },
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

// ===== LANG & THEME =====
var currentLang = "vi";

var htmlEl = document.documentElement;
var toggleIcon = document.getElementById("toggleIcon");
var currentTheme = "light";
function applyTheme(t) {
  currentTheme = t;
  htmlEl.setAttribute("data-theme", t);
  toggleIcon.innerHTML = t === "dark" ? SVG_MOON : SVG_SUN;
}
applyTheme("light");
document.getElementById("themeToggle").addEventListener("click", function () {
  applyTheme(currentTheme === "dark" ? "light" : "dark");
});

document.getElementById("langTzToggle").addEventListener("click", function () {
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
    var v = el.getAttribute("data-" + currentLang);
    if (v !== null) el.textContent = v;
  });
  document.getElementById("teamSearchInput").placeholder =
    currentLang === "vi"
      ? "Tìm đội (tiếng Việt hoặc tiếng Anh)..."
      : "Search team (English or Vietnamese)...";
  updateHideFinishedLabel();
}

// ===== HIDE FINISHED TOGGLE =====
var hideFinished = false;

// Check if a match has already finished based on result data
function isMatchFinished(m) {
  return !!m.result;
}

// ===== TEAM MULTI-SELECT =====
var selectedTeams = [];
var ALL_TEAMS = Object.keys(FLAGS).sort(function (a, b) {
  return (VN_NAMES[a] || a).localeCompare(VN_NAMES[b] || b, "vi");
});
var dropdownOpen = false;
var _skipClose = false;
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
document.getElementById("clearAllBtn").addEventListener("click", function (e) {
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
  var i = selectedTeams.indexOf(k);
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
  var el = document.getElementById("teamChips");
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
        getFlagImg(k, 20) +
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
function getAbbrev(name) {
  // Lấy chữ cái đầu của mỗi từ sau khi bỏ dấu
  return removeAccents(name.toLowerCase())
    .replace(/[^a-z\s]/g, "")
    .trim()
    .split(/\s+/)
    .map(function (w) {
      return w[0] || "";
    })
    .join("");
}
function matchesAbbrev(name, qna) {
  var abbrev = getAbbrev(name);
  // Khớp nếu viết tắt bắt đầu bằng query hoặc query là substring liên tiếp của chữ cái đầu
  return abbrev.indexOf(qna) === 0 || abbrev === qna;
}
function renderTeamList(q) {
  var ql = q.trim().toLowerCase(),
    qna = removeAccents(ql);
  var f = ALL_TEAMS.filter(function (k) {
    if (!ql) return true;
    var vn = VN_NAMES[k] || "",
      en = EN_NAMES[k] || k;
    return (
      vn.toLowerCase().indexOf(ql) !== -1 ||
      en.toLowerCase().indexOf(ql) !== -1 ||
      removeAccents(vn.toLowerCase()).indexOf(qna) !== -1 ||
      removeAccents(en.toLowerCase()).indexOf(qna) !== -1 ||
      matchesAbbrev(vn, qna) ||
      matchesAbbrev(en, qna)
    );
  });
  var el = document.getElementById("teamList");
  if (!f.length) {
    el.innerHTML =
      '<div class="team-option-none">' +
      (currentLang === "vi" ? "Không tìm thấy đội bóng" : "No team found") +
      "</div>";
    return;
  }
  el.innerHTML = f
    .map(function (k) {
      var s = selectedTeams.indexOf(k) !== -1;
      return (
        '<div class="team-option' +
        (s ? " selected" : "") +
        '" data-key="' +
        k +
        '"><span class="opt-flag">' +
        getFlagImg(k, 24) +
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

// ===== EXPAND STATE =====
var expandedId = null;

// ===== TOAST NOTIFICATION =====
function showToast(msg, type) {
  var toast = document.getElementById("aiToast");
  if (!toast) return;
  toast.textContent = msg;
  toast.className = "ai-toast " + (type || "info");
  toast.classList.add("show");
  setTimeout(function () {
    toast.classList.remove("show");
  }, 2500);
}

// ===== RENDER =====
function getMatchDisplayDate(m) {
  // Returns the date string that this match appears under in the current lang/tz
  if (currentLang === "en") {
    var off = pdtDayOffset(m.time);
    if (off !== 0) return shiftDate(m.date, off).date;
  }
  return m.date;
}

function getFiltered() {
  var d = document.getElementById("dateFilter").value,
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
    if (hideFinished && isMatchFinished(m)) return false;
    return true;
  });
}

function buildResultDetail(m) {
  var r = m.result;
  if (!r) return "";

  var homeN = getTeamName(m.home),
    awayN = getTeamName(m.away);
  var finishedLabel = currentLang === "vi" ? "Kết thúc" : "Full Time";
  var htLabel = currentLang === "vi" ? "Hiệp một:" : "HT:";

  // Hero: status badge + score box + HT
  var htHtml = "";
  if (r.ht !== undefined) {
    htHtml = '<div class="rd-ht">' + htLabel + " " + r.ht + "</div>";
  }
  var hero =
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
  var allEvents = [];
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

  function evTxt(ev) {
    return '<div class="rd-event-row">' +
      '<span class="rd-event-icon">' + ev.icon + "</span>" +
      '<span class="rd-event-text">' + ev.player + "</span>" +
      '<span class="rd-event-min">(' + ev.min + ")</span>" +
      "</div>";
  }
  var homeRows = "", awayRows = "";
  allEvents.forEach(function(ev) {
    if (ev.team === "home") homeRows += evTxt(ev);
    else awayRows += evTxt(ev);
  });

  var events = (homeRows || awayRows)
    ? '<div class="rd-events">' +
        '<div class="rd-events-home">' + homeRows + "</div>" +
        '<div class="rd-events-away">' + awayRows + "</div>" +
      "</div>"
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
  var hf = getFlagImg(m.home, 32),
    af = getFlagImg(m.away, 32);
  var homeN = getTeamName(m.home),
    awayN = getTeamName(m.away);
  var primaryTime =
    currentLang === "vi" ? vnTimeToAMPM(m.time) : vnTimeToPDT(m.time);
  var isKnockout = !!ROUND_KNOCKOUT[m.round];
  var roundBadge =
    '<span class="round-badge' +
    (isKnockout ? " knockout" : "") +
    '">' +
    getRoundLabel(m.round) +
    "</span>";
  var badgeHtml =
    m.round === "group"
      ? '<span class="group-badge">' +
        getGroupLabel(m.group) +
        "</span>" +
        roundBadge
      : roundBadge;

  var centerHtml,
    hasResult = !!m.result;
  if (hasResult) {
    centerHtml =
      '<div style="text-align:center;">' +
      '<div class="score-block" style="justify-content:center;"><span class="score-num">' +
      m.result.homeScore +
      '</span><span class="score-dash">-</span><span class="score-num">' +
      m.result.awayScore +
      "</span></div>" +
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
  var filtered = getFiltered();
  var sched = document.getElementById("schedule");
  var days = {},
    teams = {},
    groups = {};
  filtered.forEach(function (m) {
    days[m.date] = 1;
    teams[m.home] = 1;
    teams[m.away] = 1;
    groups[m.group] = 1;
  });
  document.getElementById("statMatches").textContent = filtered.length;
  document.getElementById("statDays").textContent = Object.keys(days).length;
  document.getElementById("statGroups").textContent =
    Object.keys(groups).length;
  document.getElementById("statTeams").textContent = Object.keys(teams).length;
  if (!filtered.length) {
    sched.innerHTML =
      '<div class="empty"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.039 5.062a7 7 0 0 0 9.91 9.89m1.584 -2.434a7 7 0 0 0 -9.038 -9.057"/><path d="M3 3l18 18"/></svg>' +
      (currentLang === "vi"
        ? "Không tìm thấy trận đấu phù hợp.<br>Thử thay đổi bộ lọc khác."
        : "No matches found.<br>Try changing your filters.") +
      "</div>";
    return;
  }
  var byDate = {},
    dateOrder = [];
  filtered.forEach(function (m) {
    var useDate = m.date,
      useDay = m.day;
    if (currentLang === "en") {
      var off = pdtDayOffset(m.time);
      if (off !== 0) {
        var shifted = shiftDate(m.date, off);
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
    var ai = DATE_SEQUENCE.findIndex(function (d) {
      return d.date === a;
    });
    var bi = DATE_SEQUENCE.findIndex(function (d) {
      return d.date === b;
    });
    return ai - bi;
  });
  sched.innerHTML = dateOrder
    .map(function (date) {
      var block = byDate[date];
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

  // Click handlers for cards WITHOUT results → show toast
  sched.querySelectorAll(".match-card:not(.has-result)").forEach(function (card) {
    card.addEventListener("click", function () {
      var msg = currentLang === "vi" ? "Trận đấu chưa kết thúc." : "Match not finished yet.";
      showToast(msg, "info");
    });
  });

  // Click handlers for cards with results
  sched.querySelectorAll(".match-card.has-result").forEach(function (card) {
    card.addEventListener("click", function () {
      var id = parseInt(this.getAttribute("data-id"), 10);
      var detail = this.querySelector(".result-detail");
      if (expandedId === id) {
        expandedId = null;
        if (detail) detail.classList.remove("open");
      } else {
        // close previous
        var prev = sched.querySelector(".result-detail.open");
        if (prev) prev.classList.remove("open");
        expandedId = id;
        if (detail) detail.classList.add("open");
      }
    });
  });
}

document.getElementById("dateFilter").addEventListener("change", render);
document.getElementById("groupFilter").addEventListener("change", render);

// ===== HIDE FINISHED BUTTON =====
document
  .getElementById("hideFinishedBtn")
  .addEventListener("click", function () {
    hideFinished = !hideFinished;
    this.classList.toggle("active", hideFinished);
    updateHideFinishedLabel();
    render();
  });

function updateHideFinishedLabel() {
  var el = document.getElementById("hideFinishedLabel");
  if (!el) return;
  if (hideFinished) {
    el.textContent =
      currentLang === "vi" ? "Hiện trận đã kết thúc" : "Show finished";
    // swap eye icon to eye-off
    var svg = document.querySelector("#hideFinishedBtn svg");
    if (svg)
      svg.innerHTML =
        '<path d="M3 3l18 18"/><path d="M10.584 10.587a2 2 0 0 0 2.828 2.83"/><path d="M9.363 5.365A9.466 9.466 0 0 1 12 5c3.6 0 6.6 2 9 6c-.9 1.514-1.927 2.757-3.05 3.737M5.634 5.634A16.536 16.536 0 0 0 3 12c2.4 4 5.4 6 9 6c1.266 0 2.48-.31 3.618-.902"/>';
  } else {
    el.textContent =
      currentLang === "vi" ? "Ẩn trận đã kết thúc" : "Hide finished";
    var svg = document.querySelector("#hideFinishedBtn svg");
    if (svg)
      svg.innerHTML =
        '<path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"/><path d="M21 12c-2.4 4-5.4 6-9 6c-3.6 0-6.6-2-9-6c2.4-4 5.4-6 9-6c3.6 0 6.6 2 9 6"/>';
  }
}

// ===== CUSTOM SELECT DROPDOWN LOGIC =====
var dateDropOpen = false;
var groupDropOpen = false;

function openDateDropdown() {
  dateDropOpen = true;
  document.getElementById("dateSelectDropdown").classList.add("open");
  document.getElementById("dateSelectTrigger").classList.add("open");
}
function closeDateDropdown() {
  dateDropOpen = false;
  document.getElementById("dateSelectDropdown").classList.remove("open");
  document.getElementById("dateSelectTrigger").classList.remove("open");
}
function openGroupDropdown() {
  groupDropOpen = true;
  document.getElementById("groupSelectDropdown").classList.add("open");
  document.getElementById("groupSelectTrigger").classList.add("open");
}
function closeGroupDropdown() {
  groupDropOpen = false;
  document.getElementById("groupSelectDropdown").classList.remove("open");
  document.getElementById("groupSelectTrigger").classList.remove("open");
}
document
  .getElementById("dateSelectTrigger")
  .addEventListener("click", function (e) {
    e.stopPropagation();
    if (groupDropOpen) closeGroupDropdown();
    if (dateDropOpen) closeDateDropdown();
    else openDateDropdown();
  });
document
  .getElementById("groupSelectTrigger")
  .addEventListener("click", function (e) {
    e.stopPropagation();
    if (dateDropOpen) closeDateDropdown();
    if (groupDropOpen) closeGroupDropdown();
    else openGroupDropdown();
  });
// Dùng mousedown thay click để đóng dropdown trước khi focus chuyển đi
document.addEventListener("mousedown", function (e) {
  if (
    dateDropOpen &&
    !document.getElementById("dateSelectWrapper").contains(e.target)
  )
    closeDateDropdown();
  if (
    groupDropOpen &&
    !document.getElementById("groupSelectWrapper").contains(e.target)
  )
    closeGroupDropdown();
});
// Hỗ trợ touch (mobile)
document.addEventListener(
  "touchstart",
  function (e) {
    if (
      dateDropOpen &&
      !document.getElementById("dateSelectWrapper").contains(e.target)
    )
      closeDateDropdown();
    if (
      groupDropOpen &&
      !document.getElementById("groupSelectWrapper").contains(e.target)
    )
      closeGroupDropdown();
  },
  { passive: true },
);

// Returns today's date as "DD/MM" in VN timezone (UTC+7)
function getTodayDDMM() {
  var now = new Date();
  var vnMs =
    now.getTime() + now.getTimezoneOffset() * 60000 + VN_OFFSET_MIN * 60000;
  var vnDate = new Date(vnMs);
  var d = vnDate.getDate(),
    mo = vnDate.getMonth() + 1;
  return (d < 10 ? "0" : "") + d + "/" + (mo < 10 ? "0" : "") + mo;
}

// Returns true if ALL matches on that display-date are finished (have result)
function isDatePast(dateStr) {
  var matchesOnDate = DATA.filter(function (m) {
    return getMatchDisplayDate(m) === dateStr;
  });
  if (!matchesOnDate.length) return false;
  return matchesOnDate.every(function (m) {
    return !!m.result;
  });
}

// Init
rebuildDateFilter();
rebuildGroupFilter();
renderTeamList("");

// Auto-select today's date
(function () {
  var today = getTodayDDMM();
  var sel = document.getElementById("dateFilter");
  var hasToday = false;
  for (var i = 0; i < sel.options.length; i++) {
    if (sel.options[i].value === today) {
      hasToday = true;
      break;
    }
  }
  if (hasToday) {
    sel.value = today;
    rebuildDateFilter();
  }
})();

render();

// ===== VIEW COUNTER (counterapi.dev) =====
var COUNTER_LS_KEY = "wc2026_last_view"; // timestamp lần xem cuối
var COUNTER_OWNER_KEY = "wc2026_is_owner"; // flag chủ sở hữu
var COUNTER_COOLDOWN = 60 * 60 * 1000; // 1 tiếng (ms)

function formatCount(count) {
  if (count >= 1000000)
    return (count / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (count >= 1000) return Math.floor(count / 1000) + "K";
  return count.toString();
}

async function fetchCountOnly() {
  // Chỉ đọc, không tăng (dùng endpoint /info hoặc /up nhưng đọc count hiện tại)
  var r = await fetch(
    "https://api.counterapi.dev/v1/hunglehien1012/worldcup2026/",
  );
  if (!r.ok) throw new Error();
  return (await r.json()).count || 0;
}

async function fetchAndIncrement() {
  var r = await fetch(
    "https://api.counterapi.dev/v1/hunglehien1012/worldcup2026/",
  );
  if (!r.ok) throw new Error();
  return (await r.json()).count || 0;
}

async function initViewCounter() {
  var numEl = document.getElementById("viewCountNum");
  var labelEl = document.getElementById("viewCountLabel");
  try {
    var isOwner = false;
    var shouldCount = false;

    try {
      isOwner = !!localStorage.getItem(COUNTER_OWNER_KEY);
    } catch (e) {}

    if (isOwner) {
      // Chủ sở hữu: chỉ đọc số, không tăng
      var count = await fetchCountOnly();
      numEl.textContent = formatCount(count);
    } else {
      // Kiểm tra cooldown 1 tiếng
      var lastView = 0;
      try {
        lastView = parseInt(localStorage.getItem(COUNTER_LS_KEY) || "0");
      } catch (e) {}
      var now = Date.now();
      shouldCount = now - lastView >= COUNTER_COOLDOWN;

      var count;
      if (shouldCount) {
        count = await fetchAndIncrement();
        try {
          localStorage.setItem(COUNTER_LS_KEY, now.toString());
        } catch (e) {}
      } else {
        count = await fetchCountOnly();
      }
      numEl.textContent = formatCount(count);
    }

    labelEl.textContent = currentLang === "vi" ? "lượt xem" : "views";
  } catch (e) {
    numEl.textContent = "";
    labelEl.textContent = "";
  }
}

// Hàm đánh dấu thiết bị hiện tại là chủ sở hữu (gọi từ console: setOwnerDevice())
window.setOwnerDevice = function () {
  try {
    localStorage.setItem(COUNTER_OWNER_KEY, "1");
    console.log(
      "%c✅ Thiết bị này đã được đánh dấu là chủ sở hữu. Lượt xem sẽ không được tính.",
      "color: green; font-weight: bold",
    );
  } catch (e) {
    console.error("Không thể lưu vào localStorage");
  }
};
window.removeOwnerDevice = function () {
  try {
    localStorage.removeItem(COUNTER_OWNER_KEY);
    console.log(
      "%c✅ Đã xóa flag chủ sở hữu.",
      "color: orange; font-weight: bold",
    );
  } catch (e) {}
};

initViewCounter();

// ===== GOOGLE SHEETS VISITOR TRACKING =====
(function () {
  var SHEET_URL =
    "https://script.google.com/macros/s/AKfycbzmNwUHPtIQv2qocRoXCum-HlLaJqUGtcvF-z6y8jM3IiSfJrW4GheoRcC6gKnMGTtT/exec";
  var OWNER_KEY = "wc2026_is_owner";

  // Không ghi log nếu là chủ sở hữu
  try {
    if (localStorage.getItem(OWNER_KEY)) return;
  } catch (e) {}

  var ua = navigator.userAgent;
  var isMobile =
    /Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  var isTablet = /iPad|Tablet|(Android(?!.*Mobile))/i.test(ua);
  var deviceType = isTablet
    ? "📋 Tablet"
    : isMobile
      ? "📱 Mobile"
      : "💻 Desktop";

  var os = "Không rõ";
  if (/Windows NT 10/.test(ua)) os = "Windows 10/11";
  else if (/Windows NT/.test(ua)) os = "Windows";
  else if (/Mac OS X/.test(ua) && !/iPhone|iPad/.test(ua)) os = "macOS";
  else if (/iPhone/.test(ua)) os = "iOS (iPhone)";
  else if (/iPad/.test(ua)) os = "iOS (iPad)";
  else if (/Android/.test(ua)) {
    var av = ua.match(/Android ([\d.]+)/);
    os = "Android" + (av ? " " + av[1] : "");
  } else if (/CrOS/.test(ua)) os = "Chrome OS";
  else if (/Linux/.test(ua)) os = "Linux";

  var browser = "Khác",
    bv = "";
  if (/Edg\//.test(ua)) {
    browser = "Edge";
    var m = ua.match(/Edg\/([\d]+)/);
    bv = m ? "v" + m[1] : "";
  } else if (/OPR\//.test(ua)) {
    browser = "Opera";
    var m = ua.match(/OPR\/([\d]+)/);
    bv = m ? "v" + m[1] : "";
  } else if (/SamsungBrowser/.test(ua)) {
    browser = "Samsung";
    var m = ua.match(/SamsungBrowser\/([\d]+)/);
    bv = m ? "v" + m[1] : "";
  } else if (/CriOS/.test(ua)) {
    browser = "Chrome iOS";
    var m = ua.match(/CriOS\/([\d]+)/);
    bv = m ? "v" + m[1] : "";
  } else if (/FxiOS/.test(ua)) {
    browser = "Firefox iOS";
  } else if (/Chrome/.test(ua)) {
    browser = "Chrome";
    var m = ua.match(/Chrome\/([\d]+)/);
    bv = m ? "v" + m[1] : "";
  } else if (/Firefox/.test(ua)) {
    browser = "Firefox";
    var m = ua.match(/Firefox\/([\d]+)/);
    bv = m ? "v" + m[1] : "";
  } else if (/Safari/.test(ua)) {
    browser = "Safari";
    var m = ua.match(/Version\/([\d]+)/);
    bv = m ? "v" + m[1] : "";
  }

  var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "---";
  var off = -new Date().getTimezoneOffset();
  var tzLabel =
    (off >= 0 ? "UTC+" : "UTC") + (off / 60).toFixed(1).replace(".0", "");

  var now = new Date();
  function p(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  fetch(SHEET_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      timestamp: now.toISOString(),
      date:
        now.getFullYear() +
        "-" +
        p(now.getMonth() + 1) +
        "-" +
        p(now.getDate()),
      time:
        p(now.getHours()) +
        ":" +
        p(now.getMinutes()) +
        ":" +
        p(now.getSeconds()),
      deviceType: deviceType,
      os: os,
      browser: browser + (bv ? " " + bv : ""),
      tz: tzLabel + " (" + tz + ")",
    }),
  }).catch(function () {}); // Im lặng nếu lỗi, không ảnh hưởng trang
})();

// Sticky shadow on scroll
window.addEventListener("scroll", function () {
  var sticky = document.querySelector(".sticky-top");
  if (sticky) sticky.classList.toggle("scrolled", window.scrollY > 10);
});
