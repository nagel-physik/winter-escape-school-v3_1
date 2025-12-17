(function(){
  const VERSION = "v4_3_DE";
  const KEY_BOARD = "escape_board_state_"+VERSION;
  const KEY_TEAM  = "escape_team_progress_"+VERSION;

  function fxConfetti(ms=2400){
    const c = document.getElementById("fxCanvas") || (()=>{
      const cc=document.createElement("canvas");
      cc.id="fxCanvas"; document.body.appendChild(cc);
      return cc;
    })();
    const ctx=c.getContext("2d");
    const dpr=window.devicePixelRatio||1;
    let W,H;
    function resize(){
      W=window.innerWidth; H=window.innerHeight;
      c.width=W*dpr; c.height=H*dpr;
      c.style.width=W+"px"; c.style.height=H+"px";
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    resize();

    const colors=["#7cf3ff","#ff6bd6","#5affb4","#ffd34d","#ffffff"];
    const parts=[];
    const N=520;

    for(let i=0;i<N*0.6;i++){
      parts.push({
        x: Math.random()*W,
        y: -Math.random()*H*0.7,
        vx: (Math.random()*2-1)*2.2,
        vy: 2.2 + Math.random()*5.2,
        g: 0.035 + Math.random()*0.02,
        r: 2 + Math.random()*4,
        rot: Math.random()*Math.PI,
        vr: (Math.random()*2-1)*0.20,
        col: colors[(Math.random()*colors.length)|0],
        life: ms + Math.random()*900
      });
    }
    for(let i=0;i<N*0.4;i++){
      parts.push({
        x: W*0.5 + (Math.random()*80-40),
        y: H*0.80 + (Math.random()*20-10),
        vx: (Math.random()*2-1)*8.5,
        vy: -(10 + Math.random()*12),
        g: 0.24 + Math.random()*0.18,
        r: 2 + Math.random()*4,
        rot: Math.random()*Math.PI,
        vr: (Math.random()*2-1)*0.30,
        col: colors[(Math.random()*colors.length)|0],
        life: ms + Math.random()*900
      });
    }

    const t0=performance.now();
    function frame(t){
      const dt = Math.min(32, t - (frame.prev||t));
      frame.prev=t;
      ctx.clearRect(0,0,W,H);
      for(const p of parts){
        p.life -= dt;
        if(p.life<=0) continue;
        p.vy += p.g*dt;
        p.x  += p.vx*(dt/16);
        p.y  += p.vy*(dt/16);
        p.rot += p.vr*(dt/16);
        if(p.x < -30) p.x = W+30;
        if(p.x > W+30) p.x = -30;
        ctx.save();
        ctx.translate(p.x,p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle=p.col;
        ctx.fillRect(-p.r, -p.r, p.r*2, p.r*2);
        ctx.restore();
      }
      if(t - t0 < ms) requestAnimationFrame(frame);
      else { try{ c.remove(); }catch(e){} }
    }
    requestAnimationFrame(frame);
  }

  function fnv1a(str){
    let h = 0x811c9dc5;
    for(let i=0;i<str.length;i++){
      h ^= str.charCodeAt(i);
      h = (h + ((h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24))) >>> 0;
    }
    return h >>> 0;
  }
  const TEACHER_KEY = "winter-escape-key-2025";
  function makeToken(chapter, code){
    const raw = `${TEACHER_KEY}|${chapter}|${code}`;
    const h = fnv1a(raw).toString(36).toUpperCase();
    return (h + "000000").slice(0,6);
  }

  const CHAPTERS = {
    1:{ title:"Kapitel 1 – Briefing: Frostige Mission ❄️", next:2,
      groups:{
        A:`<b>Zeitplanung</b><br>Treffpunkt ist 08:20. Für Aufbau braucht ihr 25 Minuten und ihr wollt 10 Minuten Puffer.<br><br><b>Aufgabe:</b> Wie viele Minuten <i>vor</i> 08:20 muss begonnen werden?`,
        B:`<b>Mini-Kahoot (genau lesen)</b><br>Welche Aussage stimmt immer?<br>1) Jede Primzahl ist ungerade.<br>2) Jede gerade Zahl ist durch 2 teilbar.<br>3) Jede Zahl mit 0 am Ende ist eine Primzahl.<br><br><b>Antwort:</b> nur die Optionsnummer`,
        C:`<b>Alltagsmathe</b><br>Ihr habt 3 Kurzstunden à 40 Minuten am Stück.<br><br><b>Aufgabe:</b> Wie viele Minuten sind das insgesamt?`,
        D:`<b>Logikfalle</b><br>Schreibe die Zahl 9. Addiere 1. Subtrahiere 1. Multipliziere mit 1.<br><br><b>Ergebnis:</b> Zahl`
      },
      formulaName:"A + (B×11) + (C÷10) + (D×7)",
      compute:(A,B,C,D)=>Math.round(A + (B*11) + (C/10) + (D*7))
    },
    2:{ title:"Kapitel 2 – Klick oder Kopf? 📱🧠", next:3,
      groups:{
        A:`<b>Medienkompetenz</b><br>„Wenn etwas viele Likes hat, ist es wahr.“<br>1 = wahr • 2 = falsch`,
        B:`<b>Fake-Details</b><br>Ein Post verspricht „Nur heute 70% Rabatt!“ Unten steht klein: „Gilt nur auf ausgewählte Artikel.“<br><br><b>Aufgabe:</b> Wie viele Wörter hat dieser kleine Satz?`,
        C:`<b>Datenschutz</b><br>Wähle: 1) Passwort überall gleich ist okay • 2) ist riskant • 3) ist egal<br><br><b>Antwort:</b> Optionsnummer`,
        D:`<b>Idiotentest</b><br>Wie viele Monate haben 28 Tage?<br><br><b>Antwort:</b> Zahl`
      },
      formulaName:"(A×10) + (B×3) + (C×9) + (D×2)",
      compute:(A,B,C,D)=>Math.round((A*10)+(B*3)+(C*9)+(D*2))
    },
    3:{ title:"Kapitel 3 – Physik leicht, Fehler schwer ⚡", next:4,
      groups:{
        A:`<b>Physik</b><br>Ein Fahrrad fährt 180 m in 12 s.<br><br><b>Aufgabe:</b> Geschwindigkeit in m/s (ganze Zahl).`,
        B:`<b>Stellenwert-Falle</b><br>Welche Zahl ist am größten?<br>1) 0,9<br>2) 0,10<br>3) 0,099<br><br><b>Antwort:</b> Optionsnummer`,
        C:`<b>Einheiten</b><br>3 Minuten sind wie viele Sekunden?<br><br><b>Antwort:</b> Zahl`,
        D:`<b>Mini-Formel</b><br>Wenn etwas doppelt so groß wird und du halbierst es wieder: bleibt es…<br>1) größer • 2) gleich • 3) kleiner<br><br><b>Antwort:</b> Optionsnummer`
      },
      formulaName:"(A×2) + (B×13) + (C÷30) + (D×9)",
      compute:(A,B,C,D)=>Math.round((A*2)+(B*13)+(C/30)+(D*9))
    },
    4:{ title:"Kapitel 4 – Spanne statt Streit (Toleranz) 🧬", next:5,
      groups:{
        A:`<b>Schätzung (Toleranz)</b><br>Atemzüge pro Minute in Ruhe.<br><b>Akzeptiert:</b> 12–20`,
        B:`<b>Schätzung (Toleranz)</b><br>Sauerstoffanteil der Luft in %.<br><b>Akzeptiert:</b> 20–23`,
        C:`<b>Schätzung (Toleranz)</b><br>Schlafbedarf Teenager in Stunden.<br><b>Akzeptiert:</b> 8–10`,
        D:`<b>Multiple Choice</b><br>Wie viele Muskeln hat der Mensch ungefähr?<br>1) ~200 • 2) ~400 • 3) ~650<br><b>Antwort:</b> Optionsnummer`
      },
      formulaName:"A + B + C + (D×10)  (Toleranz aktiv)",
      normalize:(vals)=>{
        let [A,B,C,D]=vals;
        if(Number.isFinite(A)) A = (A<12?12:(A>20?20:A));
        if(Number.isFinite(B)) B = (B<20?20:(B>23?23:B));
        if(Number.isFinite(C)) C = (C<8?8:(C>10?10:C));
        D = Math.min(3, Math.max(1, D));
        return [A,B,C,D];
      },
      compute:(A,B,C,D)=>Math.round(A+B+C+(D*10))
    },
    5:{ title:"Kapitel 5 – Kaufen oder Ködern 🛒", next:6,
      groups:{
        A:`<b>Rabatt</b><br>„Statt 2,99€ nur 2,49€“ – wie viele Cent sind das weniger?`,
        B:`<b>Influencer (Kategorie statt Schätzen)</b><br>In 15 Minuten Social Media:<br>1) 0–1 Werbung • 2) 2–4 • 3) 5+<br><b>Antwort:</b> 1/2/3`,
        C:`<b>2 kaufen – 1 gratis</b><br>Du nimmst 6 Riegel. Wie viele bezahlst du?`,
        D:`<b>Prozent</b><br>20% Rabatt auf 50€ = ? (nur die Rabatt-Eurozahl)`
      },
      formulaName:"A + (B×8) + (C×3) + (D×2)",
      compute:(A,B,C,D)=>Math.round(A+(B*8)+(C*3)+(D*2))
    },
    6:{ title:"Kapitel 6 – Sprache & Codes 📝", next:7,
      groups:{
        A:`<b>Deutsch</b><br>Wie viele Buchstaben hat „Prüfung“? (Umlaute zählen als 1)`,
        B:`<b>Rechtschreibung</b><br>Welche Schreibweise ist korrekt?<br>1) seit dem • 2) seid dem • 3) seiddem<br><b>Antwort:</b> 1/2/3`,
        C:`<b>Englisch</b><br>„I’m excited“ bedeutet meistens…<br>1) aufgeregt/freue mich • 2) wütend • 3) gelangweilt<br><b>Antwort:</b> 1/2/3`,
        D:`<b>Vokale zählen</b><br>Zähle die Vokale (a,e,i,o,u) in „education“.`
      },
      formulaName:"(A×5) + (B×9) + (C×7) + (D×3)",
      compute:(A,B,C,D)=>Math.round((A*5)+(B*9)+(C*7)+(D*3))
    },
    7:{ title:"Kapitel 7 – Logik & Fallen 🧩", next:8,
      groups:{
        A:`<b>Reihenfolge!</b><br>Startzahl 14. Addiere 10 und halbiere dann. Ergebnis?`,
        B:`<b>Geometrie</b><br>Ein Quader hat…<br>1) 4 Flächen • 2) 6 Flächen • 3) 8 Flächen<br><b>Antwort:</b> 1/2/3`,
        C:`<b>Wort zählen</b><br>„WEIHNACHTEN“ hat wie viele Buchstaben? Subtrahiere 5.`,
        D:`<b>Brüche</b><br>Welcher Bruch ist am größten?<br>1) 3/8 • 2) 4/9 • 3) 5/12<br><b>Antwort:</b> 1/2/3`
      },
      formulaName:"A + (B×10) + (C×2) + (D×7)",
      compute:(A,B,C,D)=>Math.round(A+(B*10)+(C*2)+(D*7))
    },
    8:{ title:"Kapitel 8 – Energie im Alltag ⚡", next:9,
      groups:{
        A:`<b>Zeit</b><br>Wasserkocher läuft 3 Minuten. Wie viele Sekunden?`,
        B:`<b>Temperatur</b><br>Von −2°C auf 20°C: Temperaturänderung?`,
        C:`<b>Schaltzeichen</b><br>Kreis mit Kreuz steht für… 1) Batterie 2) Lampe 3) Schalter<br><b>Antwort:</b> 1/2/3`,
        D:`<b>Idiotentest</b><br>Wie viele Monate haben 28 Tage?`
      },
      formulaName:"(A÷30) + (B×2) + (C×9) + (D×8)",
      compute:(A,B,C,D)=>Math.round((A/30)+(B*2)+(C*9)+(D*8))
    },
    9:{ title:"Kapitel 9 – Alltag & Fair Play 🤝", next:10,
      groups:{
        A:`<b>Meinungsfreiheit</b><br>Was passt am ehesten?<br>1) alles sagen ohne Folgen • 2) Meinung ja, aber ohne Beleidigung/Drohung • 3) immer Mehrheit übernehmen<br><b>Antwort:</b> 1/2/3`,
        B:`<b>Online-Streit</b><br>Was hilft am ehesten?<br>1) provozieren • 2) Pause/melden/Beweise sichern • 3) alles posten<br><b>Antwort:</b> 1/2/3`,
        C:`<b>Fair teilen</b><br>18 Kekse auf 5 Personen: wie viele bleiben übrig?`,
        D:`<b>Bio</b><br>Welche Zelle transportiert Sauerstoff?<br>1) Nervenzelle • 2) rotes Blutkörperchen • 3) Hautzelle<br><b>Antwort:</b> 1/2/3`
      },
      formulaName:"(A×6) + (B×6) + (C×5) + (D×7)",
      compute:(A,B,C,D)=>Math.round((A*6)+(B*6)+(C*5)+(D*7))
    },
    10:{ title:"Kapitel 10 – KI & Bullshit-Radar 🛰️", next:11,
      groups:{
        A:`<b>True/False</b><br>„Ein Screenshot ist immer ein Beweis.“ 1=wahr 2=falsch`,
        B:`<b>True/False</b><br>„Ein KI-Text kann Fehler enthalten.“ 1=nein 2=ja`,
        C:`<b>Buchstaben</b><br>Zähle die Buchstaben in „algorithmus“.`,
        D:`<b>Passwort</b><br>Was ist am stärksten?<br>1) 12345678 • 2) passwort • 3) T7!kZ2#pQ9<br><b>Antwort:</b> 1/2/3`
      },
      formulaName:"(A×10) + (B×10) + C + (D×9)",
      compute:(A,B,C,D)=>Math.round((A*10)+(B*10)+C+(D*9))
    },
    11:{ title:"Kapitel 11 – Boss-Quiz I 👑", next:12,
      groups:{
        A:`<b>Genau lesen</b><br>Notiere 6. Addiere 2. Multipliziere mit 3. Ergebnis?`,
        B:`<b>Umfang</b><br>Rechteck hat Umfang 30 cm. Eine Seite 8 cm. Andere Seite?`,
        C:`<b>Physik</b><br>Erwärmen → Teilchen bewegen sich… 1) langsamer 2) gleich 3) schneller<br><b>Antwort:</b> 1/2/3`,
        D:`<b>Wort</b><br>Wie viele Buchstaben hat „SCHNEE“?`
      },
      formulaName:"A + (B×2) + (C×11) + (D×4)",
      compute:(A,B,C,D)=>Math.round(A+(B*2)+(C*11)+(D*4))
    },
    12:{ title:"Kapitel 12 – Boss-Quiz II 🧠🔥", next:13,
      groups:{
        A:`<b>Mathe</b><br>12% von 250 = ? (ganze Zahl)`,
        B:`<b>Logik</b><br>Wenn heute Dienstag ist: in 10 Tagen ist… 1) Freitag 2) Samstag 3) Sonntag<br><b>Antwort:</b> 1/2/3`,
        C:`<b>Sprache</b><br>Wie viele Silben hat „Information“? (In-for-ma-ti-on)`,
        D:`<b>Idiotentest</b><br>Was ist schwerer: 1 kg Federn oder 1 kg Steine?<br>1) Federn 2) Steine 3) gleich<br><b>Antwort:</b> 1/2/3`
      },
      formulaName:"A + (B×15) + (C×6) + (D×9)",
      compute:(A,B,C,D)=>Math.round(A+(B*15)+(C*6)+(D*9))
    },
    13:{ title:"Kapitel 13 – GeWi & Welt 🗺️", next:14,
      groups:{
        A:`<b>Deutschland</b><br>Wie viele Bundesländer hat Deutschland?`,
        B:`<b>EU</b><br>Wie viele Sterne hat die EU-Flagge?`,
        C:`<b>Politik-Basis</b><br>Wie viele Jahre dauert eine Legislaturperiode des Bundestags?`,
        D:`<b>Geografie</b><br>Welche ist die längste? 1) Rhein 2) Elbe 3) Oder<br><b>Antwort:</b> 1/2/3`
      },
      formulaName:"A + (B×3) + (C×7) + (D×11)",
      compute:(A,B,C,D)=>Math.round(A+(B*3)+(C*7)+(D*11))
    },
    14:{ title:"Kapitel 14 – WAT & Geld 🧾", next:15,
      groups:{
        A:`<b>Fix vs. variabel</b><br>Wähle: 1) Miete ist variabel 2) Miete ist fix 3) egal<br><b>Antwort:</b> 1/2/3`,
        B:`<b>Mehrwertsteuer</b><br>19% von 100€ sind wie viel €?`,
        C:`<b>Budget</b><br>Du hast 50€. Du gibst 18€ und 12€ aus. Rest?`,
        D:`<b>Rechnen</b><br>2,50€ pro Tag für 7 Tage: Gesamt in Cent?`
      },
      formulaName:"(A×20) + B + (C×4) + (D÷10)",
      compute:(A,B,C,D)=>Math.round((A*20)+B+(C*4)+(D/10))
    },
    15:{ title:"Kapitel 15 – Finale Vorbereitung 🎄", next:16,
      groups:{
        A:`<b>Wort-Radar</b><br>Wie viele Buchstaben hat „WEIHNACHTSBAUM“?`,
        B:`<b>Mathe</b><br>Summe der Ziffern von 2025?`,
        C:`<b>Logik</b><br>Wenn du 3 Kerzen anzündest und 2 wieder auspustest: Wie viele Kerzen brennen?`,
        D:`<b>Mini-Englisch</b><br>„Snow“ hat wie viele Buchstaben?`
      },
      formulaName:"A + (B×9) + (C×12) + (D×7)",
      compute:(A,B,C,D)=>Math.round(A+(B*9)+(C*12)+(D*7))
    },
    16:{ title:"Kapitel 16 – FINALE 🎁🔒", next:0, finalCode:2412 }
  };


  // ===== Chapter solution codes (strict unlock) =====
  // These are the *expected* numeric codes for each chapter based on the default solutions.
  // Teams must enter the correct code to unlock the next chapter.
  const SOLUTIONS = {
    1:132, 2:77, 3:67, 4:76, 5:98, 6:66, 7:58, 8:164,
    9:53, 10:78, 11:95, 12:102, 13:91, 14:314, 15:135, 16:2412
  };

  function loadBoard(){
    try{
      const raw = localStorage.getItem(KEY_BOARD);
      if(!raw) return {chapter:1, lastCode:"", lastToken:""};
      const st = JSON.parse(raw);
      return {chapter: st.chapter||1, lastCode: st.lastCode||"", lastToken: st.lastToken||""};
    }catch(e){ return {chapter:1, lastCode:"", lastToken:""}; }
  }
  function saveBoard(st){ localStorage.setItem(KEY_BOARD, JSON.stringify(st)); }
  function loadTeam(){
    const raw=localStorage.getItem(KEY_TEAM);
    const n=raw?parseInt(raw,10):1;
    return Number.isFinite(n)?n:1;
  }
  function saveTeam(n){ localStorage.setItem(KEY_TEAM, String(n)); }

  window.ESC = { VERSION, KEY_BOARD, KEY_TEAM, CHAPTERS, SOLUTIONS, loadBoard, saveBoard, loadTeam, saveTeam, fxConfetti, makeToken };
})();