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
/* contact-shop-v18.js */
(()=>{'use strict';const en=document.documentElement.lang==='en';document.querySelectorAll('[data-kinetic]>span').forEach(el=>{const original=el.textContent;el.setAttribute('aria-label',original);el.replaceChildren(...[...original].map((char,i)=>{const s=document.createElement('span');s.className='kinetic-char';s.style.setProperty('--i',i);s.textContent=char;s.setAttribute('aria-hidden','true');return s}))});
const filters=[...document.querySelectorAll('[data-filter]')],courses=[...document.querySelectorAll('.shop-course')],count=document.querySelector('.course-count');filters.forEach(b=>b.addEventListener('click',()=>{filters.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));let visible=0;courses.forEach(c=>{c.hidden=b.dataset.filter!=='all'&&c.dataset.category!==b.dataset.filter;if(!c.hidden)visible++});count.textContent=en?visible+' courses and experiences':visible+' คอร์สและประสบการณ์'}));
const config=window.THE_NAME_CONFIG||{},urls={instagram:config.instagramUrl,youtube:config.youtubeUrl,line:config.lineUrl},status=document.querySelector('.channel-status');document.querySelectorAll('[data-social]').forEach(button=>{const key=button.dataset.social,url=urls[key];if(url&&/^https:\/\//.test(url)){button.removeAttribute('aria-disabled');button.querySelector('small')?.remove();button.addEventListener('click',()=>window.open(url,'_blank','noopener,noreferrer'))}else button.addEventListener('click',()=>{status.textContent=en?'This contact link will be added soon.':'กำลังเตรียมลิงก์ช่องทางนี้';});});
const copy=document.querySelector('#copy-support'),supportStatus=document.querySelector('#support-status');copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText('8852791067');supportStatus.textContent=en?'Account number copied.':'คัดลอกเลขบัญชีแล้ว'}catch{supportStatus.textContent=en?'SCB account: 885-279106-7':'เลขบัญชี SCB: 885-279106-7'}});
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
/* contact-galaxy.js */
(() => {
  const section = document.querySelector('.contact-lead-v20');
  if (!section) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'contact-galaxy';
  canvas.setAttribute('aria-hidden', 'true');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  section.append(canvas);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const colors = ['#e5f3ff', '#a4d8ee', '#efdcad', '#c3b9dd'];
  const points = Array.from({ length: 420 }, () => ({
    x: Math.random(), y: Math.random(), depth: Math.random(),
    phase: Math.random() * Math.PI * 2,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));

  let width = 0, height = 0, frame = 0, visible = false;
  function paint(time) {
    ctx.clearRect(0, 0, width, height);
    const count = width < 760 ? 240 : points.length;
    for (let index = 0; index < count; index++) {
      const point = points[index];
      const x = point.x * width;
      const y = point.y * height;
      const radius = .35 + point.depth ** 3 * .7;
      const alpha = (.16 + point.depth * .41) *
        (.87 + .13 * Math.sin(time * (.65 + point.depth * .8) + point.phase));
      ctx.fillStyle = point.color;
      ctx.globalAlpha = alpha * .16;
      ctx.beginPath();
      ctx.arc(x, y, radius * 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function tick(time) {
    paint(time / 1000);
    frame = requestAnimationFrame(tick);
  }

  function update() {
    if (visible && !document.hidden && !reduced.matches) {
      if (!frame) frame = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(frame);
      frame = 0;
      if (reduced.matches) paint(0);
    }
  }

  new ResizeObserver(() => {
    width = section.clientWidth;
    height = section.clientHeight;
    const ratio = Math.min(devicePixelRatio || 1, 1.6);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    paint(0);
  }).observe(section);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    update();
  }).observe(section);
  reduced.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
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

;
/* stone-reveal-v25.js */
(() => {
  const pathways = document.querySelector('#pathways');
  if (pathways) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('stone-revealed25');
        observer.unobserve(entry.target);
      }
    }, { threshold: .28 });
    const stages = pathways.querySelectorAll('.stone-stage');
    const sectionObserver = new IntersectionObserver(([entry]) => {
      for (const stage of stages) {
        if (entry.isIntersecting) observer.observe(stage);
        else {
          observer.unobserve(stage);
          stage.classList.remove('stone-revealed25');
        }
      }
    });
    sectionObserver.observe(pathways);
  }

  const support = document.querySelector('#support');
  if (!support) return;
  support.addEventListener('pointerup', event => {
    if (event.pointerType === 'mouse') return;
    support.classList.remove('giving-react25');
    requestAnimationFrame(() => support.classList.add('giving-react25'));
  });
  support.addEventListener('animationend', event => {
    if (event.animationName === 'quartz-heart25') support.classList.remove('giving-react25');
  });
})();

