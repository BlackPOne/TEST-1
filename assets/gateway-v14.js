import * as THREE from './vendor/three/build/three.module.js';
import {GLTFLoader} from './vendor/three/examples/jsm/loaders/GLTFLoader.js';
import {RoomEnvironment} from './vendor/three/examples/jsm/environments/RoomEnvironment.js';
// Match the floating Om hue while leaving cool texture pixels and their lighting alone.
const foilAmount = { value: 0 };
const foilPoint = { value: new THREE.Vector2(.5, .5) };
const foilViewport = { value: new THREE.Vector2(1, 1) };
const foilColor = new THREE.Color('#83d9ff');
function installFoil(material) {
  const textured = Boolean(material.map);
  material.onBeforeCompile = shader => {
    shader.uniforms.cardFoilAmount = foilAmount;
    shader.uniforms.cardFoilPoint = foilPoint;
    shader.uniforms.cardFoilViewport = foilViewport;
    shader.uniforms.cardFoilColor = { value: foilColor };
    shader.fragmentShader = 'uniform float cardFoilAmount; uniform vec3 cardFoilColor; uniform vec2 cardFoilPoint; uniform vec2 cardFoilViewport;\n' + shader.fragmentShader
      .replace('#include <map_fragment>', `#include <map_fragment>
        float warmFoil = ${textured ? 'smoothstep(0.035, 0.17, diffuseColor.r - diffuseColor.b) * smoothstep(0.012, 0.1, diffuseColor.g - diffuseColor.b)' : '1.0'};
        vec2 delta = (gl_FragCoord.xy / cardFoilViewport - cardFoilPoint)
          * cardFoilViewport / min(cardFoilViewport.x, cardFoilViewport.y);
        float spotlight = 1.0 - smoothstep(.027, .16, length(delta));
        float foilMix = warmFoil * cardFoilAmount * spotlight;
        float foilLuma = dot(diffuseColor.rgb, vec3(.2126, .7152, .0722));
        diffuseColor.rgb = mix(diffuseColor.rgb, cardFoilColor * (.45 + .55 * foilLuma), foilMix);`)
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n totalEmissiveRadiance += cardFoilColor * foilMix * .33;');
  };
  material.customProgramCacheKey = () => textured ? 'card-foil-texture' : 'card-foil-solid';
}
const stage=document.querySelector('.card-viewer');if(stage){const section=stage.closest('section'),canvas=stage.querySelector('canvas'),reduce=matchMedia('(prefers-reduced-motion:reduce)');let renderer,scene,camera,model,frame=0,last=0,elapsed=0,visible=false,loaded=false,fallback=false,fallbackModel=null,rx=.03,ry=-.18,tx=.03,ty=-.18,drag=false,prevX=0,prevY=0,flip=false,turned=false,moved=0;let contactUntil=0, hovering=false;
let pointer=null;
const ray=new THREE.Raycaster();
const pointerNdc=new THREE.Vector2();
function hitCard(event){
  const rect=stage.getBoundingClientRect();
  if(!rect.width||!rect.height)return false;
  pointer={x:event.clientX,y:event.clientY};
  const x=(pointer.x-rect.left)/rect.width,y=(pointer.y-rect.top)/rect.height;
  foilPoint.value.set(x,1-y);
  if(fallbackModel){
    const face=fallbackModel.querySelector('.card-fallback-foil');
    const bounds=face.getBoundingClientRect();
    return pointer.x>=bounds.left&&pointer.x<=bounds.right&&pointer.y>=bounds.top&&pointer.y<=bounds.bottom;
  }
  if(!model)return false;
  pointerNdc.set(x*2-1,1-y*2);
  ray.setFromCamera(pointerNdc,camera);
  return ray.intersectObject(model,true).length>0;
}
function updateFoil(dt,time){
  const target=Number(hovering||time<contactUntil);
  foilAmount.value+=(target-foilAmount.value)*(reduce.matches?1:1-Math.exp(-dt*14));
  if(fallbackModel){
    stage.style.setProperty('--foil-amount',foilAmount.value);
    for(const face of fallbackModel.querySelectorAll('.card-fallback-foil')){
      const rect=face.getBoundingClientRect();
      const x=pointer&&rect.width?(pointer.x-rect.left)/rect.width:.5;
      const y=pointer&&rect.height?(pointer.y-rect.top)/rect.height:.5;
      const direction=Math.cos(ry)*(face.classList.contains('card-face-back')?-1:1);
      face.style.setProperty('--foil-x',((direction<0?1-x:x)*100)+'%');
      face.style.setProperty('--foil-y',y*100+'%');
    }
  }
}
function turn(){if(flip)return;turned=!turned;ty+=Math.PI;stage.setAttribute("aria-pressed",String(turned));animate()}function render(ts){frame=0;if(!visible||document.hidden||!loaded)return;const dt=last?Math.min((ts-last)/1000,.05):.016;last=ts;elapsed+=dt;updateFoil(dt,ts);rx+=(tx-rx)*(1-Math.exp(-dt*9));ry+=(ty-ry)*(1-Math.exp(-dt*9));if(fallback){fallbackModel.style.transform=`translate(-50%,calc(-50% + ${reduce.matches?0:Math.sin(elapsed*.7)*8}px)) rotateX(${rx}rad) rotateY(${ry}rad) rotateZ(-.05rad)`}else{model.rotation.set(rx,ry,reduce.matches?-.05:-.05+Math.sin(elapsed*.34)*.014);model.position.y=reduce.matches?0:Math.sin(elapsed*.7)*.028;renderer.render(scene,camera);}if(!reduce.matches||ts<contactUntil||Math.abs(foilAmount.value-Number(hovering))>.002||Math.abs(tx-rx)+Math.abs(ty-ry)>.001)frame=requestAnimationFrame(render)}function animate(){if(!frame&&loaded&&visible&&!document.hidden){last=0;frame=requestAnimationFrame(render)}}function size(){if(!renderer||fallback)return;const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);renderer.getDrawingBufferSize(foilViewport.value);camera.aspect=w/h;camera.updateProjectionMatrix();animate()}async function init(){if(renderer||loaded)return;try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.45;scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(37,1,.01,100);camera.position.set(0,0,3.25);const pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();scene.environment=pmrem.fromScene(room,.04).texture;room.dispose();pmrem.dispose();scene.add(new THREE.HemisphereLight(0xffead2,0x605786,1.4));const key=new THREE.DirectionalLight(0xffedc9,2.1);key.position.set(3,4,5);scene.add(key);const rim=new THREE.DirectionalLight(0xc6c9ff,1.4);rim.position.set(-3,1,2);scene.add(rim);const result=await new GLTFLoader().loadAsync(new URL('./the-name-card-v4.glb',import.meta.url).href);model=result.scene;const materials=new Set();
model.traverse(o=>{
  if(!o.isMesh)return;
  if(!o.geometry.attributes.normal)o.geometry.computeVertexNormals();
  for(const material of [o.material].flat()) materials.add(material);
});
materials.forEach(installFoil);scene.add(model);loaded=true;stage.classList.add('is-ready');size();animate()}catch(error){stage.dataset.fallback='true';fallback=true;loaded=true;fallbackModel=document.createElement('div');fallbackModel.className='card-fallback-model';const front=stage.querySelector('.card-poster');front.className='';const back=front.cloneNode(true);back.alt='';back.src=new URL('./card-back-v4.png',import.meta.url).href;back.className='card-face-back';
fallbackModel.append(front,back);
for(const face of ['front','back']){
  const foil=document.createElement('img');
  foil.className='card-fallback-foil card-face-'+face;
  foil.alt='';
  foil.src=new URL('./card-'+face+'-cyan.webp',import.meta.url).href;
  fallbackModel.append(foil);
}stage.append(fallbackModel);animate();console.warn('Card preview fallback:',error.message)}}new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible){init();animate()}else{cancelAnimationFrame(frame);frame=0;last=0}},{rootMargin:'100px'}).observe(section);new ResizeObserver(size).observe(stage);document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else animate()});addEventListener('scroll',animate,{passive:true});stage.addEventListener('pointerdown',e=>{if(hitCard(e))contactUntil=performance.now()+680;drag=true;moved=0;prevX=e.clientX;prevY=e.clientY;stage.setPointerCapture(e.pointerId)});stage.addEventListener('pointermove',e=>{if(drag){moved+=Math.hypot(e.clientX-prevX,e.clientY-prevY);ty+=(e.clientX-prevX)*.009;tx=Math.max(-.5,Math.min(.5,tx+(e.clientY-prevY)*.006));prevX=e.clientX;prevY=e.clientY}else if(e.pointerType==='mouse'&&!flip&&!turned){const r=stage.getBoundingClientRect();tx=(e.clientY-r.top-r.height/2)/r.height*.16;ty=-.18+(e.clientX-r.left-r.width/2)/r.width*.3}if(e.pointerType==='mouse')hovering=hitCard(e);
animate()});stage.addEventListener('pointerup',()=>{if(drag&&moved<7)turn();drag=false});stage.addEventListener('pointercancel',()=>{drag=false;hovering=false;contactUntil=0;animate()});stage.addEventListener('pointerleave',()=>{hovering=false;animate();if(!drag&&!flip&&!turned){tx=.03;ty=-.18;animate()}});stage.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();turn();return}if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();if(e.key==='ArrowLeft')ty-=.2;if(e.key==='ArrowRight')ty+=.2;if(e.key==='ArrowUp')tx=Math.max(-.5,tx-.12);if(e.key==='ArrowDown')tx=Math.min(.5,tx+.12);animate()});section.querySelector('.card-open').addEventListener('click',e=>{e.preventDefault();if(flip)return;flip=true;e.currentTarget.classList.add('is-opening');ty+=Math.PI;animate();setTimeout(()=>{document.querySelector('#pathways').scrollIntoView({behavior:reduce.matches?'instant':'smooth',block:'start'});flip=false;section.querySelector('.card-open').classList.remove('is-opening')},loaded&&!reduce.matches?850:0)});reduce.addEventListener('change',animate)}
