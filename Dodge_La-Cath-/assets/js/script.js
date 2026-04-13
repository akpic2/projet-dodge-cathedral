const cv=document.getElementById('canvas'),ctx=cv.getContext('2d'),W=480,H=420;

let lastTime = 0;
const TARGET_FPS = 120;

let currentAccessory = 'none';

cv.addEventListener('click', (e) => {
  const rect = cv.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  // zone du bouton
  if(mx >= 10 && mx <= 130 && my >= 10 && my <= 50){
    currentAccessory = (currentAccessory === 'lunettes') ? 'none' : 'lunettes';
    currentAccessory = (currentAccessory === 'aureole') ? 'none' : 'aureole';
    currentAccessory = (currentAccessory === 'biere') ? 'none' : 'biere';
  }
});

// Charger l'image du personnage
const playerImage = new Image();
playerImage.src = 'assets/img/test.png';

const playerImage2 = new Image();
playerImage2.src = 'assets/img/HommeBleu.png';
const playerImage2S = new Image();
playerImage2S.src = 'assets/img/HommeBleuSunglass.png';
const playerImage2A = new Image();
playerImage2A.src = 'assets/img/HommeBleuAureole.png';
const playerImage2B = new Image();
playerImage2B.src = 'assets/img/HommeBleuBiere.png';

const playerImage3 = new Image();
playerImage3.src = 'assets/img/FemmeBleu.png';
const playerImage3S = new Image();
playerImage3S.src = 'assets/img/FemmeBleuSunglass.png';
const playerImage3A = new Image();
playerImage3A.src = 'assets/img/FemmeBleuAureole.png';
const playerImage3B = new Image();
playerImage3B.src = 'assets/img/FemmeBleuBiere.png';


let playerImageLoaded = false;
playerImage.onload = () => { playerImageLoaded = true; };
playerImage.onerror = () => { console.warn('Image personnage introuvable :', playerImage.src); };

const CHARS=[
  {id:'roi',name:'Roi',speed:280,
   draw(x,y,acc){
    if(playerImageLoaded || playerImage.complete){
      ctx.save();
      ctx.translate(x,y);
      ctx.drawImage(playerImage,-16,-45,32,45);
      ctx.restore();
    }
   }
  },
  {id:'HommeBleu',name:'Homme Bleu',speed:280,
  draw(x,y,acc){
    ctx.save();
    ctx.translate(x,y);

    let img = playerImage2;

    if(acc === 'lunettes' && playerImage2S.complete){
      img = playerImage2S;
    }

    if(acc === 'aureole' && playerImage2A.complete){
      img = playerImage2A;
    }

    if(acc === 'biere' && playerImage2B.complete){
      img = playerImage2B;
    }

    if(img.complete){
      ctx.drawImage(img, -26, -45, 52, 45);
    }

    ctx.restore();
  }
  },
  {id:'FemmeBleu',name:'Femme Bleu',speed:280,
  draw(x,y,acc){
    ctx.save();
    ctx.translate(x,y);

    let img = playerImage3;

    if(acc === 'lunettes' && playerImage3S.complete){
      img = playerImage3S;
    }

    if(acc === 'aureole' && playerImage3A.complete){
      img = playerImage3A;
    }

    if(acc === 'biere' && playerImage3B.complete){
      img = playerImage3B;
    }

    if(img.complete){
      ctx.drawImage(img, -26, -45, 52, 45);
    }

    ctx.restore();
  }
  }
];

const ACCESSORIES=[
  {id:'none',name:'Rien'},
  {id:'lunettes',name:'Lunettes'},
  {id:'biere',name:'Bière'},
  {id:'aureole',name:'Auréole'}
];

const COLORS=[
  {label:'Défaut',body:'#c41e3a',hat:'#ffd700'}
];

function drawAcc(acc,x,y,sc){
  if(acc==='lunettes'){
    ctx.strokeStyle='#333';ctx.lineWidth=1.5;
    ctx.strokeRect(x-8,y-2,7,5);ctx.strokeRect(x+1,y-2,7,5);
    ctx.beginPath();ctx.moveTo(x-1,y);ctx.lineTo(x+1,y);ctx.stroke();

  } else if(acc==='moustache'){
    ctx.fillStyle='#4a3020';
    ctx.beginPath();ctx.ellipse(x-4,y+5,5,2.5,0.2,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(x+4,y+5,5,2.5,-0.2,0,Math.PI*2);ctx.fill();
  } else if(acc==='biere'){
    ctx.fillStyle='#ffd700';
    ctx.beginPath();ctx.moveTo(x-8,y-14);ctx.lineTo(x-8,y-8);ctx.lineTo(x-4,y-11);
    ctx.lineTo(x,y-8);ctx.lineTo(x+4,y-11);ctx.lineTo(x+8,y-8);ctx.lineTo(x+8,y-14);ctx.closePath();ctx.fill();
    ctx.fillStyle='#ff4444';ctx.beginPath();ctx.arc(x,y-13,2,0,Math.PI*2);ctx.fill();
  } else if(acc==='aureole'){
    ctx.strokeStyle='#ffd700';ctx.lineWidth=2.5;
    ctx.beginPath();ctx.ellipse(x,y-16,10,4,0,0,Math.PI*2);ctx.stroke();
  }
}

let state='mode';
let gameMode='classic';
const DIFFICULTIES=[
  {id:'easy',label:'Facile',spd:100,spawnInt:300},
  {id:'normal',label:'Normal',spd:150,spawnInt:200},
  {id:'hard',label:'Difficile',spd:220,spawnInt:120}
];
let difficultyIdx=1;
let charIdx=0,colorIdx=0,accIdx=0;
let customName='';
let player,gargoyles,score,best=0,scoreTime=0,frames,spd,spawnInt,lastSpawn,levelTimer=0;
let mouseX=W/2,mouseY=0;
let keys={};
let nameInput=false;
let hoverChar=-1,hoverColor=-1,hoverAcc=-1;

function getChosenChar(){return CHARS[charIdx];}
function getChosenColor(){return COLORS[colorIdx];}
function getChosenAcc(){return ACCESSORIES[accIdx].id;}
function getDisplayName(){return customName||getChosenChar().name;}
function getDifficulty(){return DIFFICULTIES[difficultyIdx];}
function updateDifficultyButton(){
  const btn=document.getElementById('difficultyBtn');
  if(!btn) return;
  if(state==='mode'){
    btn.style.display='none';
    return;
  }
  if(gameMode==='classic'){
    btn.style.display='inline-block';
    btn.textContent='Diff: '+getDifficulty().label;
  } else {
    btn.style.display='none';
  }
}

function initGame(){
  const diff=getDifficulty();
  player={x:W/2,y:H-30,w:32,h:45,vy:0,isJumping:false};
  gargoyles=[];score=0;scoreTime=0;frames=0;levelTimer=0;
  spd=diff.spd;spawnInt=diff.spawnInt;lastSpawn=0;
  state='playing';
}

document.addEventListener('keydown',e=>{
  if(state==='playing'){
    keys[e.key]=true;
    e.preventDefault();
    return;
  }
  if(state==='select'){
    if(nameInput){
      if(e.key==='Backspace') customName=customName.slice(0,-1);
      else if(e.key==='Enter'||e.key==='Escape') nameInput=false;
      else if(e.key.length===1 && customName.length<12) customName+=e.key;
      return;
    }
    if(e.key==='ArrowLeft') charIdx=(charIdx-1+CHARS.length)%CHARS.length;
    if(e.key==='ArrowRight') charIdx=(charIdx+1)%CHARS.length;
    if(e.key==='Enter') initGame();
  }
  if(state==='dead'){
    if(e.key==='Enter'||e.key===' '){
      if(gameMode==='classic'){initGame();}
      else {state='mode';}
    }
  }
  if(state==='win'){
    if(e.key==='Enter'||e.key===' '){state='mode';}
  }
});
document.addEventListener('keyup',e=>{keys[e.key]=false;});

cv.addEventListener('click',e=>{
  const r=cv.getBoundingClientRect();
  const cx=(e.clientX-r.left)*(W/r.width);
  const cy=(e.clientY-r.top)*(H/r.height);
  if(state==='mode'){
    if(cx>=70&&cx<=250&&cy>=160&&cy<=270){gameMode='classic';state='select';updateDifficultyButton();return;}
    if(cx>=250&&cx<=430&&cy>=160&&cy<=270){gameMode='adventure';state='select';updateDifficultyButton();return;}
  }
  if(state==='select'){
    nameInput=false;
    for(let i=0;i<CHARS.length;i++){
      const x=getCharCardX(i);
      if(cx>=x&&cx<=x+80&&cy>=40&&cy<=145){charIdx=i;return;}
    }
    for(let i=0;i<COLORS.length;i++){
      const x=20+i*38;
      if(cx>=x&&cx<=x+30&&cy>=175&&cy<=205){colorIdx=i;return;}
    }
    for(let i=0;i<ACCESSORIES.length;i++){
      const x=20+i*88;
      if(cx>=x&&cx<=x+80&&cy>=230&&cy<=260){accIdx=i;return;}
    }
    if(cx>=140&&cx<=340&&cy>=275&&cy<=300){nameInput=true;return;}
    if(cx>=160&&cx<=320&&cy>=320&&cy<=355){initGame();return;}
  }
  if(state==='dead'){
    if(gameMode==='classic'){initGame();} else {state='mode';}
  }
  if(state==='win'){
    state='mode';
  }
});

const difficultyBtn = document.getElementById('difficultyBtn');
if(difficultyBtn){
  difficultyBtn.addEventListener('click',()=>{
    if(state!=='playing'){
      difficultyIdx=(difficultyIdx+1)%DIFFICULTIES.length;
      updateDifficultyButton();
    }
  });
}
updateDifficultyButton();

cv.addEventListener('mousemove',e=>{
  const r=cv.getBoundingClientRect();
  mouseX=(e.clientX-r.left)*(W/r.width);
  mouseY=(e.clientY-r.top)*(H/r.height);
  if(state==='select'){
    hoverChar=-1;hoverColor=-1;hoverAcc=-1;
    for(let i=0;i<CHARS.length;i++){const x=getCharCardX(i);if(mouseX>=x&&mouseX<=x+80&&mouseY>=40&&mouseY<=145)hoverChar=i;}
    for(let i=0;i<COLORS.length;i++){const x=20+i*38;if(mouseX>=x&&mouseX<=x+30&&mouseY>=175&&mouseY<=205)hoverColor=i;}
    for(let i=0;i<ACCESSORIES.length;i++){const x=20+i*88;if(mouseX>=x&&mouseX<=x+80&&mouseY>=230&&mouseY<=260)hoverAcc=i;}
  }
});
cv.addEventListener('touchmove',e=>{
  e.preventDefault();
  const r=cv.getBoundingClientRect();
  mouseX=(e.touches[0].clientX-r.left)*(W/r.width);
}, {passive:false});

function getCharCardX(i){
  const total=CHARS.length*80+(CHARS.length-1)*12;
  return (W-total)/2+i*92;
}

function drawModeScreen(){
  drawCathedral();
  ctx.fillStyle='rgba(10,8,30,0.85)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#e8e0ff';ctx.font='500 22px sans-serif';ctx.textAlign='center';
  ctx.fillText('Choisissez un mode',W/2,70);

  const w=180,h=110;
  const x1=70,y=160,x2=230;
  rrect(x1,y,w,h,12,'#2d2060','#7c6fc7');
  rrect(x2,y,w,h,12,'#2d2060','#7c6fc7');
  ctx.fillStyle='#e8e0ff';ctx.font='600 20px sans-serif';ctx.fillText('Classique',x1+w/2,y+50);
  ctx.fillText('Aventure',x2+w/2,y+50);
  ctx.fillStyle='#b8a9d8';ctx.font='400 12px sans-serif';
  ctx.fillText('Mode infini, score croissant',x1+w/2,y+80);
  ctx.fillText('Niveau de 30s, finis et gagne',x2+w/2,y+80);
}

function spawnGargoyle(){
  const type=Math.random()<0.3?'rosace':'gargouille';
  const rand=Math.random();
  
  if(rand<0.3){
    const y=H-40;
    if(rand<0.15){
      gargoyles.push({x:W+20,y,w:type==='rosace'?28:30,h:type==='rosace'?28:36,vx:-(spd*0.4+18+Math.random()*18),vy:0,rot:0,type,fromRight:true});
    } else {
      gargoyles.push({x:-20,y,w:type==='rosace'?28:30,h:type==='rosace'?28:36,vx:spd*0.4+18+Math.random()*18,vy:0,rot:0,type,fromRight:true});
    }
  } else {
    const x=Math.random()*(W-30)+15;
    gargoyles.push({x,y:-30,w:type==='rosace'?28:30,h:type==='rosace'?28:36,vy:spd+30+Math.random()*48,vx:0,rot:0,type,fromRight:false});
  }
}

function drawCathedral(){
  ctx.fillStyle='#0d0d1f';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#1e1a3a';ctx.fillRect(0,H-80,W,80);
  [[0,H-80,80,80],[80,H-70,100,70],[200,H-90,80,90],[320,H-75,90,75],[430,H-85,50,85]].forEach(([x,y,w,h])=>{
    ctx.fillStyle='#252040';ctx.fillRect(x,y,w,h);
    ctx.strokeStyle='#1a1535';ctx.lineWidth=1;ctx.strokeRect(x,y,w,h);
  });
  function tower(x,w,h){
    ctx.fillStyle='#1e1a3a';ctx.fillRect(x,H-80-h,w,h);
    ctx.fillStyle='#141130';ctx.beginPath();ctx.moveTo(x,H-80-h);ctx.lineTo(x+w/2,H-80-h-60);ctx.lineTo(x+w,H-80-h);ctx.fill();
    for(let i=0;i<4;i++){ctx.fillStyle='#0d1a2e';const wx=x+10+(i%2)*(w-28),wy=H-80-h+20+Math.floor(i/2)*35;ctx.fillRect(wx,wy,12,20);ctx.beginPath();ctx.arc(wx+6,wy,6,Math.PI,0);ctx.fill();}
    for(let i=0;i<4;i++){ctx.fillStyle='#2a2050';ctx.fillRect(x+i*(w/4),H-80-h-12,w/4,12);}
  }
  tower(20,90,200);tower(370,90,180);
  ctx.fillStyle='#181530';ctx.fillRect(110,H-210,260,130);
  ctx.fillStyle='#221d45';
  ctx.beginPath();ctx.arc(240,H-210,40,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#3a3268';ctx.lineWidth=2;ctx.stroke();
  for(let i=0;i<8;i++){const a=i*Math.PI/4;ctx.beginPath();ctx.moveTo(240,H-210);ctx.lineTo(240+Math.cos(a)*40,H-210+Math.sin(a)*40);ctx.strokeStyle='#4a3f88';ctx.lineWidth=1;ctx.stroke();}
}

function drawGargoyle(g){
  ctx.save();ctx.translate(g.x,g.y);
  if(g.type==='rosace'){
    ctx.rotate(g.rot);ctx.strokeStyle='#9b7fd4';ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(0,0,14,0,Math.PI*2);ctx.stroke();
    for(let i=0;i<8;i++){const a=i*Math.PI/4;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(a)*14,Math.sin(a)*14);ctx.strokeStyle='#7c5fb8';ctx.stroke();}
    ctx.fillStyle='#5a3a9e';ctx.beginPath();ctx.arc(0,0,5,0,Math.PI*2);ctx.fill();
  } else {
    ctx.fillStyle='#6b6080';ctx.fillRect(-12,-14,24,22);
    ctx.strokeStyle='#4a4060';ctx.lineWidth=1;ctx.strokeRect(-12,-14,24,22);
    ctx.fillStyle='#4a4060';ctx.beginPath();ctx.moveTo(-12,-14);ctx.lineTo(-18,-6);ctx.lineTo(-12,0);ctx.fill();
    ctx.beginPath();ctx.moveTo(12,-14);ctx.lineTo(18,-6);ctx.lineTo(12,0);ctx.fill();
    ctx.fillStyle='#ff4444';ctx.beginPath();ctx.arc(-5,-10,3,0,Math.PI*2);ctx.arc(5,-10,3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#5a3030';ctx.fillRect(-8,-4,16,6);
    ctx.fillStyle='#ff6666';for(let i=0;i<3;i++)ctx.fillRect(-6+i*4,-3,2,4);
    ctx.fillStyle='#6b6080';ctx.fillRect(-8,8,16,8);ctx.fillRect(-18,8,8,4);ctx.fillRect(10,8,8,4);
  }
  ctx.restore();
}

function rrect(x,y,w,h,r,fill,stroke){
  ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);ctx.closePath();
  if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.stroke();}
}

function drawSelectScreen(){
  drawCathedral();
  ctx.fillStyle='rgba(10,8,30,0.80)';ctx.fillRect(0,0,W,H);

  const diff=getDifficulty();
  ctx.fillStyle='#e8e0ff';ctx.font='400 12px sans-serif';ctx.textAlign='right';
  ctx.fillText('Mode: '+(gameMode==='classic'?'Classique':'Aventure'),W-20,24);
  if(gameMode!='classic'){
      /*rrect(370,20,90,26,6,'#2d2060','#7c6fc7');
      ctx.fillStyle='#e8e0ff';ctx.font='500 12px sans-serif';ctx.textAlign='center';
      ctx.fillText('Diff: '+diff.label,415,38);
      */
      ctx.fillStyle='#b8a9d8';ctx.font='400 12px sans-serif';ctx.textAlign='right';
      ctx.fillText('Niveau 1 - 30s',W-20,24);
    } /*else {
      ctx.fillStyle='#b8a9d8';ctx.font='400 12px sans-serif';ctx.textAlign='right';
      ctx.fillText('Niveau 1 - 30s',W-20,24);
    }*/

  ctx.fillStyle='#e8e0ff';ctx.font='500 17px sans-serif';ctx.textAlign='center';
  ctx.fillText('Personnage',W/2,28);

  for(let i=0;i<CHARS.length;i++){
    const ch=CHARS[i],x=getCharCardX(i),sel=i===charIdx,hov=i===hoverChar;
    rrect(x,40,80,105,8,sel?'#2d2060':hov?'#1e1840':'#16133a',sel?'#9b7fd4':hov?'#5a4a90':'#2a2550');
    ch.draw(x+40,100,ACCESSORIES[accIdx].id);
    ctx.fillStyle=sel?'#e8e0ff':'#b8a9d8';ctx.font=`${sel?'500':'400'} 11px sans-serif`;ctx.textAlign='center';
    ctx.fillText(ch.name,x+40,130);
    ctx.fillStyle=sel?'#9b7fd4':'#6a5fa0';ctx.font='400 9px sans-serif';
    ctx.fillText('Vit. '+ch.speed,x+40,142);
  }

  ctx.fillStyle='#b8a9d8';ctx.font='500 13px sans-serif';ctx.textAlign='left';
  ctx.fillText('Couleur',20,170);
  for(let i=0;i<COLORS.length;i++){
    const c=COLORS[i],x=20+i*38,sel=i===colorIdx,hov=i===hoverColor;
    ctx.beginPath();ctx.arc(x+15,190,sel?14:12,0,Math.PI*2);
    ctx.fillStyle=c.body;ctx.fill();
    if(sel){ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.stroke();}
    else if(hov){ctx.strokeStyle='#9b7fd4';ctx.lineWidth=1.5;ctx.stroke();}
  }

  ctx.fillStyle='#b8a9d8';ctx.font='500 13px sans-serif';ctx.textAlign='left';
  ctx.fillText('Accessoire',20,222);
  for(let i=0;i<ACCESSORIES.length;i++){
    const a=ACCESSORIES[i],x=20+i*88,sel=i===accIdx,hov=i===hoverAcc;
    rrect(x,230,80,30,6,sel?'#2d2060':hov?'#1e1840':'#16133a',sel?'#9b7fd4':'#2a2550');
    ctx.fillStyle=sel?'#e8e0ff':'#b8a9d8';ctx.font=`${sel?'500':'400'} 11px sans-serif`;ctx.textAlign='center';
    ctx.fillText(a.name,x+40,249);
  }

  ctx.fillStyle='#b8a9d8';ctx.font='500 13px sans-serif';ctx.textAlign='left';
  ctx.fillText('Surnom',20,272);
  rrect(140,275,200,26,6,'#16133a',nameInput?'#9b7fd4':'#2a2550');
  const displayN=(customName||''+(nameInput?'':getChosenChar().name));
  ctx.fillStyle=customName?'#e8e0ff':'#6a5fa0';ctx.font='400 13px sans-serif';ctx.textAlign='left';
  ctx.fillText((customName||(nameInput?'':getChosenChar().name))+(nameInput&&Math.floor(Date.now()/500)%2?'|':''),152,293);
  if(!customName&&!nameInput){ctx.fillStyle='#4a4080';ctx.fillText(getChosenChar().name,152,293);}

  ctx.fillStyle='#e8e0ff';ctx.font='400 10px sans-serif';ctx.textAlign='left';
  ctx.fillText(nameInput?'Tapez votre surnom, Entrée pour valider':'Cliquez pour entrer un surnom',20,272+14+14);

  const btnY=320;
  rrect(160,btnY,160,36,8,'#4a3a90','#7c6fc7');
  ctx.fillStyle='#e8e0ff';ctx.font='500 15px sans-serif';ctx.textAlign='center';
  ctx.fillText('Jouer →',240,btnY+23);

  const ch=CHARS[charIdx];
  ch.draw(60,390,ACCESSORIES[accIdx].id);
  ctx.fillStyle='#7c6fc7';ctx.font='400 11px sans-serif';ctx.textAlign='center';
  ctx.fillText(getDisplayName(),60,410);
}

function checkCollision(player,g){
  const px=player.x,py=player.y,pw=player.w,ph=player.h;
  const gx=g.x,gy=g.y,gw=g.w,gh=g.h;
  
  // Collision AABB simple et précise (sans marge)
  const left=px-pw/2;
  const right=px+pw/2;
  const top=py;
  const bottom=py+ph;
  
  const gleft=gx-gw/2;
  const gright=gx+gw/2;
  const gtop=gy-gh/2;
  const gbottom=gy+gh/2;
  
  // Pas de collision si on est séparé
  if(right<=gleft || left>=gright || bottom<=gtop || top>=gbottom) return false;
  
  // Exemption: si le joueur saute dessus (venant du dessus avec vélocité négative)
  if(py+ph-5<gy-gh/2 && player.vy>=0) return false;
  
  return true;
}

function loop(timestamp){
  const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
  lastTime = timestamp;

  ctx.clearRect(0,0,W,H);
  if(state==='mode'){drawModeScreen();requestAnimationFrame(loop);return;}
  if(state==='select'){drawSelectScreen();requestAnimationFrame(loop);return;}
  drawCathedral();

  if(state==='dead' || state==='win'){
      const message = state==='win' ? 'GAGNÉ !' : getDisplayName()+' est écrasé !';
      ctx.fillStyle='rgba(10,8,30,0.82)';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#e8e0ff';ctx.font='500 24px sans-serif';ctx.textAlign='center';
      ctx.fillText(message,W/2,H/2-30);
      ctx.fillStyle='#b8a9d8';ctx.font='400 15px sans-serif';
      localStorage.setItem('Best_score', score)
      ctx.fillText('Score : '+score+'  —  Meilleur : '+best,W/2,H/2+10);  
      ctx.fillStyle='#7c6fc7';ctx.font='400 13px sans-serif';
      ctx.fillText(state==='win'?'Entrée pour revenir au menu':'Entrée pour recommencer',W/2,H/2+35);
      requestAnimationFrame(loop);return;
    }

  scoreTime += dt;
  score = Math.floor(scoreTime * 20);
  if(score>best)best=score;
  document.getElementById('sv').textContent=score;
  document.getElementById('bv').textContent=best;

  if(frames%200===0){spd+=25;spawnInt=Math.max(25,spawnInt-8);}
  if(frames-lastSpawn>=spawnInt){spawnGargoyle();lastSpawn=frames;}
  frames++;

  if(gameMode==='adventure'){
    levelTimer += dt;
    ctx.fillStyle='#e8e0ff';ctx.font='400 11px sans-serif';ctx.textAlign='right';
    ctx.fillText('Temps: '+Math.max(0,Math.ceil(30-levelTimer))+'s',W-20,20);
    if(levelTimer>=30){state='win';requestAnimationFrame(loop);return;}
  }

  const ch=CHARS[charIdx];

  if(keys['ArrowLeft'])  player.x -= ch.speed * dt;
  if(keys['ArrowRight']) player.x += ch.speed * dt;
  if(keys['ArrowUp']&&!player.isJumping){player.vy=-360;player.isJumping=true;}
  player.x=Math.max(player.w/2,Math.min(W-player.w/2,player.x));

  player.vy+=720*dt;
  player.y+=player.vy*dt;
  if(player.y+player.h>=H-25){player.y=H-25-player.h;player.vy=0;player.isJumping=false;}

  gargoyles.forEach(g=>{
    if(g.fromRight){g.x+=g.vx*dt;} else {g.y+=g.vy*dt;}
    g.rot+=2.4*dt;
  });
  gargoyles=gargoyles.filter(g=>g.fromRight?(g.x>-40&&g.x<W+40):(g.y<H+40));

  for(const g of gargoyles){
    if(checkCollision(player,g)){state='dead';break;}
  }

  gargoyles.forEach(drawGargoyle);
  ch.draw(player.x,player.y+player.h,ACCESSORIES[accIdx].id);

  ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='400 11px sans-serif';ctx.textAlign='left';
  ctx.fillText(getDisplayName(),player.x-20,player.y-5);

  requestAnimationFrame(loop);
}
requestAnimationFrame(ts => { lastTime = ts; requestAnimationFrame(loop); });