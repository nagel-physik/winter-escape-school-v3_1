(function(){
  const VERSION = "v4_3";
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
        A:`<b>Round 1 (planning)</b><br>
Meet-up is <b>08:20</b>. Setup takes <b>25</b> minutes.<br>
<b>Round 2 (buffer)</b><br>
Add a safety buffer of <b>10</b> minutes.<br><br>
<b>Task:</b> How many minutes <i>before</i> 08:20 do you start? (number only)`,
        B:`<b>Mini Kahoot – read carefully</b><br>
Which statement is <b>always</b> true? (answer with the number)<br>
1) Every prime number is odd.<br>
2) Every even number is divisible by 2.<br>
3) Every number ending in 0 is prime.<br><br>
<b>Answer:</b> 1 / 2 / 3`,
        C:`<b>Round 1</b><br>
You have <b>3</b> short lessons.<br>
<b>Round 2</b><br>
Each short lesson lasts <b>40</b> minutes.<br><br>
<b>Task:</b> Total minutes?`,
        D:`<b>Idiot test (don’t overthink)</b><br>
Start with <b>9</b>.<br>
+1, then −1, then ×1.<br><br>
<b>Result:</b> number`
      },
      formulaName:"A + (B×11) + (C÷10) + (D×7)",
      compute:(A,B,C,D)=>Math.round(A + (B*11) + (C/10) + (D*7))
    },
    2:{ title:"Kapitel 2 – Klick oder Kopf? 📱🧠", next:3,
      groups:{
        A:`<b>Media literacy</b><br>
Claim: “If something has many likes, it must be true.”<br><br>
<b>Task:</b> 1 = true • 2 = false`,
        B:`<b>Who reads the small print?</b><br>
A post says: “Today only 70% off!”<br>
In tiny text: <i>“Valid only on selected items.”</i><br><br>
<b>Task:</b> How many words is that sentence? (number only)`,
        C:`<b>Password logic</b><br>
“Using the same password everywhere is …”<br>
1) okay • 2) risky • 3) irrelevant<br><br>
<b>Answer:</b> 1 / 2 / 3`,
        D:`<b>Classic trick question</b><br>
How many months have <b>28 days</b>? (number)`
      },
      formulaName:"(A×10) + (B×3) + (C×9) + (D×2)",
      compute:(A,B,C,D)=>Math.round((A*10)+(B*3)+(C*9)+(D*2))
    },
    3:{ title:"Kapitel 3 – Physik leicht, Fehler schwer ⚡", next:4,
      groups:{
        A:`<b>Physics (speed)</b><br>
A bike travels <b>180 m</b> in <b>12 s</b>.<br><br>
<b>Task:</b> v = s / t. Round to a whole number.`,
        B:`<b>Decimal trap</b><br>
Which is largest? (answer with the number)<br>
1) 0.9<br>
2) 0.10<br>
3) 0.099`,
        C:`<b>Stopwatch</b><br>
Your experiment video lasts <b>3 minutes</b>.<br><br>
<b>Task:</b> Convert to seconds.`,
        D:`<b>Logic</b><br>
Something doubles, then you halve it again.<br>
1) bigger • 2) same • 3) smaller`
      },
      formulaName:"(A×2) + (B×13) + (C÷30) + (D×9)",
      compute:(A,B,C,D)=>Math.round((A*2)+(B*13)+(C/30)+(D*9))
    },
    4:{ title:"Kapitel 4 – Spanne statt Streit (Toleranz) 🧬", next:5,
      groups:{
        A:`<b>Estimate (tolerance)</b><br>
Breaths per minute at rest.<br><b>Accepted:</b> 12–20`,
        B:`<b>Estimate (tolerance)</b><br>
Oxygen in air in percent.<br><b>Accepted:</b> 20–23`,
        C:`<b>Estimate (tolerance)</b><br>
Teen sleep need (hours).<br><b>Accepted:</b> 8–10`,
        D:`<b>Multiple choice</b><br>
How many muscles does a human have (roughly)?<br>
1) ~200 • 2) ~400 • 3) ~650`
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
        A:`<b>Price psychology</b><br>
“From €2.99 down to €2.49”.<br><br>
<b>Task:</b> How many cents do you save?`,
        B:`<b>Ads (no drama)</b><br>
In 15 minutes of social media you usually see:<br>
1) 0–1 ads • 2) 2–4 ads • 3) 5+ ads`,
        C:`<b>Deal math</b><br>
You take <b>6</b> bars. Deal: “3 for the price of 2”.<br><br>
<b>Task:</b> How many do you pay for?`,
        D:`<b>Percent</b><br>
20% off €50.<br><br>
<b>Task:</b> Discount in euros (number only).`
      },
      formulaName:"A + (B×8) + (C×3) + (D×2)",
      compute:(A,B,C,D)=>Math.round(A+(B*8)+(C*3)+(D*2))
    },
    6:{ title:"Kapitel 6 – Sprache & Codes 📝", next:7,
      groups:{
        A:`<b>German</b><br>
How many letters are in “Prüfung”? (ü counts as one)`,
        B:`<b>Spelling</b><br>
Which is correct?<br>
1) seit dem • 2) seid dem • 3) seiddem`,
        C:`<b>English</b><br>
“I’m excited” usually means…<br>
1) I’m looking forward / excited • 2) angry • 3) bored`,
        D:`<b>Vowels</b><br>
Count a,e,i,o,u in “education”.`
      },
      formulaName:"(A×5) + (B×9) + (C×7) + (D×3)",
      compute:(A,B,C,D)=>Math.round((A*5)+(B*9)+(C*7)+(D*3))
    },
    7:{ title:"Kapitel 7 – Logik & Fallen 🧩", next:8,
      groups:{
        A:`<b>Order matters</b><br>
Start: 14.<br>
1) Add 10.<br>
2) Then halve it.<br><br>
<b>Answer:</b> number`,
        B:`<b>Geometry</b><br>
A cuboid has…<br>
1) 4 faces • 2) 6 faces • 3) 8 faces`,
        C:`<b>Word → number</b><br>
“WEIHNACHTEN” letters?<br>
<b>Round 2:</b> subtract 5.`,
        D:`<b>Fractions</b><br>
Which is largest?<br>
1) 3/8 • 2) 4/9 • 3) 5/12`
      },
      formulaName:"A + (B×10) + (C×2) + (D×7)",
      compute:(A,B,C,D)=>Math.round(A+(B*10)+(C*2)+(D*7))
    },
    8:{ title:"Kapitel 8 – Energie im Alltag ⚡", next:9,
      groups:{
        A:`<b>Time</b><br>
Kettle runs 3 minutes. Convert to seconds.`,
        B:`<b>Temperature</b><br>
From −2°C to 20°C: change by how many degrees?`,
        C:`<b>Circuit symbol</b><br>
Circle with an X is…<br>
1) battery • 2) lamp • 3) switch`,
        D:`<b>Trick</b><br>
How many months have 28 days?`
      },
      formulaName:"(A÷30) + (B×2) + (C×9) + (D×8)",
      compute:(A,B,C,D)=>Math.round((A/30)+(B*2)+(C*9)+(D*8))
    },
    9:{ title:"Kapitel 9 – Alltag & Fair Play 🤝", next:10,
      groups:{
        A:`<b>Free speech vs insult</b><br>
Best rule:<br>
1) say anything, no consequences<br>
2) opinion yes, but no insults/threats<br>
3) always follow the majority`,
        B:`<b>Online conflict</b><br>
Best move:<br>
1) provoke harder<br>
2) pause / report / save evidence<br>
3) post everything publicly`,
        C:`<b>Sharing</b><br>
18 cookies shared by 5 people.<br><b>Task:</b> remainder?`,
        D:`<b>Biology</b><br>
Oxygen transport is done by…<br>
1) nerve cell • 2) red blood cell • 3) skin cell`
      },
      formulaName:"(A×6) + (B×6) + (C×5) + (D×7)",
      compute:(A,B,C,D)=>Math.round((A*6)+(B*6)+(C*5)+(D*7))
    },
    10:{ title:"Kapitel 10 – KI & Bullshit-Radar 🛰️", next:11,
      groups:{
        A:`<b>True/False</b><br>
“A screenshot is always proof.” 1=true 2=false`,
        B:`<b>True/False</b><br>
“AI text can contain errors.” 1=no 2=yes`,
        C:`<b>Count</b><br>
How many letters in “algorithmus” ?`,
        D:`<b>Password strength</b><br>
Strongest password?<br>
1) 12345678 • 2) password • 3) T7!kZ2#pQ9`
      },
      formulaName:"(A×10) + (B×10) + C + (D×9)",
      compute:(A,B,C,D)=>Math.round((A*10)+(B*10)+C+(D*9))
    },
    11:{ title:"Kapitel 11 – Boss-Quiz I 👑", next:12,
      groups:{
        A:`<b>Boss</b><br>
Write 6. Add 2. Multiply by 3.`,
        B:`<b>Math</b><br>
Rectangle perimeter 30 cm. One side 8 cm. Other side?`,
        C:`<b>Physics</b><br>
Heating a gas makes particles…<br>
1) slower 2) same 3) faster`,
        D:`<b>Word</b><br>
How many letters in “SCHNEE”?`
      },
      formulaName:"A + (B×2) + (C×11) + (D×4)",
      compute:(A,B,C,D)=>Math.round(A+(B*2)+(C*11)+(D*4))
    },
    12:{ title:"Kapitel 12 – Boss-Quiz II 🧠🔥", next:13,
      groups:{
        A:`<b>Percent</b><br>
12% of 250 (whole number).`,
        B:`<b>Weekday</b><br>
If today is Tuesday, in 10 days it is…<br>
1) Friday 2) Saturday 3) Sunday`,
        C:`<b>Syllables</b><br>
How many syllables in “Information”? (in-for-ma-ti-on)`,
        D:`<b>Trick</b><br>
Which is heavier: 1 kg feathers or 1 kg stones?<br>
1) feathers 2) stones 3) same`
      },
      formulaName:"A + (B×15) + (C×6) + (D×9)",
      compute:(A,B,C,D)=>Math.round(A+(B*15)+(C*6)+(D*9))
    },
    13:{ title:"Kapitel 13 – GeWi & Welt 🗺️", next:14,
      groups:{
        A:`<b>Germany</b><br>
How many federal states (Bundesländer)?`,
        B:`<b>EU</b><br>
How many stars on the EU flag?`,
        C:`<b>Politics</b><br>
How many years is a Bundestag term?`,
        D:`<b>Geography</b><br>
Longest river?<br>1) Rhine 2) Elbe 3) Oder`
      },
      formulaName:"A + (B×3) + (C×7) + (D×11)",
      compute:(A,B,C,D)=>Math.round(A+(B*3)+(C*7)+(D*11))
    },
    14:{ title:"Kapitel 14 – WAT & Geld 🧾", next:15,
      groups:{
        A:`<b>Fixed vs variable</b><br>
Rent is… 1) variable 2) fixed 3) depends`,
        B:`<b>VAT</b><br>
19% of €100 = ?`,
        C:`<b>Budget</b><br>
You have €50. Spend €18 and €12. Remaining?`,
        D:`<b>Cost</b><br>
€2.50 per day for 7 days. Total in cents?`
      },
      formulaName:"(A×20) + B + (C×4) + (D÷10)",
      compute:(A,B,C,D)=>Math.round((A*20)+B+(C*4)+(D/10))
    },
    15:{ title:"Kapitel 15 – Finale Vorbereitung 🎄", next:16,
      groups:{
        A:`<b>Final prep</b><br>
Letters in “WEIHNACHTSBAUM”?`,
        B:`<b>Digit sum</b><br>
Sum of digits of 2025?`,
        C:`<b>Candles</b><br>
Light 3 candles, blow out 2. How many still burn?`,
        D:`<b>English</b><br>
How many letters in “Snow”?`
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


  // ===== Tiny sound FX (no files, works offline) =====
  // Note: browsers may block sound until user interacts once. After first tap/click, it works.
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
      ok:   [660, 880, 0.10],
      bad:  [220, 160, 0.14],
      win:  [523.25, 659.25, 0.12],
      pop:  [900, 600, 0.08],
    };
    const [f1,f2,amp] = presets[type] || presets.ok;

    o.type="triangle";
    o.frequency.setValueAtTime(f1, now);
    o.frequency.exponentialRampToValueAtTime(Math.max(40,f2), now+0.14);

    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(amp, now+0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now+0.20);

    o.connect(g); g.connect(ac.destination);
    o.start(now);
    o.stop(now+0.22);
  }

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

  window.ESC = { VERSION, KEY_BOARD, KEY_TEAM, CHAPTERS, SOLUTIONS, loadBoard, saveBoard, loadTeam, saveTeam, fxConfetti, fxSound, makeToken };
})();