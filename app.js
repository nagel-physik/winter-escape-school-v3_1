(function(){
  const VERSION = "v3";
  const KEY_BOARD = "escape_board_state_"+VERSION;
  const KEY_TEAM  = "escape_team_progress_"+VERSION;

  function fxConfetti(ms=2200){
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
    const N=420;

    for(let i=0;i<N*0.65;i++){
      parts.push({
        x: Math.random()*W,
        y: -Math.random()*H*0.6,
        vx: (Math.random()*2-1)*1.8,
        vy: 2 + Math.random()*4.5,
        g: 0.035 + Math.random()*0.02,
        r: 2 + Math.random()*4,
        rot: Math.random()*Math.PI,
        vr: (Math.random()*2-1)*0.18,
        col: colors[(Math.random()*colors.length)|0],
        life: ms + Math.random()*800
      });
    }
    for(let i=0;i<N*0.35;i++){
      parts.push({
        x: W*0.5 + (Math.random()*60-30),
        y: H*0.78 + (Math.random()*20-10),
        vx: (Math.random()*2-1)*7.5,
        vy: -(8 + Math.random()*10),
        g: 0.22 + Math.random()*0.16,
        r: 2 + Math.random()*4,
        rot: Math.random()*Math.PI,
        vr: (Math.random()*2-1)*0.28,
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

        if(p.x < -20) p.x = W+20;
        if(p.x > W+20) p.x = -20;

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

  const CHAPTERS = {
    1:{ title:"Kapitel 1 – Briefing: ‚Frostige Mission‘ ❄️", next:2, codeType:"calc",
      groups:{
        A:`Ihr bekommt einen Zettel: „Treffpunkt 08:15. Wir brauchen 35 Minuten Aufbau, 10 Minuten Puffer.“
            <br><br><strong>Frage:</strong> Wie viele Minuten <em>vor</em> 08:15 muss spätestens begonnen werden?`,
        B:`In der letzten Schulwoche gibt es oft „kurze Stunden“: 40 Minuten. Heute habt ihr 3 solcher Stunden am Stück.
            <br><br><strong>Frage:</strong> Wie viele Minuten sind das insgesamt?`,
        C:`Kahoot‑Style: „Wähle die einzige Aussage, die IMMER stimmt.“
            <br>1) Jede Primzahl ist ungerade.
            <br>2) Jede gerade Zahl ist durch 2 teilbar.
            <br>3) Jede Zahl mit 0 am Ende ist eine Primzahl.
            <br><br><strong>Antwort:</strong> Gib nur die Optionsnummer (1/2/3).`,
        D:`Ein Handy-Akku zeigt 25%. In 30 Minuten sinkt er auf 10%. (Lineare Annahme nur für diese Aufgabe!)
            <br><br><strong>Frage:</strong> Wie viele Prozentpunkte verliert er pro 10 Minuten?`
      },
      formulaName:"A + (B ÷ 10) + (C×7) + (D×2)",
      normalize:(v)=>v,
      compute:(A,B,C,D)=>Math.round(A + (B/10) + (C*7) + (D*2))
    },

    2:{ title:"Kapitel 2 – Medienfalle: ‚Klick oder Kopf?‘ 🧠📱", next:3, codeType:"calc",
      groups:{
        A:`„Ein Screenshot ist immer ein Beweis.“ – Klassische Aussage im Streit.
            <br><br>1 = stimmt • 2 = stimmt nicht
            <br><br><strong>Gib die Zahl 1 oder 2.</strong>`,
        B:`Du siehst einen Post: „Nur heute! 70% Rabatt!“
            <br>Unten steht klein: „Gilt nur auf ausgewählte Artikel.“
            <br><br><strong>Frage:</strong> Wie viele Wörter hat der Satz „Gilt nur auf ausgewählte Artikel“? (Zähle genau.)`,
        C:`Idiotentest: Lies GENAU.
            <br>„Schreibe die Zahl 9, addiere 1, subtrahiere 1.“
            <br><br><strong>Frage:</strong> Was kommt am Ende raus?`,
        D:`Ein Video hat 4 Quellen in der Beschreibung.
            <br>Quelle 1 ist Werbung, Quelle 2 ist ein Meme, Quelle 3 ist ein Zeitungsartikel, Quelle 4 ist ein Blog.
            <br><br><strong>Frage:</strong> Wie viele davon sind <em>keine</em> verlässliche Quelle? (Rein vom Typ her.)`
      },
      formulaName:"(A×10) + (B×2) + (C×3) + (D×5)",
      normalize:(v)=>v,
      compute:(A,B,C,D)=>Math.round((A*10) + (B*2) + (C*3) + (D*5))
    },

    3:{ title:"Kapitel 3 – Schule trifft Alltag: ‚Rechnen ohne Tränen‘ 🎒", next:4, codeType:"calc",
      groups:{
        A:`Physik‑Mini: Ein Fahrrad fährt 180 m in 12 s.
            <br><br><strong>Frage:</strong> Wie groß ist v in m/s? (Ganze Zahl, runden.)`,
        B:`Bio‑Mini: In einer Zelle gibt es „Zellkern, Zellmembran, Cytoplasma“.
            <br><br><strong>Frage:</strong> Wie viele <em>Silben</em> hat „Zellmembran“? (Zell‑mem‑bran)`,
        C:`WAT‑Mini: Du kaufst 2 Getränke à 1,60 € und bekommst 20 Cent Pfand pro Flasche zurück.
            <br><br><strong>Frage:</strong> Wie viel Euro bekommst du Pfand zurück? (in Cent als Zahl!)`,
        D:`Idiotentest: „Welche Zahl ist größer?“
            <br>1) 0,9
            <br>2) 0,10
            <br>3) 0,099
            <br><br><strong>Antwort:</strong> Optionsnummer (1/2/3).`
      },
      formulaName:"(A×2) + (B×9) + (C ÷ 10) + (D×11)",
      normalize:(v)=>v,
      compute:(A,B,C,D)=>Math.round((A*2) + (B*9) + (C/10) + (D*11))
    },

    4:{ title:"Kapitel 4 – Körper & Kopf: ‚Spanne statt Streit‘ 🧬", next:5, codeType:"calc",
      groups:{
        A:`Schätzung mit Spanne: Atemzüge/Minute in Ruhe.
            <br><strong>Akzeptiert:</strong> 12–20
            <br><br>Gebt eure Zahl an die Spielleitung.`,
        B:`Schätzung mit Spanne: Sauerstoffanteil der Luft (in %).
            <br><strong>Akzeptiert:</strong> 20–23 (Schulwertbereich)
            <br><br>Gebt eure Zahl an die Spielleitung.`,
        C:`Schätzung mit Spanne: Schlafbedarf Teenager (in Stunden).
            <br><strong>Akzeptiert:</strong> 8–10`,
        D:`Kahoot‑Trick: „Muskeln“ wird oft diskutiert.
            <br>Wählt: 1) ~200 • 2) ~400 • 3) ~650
            <br><br><strong>Antwort:</strong> Optionsnummer (1/2/3).`
      },
      formulaName:"A + B + C + (D×10)",
      normalize:(vals)=>{
        let [A,B,C,D]=vals;
        if(Number.isFinite(A)) A = (A<12?12:(A>20?20:A));
        if(Number.isFinite(B)) B = (B<20?20:(B>23?23:B));
        if(Number.isFinite(C)) C = (C<8?8:(C>10?10:C));
        if(D<1) D=1;
        if(D>3) D=3;
        return [A,B,C,D];
      },
      compute:(A,B,C,D)=>Math.round(A + B + C + (D*10))
    },

    5:{ title:"Kapitel 5 – Kaufen oder Ködern: ‚Werbung überall‘ 🛒😅", next:6, codeType:"calc",
      groups:{
        A:`Du siehst ein Preisschild: „Statt 2,99 € nur 2,49 €!“
            <br><br><strong>Frage:</strong> Wie viele Cent sind das weniger?`,
        B:`Influencer‑Check (Kategorien, kein Schätzen):
            <br>1 = in 15 Min nur 0–1 Werbung
            <br>2 = in 15 Min 2–4 Werbung
            <br>3 = in 15 Min 5+ Werbung
            <br><br><strong>Antwort:</strong> 1/2/3`,
        C:`„2 kaufen – 1 gratis“ bei Schokoriegeln.
            <br>Du nimmst 6 Riegel. Wie viele bezahlst du?`,
        D:`Mini‑Falle: Du siehst „20% Rabatt“.
            <br>Der Artikel kostet 50 €.
            <br><br><strong>Frage:</strong> Wie viel Euro Rabatt sind das?`
      },
      formulaName:"A + (B×8) + (C×3) + (D×2)",
      normalize:(v)=>v,
      compute:(A,B,C,D)=>Math.round(A + (B*8) + (C*3) + (D*2))
    },

    6:{ title:"Kapitel 6 – Sprache & Codes: ‚Lesen wie ein Profi‘ 📝", next:7, codeType:"calc",
      groups:{
        A:`Mini‑Text:
            <br>„Im Flur hängt ein Plakat: <em>‚Bitte leise sein – Prüfung!‘</em>“
            <br><br><strong>Frage:</strong> Wie viele Buchstaben hat das Wort „Prüfung“? (Umlaute zählen als 1)`,
        B:`Kahoot‑Style:
            <br>Welche Schreibweise ist korrekt?
            <br>1) seit dem
            <br>2) seid dem
            <br>3) seiddem
            <br><br><strong>Antwort:</strong> 1/2/3`,
        C:`Englisch ohne Stolpern:
            <br>„I’m <em>excited</em>“ bedeutet meist …
            <br>1) aufgeregt / freue mich
            <br>2) wütend
            <br>3) gelangweilt
            <br><br><strong>Antwort:</strong> 1/2/3`,
        D:`Code‑Zählen:
            <br>Zähle die Vokale (a,e,i,o,u) im Wort „education“.
            <br><br><strong>Antwort:</strong> Zahl`
      },
      formulaName:"(A×5) + (B×9) + (C×7) + (D×3)",
      normalize:(v)=>v,
      compute:(A,B,C,D)=>Math.round((A*5) + (B*9) + (C*7) + (D*3))
    },

    7:{ title:"Kapitel 7 – Logik & Fallen: ‚Idiotentest‘ 🧩", next:8, codeType:"calc",
      groups:{
        A:`Du liest: „Addiere 10 und halbiere dann.“
            <br>Startzahl ist 14.
            <br><br><strong>Frage:</strong> Ergebnis als Zahl`,
        B:`Ein Würfel hat 6 Flächen. Ein Quader hat …
            <br>1) 4 Flächen
            <br>2) 6 Flächen
            <br>3) 8 Flächen
            <br><br><strong>Antwort:</strong> 1/2/3`,
        C:`Idiotentest‑Satz:
            <br>„Zähle die Buchstaben in ‚WEIHNACHTEN‘ und subtrahiere 5.“
            <br><br><strong>Antwort:</strong> Zahl`,
        D:`Welche Zahl ist als Bruch am größten?
            <br>1) 3/8
            <br>2) 4/9
            <br>3) 5/12
            <br><br><strong>Antwort:</strong> 1/2/3`
      },
      formulaName:"A + (B×10) + (C×2) + (D×7)",
      normalize:(v)=>v,
      compute:(A,B,C,D)=>Math.round(A + (B*10) + (C*2) + (D*7))
    },

    8:{ title:"Kapitel 8 – Physik/NaWi: ‚Energie im Alltag‘ ⚡", next:9, codeType:"calc",
      groups:{
        A:`Ein Wasserkocher hat 2000 W und läuft 3 Minuten.
            <br><br><strong>Frage:</strong> Wie viele Sekunden läuft er?`,
        B:`Temperatur‑Denke:
            <br>Du gehst von −2 °C in einen Raum mit 20 °C.
            <br><br><strong>Frage:</strong> Wie groß ist die Temperaturänderung (in °C)?`,
        C:`Ein Schaltplan-Symbol:
            <br>1) Batterie
            <br>2) Lampe
            <br>3) Schalter
            <br><br><strong>Auf dem Arbeitsblatt ist ein Kreis mit Kreuz.</strong> Welche Nummer?`,
        D:`Idiotentest:
            <br>„Wie viele Monate haben 28 Tage?“
            <br><br><strong>Antwort:</strong> Zahl`
      },
      formulaName:"(A ÷ 30) + (B×2) + (C×9) + (D×8)",
      normalize:(v)=>v,
      compute:(A,B,C,D)=>Math.round((A/30) + (B*2) + (C*9) + (D*8))
    },

    9:{ title:"Kapitel 9 – Gesellschaft & Alltag: ‚Fair Play‘ 🤝", next:10, codeType:"calc",
      groups:{
        A:`Kahoot‑Frage:
            <br>Was bedeutet „Meinungsfreiheit“ im Alltag am ehesten?
            <br>1) Ich darf alles sagen, ohne Folgen.
            <br>2) Ich darf meine Meinung sagen, aber nicht beleidigen/bedrohen.
            <br>3) Ich muss immer die Meinung der Mehrheit übernehmen.
            <br><br><strong>Antwort:</strong> 1/2/3`,
        B:`Konflikt‑Check:
            <br>Ein Streit eskaliert online. Was hilft am ehesten?
            <br>1) Weiter provozieren
            <br>2) Pause / melden / Beweise sichern
            <br>3) Alles öffentlich posten
            <br><br><strong>Antwort:</strong> 1/2/3`,
        C:`Alltags‑Mathe:
            <br>Du teilst 18 Kekse fair auf 5 Personen.
            <br><br><strong>Frage:</strong> Wie viele Kekse bleiben übrig?`,
        D:`Bio/NaWi:
            <br>Welche Zelle ist für Sauerstofftransport im Blut zuständig?
            <br>1) Nervenzelle
            <br>2) Rotes Blutkörperchen
            <br>3) Hautzelle
            <br><br><strong>Antwort:</strong> 1/2/3`
      },
      formulaName:"(A×6) + (B×6) + (C×5) + (D×7)",
      normalize:(v)=>v,
      compute:(A,B,C,D)=>Math.round((A*6)+(B*6)+(C*5)+(D*7))
    },

    10:{ title:"Kapitel 10 – Digital & KI: ‚Bullshit-Radar‘ 🛰️", next:11, codeType:"calc",
      groups:{
        A:`True/False:
            <br>„Wenn etwas viele Likes hat, ist es wahr.“
            <br>1 = wahr • 2 = falsch`,
        B:`True/False:
            <br>„Ein KI‑Text kann Fehler enthalten.“
            <br>1 = nein • 2 = ja`,
        C:`Zähle im Wort „algorithmus“ die Buchstaben.
            <br><br><strong>Antwort:</strong> Zahl`,
        D:`Kahoot‑Wahl:
            <br>Was ist ein starkes Passwort am ehesten?
            <br>1) 12345678
            <br>2) passwort
            <br>3) T7!kZ2#pQ9
            <br><br><strong>Antwort:</strong> 1/2/3`
      },
      formulaName:"(A×10) + (B×10) + C + (D×9)",
      normalize:(v)=>v,
      compute:(A,B,C,D)=>Math.round((A*10)+(B*10)+C+(D*9))
    },

    11:{ title:"Kapitel 11 – Boss-Quiz: ‚Konzentration!‘ 👑", next:12, codeType:"calc",
      groups:{
        A:`Mini‑Text (lesen!):
            <br>„Du sollst die Zahl 6 notieren. Danach addiere 2. Danach multipliziere mit 3.“
            <br><br><strong>Frage:</strong> Ergebnis als Zahl`,
        B:`Mathe‑Logik:
            <br>Ein Rechteck hat Umfang 30 cm.
            <br>Eine Seite ist 8 cm.
            <br><br><strong>Frage:</strong> Wie lang ist die andere Seite?`,
        C:`Physik‑Denke:
            <br>Ein Körper wird erwärmt. Was passiert im Mittel mit Teilchenbewegung?
            <br>1) wird langsamer
            <br>2) bleibt gleich
            <br>3) wird schneller
            <br><br><strong>Antwort:</strong> 1/2/3`,
        D:`Idiotentest‑Finish:
            <br>„Wie viele Buchstaben hat ‚SCHNEE‘?“
            <br><br><strong>Antwort:</strong> Zahl`
      },
      formulaName:"A + (B×2) + (C×11) + (D×4)",
      normalize:(v)=>v,
      compute:(A,B,C,D)=>Math.round(A + (B*2) + (C*11) + (D*4))
    },

    12:{ title:"Finale 🎁 – Geschenkmodus (Kapitel 12)", next:0, codeType:"word", code:"XMAS" }
  };

  function loadBoard(){
    try{
      const raw = localStorage.getItem(KEY_BOARD);
      if(!raw) return {chapter:1, lastCode:""};
      const st = JSON.parse(raw);
      return {chapter: st.chapter||1, lastCode: st.lastCode||""};
    }catch(e){ return {chapter:1, lastCode:""}; }
  }
  function saveBoard(st){ localStorage.setItem(KEY_BOARD, JSON.stringify(st)); }

  function loadTeam(){ 
    const raw=localStorage.getItem(KEY_TEAM);
    const n=raw?parseInt(raw,10):1;
    return Number.isFinite(n)?n:1;
  }
  function saveTeam(n){ localStorage.setItem(KEY_TEAM, String(n)); }

  window.ESC = { VERSION, KEY_BOARD, KEY_TEAM, CHAPTERS, loadBoard, saveBoard, loadTeam, saveTeam, fxConfetti };
})();