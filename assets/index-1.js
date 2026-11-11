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

