/* site.js */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
let lastTrigger=null;const enquiry=$('#enquiry-dialog'),form=$('#enquiry-form'),service=$('#enquiry-service'),messageFallback=$('#message-fallback'),lineLink=$('#open-enquiry-line');
function openEnquiry(trigger){lastTrigger=trigger;const desired=trigger.dataset.enquire;service.value=[...service.options].some(o=>o.value===desired)?desired:'';$('#enquiry-status').textContent='';messageFallback.hidden=true;updateLineLink();enquiry.showModal();}
function message(){if(document.documentElement.lang==='en'){const n=$('#enquiry-name').value.trim(),note=$('#enquiry-note').value.trim(),v=service.value;return 'Hello THE NAME'+(n?'\nName: '+n:'')+'\nInterested in: '+(v||'a service enquiry')+'\n'+(note||'Please share service details, pricing, availability and location.');}const name=$('#enquiry-name').value.trim(),note=$('#enquiry-note').value.trim();return 'สวัสดีครับ/ค่ะ THE NAME'+(name?'\nชื่อ '+name:'')+'\nสนใจ: '+(service.value||'สอบถามบริการ')+'\n'+(note||'ขอรายละเอียดบริการ ค่าบริการ วันว่าง และสถานที่ให้บริการครับ/ค่ะ');}
document.addEventListener('click',e=>{const trigger=e.target.closest('[data-enquire]');if(trigger)openEnquiry(trigger);const close=e.target.closest('[data-close]');if(close)close.closest('dialog').close();});$$('dialog').forEach(d=>{d.addEventListener('close',()=>{const target=lastTrigger?.closest('[inert]')?$('.glass-drop'):lastTrigger;target?.focus({preventScroll:true});});d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});});
function updateLineLink() {
  const text = message();
  lineLink.href = window.THE_NAME_CONFIG.lineUrl + '?' + encodeURIComponent(text);
  return text;
}
async function copyEnquiry(text, openingLine) {
  const status = $('#enquiry-status');
  const english = document.documentElement.lang === 'en';
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = openingLine
      ? (english ? 'If LINE opens with an empty draft, paste the copied message.' : 'ถ้าช่องพิมพ์ใน LINE ว่าง ให้วางข้อความที่คัดลอกไว้')
      : (english ? 'Message copied.' : 'คัดลอกข้อความแล้ว');
  } catch {
    messageFallback.value = text;
    messageFallback.hidden = false;
    if (!openingLine) {
      messageFallback.focus();
      messageFallback.select();
    }
    status.textContent = english ? 'You can copy the message below.' : 'คัดลอกข้อความด้านล่างเพื่อนำไปวางใน LINE ได้';
  }
}
form.addEventListener('input', updateLineLink);
form.addEventListener('change', updateLineLink);
lineLink.addEventListener('click', () => {
  // Keep native link navigation synchronous while attempting a clipboard fallback.
  void copyEnquiry(updateLineLink(), true);
});
form.addEventListener('submit', event => {
  event.preventDefault();
  lineLink.click();
});
$('#copy-enquiry').addEventListener('click', () => void copyEnquiry(message(), false));
const pathDialog=$('#path-dialog'),pathOpen=$('#open-path');if(pathOpen){pathOpen.addEventListener('click',()=>{lastTrigger=pathOpen;pathDialog.showModal();});const paths={insight:['Insight','เริ่มจากการสำรวจตัวตน ความสัมพันธ์ และศักยภาพ'],ikigai:['Ikigai','เริ่มจากสิ่งที่รัก และทิศทางที่มีความหมายกับคุณ'],wellness:['Wellness','ให้เวลากับการพักและดูแลกายใจ']};$$('[data-path]').forEach(b=>b.addEventListener('click',()=>{const key=b.dataset.path,p=paths[key],result=$('.quiz-result',pathDialog);result.hidden=false;result.innerHTML='<h3>'+p[0]+'</h3><p>'+p[1]+'</p><a class="btn" href="'+key+'.html">สำรวจ '+p[0]+' ↗</a>';}));}
const ikData=[['01','What you love.','สิ่งที่ทำให้คุณรู้สึกมีส่วนร่วม สนุก หรืออยากกลับไปทำอีก แม้ในวันที่ไม่มีใครบอกให้ทำ','“อะไรทำให้คุณลืมมองเวลา?”'],['02','What you are good at.','ทักษะ ความถนัด และประสบการณ์ที่คุณสะสมมา รวมถึงสิ่งที่คนรอบตัวมักขอความช่วยเหลือจากคุณ','“ผู้คนมักนึกถึงคุณเมื่ออยากให้ช่วยเรื่องอะไร?”'],['03','What the world needs.','เรื่องที่คุณอยากมีส่วนร่วม ปัญหาที่คุณสนใจ หรือผู้คนที่คุณอยากสร้างประโยชน์ให้','“คุณอยากทำให้เรื่องไหนดีขึ้นสำหรับใคร?”'],['04','What you can be paid for.','คุณค่าที่สามารถส่งต่อเป็นงาน บริการ หรือสิ่งที่ผู้คนยินดีแลกเปลี่ยนรายได้ให้','“สิ่งที่คุณทำ ช่วยแก้ปัญหาหรือสร้างคุณค่าอย่างไร?”']];$$('[data-ikigai]').forEach(b=>b.addEventListener('click',()=>{const data=ikData[Number(b.dataset.ikigai)];$$('[data-ikigai]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const c=$('#atlas-content');$('.count',c).textContent=data[0];$('h3',c).textContent=data[1];$('p',c).textContent=data[2];$('.reflection',c).textContent=data[3];}));
const exData=[{title:'Signature<br>Facial Ritual.',desc:'ให้เวลากับการดูแลผิวหน้าในบรรยากาศสงบ ผ่านประสบการณ์ Facial Ritual ของ THE NAME',price:'฿2,200',duration:'2 ชั่วโมง',enquire:'Signature Facial Ritual',mark:'✧'},{title:'Signature<br>Mantra Yoga.',desc:'เคลื่อนไหวไปกับลมหายใจ และให้เวลากับตัวเองผ่านประสบการณ์ Mantra Yoga',price:'เริ่ม ฿2,500',duration:'90 นาที',enquire:'Signature Mantra Yoga',mark:'ॐ'},{title:'Signature<br>Wellness Experience.',desc:'ให้พื้นที่กับการดูแลกายและใจ ผ่าน Signature Wellness Experience ของ THE NAME',price:'฿4,500 / คน',duration:'ประมาณ 3 ชั่วโมง',enquire:'Signature Wellness Experience',mark:'◌'}];const tabs=$$('[data-experience]');function selectExperience(tab){const i=Number(tab.dataset.experience),d=exData[i];tabs.forEach(b=>{b.setAttribute('aria-selected',String(b===tab));b.tabIndex=b===tab?0:-1;});const panel=$('#experience-panel');panel.setAttribute('aria-labelledby',tab.id);$('h3',panel).innerHTML=d.title;$('#experience-description').textContent=d.desc;$('#experience-price').textContent=d.price;$('#experience-duration').textContent=d.duration;$('#experience-enquire').dataset.enquire=d.enquire;$('#experience-mark').textContent=d.mark;}tabs.forEach((b,i)=>{b.addEventListener('click',()=>selectExperience(b));b.addEventListener('keydown',e=>{let next=i;if(e.key==='ArrowRight')next=(i+1)%tabs.length;else if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();selectExperience(tabs[next]);tabs[next].focus();});});
const reduce=matchMedia('(prefers-reduced-motion: reduce)'),scene=$('.hero-scroll-scene');if(scene){
const svg=$('.hero-logo',scene),stage=$('.signature-stage',scene),symbol=$('.home-symbol');
const drain=$('#logo-name-drain',svg),nameBlue=$('.logo-name-blue',svg),traces=$$('.logo-liquid-trace',svg),theFinish=$('.logo-the-finish',svg);
let target=0,rendered=0,frame=0,last=0,visible=true;
function paint(){
  const clamp=value=>Math.max(0,Math.min(1,value));
  const progress=clamp(rendered/.5);
  if(drain&&nameBlue&&theFinish){
    drain.setAttribute('r',Math.max(1,460*(1-progress)**1.35));
    nameBlue.setAttribute('opacity',clamp((1-progress)/.06));
    traces.forEach(trace=>{
      const start=Number(trace.dataset.start),end=Number(trace.dataset.end);
      trace.style.strokeDashoffset=1-clamp((progress-start)/(end-start));
    });
    theFinish.setAttribute('opacity',clamp((progress-.9)/.1));
    svg.style.setProperty('--the-glow',clamp((progress-.48)/.52)*13+'px');
  }
  svg.style.transform='translate3d('+((1-rendered)*18)+'px,0,0)';
  stage.dataset.progress=rendered.toFixed(3);
  symbol?.style.setProperty('--hero-scroll',reduce.matches?target:rendered);
  const menuProgress=clamp(rendered/.16);
  symbol?.style.setProperty('--menu-fold',Math.min(1,menuProgress*2));
  symbol?.style.setProperty('--menu-light',reduce.matches?0:Math.sin(Math.PI*menuProgress));
  symbol?.style.setProperty('--menu-light-rise',-menuProgress*27+'px');
}
function tick(time){frame=0;const dt=last?Math.min((time-last)/1000,.06):.016;last=time;rendered+=(target-rendered)*(1-Math.exp(-dt*13));if(Math.abs(target-rendered)<.001)rendered=target;paint();if(Math.abs(target-rendered)>.001&&visible)frame=requestAnimationFrame(tick);}
function update(){const rect=scene.getBoundingClientRect(),range=Math.max(1,scene.offsetHeight-innerHeight);target=Math.max(0,Math.min(1,-rect.top/range));if(reduce.matches||!visible){rendered=target;paint();return;}if(!frame&&visible){last=0;frame=requestAnimationFrame(tick);}}
addEventListener('scroll',update,{passive:true});addEventListener('resize',update);reduce.addEventListener('change',update);new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible)update();else{cancelAnimationFrame(frame);frame=0;update();}}).observe(scene);update();paint();}
const cards=$$('.home-v2 .path-card');if(cards.length){const observer=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('in-view',e.isIntersecting)),{threshold:.12});cards.forEach(c=>observer.observe(c));}
const audio=$('#calm-audio'),button=$('#calm-toggle'),canvas=$('#om-dots');if(audio&&button&&canvas){const status=$('#calm-status'),ctx=canvas.getContext('2d',{alpha:true}),om=$('.om-center'),section=$('#pause');let running=false,width=0,height=0;
let bands=[];
const colors=['#8bc9ef','#d8f4ff','#719dbd'];
function size(){
  const rect=canvas.getBoundingClientRect();
  width=rect.width;
  height=rect.height;
  const dpr=Math.min(devicePixelRatio||1,1.25);
  canvas.width=Math.round(width*dpr);
  canvas.height=Math.round(height*dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);
  bands=colors.map(()=>[]);
  const reach=Math.hypot(width,height)*.7;
  for(let radius=48,index=0;radius<reach;radius+=22,index++){
    const count=Math.max(25,Math.round(Math.PI*2*radius/17));
    for(let i=0;i<count;i++){
      const theta=i/count*Math.PI*2+index*.016;
      const side=Math.abs(Math.cos(theta));
      const petal=(.80+.19*Math.cos(5*(theta-Math.PI*1.5)))*(.86+.14*side);
      const x=Math.cos(theta)*radius*petal;
      const y=Math.sin(theta)*radius*petal;
      if(Math.abs(x)>width*.58||Math.abs(y)>height*.59)continue;
      bands[(i+index)%3].push({x,y,size:.65+((index+i)%4)*.15});
    }
  }
  draw();
}
function draw(){
  if(!width||!height)return;
  ctx.clearRect(0,0,width,height);
  bands.forEach((points,i)=>{
    ctx.fillStyle=colors[i];
    ctx.globalAlpha=.34;
    ctx.beginPath();
    for(const point of points){
      const x=width*.5+point.x;
      const y=height*.48+point.y;
      const radius=point.size;
      ctx.moveTo(x+radius,y);
      ctx.arc(x,y,radius,0,Math.PI*2);
    }
    ctx.fill();
  });
  ctx.globalAlpha=1;
}
function sync(){running=!audio.paused&&!audio.ended;button.textContent=running?'หยุดช่วงเวลาสงบ':'เริ่มช่วงเวลาสงบ';button.setAttribute('aria-pressed',String(running));status.textContent=running?'หายใจตามจังหวะที่สบายของคุณ':'พร้อมเมื่อคุณพร้อม';section.dataset.playing=String(running)}
button.addEventListener('click',async()=>{if(!audio.paused){audio.pause();return}try{if(audio.ended)audio.currentTime=0;await audio.play();sync()}catch{status.textContent='ยังเล่นเสียงไม่ได้ ลองเปิดแถบเสียงด้านล่าง'}});audio.addEventListener('play',sync);audio.addEventListener('pause',sync);audio.addEventListener('ended',()=>{sync();status.textContent='จบช่วงเวลาสงบแล้ว'});audio.addEventListener('error',()=>{audio.pause();sync();status.textContent='ยังโหลดเสียงไม่ได้ กรุณาลองอีกครั้ง'});let resizeFrame=0;new ResizeObserver(()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(size)}).observe(section);om.addEventListener('load',size);document.fonts.ready.then(size);size()}
})();

;
/* product-v4.js */
(()=>{'use strict';const reduce=matchMedia('(prefers-reduced-motion:reduce)');const iconNames=['love','strength','need','value'];const emblem=document.querySelector('.v4-topic-emblem');if(emblem){let last=0;async function topic(i){if(!iconNames[i])return;
last=i;
let r;
try{r=await fetch('assets/symbols/'+iconNames[i]+'.svg')}catch{return}
if(!r.ok)return;const markup=await r.text();if(last!==i)return;const doc=new DOMParser().parseFromString(markup,'image/svg+xml');const svg=doc.documentElement;svg.classList.add('v4-symbol');svg.setAttribute('aria-hidden','true');emblem.querySelector('svg').replaceWith(document.importNode(svg,true));emblem.querySelector('img').src='assets/'+['rose-quartz','amethyst','clear-quartz','amethyst'][i]+'.webp'}window.addEventListener('garden-topic',e=>topic(e.detail));document.querySelectorAll('.ik-topic-button').forEach(b=>b.addEventListener('click',()=>topic(Number(b.dataset.garden))));const current=document.querySelector('.ik-topic-button[aria-pressed=true]');topic(current?Number(current.dataset.garden):0)}
const cards=[...document.querySelectorAll('[data-dimension]')],detail=document.querySelector('#dimension-detail');const descriptions=['เริ่มจากการรู้จักตัวเอง และมุมมองที่คุณมีต่อชีวิต','สำรวจความเชื่อมโยงระหว่างคุณกับผู้คนรอบตัว','มองจุดแข็ง ความท้าทาย และโอกาสพัฒนาตัวเอง','ทบทวนแนวโน้มและความเป็นไปได้ของเส้นทางข้างหน้า','เชื่อมภาพชีวิตกับทิศทางที่อยากก้าวต่อ'];cards.forEach((c,i)=>{c.addEventListener('pointermove',e=>{if(reduce.matches||e.pointerType!=='mouse')return;const r=c.getBoundingClientRect();c.style.transform=`translateY(-10px) rotateY(${(e.clientX-r.left-r.width/2)/25}deg) rotateX(${-(e.clientY-r.top-r.height/2)/35}deg)`});c.addEventListener('pointerleave',()=>c.style.transform='');c.addEventListener('click',()=>{const was=c.getAttribute('aria-expanded')==='true';cards.forEach(x=>x.setAttribute('aria-expanded','false'));detail.hidden=was;if(was)return;c.setAttribute('aria-expanded','true');detail.replaceChildren();const h=document.createElement('h3');h.textContent=c.querySelector('.v4-card-name').textContent;const p=document.createElement('p');p.textContent=descriptions[i];const b=document.createElement('button');b.className='btn';b.textContent='สอบถาม '+h.textContent;const ar=document.createElementNS('http://www.w3.org/2000/svg','svg');ar.setAttribute('viewBox','0 0 20 20');ar.setAttribute('class','v4-arrow');ar.setAttribute('aria-hidden','true');const pa=document.createElementNS('http://www.w3.org/2000/svg','path');pa.setAttribute('d','M4 16L16 4M4 4H16V16');ar.append(pa);b.append(ar);b.addEventListener('click',()=>{const opener=document.querySelector('.site-header [data-enquire]');opener.click();const note=document.querySelector('#enquiry-note');if(note)note.value='สนใจ '+h.textContent+' ('+c.querySelector('.v4-range').textContent+')'});detail.append(h,p,b);if(innerWidth>700&&innerWidth<950)detail.scrollIntoView({behavior:reduce.matches?'auto':'smooth',block:'nearest'})})});})();

;
/* interaction-v5.js */
(()=>{'use strict';
const lifeTopics=[{"title": "พื้นฐานตัวตน", "description": "กลับมามองรากฐานและเรื่องราวที่ประกอบเป็นคุณ"}, {"title": "บุคลิกและการใช้ชีวิต", "description": "ทำความเข้าใจรูปแบบการใช้ชีวิตและมุมมองของตัวเอง"}, {"title": "การเงินและความมั่นคง", "description": "ทบทวนแนวทางสร้างความมั่นคงและการวางแผนการเงิน"}, {"title": "การงานและอาชีพ", "description": "สำรวจเส้นทางการทำงานที่เชื่อมกับตัวคุณ"}, {"title": "ธุรกิจที่เหมาะสม", "description": "สำรวจโอกาสและแนวทางของการเริ่มต้นหรือต่อยอดธุรกิจ"}, {"title": "ความรักและคู่ครอง", "description": "มองความสัมพันธ์ที่เกื้อหนุนและการอยู่ร่วมกัน"}, {"title": "จุดแข็งและความท้าทาย", "description": "รู้จักจุดเด่นและประเด็นที่ควรเตรียมพร้อม"}, {"title": "ต่างประเทศและการเดินทาง", "description": "สำรวจความเป็นไปได้ของการเดินทางและประสบการณ์ใหม่"}, {"title": "แนวทางการเติบโต", "description": "มองการพัฒนาตนเองในระยะยาว"}, {"title": "สิ่งที่ควรระวัง", "description": "ทบทวนความเสี่ยงและแนวทางเตรียมรับมือ"}, {"title": "ปัจจัยสนับสนุน", "description": "สำรวจปัจจัยที่อาจมีส่วนสนับสนุนเส้นทางของคุณ"}, {"title": "ทิศทางชีวิต", "description": "เชื่อมภาพรวมชีวิตกับแนวทางที่อยากเดินต่อ"}];
const reduce=matchMedia('(prefers-reduced-motion:reduce)'),fine=matchMedia('(hover:hover) and (pointer:fine)');
// Preserve text nodes, line breaks and emphasis. Thai marks stay with their grapheme.
const segmenter=typeof Intl.Segmenter==='function'?new Intl.Segmenter('th',{granularity:'grapheme'}):null;
document.querySelectorAll('[data-split-text]').forEach(el=>{const original=el.innerText.replace(/\s+/g," ");el.setAttribute('aria-label',original);let order=0;const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(node=>{const frag=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(word=>{if(/^\s+$/.test(word)){frag.append(document.createTextNode(word));return}if(!word)return;const wrap=document.createElement('span');wrap.className='split-word';wrap.setAttribute('aria-hidden','true');const pieces=segmenter?[...segmenter.segment(word)].map(x=>x.segment):[...word];pieces.forEach(char=>{const c=document.createElement('span');c.className='split-char';c.textContent=char;c.style.setProperty('--char-delay',Math.min(order++*32,1100)+'ms');wrap.append(c)});frag.append(wrap)});node.replaceWith(frag)});el.classList.add('split-ready');new IntersectionObserver((entries,ob)=>{if(entries[0].isIntersecting){el.classList.add('split-visible');ob.disconnect()}},{threshold:.1}).observe(el)});
const universe=document.querySelector('.life-universe');if(universe){const hint=document.querySelector('.v4-map-instruction');function hintText(){hint.textContent=fine.matches?'ขยับเมาส์เพื่อสำรวจ · คลิก Bubble เพื่อดูรายละเอียด':'แตะ Bubble เพื่อดูรายละเอียดกลางภาพ'}hintText();fine.addEventListener('change',hintText);const bubbles=[...universe.querySelectorAll('.life-bubble')],anchors=[...universe.querySelectorAll('.life-anchor')],center=universe.querySelector('.life-center'),content=center.querySelector('.life-center-content'),reset=center.querySelector('.life-reset'),initial=content.innerHTML;let selected=-1,pointer=null,visible=false,raf=0,last=0,px=0,py=0,tx=0,ty=0,scroll=0,scrollTarget=0;const motion=bubbles.map(()=>({x:0,y:0,tx:0,ty:0}));
function select(i,focus=false){selected=i;const topic=lifeTopics[i];bubbles.forEach((b,j)=>b.setAttribute('aria-pressed',String(j===i)));content.replaceChildren();const count=document.createElement('span');count.className='life-center-index';count.textContent=String(i+1).padStart(2,'0')+' / FULL LIFE MAP';const symbol=bubbles[i].querySelector('svg').cloneNode(true);const h=document.createElement('h3');h.textContent=topic.title;const p=document.createElement('p');p.textContent=topic.description;content.append(count,symbol,h,p);center.classList.add('has-selection');reset.hidden=false;if(!reduce.matches)content.animate([{opacity:0,transform:'translateY(12px) scale(.96)'},{opacity:1,transform:'none'}],{duration:500,easing:'cubic-bezier(.2,.8,.2,1)'});if(focus)center.scrollIntoView({behavior:reduce.matches?'auto':'smooth',block:'center'})}
document.querySelectorAll('[data-life]').forEach(b=>b.addEventListener('click',()=>select(Number(b.dataset.life),!b.classList.contains('life-bubble'))));reset.addEventListener('click',()=>{selected=-1;content.innerHTML=initial;center.classList.remove('has-selection');reset.hidden=true;bubbles.forEach(b=>b.setAttribute('aria-pressed','false'))});
function schedule(){if(!raf&&visible&&!reduce.matches)raf=requestAnimationFrame(tick)}function updateScroll(){const r=universe.getBoundingClientRect();scrollTarget=Math.max(-1,Math.min(1,(innerHeight/2-r.top-r.height/2)/innerHeight));schedule()}
function tick(t){raf=0;const dt=last?Math.min((t-last)/1000,.06):.016;last=t;const k=1-Math.exp(-dt*9);px+=(tx-px)*k;py+=(ty-py)*k;scroll+=(scrollTarget-scroll)*k;let changing=Math.abs(tx-px)+Math.abs(ty-py)+Math.abs(scroll-scrollTarget)>.003;
universe.style.setProperty('--parallax-x',px+'px');universe.style.setProperty('--parallax-y',(py+scroll*14)+'px');motion.forEach((m,i)=>{m.x+=(m.tx-m.x)*k;m.y+=(m.ty-m.y)*k;bubbles[i].style.setProperty('--magnet-x',m.x+'px');bubbles[i].style.setProperty('--magnet-y',m.y+'px');if(Math.abs(m.tx-m.x)+Math.abs(m.ty-m.y)>.03)changing=true});if(changing)schedule();else last=0}
universe.addEventListener('pointermove',e=>{if(!fine.matches||reduce.matches||e.pointerType==='touch')return;const r=universe.getBoundingClientRect();tx=((e.clientX-r.left)/r.width-.5)*14;ty=((e.clientY-r.top)/r.height-.5)*10;anchors.forEach((a,i)=>{const b=a.getBoundingClientRect(),dx=e.clientX-(b.left+b.width/2),dy=e.clientY-(b.top+b.height/2),distance=Math.hypot(dx,dy),strength=Math.max(0,1-distance/155);motion[i].tx=Math.max(-13,Math.min(13,dx*.24*strength));motion[i].ty=Math.max(-13,Math.min(13,dy*.24*strength))});schedule()});function neutral(){tx=ty=0;motion.forEach(m=>m.tx=m.ty=0);schedule()}universe.addEventListener('pointerleave',neutral);new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible)updateScroll();else{cancelAnimationFrame(raf);raf=0;last=0}},{rootMargin:'100px'}).observe(universe);addEventListener('scroll',updateScroll,{passive:true});addEventListener('resize',updateScroll);reduce.addEventListener('change',()=>{neutral();if(reduce.matches){universe.style.setProperty('--parallax-x','0px');universe.style.setProperty('--parallax-y','0px');bubbles.forEach(b=>{b.style.setProperty('--magnet-x','0px');b.style.setProperty('--magnet-y','0px')})}else schedule()});}
// Enhance real disclosure actions without replacing the native cursor on ordinary links/forms.
const cursor=document.createElement('div');cursor.className='character-cursor';cursor.setAttribute('aria-hidden','true');const cursorText=document.createElement('span');cursor.append(cursorText);document.body.append(cursor);let target=null,cx=0,cy=0,mx=0,my=0,frame=0,initialized=false;
const selector='[data-cursor],summary,[data-dimension],[data-experience],[data-garden],[data-path],.ik-view-map,[data-enquire],.path-card,a.btn,a[href^="#"]:not(.skip)';function label(el){if(el.dataset.cursor)return el.dataset.cursor;if(el.matches('summary'))return el.parentElement.open?'ย่อข้อมูล':'ดูเพิ่มเติม';if(el.matches('[data-enquire]'))return 'สอบถาม';if(el.matches('[data-experience],[data-garden]'))return 'สำรวจ';if(el.matches('.path-card'))return 'เปิดเส้นทาง';return 'ดูเพิ่มเติม'}
function cursorTick(){frame=0;cx+=(mx-cx)*.23;cy+=(my-cy)*.23;cursor.style.transform=`translate3d(${cx}px,${cy}px,0)`;if(Math.hypot(mx-cx,my-cy)>.2&&target)frame=requestAnimationFrame(cursorTick)}function hide(){target=null;cursor.classList.remove('is-visible','is-down');document.documentElement.classList.remove('character-cursor-active')}
addEventListener('pointermove',e=>{if(!fine.matches||reduce.matches||e.pointerType!=='mouse'){hide();return}const el=e.target.closest(selector);if(!el||el.matches(':disabled')||e.target.closest('input,textarea,select')){hide();return}target=el;cursorText.textContent=label(el);mx=e.clientX;my=e.clientY;if(!initialized){cx=mx;cy=my;initialized=true}cursor.classList.add('is-visible');document.documentElement.classList.add('character-cursor-active');if(!frame)frame=requestAnimationFrame(cursorTick)},{passive:true});addEventListener('pointerdown',()=>{if(target)cursor.classList.add('is-down')});addEventListener('pointerup',()=>{cursor.classList.remove('is-down');if(target)cursorText.textContent=label(target)});document.addEventListener('pointerleave',hide);addEventListener('blur',hide);addEventListener('scroll',hide,{passive:true});addEventListener('keydown',e=>{if(e.key==='Tab')hide()});fine.addEventListener('change',hide);reduce.addEventListener('change',hide);
})();

;
/* refinement-v6.js */
(()=>{'use strict';const selectors='h1,h2,h3,summary,.v4-card-name,.v4-card-thai,.life-bubble>span,.ik-topic-button,.ik-circle-label,[data-experience],.nav-links a';function decorate(root){const nodes=[...(root.matches?.(selectors)?[root]:[]),...root.querySelectorAll(selectors)];nodes.forEach(el=>{if(el.hasAttribute('data-tone-target'))return;el.setAttribute('data-tone-target','');const dark=el.closest('.night,.site-header,.footer,.life-universe');el.dataset.tone=dark?'dark':el.closest('.ik-alignment,.ik-service,.ik-questions')?'sage':'light';el.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch')return;el.classList.add('tone-touch');setTimeout(()=>el.classList.remove('tone-touch'),550)})})}decorate(document);new MutationObserver(entries=>{entries.forEach(e=>e.addedNodes.forEach(n=>{if(n.nodeType===1)decorate(n)}))}).observe(document.querySelector('main')||document.body,{childList:true,subtree:true});})();

;
/* header-v8.js */
(()=>{'use strict';const h=document.querySelector('.site-header'),drop=document.querySelector('.glass-drop'),toggle=h.querySelector('.glass-page-toggle'),panel=h.querySelector('.glass-menu-panel'),nav=h.querySelector('.nav-links'),current=nav.querySelector('[aria-current]'),fine=matchMedia('(hover:hover) and (pointer:fine)'),reduce=matchMedia('(prefers-reduced-motion:reduce)'),mobile=matchMedia('(max-width:760px)');let opened=false,closeTimer=0,frame=0,tx=0,ty=0,x=0,y=0;const pill=document.createElement('span');pill.className='glass-active';pill.setAttribute('aria-hidden','true');nav.prepend(pill);
function layout(){if(current){pill.style.width=current.offsetWidth+'px';pill.style.transform=`translateX(${current.offsetLeft}px)`}}
function anchor(){
  const rect=drop.getBoundingClientRect();
  h.style.setProperty('--menu-anchor-x',rect.left+rect.width/2+'px');
  const footer=drop.classList.contains('is-footer-docked');
  h.classList.toggle('opens-at-footer',footer);
  if(footer){
    h.style.setProperty('--menu-footer-gap',Math.max(12,innerHeight-rect.top+10)+'px');
  }
}
function open(){clearTimeout(closeTimer);if(opened)return;opened=true;anchor();h.inert=false;h.classList.add('drop-open');drop.classList.add('is-hidden');drop.setAttribute('aria-expanded','true');h.classList.toggle('is-open',mobile.matches);toggle.setAttribute('aria-expanded','true');layout()}
function close(restore=false){clearTimeout(closeTimer);opened=false;h.classList.remove('drop-open','is-open','opens-at-footer');h.inert=true;drop.classList.remove('is-hidden');drop.setAttribute('aria-expanded','false');toggle.setAttribute('aria-expanded','false');tx=ty=0;animate();if(restore)requestAnimationFrame(()=>drop.focus())}
function delayedClose(){if(fine.matches)closeTimer=setTimeout(()=>{if(!h.matches(':hover')&&!h.contains(document.activeElement))close()},420)}
drop.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&fine.matches)open()});drop.addEventListener('click',()=>{open();h.querySelector('.brand').focus({preventScroll:true})});drop.addEventListener('keydown',e=>{if(['Enter',' ','ArrowDown'].includes(e.key)){e.preventDefault();open();setTimeout(()=>{if(opened)h.querySelector('.brand').focus()},reduce.matches?0:380)}});
h.addEventListener('pointerenter',()=>clearTimeout(closeTimer));h.addEventListener('pointerleave',delayedClose);h.addEventListener('focusin',()=>clearTimeout(closeTimer));h.addEventListener('focusout',()=>setTimeout(()=>{if(opened&&!h.contains(document.activeElement)&&!h.matches(':hover'))close()},0));toggle.addEventListener('click',()=>close(true));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&opened)close(true)});document.addEventListener('pointerdown',e=>{if(opened&&!h.contains(e.target)&&!drop.contains(e.target))close()});panel.addEventListener('click',e=>{const action=e.target.closest('a,button');if(action)setTimeout(()=>close(),0)});
function animate(){if(frame)return;function tick(){x+=(tx-x)*.13;y+=(ty-y)*.13;drop.style.setProperty('--drop-x',x.toFixed(2)+'px');drop.style.setProperty('--drop-y',y.toFixed(2)+'px');if(Math.abs(tx-x)+Math.abs(ty-y)>.05)frame=requestAnimationFrame(tick);else frame=0}frame=requestAnimationFrame(tick)}
document.addEventListener('pointermove',e=>{if(!fine.matches||reduce.matches||opened)return;const dx=e.clientX-innerWidth/2,dy=e.clientY-(mobile.matches?52:58),distance=Math.hypot(dx,dy);const force=Math.max(0,1-distance/145);tx=dx*force*.22;ty=dy*force*.22;animate()},{passive:true});document.addEventListener('pointerleave',()=>{tx=ty=0;animate()});h.addEventListener('pointermove',e=>{const r=h.getBoundingClientRect();h.style.setProperty('--glass-x',((e.clientX-r.left)/r.width*100)+'%')});addEventListener('scroll',()=>h.classList.toggle('is-compact',scrollY>70),{passive:true});addEventListener('resize',()=>{
  if(opened){h.classList.toggle('is-open',mobile.matches);anchor()}
  layout();
});document.fonts.ready.then(layout);layout();})();

;
/* dimensions-v21.js */
(()=>{'use strict';const section=document.querySelector('#discover');if(!section)return;const cards=[...section.querySelectorAll('[data-dimension]')],gallery=section.querySelector('.v4-gallery'),detail=section.querySelector('#dimension-detail'),mobile=matchMedia('(max-width:700px)'),fine=matchMedia('(hover:hover) and (pointer:fine)'),en=document.documentElement.lang==='en',backdrop=document.createElement('div');backdrop.className='insight-hover-backdrop';backdrop.setAttribute('aria-hidden','true');const names=['mini','life','deep','future','path'],images=names.map(n=>{const im=new Image;im.alt='';im.decoding='async';im.dataset.src='assets/insight-'+n+'.webp';backdrop.append(im);return im});let selected=-1,keyboard=false,pressed=null;
function layout(){section.prepend(backdrop);if(detail)detail.hidden=true;cards.forEach(c=>c.setAttribute('aria-expanded','false'))}layout();
function preload(){images.forEach(i=>{if(!i.getAttribute('src'))i.src=i.dataset.src})}function show(i){if(i<0)return;preload();selected=i;images.forEach((im,j)=>im.classList.toggle('is-current',i===j));cards.forEach((c,j)=>{c.classList.toggle('touch-selected',i===j);if(mobile.matches)c.setAttribute('aria-pressed',String(i===j))});document.body.classList.add('insight-background-on');section.dataset.activeDimension=names[i];}function hide(){selected=-1;images.forEach(i=>i.classList.remove('is-current'));cards.forEach(c=>{c.classList.remove('touch-selected');c.removeAttribute('aria-pressed')});document.body.classList.remove('insight-background-on');delete section.dataset.activeDimension;}
new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting))preload()},{rootMargin:'650px'}).observe(section);new IntersectionObserver(([e])=>{if(!e.isIntersecting){pressed=null;hide()}},{threshold:.05}).observe(section);
// pointerdown reveals the image before release; elementFromPoint follows an implicitly captured touch.
section.addEventListener('pointerdown',e=>{const card=e.target.closest('[data-dimension]');if(!card)return;pressed=e.pointerId;keyboard=false;show(cards.indexOf(card));if(mobile.matches&&detail)detail.hidden=true;},{capture:true,passive:true});
section.addEventListener('pointermove',e=>{if(!mobile.matches||pressed!==e.pointerId)return;const card=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-dimension]');if(card&&section.contains(card))show(cards.indexOf(card));},{passive:true});
section.addEventListener('click',e=>{const card=e.target.closest('[data-dimension]');if(!card||!mobile.matches)return;e.preventDefault();e.stopImmediatePropagation();show(cards.indexOf(card));if(detail)detail.hidden=true;cards.forEach(c=>c.setAttribute('aria-expanded','false'));},true);
addEventListener('pointerup',()=>pressed=null,{passive:true});addEventListener('pointercancel',()=>pressed=null,{passive:true});document.addEventListener('pointerdown',e=>{if(!section.contains(e.target))hide()},{passive:true});document.addEventListener('keydown',e=>{if(e.key==='Tab')keyboard=true});cards.forEach((c,i)=>{c.addEventListener('pointerenter',e=>{if(!mobile.matches&&fine.matches&&e.pointerType!=='touch')show(i)});c.addEventListener('pointerleave',()=>{if(!mobile.matches&&!keyboard)hide()});c.addEventListener('focusin',()=>{if(keyboard)show(i)});c.addEventListener('focusout',()=>{if(!mobile.matches)hide()});c.addEventListener('keydown',e=>{if(!mobile.matches)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();show(i)}else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const j=(i+(e.key==='ArrowDown'?1:-1)+5)%5;cards[j].focus();show(j)}})});mobile.addEventListener('change',()=>{hide();layout()});document.addEventListener('visibilitychange',()=>{if(document.hidden)hide()});addEventListener('blur',hide);
})();

;
/* crystal-v20.js */
(()=>{'use strict';const reduced=matchMedia('(prefers-reduced-motion:reduce)');document.querySelectorAll('.crystal-hero-btn').forEach(button=>button.addEventListener('pointermove',e=>{const r=button.getBoundingClientRect();button.style.setProperty('--cx',(e.clientX-r.left)/r.width*100+'%');button.style.setProperty('--cy',(e.clientY-r.top)/r.height*100+'%')}));
const hero=document.querySelector('.ik-hero');if(hero){const layer=document.createElement('div');layer.className='hero-fireflies';layer.setAttribute('aria-hidden','true');hero.append(layer);let animations=[],visible=true,width=0,height=0;const flies=Array.from({length:10},(_,i)=>{const el=document.createElement('i');el.className='hero-firefly';el.style.setProperty('--blink',(4.2+i*.47)+'s');el.style.setProperty('--delay',(-i*1.37)+'s');el.style.width=el.style.height=(2.7+i%3*.7)+'px';layer.append(el);return el});function create(){const w=hero.clientWidth,h=hero.clientHeight;if(w===width&&h===height&&animations.length)return;width=w;height=h;animations.forEach(a=>a.cancel());animations=[];flies.forEach((el,i)=>{const seed=(i*.61803398875)%1;const points=Array.from({length:7},(_,j)=>{const angle=seed*Math.PI*2+j*.9,px=.5+Math.sin(angle*(i%2?1:-1)+i*.7)*.41,py=.51+Math.cos(angle*.83+i*.46)*.35;return{transform:`translate3d(${Math.round(22+px*(w-44))}px,${Math.round(28+py*(h-56))}px,0)`}});points.push(points[0]);if(reduced.matches){el.style.transform=points[0].transform;return}const duration=24000+i*1900,animation=el.animate(points,{duration,iterations:Infinity,easing:'ease-in-out',delay:-seed*duration});if(!visible||document.hidden)animation.pause();animations.push(animation)})}new ResizeObserver(create).observe(hero);new IntersectionObserver(([e])=>{visible=e.isIntersecting;animations.forEach(a=>visible&&!document.hidden?a.play():a.pause())}).observe(hero);document.addEventListener('visibilitychange',()=>animations.forEach(a=>visible&&!document.hidden?a.play():a.pause()));reduced.addEventListener('change',()=>{width=0;create()});create()}
const audio=document.querySelector('#calm-audio'),panel=document.querySelector('#music-panel'),primary=document.querySelector('#calm-toggle');if(!audio||!panel)return;const play=panel.querySelector('.music-play'),mute=panel.querySelector('.music-mute'),volume=panel.querySelector('#music-volume'),group=panel.querySelector('.volume-group'),open=panel.querySelector('.music-volume-open'),state=panel.querySelector('.music-state');audio.loop=true;audio.volume=.7;panel.hidden=false;panel.parentElement.classList.add('custom-ready');
function sync(){const active=!audio.paused;panel.classList.toggle('is-playing',active);play.setAttribute('aria-pressed',String(active));play.setAttribute('aria-label',document.documentElement.lang==='en'?(active?'Stop Om':'Play Om'):(active?'หยุดเสียงโอม':'เล่นเสียงโอม'));mute.setAttribute('aria-pressed',String(audio.muted));mute.setAttribute('aria-label',document.documentElement.lang==='en'?(audio.muted?'Unmute':'Mute'):(audio.muted?'เปิดเสียง':'ปิดเสียง'));volume.value=String(audio.volume);volume.style.setProperty('--progress',audio.volume*100+'%');state.textContent=active?'Om · playing':'Om · stopped';document.querySelector('#pause')?.classList.toggle('om-playing',active)}
play.addEventListener('click',async()=>{if(!audio.paused){audio.pause();audio.currentTime=0;primary?.setAttribute('aria-pressed','false');if(primary)primary.textContent=document.documentElement.lang==='en'?'Begin a quiet moment':'เริ่มช่วงเวลาสงบ'}else primary?.click();sync()});mute.addEventListener('click',()=>{audio.muted=!audio.muted;sync()});volume.addEventListener('input',()=>{audio.volume=Number(volume.value);audio.muted=audio.volume===0;sync()});open.addEventListener('click',()=>{const expanded=group.classList.toggle('volume-open');open.setAttribute('aria-expanded',String(expanded))});group.addEventListener('pointerenter',()=>open.setAttribute('aria-expanded','true'));group.addEventListener('pointerleave',()=>{if(!group.classList.contains('volume-open'))open.setAttribute('aria-expanded','false')});document.addEventListener('pointerdown',e=>{if(!group.contains(e.target)){group.classList.remove('volume-open');open.setAttribute('aria-expanded','false')}});['play','pause','ended','volumechange'].forEach(e=>audio.addEventListener(e,sync));audio.addEventListener('error',()=>state.textContent='Unable to load audio');sync();})();

;
/* translations-v14.js */
window.THE_NAME_TRANSLATIONS={"/ คน": "/ person", "2 ชั่วโมง": "2 hours", "2 หัวข้อ": "2 topics", "4 หัวข้อ": "4 topics", "5 มิติแห่งการค้นพบตัวคุณ": "Five dimensions of self-discovery", "6 หัวข้อ": "6 topics", "7 หัวข้อ": "7 topics", "8 หัวข้อ": "8 topics", "90 นาที": "90 minutes", "Facial ในแพ็กเกจรวมใช้เวลา 90 นาที ส่วน Facial แบบเดี่ยวใช้เวลา 2 ชั่วโมง": "The combined experience includes a 90-minute facial. The standalone Facial Ritual lasts 2 hours.", "Full Life Map ครอบคลุมอะไรบ้าง?": "What does the Full Life Map cover?", "Ikigai ต่างจาก Insight อย่างไร?": "How is Ikigai different from Insight?", "Insight มองตัวตน ความสัมพันธ์ และแนวทางชีวิตในภาพกว้าง ส่วน Ikigai เน้นเชื่อมสิ่งที่รัก ความถนัด สิ่งที่โลกต้องการ และสิ่งที่สร้างรายได้": "Insight explores your identity, relationships and broader life direction. Ikigai focuses on connecting what you love, your strengths, what the world needs and what you can earn from.", "Insight เน้นสำรวจตัวตนและแนวทางชีวิต Ikigai เน้นค้นหาความหมายและจุดเชื่อมโยงของสิ่งที่รัก ส่วน Wellness ให้พื้นที่กับการดูแลกายและใจ": "Insight explores who you are and your life direction. Ikigai explores meaning and the connections between what matters to you. Wellness offers space to care for your body and mind.", "Insight เหมาะกับใคร?": "Who is Insight for?", "Signature Facial Ritual ใช้เวลา 2 ชั่วโมง Signature Mantra Yoga 90 นาที และ Signature Wellness Experience ประมาณ 3 ชั่วโมง สอบถามวันเวลาและรูปแบบกับ THE NAME ก่อนนัดหมาย": "Signature Facial Ritual lasts 2 hours, Signature Mantra Yoga 90 minutes, and Signature Wellness Experience approximately 3 hours. Please confirm availability and the format with THE NAME before booking.", "กด “สอบถามบริการ” เพื่อเตรียมข้อความ ระบุบริการและคำถามที่ต้องการ แล้วส่งให้ THE NAME ผ่านช่องทางติดต่อที่คุณใช้อยู่ การเตรียมข้อความยังไม่ใช่การยืนยันนัดหมาย": "Select “Enquire” to prepare a message with the service and questions you have in mind. Send it to THE NAME through your preferred contact channel. Preparing a message does not confirm a booking.", "กรอกข้อมูล": "Share your details", "กลับมามองรากฐานและเรื่องราวที่ประกอบเป็นคุณ": "Revisit the foundations and experiences that make you who you are.", "กลับมาอยู่กับตัวเอง": "Reconnect with yourself", "กลับมาอยู่กับร่างกาย": "Reconnect with your body", "กลับมาอยู่กับลมหายใจ": "Return to your breath", "กลับหน้า Home": "Back to Home", "การงานและอาชีพ": "Work & career", "การดูแลด้วยเทคนิค Bojin": "Care through the Bojin technique", "การดูแลใบหน้าและช่วงเวลาแห่งการผ่อนคลาย": "Facial care and time to unwind", "การฝึกที่ออกแบบตามความต้องการ": "A practice shaped around your needs", "การเงินและความมั่นคง": "Finances & stability", "กำลังเล่น · วนต่อเนื่อง": "Playing · on repeat", "ขยับเมาส์เพื่อสำรวจ · คลิก Bubble เพื่อดูรายละเอียด": "Move your cursor to explore · select a bubble for details", "ขอรายละเอียดบริการ ค่าบริการ วันว่าง และสถานที่ให้บริการครับ/ค่ะ": "Please share the service details, pricing, availability and location.", "ข้อความนี้ยังไม่ใช่การยืนยันการจอง": "This message does not confirm a booking.", "ข้ามไปเนื้อหา": "Skip to content", "ควรเตรียมข้อมูลอะไร?": "What information should I prepare?", "ความต้องการที่ต่อยอดได้": "Needs you can build on", "ความถนัดที่สร้างรายได้": "Strengths you can earn from", "ความรักและคู่ครอง": "Love & partnership", "คัดลอกข้อความ": "Copy message", "คัดลอกข้อความแล้ว พร้อมนำไปส่งให้ THE NAME": "Message copied. You can now send it to THE NAME.", "คืนพื้นที่ให้กายและใจ": "Make space for your body and mind", "คืนพื้นที่ให้ความสบาย": "Make room for ease", "คุณค่าจากสิ่งที่คุณทำ ซึ่งอาจพัฒนาเป็นงาน บริการ หรือสิ่งที่ผู้คนยินดีจ่ายให้": "The value you create may grow into work, a service or something others are willing to pay for.", "คุณค่าที่สามารถส่งต่อเป็นงาน บริการ หรือสิ่งที่ผู้คนยินดีแลกเปลี่ยนรายได้ให้": "Value you can offer through work, a service or something others are willing to pay for.", "ค่อย ๆ กลายเป็นภาพที่เชื่อมโยงกัน": "gradually become a connected picture", "ค่อย ๆ รับรู้ลมหายใจในจังหวะที่สบาย": "Gently notice your breath at a comfortable pace.", "ค้นพบ Ikigai": "Discover Ikigai", "ค้นพบเส้นทางของคุณ": "Discover your path", "ค้นหาตัวตน เข้าใจชีวิต": "Discover yourself, understand your life", "จบช่วงเวลาสงบแล้ว": "Your quiet moment has ended.", "จบด้วยความละมุน": "A gentle finish", "จองวันและเวลา": "Arrange a date & time", "จังหวะที่เบาและพอดี": "A gentle, considered rhythm", "จำเป็นต้องเลือกหลายบริการพร้อมกันไหม?": "Do I need to choose more than one service?", "จุดแข็งและการเติบโต": "Strengths & growth", "จุดแข็งและความท้าทาย": "Strengths & challenges", "ชีวิตที่มีความหมาย": "A meaningful life", "ชื่อที่ต้องการให้เรียก (ไม่บังคับ)": "Preferred name (optional)", "ช่วงเวลาของความชุ่มชื้น": "A moment of hydration", "ดู Wellness": "Explore Wellness", "ดูบริการที่ตรงกับสิ่งที่คุณกำลังมองหา": "Explore the service that fits what you are looking for.", "ดูหัวข้อทั้งหมดแบบรายการ": "View all topics as a list", "ดูเพิ่มเติม": "View details", "ดูเส้นทางประสบการณ์": "Explore the experience", "ดูแลด้วย Facial Cupping ตามความเหมาะสมของผิว": "Facial cupping tailored to what is appropriate for your skin.", "ดูแลตัวเองอย่างต่อเนื่อง": "A fuller moment of self-care", "ดูแลรอบดวงตา หน้าผาก และขมับด้วยสัมผัสอ่อนโยน": "Gentle care around the eyes, forehead and temples.", "ดูแลศีรษะ คอ และบ่าไหล่ เป็นส่วนหนึ่งของการพักผ่อน": "Care for the head, neck and shoulders as part of your time to rest.", "ตั้งแต่สัมผัสแรก จนถึงชาถ้วยสุดท้าย": "From the first touch to the last cup of tea", "ต่างประเทศและการเดินทาง": "Travel & experiences abroad", "ต้องเตรียมตัวและนัดหมายอย่างไร?": "How do I prepare and arrange a session?", "ถ้ามีข้อจำกัดในการเคลื่อนไหวหรือผิวแพ้ง่าย?": "What if I have movement limitations or sensitive skin?", "ทบทวนความเสี่ยงและแนวทางเตรียมรับมือ": "Reflect on potential risks and ways to prepare.", "ทบทวนแนวทางสร้างความมั่นคงและการวางแผนการเงิน": "Reflect on financial planning and ways to build stability.", "ทบทวนแนวโน้มและความเป็นไปได้ของเส้นทางข้างหน้า": "Reflect on trends and possibilities for the path ahead.", "ทักษะ ความถนัด และประสบการณ์ที่คุณสะสมมา รวมถึงสิ่งที่คนรอบตัวมักขอความช่วยเหลือจากคุณ": "The skills, strengths and experience you have built, including the things people often ask you to help with.", "ทักษะ ประสบการณ์ และความถนัดที่คุณสะสมมา รวมถึงสิ่งที่ผู้คนมักขอให้คุณช่วย": "The skills, experience and strengths you have developed, including the help people often seek from you.", "ทั้งสามบริการต่างกันอย่างไร?": "How do the three services differ?", "ทำความเข้าใจรูปแบบการใช้ชีวิตและมุมมองของตัวเอง": "Understand your way of living and your perspective on life.", "ทำหลายอย่างได้": "You can do many things,", "ทิศทางชีวิต": "Life direction", "ธุรกิจที่เหมาะสม": "Business possibilities", "นวดใบหน้าและดูแลแนวกรอบหน้าในจังหวะที่เหมาะกับคุณ": "Facial massage and contour care at a pace that suits you.", "นำประเด็นที่ค้นพบมาเป็นจุดเริ่มต้นของการทบทวนทางเลือก": "Use what you discover as a starting point for reflecting on your options.", "นำมุมมองที่ค้นพบไปทบทวนเส้นทางของตัวเอง": "Take your new perspective into reflecting on your own path.", "บริการที่สนใจ": "Service of interest", "บอกความต้องการ ประสบการณ์ และข้อจำกัดในการเคลื่อนไหว": "Share your needs, experience and any movement limitations.", "บำรุงผิวขั้นสุดท้าย พร้อมพักและจิบ Wellness Tea": "Finish with skincare, a moment of rest and Wellness Tea.", "บุคลิกและการใช้ชีวิต": "Personality & way of life", "ประมาณ 3 ชั่วโมง · Private experience": "Approximately 3 hours · Private experience", "ประมาณ 3 ชั่วโมง": "Approximately 3 hours", "ประสบการณ์ Private ที่เชื่อม Mantra Yoga 90 นาที กับ Facial Ritual 90 นาที ให้การเคลื่อนไหวต่อเนื่องสู่การพัก": "A private experience combining 90 minutes of Mantra Yoga with a 90-minute Facial Ritual, moving gently from movement into rest.", "ประสบการณ์หรือทักษะใดของคุณที่ผู้คนยินดีจ่ายเพื่อรับคุณค่านั้น?": "Which of your skills or experiences offers value others would pay for?", "ปรึกษาและเตรียมผิว": "Consultation & skin preparation", "ปัจจัยสนับสนุน": "Supportive factors", "ปัญหาที่คุณสนใจ ผู้คนที่คุณอยากช่วย และคุณค่าที่คุณอยากมีส่วนร่วมสร้าง": "The issues you care about, the people you want to help and the value you want to help create.", "ปัญหาที่คุณสนใจมีโอกาสพัฒนาเป็นงานหรือบริการอย่างไร?": "How could an issue you care about become an opportunity for work or a service?", "ปิดท้ายด้วยท่าพักและการรับรู้ความรู้สึกหลังฝึก": "Finish in a resting pose, noticing how you feel after the practice.", "ปิดผิวด้วยเจลมาสก์และเว้นเวลาให้คุณได้พัก": "Apply a jelly mask and leave space for you to rest.", "ปิดเสียง": "Mute", "ผสาน Mantra Yoga และ Facial Ritual": "Bringing Mantra Yoga and Facial Ritual together", "ผสานการเคลื่อนไหว ลมหายใจ และสมาธิ ด้วยการฝึกที่ปรับตามระดับและสภาวะร่างกายของคุณ": "A practice combining movement, breathwork and meditation, adapted to your level and physical condition.", "ผสานเทคนิค Bojin เข้ากับช่วงเวลาการดูแลใบหน้า": "Incorporating the Bojin technique into your facial care.", "ผู้ที่อยากสำรวจตัวตน ความสัมพันธ์ ศักยภาพ หรืออยากมีพื้นที่ทบทวนแนวทางชีวิตของตัวเอง": "For anyone wishing to explore their identity, relationships and potential, or make space to reflect on their life direction.", "ผ่อนคลายผ่านสัมผัส": "Unwind through touch", "ฝึกในระดับที่เหมาะกับร่างกายของคุณ": "Practice at a level that suits your body.", "พบความหมายในแบบของคุณ": "Find meaning in your own way", "พร้อมเมื่อคุณพร้อม": "Ready when you are", "พักบริเวณรอบดวงตา": "Rest for the eye area", "พักสักครู่": "Take a moment", "พักอยู่กับช่วงเวลานี้": "Rest in this moment", "พื้นฐานตัวตน": "Your foundations", "พื้นที่สำหรับจังหวะของคุณ": "Space for your own rhythm", "พูดคุยก่อนเริ่ม": "A conversation before you begin", "พูดคุยผ่านรูปแบบและช่องทางที่ตกลงไว้": "Meet through the format and channel agreed in advance.", "พูดคุยรายละเอียด": "Talk through the details", "ภาพชีวิตที่กว้างขึ้น ผ่าน 5 มิติ รวม 27 หัวข้อ": "A broader view of your life across 5 dimensions and 27 topics", "ภาพประกอบ Facial Ritual": "Facial Ritual illustration", "ภาพประกอบบรรยากาศของประสบการณ์": "Images illustrating the atmosphere of the experience", "ภาพประกอบ ": "Illustration of ", "มองการพัฒนาตนเองในระยะยาว": "Consider your personal development over the longer term.", "มองความสัมพันธ์ที่เกื้อหนุนและการอยู่ร่วมกัน": "Explore supportive relationships and life together.", "มองจุดแข็ง ความท้าทาย และโอกาสพัฒนาตัวเอง": "Explore your strengths, challenges and opportunities for growth.", "มองทิศทางที่อยากสำรวจต่อ": "See the directions you want to explore", "มองเห็นจุดเชื่อมโยง": "Recognise the connections", "มองเห็นตัวเองชัดขึ้น": "See yourself more clearly", "มีอะไรที่คุณทั้งสนุกกับการทำ และได้ใช้ความถนัดของตัวเอง?": "What lets you enjoy what you do while using your strengths?", "ยังเล่นเสียงไม่ได้ ลองเปิดแถบเสียงด้านล่าง": "Unable to play the audio. Please try the audio controls below.", "ยังโหลดเสียงไม่ได้ กรุณาลองอีกครั้ง": "Unable to load the audio. Please try again.", "ยังไม่รู้ว่าตัวเองชอบอะไร เริ่มได้ไหม?": "Can I begin if I do not know what I love yet?", "ยังไม่แน่ใจว่าจะเริ่มตรงไหน?": "Not sure where to begin?", "ยืดและผ่อนลง": "Stretch and soften", "ย่อข้อมูล": "Show less", "รักและทำได้ดี": "What you love and do well", "รักและมีคุณค่าต่อผู้อื่น": "What you love and offer others", "รับ Insight ของคุณ": "Receive your Insight", "รับคำปรึกษา": "Have your consultation", "รู้จักจุดเด่นและประเด็นที่ควรเตรียมพร้อม": "Recognise your strengths and the challenges to prepare for.", "รู้จักตัวเอง · ค้นพบความหมาย · กลับสู่สมดุล": "Know yourself · Discover meaning · Return to balance", "รู้จักสิ่งที่มีความหมาย": "Recognise what matters to you", "ลองช่วงเวลาสงบพร้อมเสียง": "Try a quiet moment with sound", "ลองเลือกจากความรู้สึกวันนี้": "Start with how you feel today", "ลากชมภาพ": "Drag to explore", "ลากภาพหรือใช้ปุ่มลูกศรเพื่อชม Gallery": "Drag the images or use the arrow buttons to explore the gallery", "ลำดับการฝึกปรับตามระดับและสภาวะร่างกายของผู้เรียน": "The practice sequence is adapted to each participant’s level and physical condition.", "วันนี้คุณอยากให้พื้นที่กับเรื่องไหนมากที่สุด?": "What would you most like to make space for today?", "วางความเร่งรีบ แล้วกลับมาอยู่กับลมหายใจ": "Set the rush aside and return to your breath.", "สถานที่และการเตรียมตัวเป็นอย่างไร?": "Where is the session, and how should I prepare?", "สนใจ ": "Interested in ", "สวัสดีครับ/ค่ะ THE NAME": "Hello THE NAME", "สอบถาม Facial Ritual": "Enquire about Facial Ritual", "สอบถาม Mantra Yoga": "Enquire about Mantra Yoga", "สอบถามช่วงเวลาของคุณ": "Enquire about your session", "สอบถามช่วงเวลาที่สะดวกผ่านช่องทางของ THE NAME": "Contact THE NAME to discuss a suitable date and time.", "สอบถามบริการ": "Enquire", "สอบถามประสบการณ์ Ikigai": "Enquire about the Ikigai experience", "สอบถามรูปแบบ ระยะเวลา สิ่งที่จะได้รับ และค่าบริการก่อนนัดหมาย": "Please confirm the format, duration, what is included and pricing before arranging a session.", "สอบถามรูปแบบ วันเวลา และการเตรียมตัว": "Ask about the format, availability and how to prepare.", "สอบถามสถานที่ อุปกรณ์ เครื่องแต่งกาย และเงื่อนไขการนัดหมายของแต่ละบริการก่อนยืนยันการจอง": "Please confirm the location, equipment, clothing and booking conditions for your chosen service before booking.", "สอบถามแพ็กเกจ": "Enquire about the package", "สอบถามและนัดหมายอย่างไร?": "How do I enquire and arrange a session?", "สอบถาม ": "Enquire about ", "สอบถาม": "Enquire", "สังเกตลมหายใจ": "Notice your breath", "สัมผัส การเคลื่อนไหว และการพัก": "Touch, movement and rest", "สัมผัสที่ค่อย ๆ คลาย": "Touch that gently softens", "สามเส้นทางของการกลับมารู้จักตัวเอง": "Three paths to reconnect with yourself", "สำรวจ 5 มิติ": "Explore 5 dimensions", "สำรวจ Insight": "Explore Insight", "สำรวจความเชื่อมโยงระหว่างคุณกับผู้คนรอบตัว": "Explore the connections between you and the people around you.", "สำรวจความเป็นไปได้ของการเดินทางและประสบการณ์ใหม่": "Explore possibilities for travel and new experiences.", "สำรวจปัจจัยที่อาจมีส่วนสนับสนุนเส้นทางของคุณ": "Explore the factors that may support your path.", "สำรวจสิ่งที่รัก ความถนัด และคุณค่าที่คุณอยากส่งต่อ": "Explore what you love, your strengths and the value you want to offer.", "สำรวจเส้นทางการทำงานที่เชื่อมกับตัวคุณ": "Explore career paths that connect with who you are.", "สำรวจโอกาสและแนวทางของการเริ่มต้นหรือต่อยอดธุรกิจ": "Explore opportunities and approaches for starting or developing a business.", "สำรวจ": "Explore", "สิ่งที่ควรระวัง": "Things to be mindful of", "สิ่งที่คุณถนัด": "What you are good at", "สิ่งที่คุณรัก": "What you love", "สิ่งที่คุณรักสามารถช่วยใคร หรือทำให้เรื่องไหนดีขึ้นได้บ้าง?": "Who could benefit from what you love, or what could it help improve?", "สิ่งที่คุณให้คุณค่าหรือเปล่า?": "what you value?", "สิ่งที่ถนัด": "Your strengths", "สิ่งที่ทำอยู่ เชื่อมกับ": "Does what you do connect with", "สิ่งที่ทำให้คุณรู้สึกมีส่วนร่วม สนุก หรืออยากกลับไปทำอีก แม้ในวันที่ไม่มีใครบอกให้ทำ": "What draws you in, brings you joy or makes you want to return to it, even when no one asks you to.", "สิ่งที่ทำให้คุณรู้สึกมีส่วนร่วม สนุก หรืออยากกลับไปทำอีก โดยไม่ต้องมีใครบอกให้ทำ": "What draws you in, brings you joy or makes you want to return to it without anyone asking you to.", "สิ่งที่รัก ความถนัด สิ่งที่ผู้คนต้องการ และสิ่งที่สร้างรายได้ อาจเชื่อมกันได้มากกว่าที่คุณคิด": "What you love, your strengths, what people need and what you can earn from may connect more than you think.", "สิ่งที่รัก": "What you love", "สิ่งที่สร้างรายได้": "What you can earn from", "สิ่งที่อยากสอบถาม (ไม่บังคับ)": "Your questions (optional)", "สิ่งที่โลกต้องการ": "What the world needs", "หยุดช่วงเวลาสงบ": "Pause your quiet moment", "หยุดเสียงโอม": "Pause Om audio", "หัวข้อด้านบนเป็นภาพรวมของบริการ สอบถามรายการครบ 27 หัวข้อ รูปแบบ และระยะเวลาก่อนนัดหมาย": "The topics above provide an overview of the service. Please confirm the full list of 27 topics, the format and the duration before arranging a session.", "หายใจตามจังหวะที่สบายของคุณ": "Breathe at a pace that feels comfortable for you.", "อนาคตและทางเลือก": "Future & possibilities", "อยากค้นหาทิศทางและความหมาย": "I want to explore direction and meaning", "อยากพักและดูแลกายใจ": "I want to rest and care for my body and mind", "อยากเข้าใจตัวเองมากขึ้น": "I want to understand myself better", "อยากเริ่มต้นใหม่": "You want a fresh start,", "฿4,500 / คน": "฿4,500 / person", "เคลื่อนไหวอย่างค่อยเป็นค่อยไปก่อนเข้าสู่การฝึก": "Ease into movement before the main practice.", "เคลื่อนไหวและเรียนรู้ร่วมกัน": "Move and learn together", "เคลื่อนไหวในแบบของคุณ": "Move in your own way", "เคลื่อนไหวไปกับลมหายใจ และให้เวลากับตัวเองผ่านประสบการณ์ Mantra Yoga": "Move with your breath and take time for yourself through Mantra Yoga.", "เชื่อมภาพชีวิตกับทิศทางที่อยากก้าวต่อ": "Connect your view of life with the direction you want to take.", "เชื่อมภาพรวมชีวิตกับแนวทางที่อยากเดินต่อ": "Connect the bigger picture of your life with the path you want to follow.", "เชื่อมเรื่องราวของตัวเองกับบริบทของงาน ผู้คน และรายได้": "Connect your own story with the realities of work, people and income.", "เตรียมข้อความสอบถาม": "Prepare an enquiry", "เตรียมข้อมูลพื้นฐานตามที่ผู้ให้บริการแจ้ง": "Prepare the background information requested by the provider.", "เตรียมร่างกาย": "Prepare your body", "เปิด JavaScript เพื่อใช้งานเสียง แอนิเมชัน และเตรียมข้อความสอบถาม": "Enable JavaScript to use audio, animations and enquiry messages.", "เปิด LINE": "Open LINE", "เปิดเสียง": "Unmute", "เปิดเส้นทางของคุณ": "Open your path", "เปิดเส้นทาง": "Open your path", "เพื่อสำรวจแต่ละด้านของชีวิต": "to explore each part of your life", "เมื่อยืนยันนัดหมายแล้ว เริ่มประสบการณ์ในจังหวะของคุณ": "Once your appointment is confirmed, begin the experience at your own pace.", "เริ่ม ฿2,500": "From ฿2,500", "เริ่มจากการรู้จักตัวเอง และมุมมองที่คุณมีต่อชีวิต": "Begin with understanding yourself and your perspective on life.", "เริ่มจากการสังเกตตัวเอง แล้วค่อย ๆ มองหาจุดเชื่อมโยง": "Begin by noticing yourself, then gradually look for the connections.", "เริ่มจากการสำรวจตัวตน ความสัมพันธ์ และศักยภาพ": "Begin with exploring your identity, relationships and potential.", "เริ่มจากคำถามเล็ก ๆ ที่มีความหมายกับคุณ": "Begin with a small question that matters to you.", "เริ่มจากดูรายละเอียดของบริการที่คุณสนใจ แล้วสอบถาม THE NAME เพื่อเลือกรูปแบบที่เหมาะกับคุณก่อนจอง": "Explore the service that interests you, then contact THE NAME to find a suitable format before booking.", "เริ่มจากพูดคุยเรื่องผิวและความต้องการ แล้วทำความสะอาดอย่างอ่อนโยน": "Begin with a conversation about your skin and needs, followed by gentle cleansing.", "เริ่มจากสังเกตช่วงเวลาที่คุณรู้สึกมีส่วนร่วม แล้วใช้คำถามในแต่ละหัวข้อช่วยทบทวนได้ คุณไม่ต้องมีคำตอบพร้อมทั้งหมดก่อนสอบถามบริการ": "Start by noticing the moments that draw you in, then use the questions in each area to reflect. You do not need all the answers before enquiring.", "เริ่มจากสิ่งที่คุณต้องการในวันนี้": "Begin with what you need today", "เริ่มจากสิ่งที่คุณอยากรู้จักให้มากขึ้น": "Begin with what you want to understand better", "เริ่มจากสิ่งที่คุณอยากให้ตัวเองในวันนี้": "Begin with what you want to give yourself today", "เริ่มจากสิ่งที่รัก และทิศทางที่มีความหมายกับคุณ": "Begin with what you love and a direction that matters to you.", "เริ่มช่วงเวลาสงบ": "Begin a quiet moment", "เริ่มต้น ฿2,500": "From ฿2,500", "เริ่มต้นช่วงเวลาของคุณ": "Begin your own moment", "เริ่มต้นด้วยช่วงเวลานิ่ง ๆ และการรับรู้ตัว": "Begin with stillness and awareness.", "เริ่มต้นสอบถาม Insight": "Enquire about Insight", "เริ่มสำรวจ Ikigai ของคุณ": "Begin exploring your Ikigai", "เริ่มสำรวจตัวคุณ": "Begin exploring yourself", "เรื่องที่คุณอยากมีส่วนร่วม ปัญหาที่คุณสนใจ หรือผู้คนที่คุณอยากสร้างประโยชน์ให้": "The issues you want to engage with, the problems you care about or the people you want to benefit.", "เลือก Bubble รอบภาพ": "Select a bubble around the image", "เลือกข้อความด้านล่างแล้วคัดลอกเพื่อนำไปส่งให้ THE NAME": "Select and copy the message below to send it to THE NAME.", "เลือกช่วงเวลาของคุณ": "Choose your moment", "เลือกบริการแล้วคัดลอกข้อความสำหรับสอบถาม THE NAME": "Choose a service, then copy your enquiry message for THE NAME.", "เลือกบริการ": "Choose a service", "เลือกมิติที่อยากรู้จักให้มากขึ้น": "Choose a dimension you want to explore", "เลือกมิติหรือแพ็กเกจที่คุณอยากสำรวจ": "Choose the dimension or package you want to explore.", "เลือกวงหรือหัวข้อ เพื่อสำรวจในจังหวะของคุณ": "Choose a circle or topic to explore at your own pace.", "เลือกเส้นทาง": "Choose your path", "เลื่อนต่อให้ต้นไม้ค่อย ๆ เติบโต": "Scroll and let the tree grow", "เล่นเสียงโอม": "Play Om audio", "เสียงจะเริ่มเมื่อคุณกดปุ่ม": "Audio begins when you press play", "เส้นทางชีวิต": "Life path", "แจ้งข้อจำกัดในการเคลื่อนไหวก่อนนัดหมาย": "Please share any movement limitations before arranging a session.", "แจ้งประเด็นที่คุณอยากสำรวจ และสอบถาม THE NAME ว่าต้องเตรียมข้อมูลส่วนตัวใดสำหรับบริการที่เลือก ก่อนยืนยันนัดหมาย": "Share what you would like to explore, and ask THE NAME which personal details your chosen service requires before confirming an appointment.", "แจ้งรายละเอียดให้ผู้ให้บริการทราบก่อนจอง เพื่อสอบถามความเหมาะสมและสิ่งที่ควรเตรียมสำหรับประสบการณ์ที่เลือก": "Let the provider know before booking so you can discuss suitability and preparation for your chosen experience.", "แจ้งสิ่งที่คุณกำลังค้นหา แล้วสอบถามรูปแบบบริการ ระยะเวลา ราคา สถานที่ และสิ่งที่จะได้รับจาก THE NAME ก่อนยืนยันนัดหมาย": "Share what you are looking for, then confirm the format, duration, price, location and what is included with THE NAME before arranging a session.", "แตะ Bubble เพื่อดูรายละเอียดกลางภาพ": "Tap a bubble to see its details in the centre", "แต่ยังไม่รู้ว่าอยากไปทางไหน?": "but are not sure which direction to take?", "แต่ยังไม่เห็นจุดเริ่มต้น?": "but cannot see where to begin?", "แต่ละประสบการณ์ใช้เวลาต่างกันอย่างไร?": "How long does each experience last?", "แนวทางการเติบโต": "Growth & development", "แผนภาพนี้บอกคำตอบชีวิตได้เลยไหม?": "Will this diagram give me all the answers?", "แผนภาพนี้เป็นกรอบชวนทบทวน คุณไม่จำเป็นต้องมีคำตอบครบทุกวงในวันนี้": "This diagram is a framework for reflection. You do not need an answer for every circle today.", "แผนภาพใช้ช่วยตั้งคำถามและมองความเชื่อมโยง ทิศทางที่เหมาะกับคุณยังต้องสำรวจจากประสบการณ์และบริบทชีวิตจริง": "The diagram helps you ask questions and see connections. Finding your own direction still calls for exploring your experiences and real-life circumstances.", "และระดับการเคลื่อนไหวของคุณ": "and your level of movement", "และออกแบบอนาคตในแบบของคุณ": "and shape a future of your own", "แล้วค่อย ๆ เลือกเส้นทางในแบบของคุณ": "then find your own way forward", "โครงสร้างบริการแบ่งเป็น 5 มิติ รวม 27 หัวข้อ สามารถสอบถามรายการหัวข้อ วิธีการวิเคราะห์ และรูปแบบผลลัพธ์จากผู้ให้บริการก่อนตัดสินใจ": "The service is structured around 5 dimensions and 27 topics. Ask the provider about the topic list, approach and format of the results before deciding.", "โลกและความสัมพันธ์": "Your world & relationships", "ในช่วงเวลาที่เป็นของคุณ": "in a moment that is yours", "ในแบบของคุณ": "in your own way", "ให้การเคลื่อนไหวค่อย ๆ ต่อเนื่องสู่การพัก": "Let movement flow gently into rest", "ให้คำถามที่กระจัดกระจาย": "Let scattered questions", "ให้พื้นที่กับการดูแลกายและใจ ผ่าน Signature Wellness Experience ของ THE NAME": "Make space to care for your body and mind through THE NAME’s Signature Wellness Experience.", "ให้เวลากับการดูแลผิวหน้าในบรรยากาศสงบ ผ่านประสบการณ์ Facial Ritual ของ THE NAME": "Take time for facial care in a peaceful setting through THE NAME’s Facial Ritual.", "ให้เวลากับการดูแลใบหน้า ศีรษะ คอ และบ่าไหล่ ในบรรยากาศสงบและเป็นส่วนตัว": "Take time for your face, head, neck and shoulders in a calm, private setting.", "ให้เวลากับการพักและดูแลกายใจ": "Take time to rest and care for your body and mind.", "ให้เวลากับการยืดเหยียดและการคลายตัว": "Take time to stretch and release.", "ให้เวลากับช่วงเวลาตรงหน้า": "Take time for the moment in front of you.", "ให้เวลากับตัวเอง": "Take time for yourself", "ไม่ต้องรีบไปไหน": "There is no need to rush", "“คุณอยากทำให้เรื่องไหนดีขึ้น สำหรับใคร?”": "“What would you like to improve, and for whom?”", "“คุณอยากทำให้เรื่องไหนดีขึ้นสำหรับใคร?”": "“What would you like to improve, and for whom?”", "“ผู้คนมักนึกถึงคุณเมื่ออยากให้ช่วยเรื่องอะไร?”": "“What do people usually turn to you for help with?”", "“สิ่งที่คุณทำ ช่วยแก้ปัญหาหรือสร้างคุณค่าอย่างไร?”": "“How does what you do solve a problem or create value?”", "“อะไรทำให้คุณลืมมองเวลา?”": "“What makes you lose track of time?”", "ทุกตัวตน มีเรื่องราวให้ค้นพบ": "Every self holds a story to discover.", "เริ่มจากสิ่งที่คุณอยากรู้จักในตัวเอง": "Begin with what you want to understand about yourself,", "แล้วเลือกเส้นทางที่มีความหมายกับคุณ": "then choose a path that matters to you.", "ลากเพื่อหมุน · เปิดเส้นทางเพื่อเริ่มสำรวจ": "Drag to rotate · open your path to begin", "การ์ดสามมิติของ THE NAME ลากหรือใช้ปุ่มลูกศรเพื่อหมุน": "THE NAME 3D card. Drag or use the arrow keys to rotate.", "การ์ดสีน้ำเงินขอบทองของ THE NAME": "THE NAME navy and gold card", "เปิดเมนู THE NAME": "Open THE NAME menu", "เลือกหน้า": "Choose a page", "เมนูหลัก": "Main navigation", "เมนูท้ายหน้า": "Footer navigation", "บริการอื่น": "Other services", "ปิด": "Close", "โอม": "Om", "ภาพก่อนหน้า": "Previous image", "ภาพถัดไป": "Next image", "ระดับเสียงโอม": "Om audio volume", "ตำแหน่งการเล่นเสียงโอม": "Om audio playback position", "เล่นวนต่อเนื่อง": "Continuous loop", "Signature Facial Ritual, Mantra Yoga และ Wellness Experience พื้นที่สำหรับดูแลกายและใจของคุณ": "Signature Facial Ritual, Mantra Yoga and Wellness Experience: space to care for your body and mind.", "THE NAME ตามโลโก้ต้นฉบับ": "The original THE NAME wordmark", "THE NAME หน้าแรก": "THE NAME Home", "THE NAME — เขียนเรื่องราวของคุณด้วยการเลื่อนหน้า": "THE NAME — scroll to unfold your story", "กลับสู่ภาพรวม": "Return to the overview", "ก่อนหน้า": "Previous", "ข้อความสอบถามสำหรับคัดลอก": "Enquiry message to copy", "ค้นพบเส้นทางของคุณผ่าน Insight, Ikigai และ Wellness พร้อมช่วงเวลาสงบสำหรับกายและใจ": "Discover your path through Insight, Ikigai and Wellness, with quiet moments for body and mind.", "ค้นหาจุดเชื่อมโยงของสิ่งที่รัก สิ่งที่ถนัด สิ่งที่โลกต้องการ และสิ่งที่สร้างรายได้": "Find the connections between what you love, your strengths, what the world needs and what you can earn from.", "จุดไล่เฉดสีเต็มหน้าจอ ยุบและขยายรอบโอมเมื่อเริ่มช่วงเวลาสงบ": "A full-screen field of gradient dots, gently expanding and contracting around Om during your quiet moment", "ชื่อของคุณ": "Your name", "ดูขั้นตอน": "View the steps", "ดูเส้นทาง": "Explore the path", "ดูแผนภาพ 4 วง": "View the four-circle diagram", "ถัดไป": "Next", "ปิดหน้าต่าง": "Close dialog", "ฟังเสียง": "Listen", "ภาพบรรยากาศ Mantra Yoga": "Mantra Yoga atmosphere gallery", "ภาพประกอบบรรยากาศ Present Yoga": "Image illustrating a mindful yoga moment", "ภาพรวม": "Overview", "ภาพโยคะกลุ่มริมชายหาด": "Group yoga on the beach", "ภาพโยคะเดี่ยวริมชายหาด": "Individual yoga practice on the beach", "ภาพใบหน้าต้นฉบับของ THE NAME": "The original THE NAME portrait", "รายละเอียดหัวข้อที่เลือก": "Details of the selected topic", "รายละเอียดใบหน้าและผิวตามภาพต้นฉบับของ THE NAME": "Facial and skin detail from the original THE NAME photograph", "สำรวจตัวตน ความสัมพันธ์ และศักยภาพ ผ่าน Insight และ Full Life Map 5 มิติ 27 หัวข้อ": "Explore your identity, relationships and potential through Insight and the Full Life Map: 5 dimensions, 27 topics.", "สี่วงของ Ikigai": "The four circles of Ikigai", "อ่านเพิ่มเติม": "Read more", "เช่น รายละเอียดบริการ วันว่าง หรือสถานที่ให้บริการ": "For example, service details, availability or the location", "เปิดรายการ": "Open the list", "เลือกช่วงเวลา": "Choose your moment", "เลือกประสบการณ์ Wellness": "Choose a Wellness experience", "เลือกหัวข้อสำรวจ": "Choose a topic to explore", "เส้นต้นไม้เติบโตและเปลี่ยนเป็นสี่วงสำหรับสำรวจ Ikigai": "A growing tree transforms into four circles for exploring Ikigai", "แผนที่ชีวิตแบบ Interactive": "Interactive life map"};
;
/* i18n-v14.js */
(()=>{'use strict';const english=document.documentElement.lang==='en',dict=window.THE_NAME_TRANSLATIONS||{},keys=Object.keys(dict).sort((a,b)=>b.length-a.length),page=location.pathname.split('/').pop()||'index.html';function translate(text){if(!/[\u0E00-\u0E7F]/.test(text))return text;const key=text.trim();if(dict[key])return text.slice(0,text.indexOf(key))+dict[key]+text.slice(text.indexOf(key)+key.length);let result=text;for(const key of keys)if(result.includes(key))result=result.split(key).join(dict[key]);return result}window.tnTranslate=text=>english?translate(text):text;const explicit=new URLSearchParams(location.search).get('lang');if(explicit==='th'||explicit==='en'){try{localStorage.setItem('the-name-language',explicit)}catch{}}document.querySelectorAll('[data-language]').forEach(link=>link.addEventListener('click',()=>{try{localStorage.setItem('the-name-language',link.dataset.language)}catch{}}));if(!english){
  let preferred=explicit;
  if(preferred!=='en'&&preferred!=='th'){
    try{preferred=localStorage.getItem('the-name-language')}catch{}
  }
  if(preferred==='en')location.replace(new URL('en/'+page+location.search+location.hash,document.baseURI));
  return;
}try{localStorage.setItem('the-name-language','en')}catch{}
const attrs=['aria-label','title','alt','placeholder','data-cursor'];function element(el){for(const attr of attrs){const value=el.getAttribute?.(attr);if(value){const next=translate(value);if(next!==value)el.setAttribute(attr,next)}}if(el.tagName==='A'&&!el.hasAttribute('data-language')){const value=el.getAttribute('href')||'';if(/^(index|insight|ikigai|wellness|contact-shop)\.html/.test(value))el.setAttribute('href','en/'+value);else if(value.startsWith('#'))el.setAttribute('href',location.pathname+location.search+value)}}function walk(root){if(root.nodeType===3){if(!root.parentElement?.closest('script,style,svg,textarea')){const next=translate(root.nodeValue);if(next!==root.nodeValue)root.nodeValue=next}return}if(root.nodeType!==1)return;if(root.matches('script,style,svg'))return;element(root);for(const child of root.childNodes)walk(child)}walk(document.body);new MutationObserver(records=>{for(const r of records){if(r.type==='characterData')walk(r.target);else if(r.type==='attributes')element(r.target);else for(const node of r.addedNodes)walk(node)}}).observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:[...attrs,'href']});})();

;
/* refinement-v15.js */
(()=>{'use strict';const reduced=matchMedia('(prefers-reduced-motion:reduce)'),fine=matchMedia('(hover:hover) and (pointer:fine)');
// Keep magnetism independent from existing transforms and click targets.
for(const b of document.querySelectorAll('a.crystal-hero-btn')){b.addEventListener('pointermove',e=>{if(!fine.matches||reduced.matches)return;const r=b.getBoundingClientRect();b.style.setProperty('--mag-x',((e.clientX-r.left-r.width/2)*.075).toFixed(2)+'px');b.style.setProperty('--mag-y',((e.clientY-r.top-r.height/2)*.12).toFixed(2)+'px')});b.addEventListener('pointerleave',()=>{b.style.setProperty('--mag-x','0px');b.style.setProperty('--mag-y','0px')})}
const magnets=[...document.querySelectorAll('a.crystal-hero-btn')];let magnetFrame=0,mouseX=0,mouseY=0;addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||!fine.matches||reduced.matches)return;mouseX=e.clientX;mouseY=e.clientY;if(magnetFrame)return;magnetFrame=requestAnimationFrame(()=>{magnetFrame=0;for(const b of magnets){const r=b.getBoundingClientRect(),dx=mouseX-r.left-r.width/2,dy=mouseY-r.top-r.height/2,near=Math.abs(dx)<r.width/2+45&&Math.abs(dy)<r.height/2+45;b.style.setProperty('--mag-x',near?Math.max(-9,Math.min(9,dx*.07)).toFixed(2)+'px':'0px');b.style.setProperty('--mag-y',near?Math.max(-7,Math.min(7,dy*.1)).toFixed(2)+'px':'0px')}})},{passive:true});
for(const item of document.querySelectorAll('.v4-steps article')){const reset=()=>{item.classList.remove('is-reacting');item.style.setProperty('--step-lift','0px');item.style.setProperty('--step-rx','0deg');item.style.setProperty('--step-ry','0deg')};item.addEventListener('pointermove',e=>{if(!fine.matches||reduced.matches)return;const r=item.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;item.classList.add('is-reacting');item.style.setProperty('--step-x',x*100+'%');item.style.setProperty('--step-y',y*100+'%');item.style.setProperty('--step-lift','-6px');item.style.setProperty('--step-rx',(y-.5)*-8+'deg');item.style.setProperty('--step-ry',(x-.5)*12+'deg')});item.addEventListener('pointerleave',reset);item.addEventListener('pointercancel',reset)}
const hero=document.querySelector('.hero-v2'),scene=hero?.closest('.hero-scroll-scene');if(!hero||!scene)return;
const ns='http://www.w3.org/2000/svg',layer=document.createElement('div');layer.className='story-light-field';layer.setAttribute('aria-hidden','true');const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 600 900');svg.setAttribute('preserveAspectRatio','none');svg.innerHTML='<defs><linearGradient id="story-gold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#a3d5f8" stop-opacity=".1"/><stop offset=".38" stop-color="#ace9ff"/><stop offset=".75" stop-color="#63b8ed"/><stop offset="1" stop-color="#e4f8ff" stop-opacity=".1"/></linearGradient></defs>';
const shapes=['M90 -60C610 40 690 440 470 690C330 850 200 810 60 950','M155 -80C650 90 645 460 490 655C350 830 220 880 110 960','M250 -70C620 65 610 360 520 540C400 810 200 740 20 890','M70 930C230 740 560 860 590 540C615 280 560 130 350 -50','M320 -60C700 190 540 570 280 750C180 825 125 875 110 960'];
const narrow = matchMedia('(max-width: 700px)');
// The mobile reference bends around the portrait and sweeps into the lower left.
const narrowShapes = [
  'M308 -12 C504 35 600 158 593 341 C586 544 523 663 392 726 C269 785 100 792 -12 880',
  'M389 -12 C555 58 618 184 605 362 C591 561 537 675 404 741 C280 801 109 799 -12 889',
  'M428 -12 C569 70 620 207 610 374 C598 566 542 686 411 748 C294 805 119 808 -12 901'
];
const tracks=shapes.map((d,i)=>{const p=document.createElementNS(ns,'path');p.setAttribute('d',d);p.setAttribute('class','story-track');p.setAttribute('stroke','url(#story-gold)');svg.append(p);return p});const dots=tracks.map((p,i)=>{const c=document.createElementNS(ns,'circle');c.setAttribute('r',i%2?1.5:2);c.setAttribute('class','story-bead');svg.append(c);return{el:c,path:p,length:p.getTotalLength(),phase:i*.193}});layer.append(svg);hero.append(layer);
let visible=false,frame=0,last=0,t=0,current=0,target=0;
function fitTracks(){
  const layout=narrow.matches?narrowShapes:shapes;
  dots.forEach((dot,i)=>{
    const shape=layout[i];
    dot.path.style.display=dot.el.style.display=shape?'':'none';
    if (!shape) return;
    dot.path.setAttribute('d',shape);
    dot.length=dot.path.getTotalLength();
  });
  start();
}
narrow.addEventListener('change',fitTracks);
fitTracks();

function measure(){const r=scene.getBoundingClientRect();target=Math.max(0,Math.min(1,-r.top/Math.max(1,scene.offsetHeight-innerHeight)));start()}
function draw(ts){frame=0;if(!visible||document.hidden)return;const dt=last?Math.min((ts-last)/1000,.05):.016;last=ts;current+=(target-current)*(1-Math.exp(-dt*7));if(!reduced.matches)t+=dt;svg.style.transform=(reduced.matches||narrow.matches)?'none':`translate3d(0,${current*-22}px,0)`;dots.forEach((d,i)=>{if(narrow.matches&&i>=narrowShapes.length)return;const progress=reduced.matches?d.phase:(d.phase+t*(.033+i*.002))%1;const point=d.path.getPointAtLength(progress*d.length);d.el.setAttribute('cx',point.x.toFixed(2));d.el.setAttribute('cy',point.y.toFixed(2));d.el.style.opacity=((.5+Math.sin(t*.8+i)*.25)*Math.min(1,progress*14,(1-progress)*14)).toFixed(2)});if(!reduced.matches)frame=requestAnimationFrame(draw)}
function start(){if(!frame&&visible&&!document.hidden){last=0;frame=requestAnimationFrame(draw)}}new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible)measure();else{cancelAnimationFrame(frame);frame=0}},{threshold:0}).observe(scene);addEventListener('scroll',measure,{passive:true});addEventListener('resize',measure);document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else start()});reduced.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;current=target;start()});measure();
})();

;
/* responsive-v17.js */
(()=>{'use strict';
const mobile=matchMedia('(max-width:700px)'),english=document.documentElement.lang==='en';
const universe=document.querySelector('.life-universe');
if(universe){
 const stage=document.createElement('div');stage.className='life-orbit-stage';
 const orbit=universe.querySelector('.life-orbits');orbit.setAttribute('preserveAspectRatio','xMidYMid meet');orbit.innerHTML='<circle cx="500" cy="500" r="380"/><circle cx="500" cy="500" r="402"/>';
 universe.append(stage);[orbit,universe.querySelector('.life-node-layer'),universe.querySelector('.life-center')].forEach(el=>stage.append(el));
 function fit(){const intro=universe.querySelector('.life-intro'),h=universe.clientHeight,w=universe.clientWidth,top=intro.offsetTop+intro.offsetHeight+16,bottom=36,size=Math.max(180,Math.min(w-20,h-top-bottom));stage.style.width=stage.style.height=size+'px';stage.style.top=(top+(h-top-bottom-size)/2)+'px';}
 new ResizeObserver(fit).observe(universe);new ResizeObserver(fit).observe(universe.querySelector('.life-intro'));document.fonts.ready.then(fit);fit();
}
})();

;
/* insight-roots-v22.js */
(() => {
  const section = document.querySelector('#discover');
  const mapStage = document.querySelector('#full-life-map .life-map-stage');
  if (!section || !mapStage) return;
  const main = section.closest('main');
  const slope = Math.tan(Math.PI / 6);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const ns = 'http://www.w3.org/2000/svg';
  function make(name, attributes) {
    const node = document.createElementNS(ns, name);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
    return node;
  }
  const layers = ['back', 'front'].map(depth =>
    make('svg', { class: 'meteor-layer26 meteor-' + depth + '26', 'aria-hidden': 'true' }));
  main.classList.add('insight-meteor-region');
  main.append(...layers);

  let stars = [], frame = 0, previousTime = 0, visible = false, width = 0, height = 0;
  let mapStart = 0, sectionEnd = 0;
  const visibleSections = new Set();
  function respawn(star) {
    const endY = mapStart + Math.min(84, width * .12) * (.55 + Math.random() * .45);
    const maxTravel = width * .91 * slope;
    star.startY = Math.max(5, endY - maxTravel, sectionEnd - 40 - Math.random() * 100);
    star.distance = endY - star.startY;
    star.x = star.distance / slope + Math.random() * (width - star.distance / slope);
    star.duration = star.distance / (115 + Math.random() * 55);
    star.age = -.35 - Math.random() * 4;
  }
  function layout() {
    width = main.clientWidth;
    const discover = section.getBoundingClientRect();
    const map = mapStage.getBoundingClientRect();
    const top = Math.max(discover.top, discover.bottom - 160);
    sectionEnd = discover.bottom - top;
    mapStart = map.top - top;
    height = mapStart + Math.min(100, width * .14);
    const offset = top - main.getBoundingClientRect().top;
    if (!width || !height) return;
    for (const layer of layers) {
      layer.style.top = offset + 'px';
      layer.style.height = height + 'px';
      layer.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
      layer.replaceChildren();
    }
    stars = Array.from({ length: width <= 700 ? 8 : 16 }, (_, index) => {
      const layer = layers[index % 3 === 0 ? 1 : 0];
      const color = index % 2 ? '#fffdf7' : '#91dbff';
      const length = 22 + (index % 6) * 6;
      const gradient = make('linearGradient', {
        id: 'meteor-trail-' + index, gradientUnits: 'userSpaceOnUse',
        x1: length, y1: -length * slope, x2: 0, y2: 0
      });
      gradient.append(
        make('stop', { offset: 0, 'stop-color': color, 'stop-opacity': 0 }),
        make('stop', { offset: .72, 'stop-color': color, 'stop-opacity': .46 }),
        make('stop', { offset: 1, 'stop-color': color })
      );
      layer.append(gradient);
      const group = make('g', { color, opacity: 0 });
      group.append(
        make('path', { fill: 'url(#meteor-trail-' + index + ')', d: 'M' + length + ' ' + -length * slope + 'L-1.35 -.25 Q-2 2 .25 1.35Z' }),
        make('circle', { class: 'meteor-head22', r: index % 5 === 0 ? 1.8 : 1.15 })
      );
      layer.append(group);
      const star = { group };
      respawn(star);
      return star;
    });
  }

  function draw(time) {
    frame = 0;
    const dt = previousTime ? Math.min(65, time - previousTime) / 1000 : 0;
    previousTime = time;
    for (const star of stars) {
      star.age += dt;
      if (star.age >= star.duration) respawn(star);
      const p = Math.max(0, star.age / star.duration);
      const travel = star.distance * p;
      const x = star.x - travel / slope;
      const y = star.startY + travel;
      star.group.setAttribute('transform', 'translate(' + x + ' ' + y + ')');
      star.group.setAttribute('opacity', star.age < 0 ? 0 : Math.min(1, p * 18, (1 - p) * 26) * .86);
    }
    update();
  }
  function update() {
    if (visible && !document.hidden && !reduced.matches) {
      if (!frame) frame = requestAnimationFrame(draw);
      return;
    }
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
    if (reduced.matches) for (const star of stars) star.group.setAttribute('opacity', 0);
  }

  const resize = new ResizeObserver(layout);
  [main, section, mapStage].forEach(element => resize.observe(element));
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) visibleSections.add(entry.target);
      else visibleSections.delete(entry.target);
    }
    visible = visibleSections.size > 0;
    update();
  }, {rootMargin: '180px'});
  observer.observe(section);
  observer.observe(mapStage);
  document.addEventListener('visibilitychange', update);
  reduced.addEventListener('change', update);
  layout();
})();

;
/* experience-base-v21.js */
(()=>{'use strict';const reduce=matchMedia('(prefers-reduced-motion:reduce)'),fine=matchMedia('(hover:hover) and (pointer:fine)');
// Native photo crops and pointer light; scrolling never captures touch gestures.
const photos=[...document.querySelectorAll('.photo-react')];for(const figure of photos){figure.addEventListener('pointermove',e=>{if(!fine.matches||reduce.matches)return;const r=figure.getBoundingClientRect();figure.style.setProperty('--px',(e.clientX-r.left)/r.width*100+'%');figure.style.setProperty('--py',(e.clientY-r.top)/r.height*100+'%')},{passive:true});figure.addEventListener('pointerleave',()=>{figure.style.setProperty('--px','50%');figure.style.setProperty('--py','50%')})}
document.querySelectorAll('.channel-title').forEach(el=>{const original=el.textContent;el.setAttribute('aria-label',original);el.replaceChildren(...[...original].map((char,i)=>{const s=document.createElement('span');s.className='kinetic-char';s.style.setProperty('--i',i);s.textContent=char;s.setAttribute('aria-hidden','true');return s}))});const visual=document.querySelector('.contact-visuals');document.querySelectorAll('[data-social-motion]').forEach(link=>{const activate=()=>{if(visual)visual.dataset.mood=link.dataset.motion};const reset=()=>{if(visual)delete visual.dataset.mood};link.addEventListener('pointerenter',activate);link.addEventListener('focus',activate);link.addEventListener('pointerleave',reset);link.addEventListener('blur',reset)});
if(photos.length&&!reduce.matches){let frame=0;const visible=new Set;new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?visible.add(e.target):visible.delete(e.target)),{rootMargin:'100px'}).observe(photos[0]);const observer=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?visible.add(e.target):visible.delete(e.target)),{rootMargin:'100px'});photos.forEach(p=>observer.observe(p));const update=()=>{frame=0;for(const p of visible){const r=p.getBoundingClientRect();p.style.setProperty('--drift',Math.max(-9,Math.min(9,(innerHeight*.5-r.top-r.height*.5)*.025))+'px')}};addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(update)},{passive:true});update()}

})();

;
/* journey-v22.js */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 700px)');
  const activeWaves = new WeakSet();

  function wave(surface, x = .5, y = .5) {
    if (!surface || reduced.matches || activeWaves.has(surface)) return;
    const { width, height } = surface.getBoundingClientRect();
    if (!width || !height) return;

    const layer = document.createElement('span');
    layer.className = 'water-layer24';
    layer.setAttribute('aria-hidden', 'true');
    const crest = document.createElement('span');
    crest.className = 'water-crest24';
    const radius = Math.hypot(Math.max(x, 1 - x) * width, Math.max(y, 1 - y) * height);
    crest.style.setProperty('--water-diameter', `${radius * 2}px`);
    crest.style.left = `${x * 100}%`;
    crest.style.top = `${y * 100}%`;
    layer.append(crest);
    activeWaves.add(surface);
    surface.dataset.wave = 'active';
    surface.append(layer);

    // Animate a single decorative layer. Keep the section and its content untouched.
    const transform = progress => `translate(-50%, -50%) scale(${progress})`;
    const animation = crest.animate([
      { transform: transform(.015), opacity: 0 },
      { transform: transform(.2), opacity: .7, offset: .19 },
      { transform: transform(.7), opacity: .38, offset: .69 },
      { transform: transform(1.03), opacity: 0 }
    ], { duration: 2600, easing: 'linear' });

    function cleanup() {
      layer.remove();
      surface.removeAttribute('data-wave');
      activeWaves.delete(surface);
      reduced.removeEventListener('change', stopIfReduced);
    }
    function stopIfReduced(event) {
      if (event.matches) animation.cancel();
    }
    animation.finished.then(cleanup, cleanup);
    reduced.addEventListener('change', stopIfReduced);
  }

  document.addEventListener('water-wave22', ({ target, detail }) => wave(target, detail?.x, detail?.y));
  const gateway = document.querySelector('.home-v2 #your-story');
  const viewer = gateway?.querySelector('.card-viewer');
  if (!viewer) return;

  function cardBounds() {
    const model = viewer.querySelector('.card-fallback-model, .card-poster');
    const stage = viewer.getBoundingClientRect();
    if (model) return model.getBoundingClientRect();
    // The 3D renderer may remove the poster once the card loads.
    const height = Math.min(stage.height, mobile.matches ? 327 : 410);
    return {
      left: stage.left,
      width: stage.width,
      top: stage.top + (stage.height - height) / 2,
      height
    };
  }

  let armed = true;
  let frame = 0;
  function checkCardArrival() {
    frame = 0;
    const distance = cardBounds().top + 8 - innerHeight * .59;
    if (distance > 110) armed = true;
    if (distance > 0 || !armed || reduced.matches) return;

    armed = false;
    const card = cardBounds();
    const section = gateway.getBoundingClientRect();
    viewer.classList.remove('card-gold22');
    void viewer.offsetWidth;
    viewer.classList.add('card-gold22');
    wave(gateway,
      (card.left + card.width / 2 - section.left) / section.width,
      (card.top + card.height / 2 - section.top) / section.height);
  }
  function scheduleCardCheck() {
    if (!frame) frame = requestAnimationFrame(checkCardArrival);
  }
  addEventListener('scroll', scheduleCardCheck, { passive: true });
  addEventListener('resize', scheduleCardCheck);
  document.fonts.ready.then(scheduleCardCheck);
  armed = cardBounds().top + 8 > innerHeight * .59;
})();

;
/* full-life-sky.js */
(() => {
  const art = document.querySelector('.life-map-art');
  if (!art) return;
  const sky = art.querySelector('.life-map-sky');
  const narrow = matchMedia('(max-width: 760px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // Separate sky regions for the two compositions. Keep the wheel, title and lake clear.
  const wideZones = [[.03, .28, .05, .66, 25], [.72, .97, .05, .66, 25]];
  const narrowZones = [
    [.05, .46, .035, .15, 8], [.54, .95, .035, .15, 8],
    [.025, .12, .31, .36, 4], [.88, .975, .31, .36, 4],
    [.015, .045, .40, .46, 2], [.955, .985, .40, .46, 2],
    [.025, .14, .66, .71, 3], [.87, .975, .66, .71, 3]
  ];
  let stars = [], width = 0, height = 0, frame = 0, visible = false, previous = 0;
  let pointer = null;
  let elapsed = 0;

  function paint(now) {
    frame = 0;
    const dt = previous ? Math.min(40, now - previous) : 16;
    previous = now;
    if (!reduced.matches) elapsed += dt / 1000;
    for (const star of stars) {
      const phase = star.phase + elapsed * star.speed;
      const x = star.x + Math.sin(phase) * star.drift;
      const y = star.y + Math.cos(phase * .79) * star.drift;
      const dx = pointer ? x - pointer.x : 0;
      const dy = pointer ? y - pointer.y : 0;
      const distance = Math.hypot(dx, dy);
      const push = pointer && distance > 0 ? Math.max(0, 1 - distance / 74) ** 2 * 19 / distance : 0;
      const targetX = Math.max(star.left, Math.min(star.right, x + dx * push));
      const targetY = Math.max(star.top, Math.min(star.bottom, y + dy * push));
      const ease = reduced.matches ? 1 : 1 - Math.exp(-dt / 135);
      star.px += (targetX - star.px) * ease;
      star.py += (targetY - star.py) * ease;
      star.node.setAttribute('cx', star.px.toFixed(2));
      star.node.setAttribute('cy', star.py.toFixed(2));
      star.node.setAttribute('opacity', (.56 + .35 * Math.sin(phase * 2.8)).toFixed(2));
    }
    schedule();
  }

  function schedule() {
    if (visible && !document.hidden && !reduced.matches && !frame) frame = requestAnimationFrame(paint);
  }

  function rebuild() {
    width = art.clientWidth;
    height = art.clientHeight;
    if (!width || !height) return;
    sky.setAttribute('viewBox', `0 0 ${width} ${height}`);
    let seed = 1241;
    const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
    stars = (narrow.matches ? narrowZones : wideZones).flatMap(([l, r, t, b, count]) =>
      Array.from({ length: count * 3 }, () => {
        const left = l * width, right = r * width, top = t * height, bottom = b * height;
        const x = left + (right - left) * (.18 + random() * .64);
        const y = top + (bottom - top) * (.18 + random() * .64);
        const node = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        node.setAttribute('class', random() < .64 ? 'star-blue' : 'star-gold');
        node.setAttribute('r', (.78 + random() * 1.04).toFixed(2));
        return { node, x, y, px: x, py: y, left, right, top, bottom, phase: random() * 6.28,
          drift: Math.min((right - left) * .15, 3 + random() * 6), speed: .15 + random() * .17 };
      }));
    sky.replaceChildren(...stars.map(star => star.node));
    cancelAnimationFrame(frame);
    paint(performance.now());
  }

  art.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || reduced.matches) return;
    const rect = art.getBoundingClientRect();
    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  });
  art.addEventListener('pointerleave', () => { pointer = null; });
  new ResizeObserver(rebuild).observe(art);
  narrow.addEventListener('change', rebuild);
  reduced.addEventListener('change', () => {
    pointer = null;
    rebuild();
  });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    previous = 0;
    schedule();
  }).observe(art);
  const transition = art.closest('.life-gallery').querySelector('.life-map-transition');
  const reveal = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-revealed');
      reveal.unobserve(entry.target);
    }
  }, { threshold: .15 });
  reveal.observe(transition);
  reveal.observe(art);

  document.addEventListener('visibilitychange', () => {
    previous = 0;
    schedule();
  });
})();

;
/* insight-hero-motion.js */
(() => {
  const hero = document.querySelector('.v4-insight-hero');
  if (!hero) return;
  const gem = hero.querySelector('.insight-amethyst');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const compact = matchMedia('(max-width: 760px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const current = { x: 64, y: 48, light: 0, zoom: 1, glow: 0, tilt: 0 };
  const target = { ...current };
  let frame = 0;
  let tapTimer;
  let visible = true;

  function schedule() {
    if (!frame && visible) frame = requestAnimationFrame(render);
  }

  function render() {
    frame = 0;
    let moving = false;
    for (const key of Object.keys(current)) {
      const delta = target[key] - current[key];
      current[key] += reduced.matches || Math.abs(delta) < .001 ? delta : delta * .14;
      moving ||= Math.abs(target[key] - current[key]) >= .001;
    }
    hero.style.setProperty('--insight-x', current.x + '%');
    hero.style.setProperty('--insight-y', current.y + '%');
    hero.style.setProperty('--insight-light', current.light);
    hero.style.setProperty('--insight-angle', (24 + (64 - current.x) * .28 * current.light) + 'deg');
    hero.style.setProperty('--insight-zoom', current.zoom);
    gem.style.setProperty('--gem-tilt', current.tilt + 'deg');
    gem.style.setProperty('--gem-scale', 1 + current.glow * .12);
    gem.style.setProperty('--gem-glow', current.glow * 16 + 'px');
    if (moving) schedule();
  }

  function updateScroll() {
    if (!visible) return;
    const { top, height } = hero.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, -top / (height * .78)));
    target.zoom = reduced.matches ? 1 : 1 + progress * (compact.matches ? .065 : .14);
    if (!fine.matches) {
      target.light = reduced.matches ? 0 : Math.sin(progress * Math.PI) * .46;
      target.x = 58 + progress * 9;
      target.y = 49 + progress * 13;
    }
    schedule();
  }

  function resetPointer() {
    target.light = 0;
    target.glow = 0;
    target.tilt = 0;
    schedule();
  }

  hero.addEventListener('pointermove', event => {
    if (!fine.matches || reduced.matches || event.pointerType === 'touch') return;
    const bounds = hero.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width * 100;
    target.x = Math.min(91, Math.max(48, x));
    target.y = Math.min(82, Math.max(22, (event.clientY - bounds.top) / bounds.height * 100));
    target.light = Math.min(.95, Math.max(0, (x - 38) / 20));
    const stone = gem.getBoundingClientRect();
    const dx = event.clientX - stone.left - stone.width / 2;
    const dy = event.clientY - stone.top - stone.height / 2;
    target.glow = Math.max(0, 1 - Math.hypot(dx, dy) / 150);
    target.tilt = Math.max(-9, Math.min(9, dx * .17)) * target.glow;
    schedule();
  }, { passive: true });
  hero.addEventListener('pointerleave', resetPointer);
  gem.addEventListener('click', () => {
    clearTimeout(tapTimer);
    target.glow = 1;
    target.tilt = reduced.matches ? 0 : 8;
    schedule();
    tapTimer = setTimeout(() => {
      target.glow = 0;
      target.tilt = 0;
      schedule();
    }, 950);
  });
  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });
  fine.addEventListener('change', () => { resetPointer(); updateScroll(); });
  reduced.addEventListener('change', () => { resetPointer(); updateScroll(); });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) updateScroll();
  }).observe(hero);
  updateScroll();
})();

;
/* ambient-motion.js */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const visuals = document.querySelector('.contact-visuals');
  if (visuals) {
    const orbit = 'M 50 4 A 46 96 0 1 1 50 196 A 46 96 0 1 1 50 4';
    for (const [name, duration, count] of [['main', 17, 3], ['inset', 13, 2]]) {
      const lights = Array.from({ length: count }, (_, index) => {
        const delay = -(index + .35) * duration / count;
        return `<g><circle r="2.2" transform="scale(1 .55)"/><animateMotion path="${orbit}" dur="${duration}s" begin="${delay}s" repeatCount="indefinite"/></g>`;
      }).join('');
      for (const layer of ['back', 'front']) {
        visuals.insertAdjacentHTML('beforeend',
          `<svg class="contact-orbit contact-orbit--${name} contact-orbit--${layer}" aria-hidden="true" viewBox="0 0 100 200" preserveAspectRatio="none"><path d="${orbit}"/>${lights}</svg>`);
      }
    }
  }

  const gemColors = {
    'amethyst.webp': '#d6a8ff',
    'rose-quartz.webp': '#ffc5da',
    'clear-quartz.webp': '#b8e6ff',
    'giving-quartz-v25.webp': '#a8e8ff'
  };
  document.querySelectorAll('img[src]').forEach(image => {
    const filename = new URL(image.src).pathname.split('/').pop();
    if (!gemColors[filename] || image.matches('.giving-palm25') || image.closest('.hero-gem')) return;
    image.dataset.siteGem = '';
    image.style.setProperty('--gem-glow', gemColors[filename]);
    const container = image.closest('[aria-hidden="true"]');
    if (container && !image.closest('a, button')) container.removeAttribute('aria-hidden');
    const interactive = !image.closest('a, button');
    if (interactive) {
      image.tabIndex = 0;
      image.setAttribute('role', 'button');
      image.setAttribute('aria-pressed', 'false');
      if (!image.alt) image.setAttribute('aria-label', document.documentElement.lang === 'th' ? 'หินคริสตัล' : 'Crystal');
    }
    function toggle(event) {
      event.preventDefault();
      event.stopPropagation();
      const active = image.classList.toggle('is-gem-lit');
      if (interactive) image.setAttribute('aria-pressed', String(active));
    }
    image.addEventListener('click', toggle);
    if (interactive) image.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') toggle(event);
    });
  });

  const footer = document.querySelector('footer');
  const main = document.querySelector('main');
  if (!footer || !main) return;

  const menu = document.querySelector('.glass-drop.floating-symbol');
  const footerRow = footer.querySelector('.footer-main');
  const footerLogo = footerRow?.querySelector('a');
  const mobile = matchMedia('(max-width: 760px)');
  let docked = false;
  let flight = null;
  if (menu) {
    const label = document.createElement('span');
    label.className = 'footer-menu-label';
    label.setAttribute('aria-hidden', 'true');
    label.textContent = 'MENU';
    menu.append(label);
  }

  function positionDock() {
    const row = footerRow.getBoundingClientRect();
    const logo = footerLogo?.getBoundingClientRect();
    const x = mobile.matches ? row.right - 24 : (row.left + row.right) / 2;
    const y = logo?.height ? logo.top + logo.height / 2 : row.top + 30;
    menu.style.setProperty('--footer-menu-x', `${x}px`);
    menu.style.setProperty('--footer-menu-y', `${y}px`);
  }

  function moveMenu(next) {
    if (!menu || !footerRow || next === docked) return;
    const from = menu.getBoundingClientRect();
    flight?.cancel();
    flight = null;
    const wasOpen = menu.getAttribute('aria-expanded') === 'true';
    if (wasOpen) document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    docked = next;
    if (next) positionDock();
    menu.classList.toggle('is-footer-docked', next);
    const to = menu.getBoundingClientRect();
    if (reduced.matches || wasOpen || !from.width || !to.width || !menu.animate) return;

    const dx = from.left + from.width / 2 - to.left - to.width / 2;
    const dy = from.top + from.height / 2 - to.top - to.height / 2;
    flight = menu.animate(
      [{ translate: `${dx}px ${dy}px` }, { translate: '0px 0px' }],
      { duration: 950, easing: 'cubic-bezier(.25,.7,.25,1)' }
    );
  }

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  const context = canvas.getContext('2d');
  if (!context) return;

  const namespace = 'http://www.w3.org/2000/svg';
  const definitions = document.createElementNS(namespace, 'svg');
  definitions.setAttribute('aria-hidden', 'true');
  definitions.style.cssText = 'position:absolute;width:0;height:0;pointer-events:none';
  document.body.append(definitions);

  const surfaces = [...main.children, footer].map((element, index) => {
    const id = `footer-water-${index}`;
    const filter = document.createElementNS(namespace, 'filter');
    filter.id = id;
    filter.setAttribute('x', '0%');
    filter.setAttribute('y', '0%');
    filter.setAttribute('width', '100%');
    filter.setAttribute('height', '100%');
    filter.setAttribute('color-interpolation-filters', 'sRGB');
    filter.innerHTML = '<feImage width="100%" height="100%" preserveAspectRatio="none" result="field"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="field" scale="27" xChannelSelector="R" yChannelSelector="G"/>';
    definitions.append(filter);
    return { element, id, image: filter.firstElementChild, previous: null };
  });

  function restore(surface) {
    if (surface.previous === null) return;
    surface.element.style.filter = surface.previous;
    surface.previous = null;
  }

  let frame = 0;
  let started = null;
  let atEnd = false;
  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    started = null;
    surfaces.forEach(restore);
  }

  function paint(time) {
    if (started === null) started = time;
    const bottom = footer.getBoundingClientRect().bottom;
    const pageHeight = Math.max(1, bottom + scrollY);
    const duration = Math.max(5200, Math.min(14000, pageHeight * 2.15));
    const progress = (time - started) / duration;
    if (progress >= 1 || document.hidden || reduced.matches) {
      stop();
      return;
    }

    const center = document.documentElement.clientWidth / 2;
    const front = progress * pageHeight;
    const band = Math.max(85, Math.min(150, pageHeight * .06));
    for (const surface of surfaces) {
      const rect = surface.element.getBoundingClientRect();
      const farthest = Math.hypot(Math.max(Math.abs(rect.left - center), Math.abs(rect.right - center)) * .58, bottom - rect.top);
      if (!rect.width || !rect.height || rect.bottom <= 0 || rect.top >= innerHeight ||
          bottom - rect.bottom > front + 2 * band || farthest < front - 2 * band) {
        restore(surface);
        continue;
      }

      canvas.height = Math.max(20, Math.min(160, Math.ceil(rect.height / 22)));
      const field = context.createImageData(canvas.width, canvas.height);
      for (let row = 0; row < canvas.height; row++) {
        const y = rect.top + row / (canvas.height - 1) * rect.height;
        const dy = bottom - y;
        const attenuation = Math.max(0, 1 - dy / pageHeight) ** 2;
        for (let column = 0; column < canvas.width; column++) {
          const dx = (rect.left + column / (canvas.width - 1) * rect.width - center) * .58;
          const distance = Math.hypot(dx, dy);
          const phase = (distance - front) / band;
          const edgeX = Math.min(column, canvas.width - 1 - column) / 5;
          const edgeY = Math.min(row, canvas.height - 1 - row) / 3;
          const edgeFade = Math.min(1, edgeX, edgeY) ** 2;
          const strength = Math.sin(phase * 5) * Math.exp(-phase * phase * 2) * attenuation * edgeFade;
          const offset = (row * canvas.width + column) * 4;
          field.data[offset] = 127.5 + 118 * strength * dx / (distance || 1);
          field.data[offset + 1] = 127.5 - 118 * strength * dy / (distance || 1);
          field.data[offset + 2] = 128;
          field.data[offset + 3] = 255;
        }
      }
      context.putImageData(field, 0, 0);
      surface.image.setAttribute('href', canvas.toDataURL());
      if (surface.previous === null) {
        surface.previous = surface.element.style.filter;
        surface.element.style.filter = `url(#${surface.id})`;
      }
    }
    frame = requestAnimationFrame(paint);
  }

  function checkEnd() {
    const remaining = document.documentElement.scrollHeight - innerHeight - scrollY;
    if (remaining > 24) moveMenu(false);
    if (docked) positionDock();
    if (remaining > 24) atEnd = false;
    if (remaining <= 4 && !atEnd && !document.hidden) {
      atEnd = true;
      moveMenu(true);
      if (reduced.matches) return;
      stop();
      frame = requestAnimationFrame(paint);
    }
  }
  addEventListener('scroll', checkEnd, { passive: true });
  addEventListener('resize', checkEnd);
  window.visualViewport?.addEventListener('resize', checkEnd);
  reduced.addEventListener('change', stop);
  document.addEventListener('visibilitychange', stop);
  checkEnd();
})();

