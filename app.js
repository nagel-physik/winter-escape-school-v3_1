// ===============================
// Winter Escape – app.js
// Version: v4.3 Hardmode DE
// ===============================

const VERSION = "v4_3_DE";

// ===== Storage Keys =====
const KEY_BOARD = "winter_escape_board_v4";
const KEY_TEAM  = "winter_escape_team_v4";

// ===== Mini Sound-Effekte (offline, ohne Dateien) =====
let _ac = null;
function _ctx(){
  if(_ac) return _ac;
  const AC = window.AudioContext || window.webkitAudioContext;
  if(!AC) return null;
  _ac = new AC();
  return _ac;
}
function fxSound(type="ok"){
  const ac = _ctx();
  if(!ac) return;
  if(ac.state === "suspended") ac.resume().catch(()=>{});
  const now = ac.currentTime;
  const o = ac.createOscillator();
  const g = ac.createGain();
  const presets = {
    ok:[660,880,0.10], bad:[220,160,0.14],
    win:[523.25,659.25,0.12], pop:[900,600,0.08]
  };
  const [f1,f2,amp] = presets[type] || presets.ok;
  o.type="triangle";
  o.frequency.setValueAtTime(f1, now);
  o.frequency.exponentialRampToValueAtTime(Math.max(40,f2), now+0.14);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(amp, now+0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, now+0.20);
  o.connect(g); g.connect(ac.destination);
  o.start(now); o.stop(now+0.22);
}

// ===== Confetti =====
function fxConfetti(ms=1800){
  const d=document.createElement("div");
  d.style.position="fixed";
  d.style.inset="0";
  d.style.pointerEvents="none";
  d.style.zIndex="9999";
  document.body.appendChild(d);
  for(let i=0;i<140;i++){
    const p=document.createElement("div");
    p.style.position="absolute";
    p.style.left=Math.random()*100+"vw";
    p.style.top="-10px";
    p.style.width=p.style.height=(6+Math.random()*6)+"px";
    p.style.background=`hsl(${Math.random()*360},90%,60%)`;
    p.style.opacity="0.9";
    p.style.transform=`rotate(${Math.random()*360}deg)`;
    p.style.transition=`transform ${ms}ms linear, top ${ms}ms linear, opacity ${ms}ms`;
    d.appendChild(p);
    requestAnimationFrame(()=>{
      p.style.top="110vh";
      p.style.transform=`rotate(${Math.random()*720}deg)`;
      p.style.opacity="0";
    });
  }
  setTimeout(()=>d.remove(), ms+100);
}

// ===== State helpers =====
function loadBoard(){ try{return JSON.parse(localStorage.getItem(KEY_BOARD)||"{}");}catch{ return {}; } }
function saveBoard(s){ localStorage.setItem(KEY_BOARD, JSON.stringify(s)); }
function loadTeam(){ try{return JSON.parse(localStorage.getItem(KEY_TEAM)||"{}");}catch{ return {}; } }
function saveTeam(s){ localStorage.setItem(KEY_TEAM, JSON.stringify(s)); }

// ===== Kapitel-Definitionen (DE, Hardmode) =====
const CHAPTERS = {
  1:{ title:"Start & Planung", next:2, formulaName:"A + B + C + D",
    groups:{
      A:`<b>Szene:</b> Treffpunkt 08:20. Aufbau 25 Min + 10 Min Puffer.<br><b>Aufgabe:</b> Minuten vor 08:20?`,
      B:`Welche Aussage ist <b>immer</b> richtig?<br>1) Primzahlen ungerade<br>2) Gerade Zahlen durch 2 teilbar<br>3) Zahlen auf 0 sind Primzahlen`,
      C:`3 Kurzstunden à 40 Minuten.<br><b>Gesamtzeit?</b>`,
      D:`Idiotentest: Start 9 → +1 → −1 → ×1`
    },
    compute:(A,B,C,D)=>A+B+C+D
  },
  2:{ title:"Medien & Denken", next:3, formulaName:"A*10 + B + C*10 + D",
    groups:{
      A:`„Viele Likes = wahr?“<br>1 = wahr • 2 = falsch`,
      B:`Satz zählen: „Gilt nur auf ausgewählte Artikel.“`,
      C:`Passwort überall gleich ist … 1) ok 2) riskant 3) egal`,
      D:`Wie viele Monate haben 28 Tage?`
    },
    compute:(A,B,C,D)=>A*10+B+C*10+D
  },
  3:{ title:"Physik & Logik", next:4, formulaName:"A + B*10 + C/10 + D",
    groups:{
      A:`Fahrrad: 180 m in 12 s → v = s/t (runden)`,
      B:`Welche Zahl ist größer? 1) 0,9 2) 0,10 3) 0,099`,
      C:`3 Minuten sind wie viele Sekunden?`,
      D:`Doppelt so groß, dann halbiert → 1 größer 2 gleich 3 kleiner`
    },
    compute:(A,B,C,D)=>A+B*10+C/10+D
  },
  4:{ title:"Schätzen (Toleranz)", next:5, formulaName:"A + B + C + D",
    normalize:([A,B,C,D])=>[A,B,C,D],
    groups:{
      A:`Atemzüge/Minute (12–20)`,
      B:`Sauerstoffanteil % (20–23)`,
      C:`Schlafbedarf Std. (8–10)`,
      D:`Muskeln? 1~200 2~400 3~650`
    },
    compute:(A,B,C,D)=>A+B+C+D
  },
  5:{ title:"Kaufen & Werbung", next:6, formulaName:"A*2 + B*10 + C + D",
    groups:{
      A:`2,99€ → 2,49€: Ersparnis (Cent)`,
      B:`Werbung in 15 Min: 1)0–1 2)2–4 3)5+`,
      C:`6 Riegel – Aktion 3 für 2: Wie viele zahlen?`,
      D:`20% von 50€`
    },
    compute:(A,B,C,D)=>A*2+B*10+C+D
  },
  6:{ title:"Sprache", next:7, formulaName:"A + B*10 + C*10 + D",
    groups:{
      A:`Buchstaben in „Prüfung“`,
      B:`Richtig: 1 seit dem 2 seid dem 3 seiddem`,
      C:`„I'm excited“ = 1 freue mich 2 wütend 3 gelangweilt`,
      D:`Vokale in „education“`
    },
    compute:(A,B,C,D)=>A+B*10+C*10+D
  },
  7:{ title:"Mathe & Formen", next:8, formulaName:"A*2 + B*10 + C + D",
    groups:{
      A:`14 + 10, dann halbieren`,
      B:`Quader-Flächen? 1/2/3`,
      C:`„WEIHNACHTEN“ Buchstaben − 5`,
      D:`Größter Bruch? 1)3/8 2)4/9 3)5/12`
    },
    compute:(A,B,C,D)=>A*2+B*10+C+D
  },
  8:{ title:"Zeit & Technik", next:9, formulaName:"A + B + C*10 + D",
    groups:{
      A:`3 Minuten in Sekunden`,
      B:`−2°C → 20°C: Änderung`,
      C:`Kreis mit Kreuz = 1 Batterie 2 Lampe 3 Schalter`,
      D:`Wie viele Monate haben 28 Tage?`
    },
    compute:(A,B,C,D)=>A+B+C*10+D
  },
  9:{ title:"Zusammenleben", next:10, formulaName:"A*10 + B*10 + C + D",
    groups:{
      A:`Meinung ohne Beleidigung = welche Nummer?`,
      B:`Online-Streit: beste Lösung?`,
      C:`18 Kekse auf 5 Personen – Rest`,
      D:`Sauerstofftransport?`
    },
    compute:(A,B,C,D)=>A*10+B*10+C+D
  },
  10:{ title:"Digitales", next:11, formulaName:"A*10 + B*10 + C + D",
    groups:{
      A:`Screenshot immer Beweis? 1/2`,
      B:`KI-Text fehlerfrei? 1/2`,
      C:`Buchstaben in „algorithmus“`,
      D:`Stärkstes Passwort?`
    },
    compute:(A,B,C,D)=>A*10+B*10+C+D
  },
  11:{ title:"Bossrunde", next:12, formulaName:"A + B*10 + C*10 + D",
    groups:{
      A:`6 + 2, dann ×3`,
      B:`Rechteck: Umfang 30, Seite 8`,
      C:`Erwärmen → Teilchen?`,
      D:`Buchstaben in „SCHNEE“`
    },
    compute:(A,B,C,D)=>A+B*10+C*10+D
  },
  12:{ title:"Zeit & Denken", next:13, formulaName:"A + B*10 + C + D",
    groups:{
      A:`12% von 250`,
      B:`Dienstag + 10 Tage?`,
      C:`Silben in „Information“`,
      D:`1 kg Federn vs. 1 kg Steine`
    },
    compute:(A,B,C,D)=>A+B*10+C+D
  },
  13:{ title:"Weltwissen", next:14, formulaName:"A*10 + B*10 + C*10 + D",
    groups:{
      A:`Bundesländer`,
      B:`EU-Sterne`,
      C:`Legislaturperiode Bundestag`,
      D:`Längster Fluss?`
    },
    compute:(A,B,C,D)=>A*10+B*10+C*10+D
  },
  14:{ title:"Geld", next:15, formulaName:"A*10 + B + C + D",
    groups:{
      A:`Miete fix oder variabel?`,
      B:`19% von 100€`,
      C:`50€ − 18€ − 12€`,
      D:`2,50€ × 7 Tage (Cent)`
    },
    compute:(A,B,C,D)=>A*10+B+C+D
  },
  15:{ title:"Finale Vorbereitung", next:16, formulaName:"A*10 + B + C*10 + D",
    groups:{
      A:`Buchstaben in „WEIHNACHTSBAUM“`,
      B:`Ziffernsumme von 2025`,
      C:`3 Kerzen an, 2 aus – wie viele brennen?`,
      D:`Buchstaben in „Snow“`
    },
    compute:(A,B,C,D)=>A*10+B+C*10+D
  },
  16:{ title:"FINAL", finalCode:2412 }
};

// ===== Lösungen (unverändert) =====
const SOLUTIONS = {
  1:132,2:77,3:67,4:76,5:98,6:66,7:58,8:164,
  9:53,10:78,11:95,12:102,13:91,14:314,15:135,16:2412
};

// ===== Token (optional) =====
function makeToken(ch, code){
  const s = String(code).split("").reduce((a,b)=>a+Number(b),0);
  return `K${ch}-${s}${code%7}`;
}

// ===== Export =====
window.ESC = {
  VERSION, KEY_BOARD, KEY_TEAM,
  CHAPTERS, SOLUTIONS,
  loadBoard, saveBoard, loadTeam, saveTeam,
  fxConfetti, fxSound, makeToken
};