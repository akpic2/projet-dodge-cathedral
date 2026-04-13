const cv=document.getElementById('canvas'),ctx=cv.getContext('2d'),W=480,H=420;

const CHARS=[
  {id:'touriste',name:'Touriste',speed:5,bodyColor:'#4a90d9',skinColor:'#e8c090',hatColor:'#c8a86e',
   draw(x,y,acc,bc,sc,hc){
    ctx.save();ctx.translate(x,y);
    ctx.fillStyle=hc;ctx.fillRect(-8,-20,16,12);
    ctx.strokeStyle='#8a6a30';ctx.lineWidth=1;ctx.strokeRect(-8,-20,16,12);
    ctx.fillStyle='#8b6914';ctx.fillRect(-8,-9,16,3);
    ctx.fillStyle=sc;ctx.beginPath();ctx.arc(0,-2,9,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=bc;ctx.fillRect(-10,7,20,18);
    ctx.fillStyle=sc;ctx.fillRect(-14,9,5,12);ctx.fillRect(9,9,5,12);
    drawAcc(acc,0,-2,sc);
    ctx.restore();
   }
  },
  {id:'moine',name:'Moine',speed:3.5,bodyColor:'#5a4530',skinColor:'#e8c090',hatColor:'#2a1e10',
   draw(x,y,acc,bc,sc,hc){
    ctx.save();ctx.translate(x,y);
    ctx.fillStyle=bc;
    ctx.beginPath();ctx.moveTo(-12,25);ctx.lineTo(-14,-10);ctx.lineTo(0,-18);ctx.lineTo(14,-10);ctx.lineTo(12,25);ctx.closePath();ctx.fill();
    ctx.fillStyle=hc;ctx.beginPath();ctx.arc(0,-10,10,Math.PI,0);ctx.fill();
    ctx.fillStyle=sc;ctx.beginPath();ctx.arc(0,-10,7,Math.PI,0);ctx.fill();
    ctx.fillStyle=sc;ctx.beginPath();ctx.arc(0,-2,8,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#c8a870';ctx.fillRect(-2,10,4,18);ctx.fillRect(-6,22,12,4);
    drawAcc(acc,0,-2,sc);
    ctx.restore();
   }
  },
  {id:'chevalier',name:'Chevalier',speed:4.5,bodyColor:'#888',skinColor:'#e8c090',hatColor:'#aaa',
   draw(x,y,acc,bc,sc,hc){
    ctx.save();ctx.translate(x,y);
    ctx.fillStyle=bc;ctx.fillRect(-11,-6,22,22);
    ctx.fillStyle='#777';ctx.fillRect(-11,-6,22,4);ctx.fillRect(-11,6,22,4);
    ctx.fillStyle=bc;ctx.fillRect(-14,-4,4,16);ctx.fillRect(10,-4,4,16);
    ctx.fillStyle=hc;ctx.beginPath();ctx.arc(0,-6,10,Math.PI,0);ctx.fill();ctx.fillRect(-10,-10,20,8);
    ctx.fillStyle='#555';ctx.fillRect(-8,-8,16,4);
    ctx.fillStyle=sc;ctx.beginPath();ctx.arc(0,-8,6,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#cc3333';ctx.fillRect(-2,-22,4,14);ctx.fillRect(-7,-15,14,3);
    drawAcc(acc,0,-8,sc);
    ctx.restore();
   }
  },
  {id:'eveque',name:'Évêque',speed:2.5,bodyColor:'#7722aa',skinColor:'#e8c090',hatColor:'#5500aa',
   draw(x,y,acc,bc,sc,hc){
    ctx.save();ctx.translate(x,y);
    ctx.fillStyle=bc;ctx.fillRect(-11,-5,22,26);
    ctx.fillStyle=hc;ctx.beginPath();ctx.moveTo(-8,-22);ctx.lineTo(8,-22);ctx.lineTo(6,-8);ctx.lineTo(0,-14);ctx.lineTo(-6,-8);ctx.closePath();ctx.fill();
    ctx.fillStyle='#ffd700';ctx.fillRect(-1,-22,2,14);ctx.fillRect(-5,-16,10,2);
    ctx.fillStyle=sc;ctx.beginPath();ctx.arc(0,-5,9,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#9944cc';ctx.fillRect(-14,6,5,14);ctx.fillRect(9,6,5,14);
    ctx.fillStyle='#ffd700';ctx.beginPath();ctx.arc(0,10,4,0,Math.PI*2);ctx.fill();
    drawAcc(acc,0,-5,sc);
    ctx.restore();
   }
  }
];

const ACCESSORIES=[
  {id:'none',name:'Rien'},
  {id:'lunettes',name:'Lunettes'},
  {id:'moustache',name:'Moustache'},
  {id:'couronne',name:'Couronne'},
  {id:'aureole',name:'Auréole'}
];

const COLORS=[
  {label:'Bleu',body:'#4a90d9',hat:'#2a6aaa'},{label:'Rouge',body:'#d94a4a',hat:'#aa2a2a'},
  {label:'Vert',body:'#4aaa5a',hat:'#2a7a3a'},{label:'Or',body:'#c8a020',hat:'#9a7010'},
  {label:'Violet',body:'#8844cc',hat:'#5522aa'},{label:'Gris',body:'#778899',hat:'#556677'}
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
  } else if(acc==='couronne'){
    ctx.fillStyle='#ffd700';
    ctx.beginPath();ctx.moveTo(x-8,y-14);ctx.lineTo(x-8,y-8);ctx.lineTo(x-4,y-11);
    ctx.lineTo(x,y-8);ctx.lineTo(x+4,y-11);ctx.lineTo(x+8,y-8);ctx.lineTo(x+8,y-14);ctx.closePath();ctx.fill();
    ctx.fillStyle='#ff4444';ctx.beginPath();ctx.arc(x,y-13,2,0,Math.PI*2);ctx.fill();
  } else if(acc==='aureole'){
    ctx.strokeStyle='#ffd700';ctx.lineWidth=2.5;
    ctx.beginPath();ctx.ellipse(x,y-16,10,4,0,0,Math.PI*2);ctx.stroke();
  }
}

let state='select';
let charIdx=0,colorIdx=0,accIdx=0;
let customName='';
let player,gargoyles,score,best=0,frames,spd,spawnInt,lastSpawn;
let mouseX=W/2,mouseY=0;
let keys={};
let nameInput=false;
let hoverChar=-1,hoverColor=-1,hoverAcc=-1;

function getChosenChar(){return CHARS[charIdx];}
function getChosenColor(){return COLORS[colorIdx];}
function getChosenAcc(){return ACCESSORIES[accIdx].id;}
function getDisplayName(){return customName||getChosenChar().name;}

function initGame(){
  player={x:W/2,y:H-65,w:32,h:45};
  gargoyles=[];score=0;frames=0;
  spd=2.5;spawnInt=90;lastSpawn=0;
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
    if(e.key==='Enter'||e.key===' ') state='select';
  }
});
document.addEventListener('keyup',e=>{keys[e.key]=false;});

cv.addEventListener('click',e=>{
  const r=cv.getBoundingClientRect();
  const cx=(e.clientX-r.left)*(W/r.width);
  const cy=(e.clientY-r.top)*(H/r.height);
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
  if(state==='dead'){state='select';}
});

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

function spawnGargoyle(){
  const x=Math.random()*(W-30)+15;
  const type=Math.random()<0.3?'rosace':'gargouille';
  gargoyles.push({x,y:-30,w:type==='rosace'?28:30,h:type==='rosace'?28:36,vy:spd+Math.random()*1.5,rot:0,type});
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

  ctx.fillStyle='#e8e0ff';ctx.font='500 17px sans-serif';ctx.textAlign='center';
  ctx.fillText('Personnage',W/2,28);

  for(let i=0;i<CHARS.length;i++){
    const ch=CHARS[i],x=getCharCardX(i),sel=i===charIdx,hov=i===hoverChar;
    rrect(x,40,80,105,8,sel?'#2d2060':hov?'#1e1840':'#16133a',sel?'#9b7fd4':hov?'#5a4a90':'#2a2550');
    const col=sel?COLORS[colorIdx]:COLORS[0];
    ch.draw(x+40,120,ACCESSORIES[accIdx].id,col.body,ch.skinColor,col.hat);
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

  const ch=CHARS[charIdx],col=COLORS[colorIdx];
  ch.draw(60,390,ACCESSORIES[accIdx].id,col.body,ch.skinColor,col.hat);
  ctx.fillStyle='#7c6fc7';ctx.font='400 11px sans-serif';ctx.textAlign='center';
  ctx.fillText(getDisplayName(),60,410);
}

function collides(a,b){
  const m=6;
  return a.x-a.w/2+m<b.x+b.w/2-m&&a.x+a.w/2-m>b.x-b.w/2+m&&a.y<b.y+b.h/2-m&&a.y+a.h>b.y-b.h/2+m;
}

function loop(){
  ctx.clearRect(0,0,W,H);
  if(state==='select'){drawSelectScreen();requestAnimationFrame(loop);return;}
  drawCathedral();
  if(state==='dead'){
    ctx.fillStyle='rgba(10,8,30,0.82)';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#e8e0ff';ctx.font='500 24px sans-serif';ctx.textAlign='center';
    ctx.fillText(getDisplayName()+' est écrasé !',W/2,H/2-30);
    ctx.fillStyle='#b8a9d8';ctx.font='400 15px sans-serif';
    ctx.fillText('Score : '+score+'  —  Meilleur : '+best,W/2,H/2+10);
    ctx.fillStyle='#7c6fc7';ctx.font='400 13px sans-serif';
    ctx.fillText('Clic pour rechoisir',W/2,H/2+35);
    requestAnimationFrame(loop);return;
  }

  frames++;
  score=Math.floor(frames/6);
  if(score>best)best=score;
  document.getElementById('sv').textContent=score;
  document.getElementById('bv').textContent=best;

  if(frames%300===0){spd+=0.3;spawnInt=Math.max(35,spawnInt-5);}
  if(frames-lastSpawn>=spawnInt){spawnGargoyle();lastSpawn=frames;}

  const ch=CHARS[charIdx],col=COLORS[colorIdx];

  if(keys['ArrowLeft']) player.x-=ch.speed;
  if(keys['ArrowRight']) player.x+=ch.speed;
  player.x=Math.max(player.w/2,Math.min(W-player.w/2,player.x));

  gargoyles.forEach(g=>{g.y+=g.vy;g.rot+=0.04;});
  gargoyles=gargoyles.filter(g=>g.y<H+40);

  for(const g of gargoyles){
    if(collides({x:player.x,y:player.y+player.h/2,w:player.w,h:player.h},g)){state='dead';break;}
  }

  gargoyles.forEach(drawGargoyle);
  ch.draw(player.x,player.y+player.h,ACCESSORIES[accIdx].id,col.body,ch.skinColor,col.hat);

  ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='400 11px sans-serif';ctx.textAlign='left';
  ctx.fillText(getDisplayName(),player.x-20,player.y-5);

  requestAnimationFrame(loop);
}
loop();