(function(){
  const VERSION = "v4_4_DE";
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
        A:`<b>Aufgabe 1 (Mathe):</b> 7·5 = ?<br><b>Aufgabe 2 (Transfer):</b> Addiere 0 (nichts verändern).<br><b>Eingabe:</b> Ergebnis (nur Zahl).`,
        B:`<b>Aufgabe 1 (Logik):</b> Welche Aussage ist immer richtig?<br>1) Jede Primzahl ist ungerade.<br>2) Jede gerade Zahl ist durch 2 teilbar.<br>3) Jede Zahl, die auf 0 endet, ist prim.<br><b>Aufgabe 2:</b> Gib nur die <b>Nummer</b> ein.`,
        C:`<b>Aufgabe 1 (Zeit):</b> 3 Kurzstunden à 40 min.<br><b>Aufgabe 2:</b> Rechne 3·40.<br><b>Eingabe:</b> Minuten gesamt.`,
        D:`<b>Aufgabe 1 (Idiotentest):</b> Starte mit 9.<br><b>Aufgabe 2:</b> +1, −1, ×1.<br><b>Eingabe:</b> Endzahl.`
      },
      formulaName:"A + (B×11) + (C÷10) + (D×7)",
      compute:(A,B,C,D)=>Math.round(A + (B*11) + (C/10) + (D*7))
    },
    2:{ title:"Kapitel 2 – Klick oder Kopf? 📱🧠", next:3,
      groups:{
        A:`<b>Aufgabe 1 (Informatik):</b> „Viele Likes = wahr“ ist …<br>1) wahr  2) falsch<br><b>Aufgabe 2:</b> Nummer eingeben.`,
        B:`<b>Aufgabe 1 (Deutsch):</b> Zähle die Wörter im Satz:<br><i>„Gilt nur auf ausgewählte Artikel.“</i><br><b>Aufgabe 2:</b> Gib die Wortanzahl ein.`,
        C:`<b>Aufgabe 1 (IT-Sicherheit):</b> Gleiches Passwort überall ist …<br>1) okay  2) riskant  3) egal<br><b>Aufgabe 2:</b> Nummer eingeben.`,
        D:`<b>Aufgabe 1 (Trickfrage):</b> Wie viele Monate haben 28 Tage?<br><b>Aufgabe 2:</b> Denk an „mindestens 28 Tage“.<br><b>Eingabe:</b> Zahl.`
      },
      formulaName:"(A×10) + (B×3) + (C×9) + (D×2)",
      compute:(A,B,C,D)=>Math.round((A*10)+(B*3)+(C*9)+(D*2))
    },
    3:{ title:"Kapitel 3 – Physik leicht, Fehler schwer ⚡", next:4,
      groups:{
        A:`<b>Aufgabe 1 (Physik):</b> s = 180 m, t = 12 s.<br><b>Aufgabe 2:</b> v = s/t. Runde auf ganze Zahl.<br><b>Eingabe:</b> v (m/s).`,
        B:`<b>Aufgabe 1 (Kopfrechnen):</b> 0,9 = 0,900 …<br>Welche Zahl ist am größten?<br>1) 0,9  2) 0,10  3) 0,099<br><b>Aufgabe 2:</b> Gib nur die Nummer ein.`,
        C:`<b>Aufgabe 1 (Zeit):</b> 3 Minuten.<br><b>Aufgabe 2:</b> Umrechnen in Sekunden.<br><b>Eingabe:</b> Sekunden.`,
        D:`<b>Aufgabe 1 (Logik):</b> Verdoppeln und danach halbieren.<br><b>Aufgabe 2:</b> Ergebnis ist … 1) größer 2) gleich 3) kleiner<br><b>Eingabe:</b> Nummer.`
      },
      formulaName:"(A×2) + (B×13) + (C÷30) + (D×9)",
      compute:(A,B,C,D)=>Math.round((A*2)+(B*13)+(C/30)+(D*9))
    },
    4:{ title:"Kapitel 4 – Spanne statt Streit (Toleranz) 🧬", next:5,
      groups:{
        A:`<b>Aufgabe 1 (Bio):</b> Ein Mensch hat normalerweise <b>2</b> Lungenflügel.<br><b>Aufgabe 2 (Mathe):</b> 8·2 = ?<br><b>Eingabe:</b> Zahl.`,
        B:`<b>Aufgabe 1 (Chemie):</b> pH-Wert von Wasser ist ungefähr 7.<br><b>Aufgabe 2 (Mathe):</b> 7·3 = ?<br><b>Eingabe:</b> Zahl.`,
        C:`<b>Aufgabe 1 (Physik):</b> 1 Stunde = 60 Minuten.<br><b>Aufgabe 2:</b> 60/ ? = 9 ⇒ ? = ? (Tipp: 60/ ? = 9).<br><b>Eingabe:</b> 9 (nur Zahl).`,
        D:`<b>Aufgabe 1 (Bio):</b> Wie viele Basenpaare hat ein DNA-Baustein? (A–T und C–G bilden Paare.)<br><b>Aufgabe 2:</b> Wähle: 1) 1  2) 2  3) 4<br><b>Eingabe:</b> Nummer.`
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
        A:`<b>Aufgabe 1 (WAT):</b> 2,99€ → 2,49€.<br><b>Aufgabe 2:</b> Differenz in Cent (nur Zahl).`,
        B:`<b>Aufgabe 1 (Alltag):</b> In 15 Minuten Social Media siehst du meistens nicht „0“, aber auch nicht ständig „5+“.<br>Welche Kategorie ist am realistischsten?<br>1) 0–1  2) 2–4  3) 5+<br><b>Aufgabe 2:</b> Gib die <b>Nummer</b> ein (nicht die Werbezahl!).`,
        C:`<b>Aufgabe 1 (Mathe):</b> Aktion „3 zum Preis von 2“.<br><b>Aufgabe 2:</b> Bei 6 Riegeln: Wie viele bezahlst du? (nur Zahl).`,
        D:`<b>Aufgabe 1 (Prozent):</b> 20% von 50€.<br><b>Aufgabe 2:</b> Rabatt in Euro (nur Zahl).`
      },
      formulaName:"A + (B×8) + (C×3) + (D×2)",
      compute:(A,B,C,D)=>Math.round(A+(B*8)+(C*3)+(D*2))
    },
    6:{ title:"Kapitel 6 – Sprache & Codes 📝", next:7,
      groups:{
        A:`<b>Aufgabe 1 (Deutsch):</b> Zähle die Buchstaben in „Prüfung“ (ü zählt als 1).<br><b>Aufgabe 2:</b> Gib die Anzahl ein.`,
        B:`<b>Aufgabe 1:</b> Welche Schreibweise ist korrekt?<br>1) seit dem  2) seid dem  3) seiddem<br><b>Aufgabe 2:</b> Nummer eingeben.`,
        C:`<b>Aufgabe 1 (Englisch):</b> „I’m excited“ bedeutet meistens …<br>1) aufgeregt/freue mich  2) wütend  3) gelangweilt<br><b>Aufgabe 2:</b> Nummer eingeben.`,
        D:`<b>Aufgabe 1 (Englisch):</b> Zähle die Vokale a,e,i,o,u in „education“.<br><b>Aufgabe 2:</b> Gib die Anzahl ein.`
      },
      formulaName:"(A×5) + (B×9) + (C×7) + (D×3)",
      compute:(A,B,C,D)=>Math.round((A*5)+(B*9)+(C*7)+(D*3))
    },
    7:{ title:"Kapitel 7 – Logik & Fallen 🧩", next:8,
      groups:{
        A:`<b>Aufgabe 1 (Rechnen):</b> Start 14, +10, dann halbieren.<br><b>Aufgabe 2:</b> Ergebnis eintragen.`,
        B:`<b>WICHTIG:</b> Bei Multiple Choice immer nur die <b>Nummer 1/2/3</b> eingeben!<br>Ein Quader hat wie viele Flächen?<br>1) 4  2) 6  3) 8<br><b>Eingabe:</b> Nummer.`,
        C:`<b>Aufgabe 1 (Wort → Zahl):</b> Zähle Buchstaben von „WEIHNACHTEN“.<br><b>Aufgabe 2:</b> Ziehe 5 ab. Ergebnis eingeben.`,
        D:`<b>Aufgabe 1 (Brüche):</b> Welcher Bruch ist am größten?<br>1) 3/8  2) 4/9  3) 5/12<br><b>Aufgabe 2:</b> Nummer eingeben.`
      },
      formulaName:"A + (B×10) + (C×2) + (D×7)",
      compute:(A,B,C,D)=>Math.round(A+(B*10)+(C*2)+(D*7))
    },
    8:{ title:"Kapitel 8 – Energie im Alltag ⚡", next:9,
      groups:{
        A:`<b>Aufgabe 1 (Zeit):</b> 3 Minuten.<br><b>Aufgabe 2:</b> Sekunden? (nur Zahl).`,
        B:`<b>Aufgabe 1 (Temperatur):</b> −2°C → 20°C.<br><b>Aufgabe 2:</b> Temperaturänderung als Zahl.`,
        C:`<b>Aufgabe 1 (Physik):</b> Kreis mit Kreuz = welches Bauteil?<br>1) Batterie  2) Lampe  3) Schalter<br><b>Aufgabe 2:</b> Nummer eingeben.`,
        D:`<b>Aufgabe 1 (Trickfrage):</b> Wie viele Monate haben 28 Tage?<br><b>Aufgabe 2:</b> Zahl eingeben.`
      },
      formulaName:"(A÷30) + (B×2) + (C×9) + (D×8)",
      compute:(A,B,C,D)=>Math.round((A/30)+(B*2)+(C*9)+(D*8))
    },
    9:{ title:"Kapitel 9 – Alltag & Fair Play 🤝", next:10,
      groups:{
        A:`<b>Aufgabe 1 (Sozial):</b> Aussage: „Meinung ja – aber ohne Beleidigung/Drohung.“<br>Welche Nummer passt?<br>1) alles sagen ohne Folgen  2) Meinung ja, ohne Beleidigung  3) immer Mehrheit übernehmen<br><b>Aufgabe 2:</b> Nummer eingeben.`,
        B:`<b>Aufgabe 1 (Online-Konflikt):</b> Was ist am sinnvollsten?<br>1) provozieren  2) Pause/melden/Beweise sichern  3) alles posten<br><b>Aufgabe 2:</b> Nummer eingeben.`,
        C:`<b>Aufgabe 1 (Mathe):</b> 18 Kekse auf 5 Personen.<br><b>Aufgabe 2:</b> Wie viele bleiben übrig? (Rest).`,
        D:`<b>Aufgabe 1 (Bio):</b> Sauerstoff transportieren …<br>1) Nervenzelle  2) rotes Blutkörperchen  3) Hautzelle<br><b>Aufgabe 2:</b> Nummer eingeben.`
      },
      formulaName:"(A×6) + (B×6) + (C×5) + (D×7)",
      compute:(A,B,C,D)=>Math.round((A*6)+(B*6)+(C*5)+(D*7))
    },
    10:{ title:"Kapitel 10 – KI & Bullshit-Radar 🛰️", next:11,
      groups:{
        A:`<b>Aufgabe 1:</b> „Ein Screenshot ist immer ein Beweis.“<br>1) wahr  2) falsch<br><b>Aufgabe 2:</b> Nummer eingeben.`,
        B:`<b>Aufgabe 1:</b> „Ein KI-Text kann Fehler enthalten.“<br>1) nein  2) ja<br><b>Aufgabe 2:</b> Nummer eingeben.`,
        C:`<b>Aufgabe 1 (Deutsch):</b> Zähle die Buchstaben von „algorithmus“.<br><b>Aufgabe 2:</b> Zahl eingeben.`,
        D:`<b>Aufgabe 1 (IT):</b> Was ist am stärksten?<br>1) 12345678  2) passwort  3) T7!kZ2#pQ9<br><b>Aufgabe 2:</b> Nummer eingeben.`
      },
      formulaName:"(A×10) + (B×10) + C + (D×9)",
      compute:(A,B,C,D)=>Math.round((A*10)+(B*10)+C+(D*9))
    },
    11:{ title:"Kapitel 11 – Boss-Quiz I 👑", next:12,
      groups:{
        A:`<b>Aufgabe 1 (Mathe):</b> 6 + 2 = ?<br><b>Aufgabe 2:</b> Ergebnis ·3. Zahl eingeben.`,
        B:`<b>Aufgabe 1 (Geometrie):</b> Umfang Rechteck 30 cm, Seite 8 cm.<br><b>Aufgabe 2:</b> Andere Seite? (nur Zahl).`,
        C:`<b>Aufgabe 1 (Physik):</b> Erwärmen → Teilchen bewegen sich …<br>1) langsamer  2) gleich  3) schneller<br><b>Aufgabe 2:</b> Nummer eingeben.`,
        D:`<b>Aufgabe 1 (Wort):</b> Buchstaben in „SCHNEE“.<br><b>Aufgabe 2:</b> Zahl eingeben.`
      },
      formulaName:"A + (B×2) + (C×11) + (D×4)",
      compute:(A,B,C,D)=>Math.round(A+(B*2)+(C*11)+(D*4))
    },
    12:{ title:"Kapitel 12 – Boss-Quiz II 🧠🔥", next:13,
      groups:{
        A:`<b>Aufgabe 1 (Prozent):</b> 12% von 250.<br><b>Aufgabe 2:</b> Ganze Zahl eingeben.`,
        B:`<b>Aufgabe 1 (Wochentag):</b> Heute Dienstag. In 10 Tagen ist …<br>1) Freitag  2) Samstag  3) Sonntag<br><b>Aufgabe 2:</b> Nummer eingeben.`,
        C:`<b>Aufgabe 1 (Deutsch):</b> Silben in „Information“ (In-for-ma-ti-on).<br><b>Aufgabe 2:</b> Zahl eingeben.`,
        D:`<b>Aufgabe 1 (Trick):</b> 1 kg Federn vs 1 kg Steine.<br>1) Federn  2) Steine  3) gleich<br><b>Aufgabe 2:</b> Nummer eingeben.`
      },
      formulaName:"A + (B×15) + (C×6) + (D×9)",
      compute:(A,B,C,D)=>Math.round(A+(B*15)+(C*6)+(D*9))
    },
    13:{ title:"Kapitel 13 – GeWi & Welt 🗺️", next:14,
      groups:{
        A:`<b>Aufgabe 1 (GeWi):</b> Wie viele Bundesländer hat Deutschland?<br><b>Aufgabe 2:</b> Zahl eingeben.`,
        B:`<b>Aufgabe 1 (EU):</b> Wie viele Sterne hat die EU-Flagge?<br><b>Aufgabe 2:</b> Zahl eingeben.`,
        C:`<b>Aufgabe 1 (Politik):</b> Legislaturperiode Bundestag (Jahre).<br><b>Aufgabe 2:</b> Zahl eingeben.`,
        D:`<b>Aufgabe 1 (Geografie):</b> Welche ist die längste? 1) Rhein 2) Elbe 3) Oder<br><b>Aufgabe 2:</b> Nummer eingeben.`
      },
      formulaName:"A + (B×3) + (C×7) + (D×11)",
      compute:(A,B,C,D)=>Math.round(A+(B*3)+(C*7)+(D*11))
    },
    14:{ title:"Kapitel 14 – WAT & Geld 🧾", next:15,
      groups:{
        A:`<b>Aufgabe 1 (WAT):</b> Miete ist … 1) variabel  2) fix  3) egal<br><b>Aufgabe 2:</b> Nummer eingeben.`,
        B:`<b>Aufgabe 1 (Mathe):</b> 19% von 100€.<br><b>Aufgabe 2:</b> Zahl eingeben.`,
        C:`<b>Aufgabe 1 (Budget):</b> 50€ − 18€ − 12€.<br><b>Aufgabe 2:</b> Restbetrag eingeben.`,
        D:`<b>Aufgabe 1 (Rechnen):</b> 2,50€ pro Tag für 7 Tage.<br><b>Aufgabe 2:</b> Gesamt in Cent eingeben.`
      },
      formulaName:"(A×20) + B + (C×4) + (D÷10)",
      compute:(A,B,C,D)=>Math.round((A*20)+B+(C*4)+(D/10))
    },
    15:{ title:"Kapitel 15 – Finale Vorbereitung 🎄", next:16,
      groups:{
        A:`<b>Aufgabe 1 (Wort):</b> Buchstaben in „WEIHNACHTSBAUM“ zählen.<br><b>Aufgabe 2:</b> Zahl eingeben.`,
        B:`<b>Aufgabe 1 (Mathe):</b> Ziffernsumme von 2025.<br><b>Aufgabe 2:</b> Zahl eingeben.`,
        C:`<b>Aufgabe 1 (Logik):</b> 3 Kerzen an, 2 aus.<br><b>Aufgabe 2:</b> Wie viele brennen? Zahl eingeben.`,
        D:`<b>Aufgabe 1 (Englisch):</b> Buchstaben in „Snow“.<br><b>Aufgabe 2:</b> Zahl eingeben.`
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