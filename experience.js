/* B·Tech — a shared visual language for flight, construction and connection.
   All ornament is native SVG/CSS. Navigation remains native and unobstructed. */
(() => {
  const namespace = 'http://www.w3.org/2000/svg';
  const chapters = [...document.querySelectorAll('main > section[id]')];
  const routes = [];
  let frame = 0;
  const d = [
    'M1120 -100C1410 150 710 180 910 450S1540 670 1210 1020',
    'M1200 -100C710 130 1490 280 1150 500S630 690 1210 1020',
    'M1210 -100C1530 150 720 240 1140 480S1540 830 1210 1020'
  ];
  const make = (tag, attributes) => {
    const element = document.createElementNS(namespace, tag);
    for (const [name,value] of Object.entries(attributes)) element.setAttribute(name,value);
    return element;
  };
  for (const [index, chapter] of chapters.entries()) {
    chapter.classList.add('story-scene');
    const field = make('svg', {class:'route-field', viewBox:'0 0 1440 900', preserveAspectRatio:'xMidYMid slice', 'aria-hidden':'true', focusable:'false'});
    const contours = make('g', {class:'route-contours', fill:'none'});
    const base = d[index % d.length];
    for (const offset of [-660,-250,180,590]) {
      const group = make('g', {transform:`translate(${offset} 0)`});
      group.append(make('path',{d:base}));
      contours.append(group);
    }
    // Circuit-like turns are part of the same flight paths, not a separate grid.
    contours.append(make('path',{d:'M-80 680C120 360 280 720 420 590S540 210 330 140 80 170 130 260 340 250 430 280L470 320L570 320'}));
    const route = make('path',{class:'route-main', d:base, fill:'none', pathLength:'1'});
    const signal = make('path',{class:'route-signal', d:base, fill:'none', pathLength:'1'});
    field.append(contours,route,signal);
    chapter.prepend(field);
    const wash = document.createElement('div');wash.className='chapter-wash';wash.setAttribute('aria-hidden','true');chapter.prepend(wash);
    routes.push({chapter,signal});
  }

  // Reveal complete lines, without duplicating text for assistive technology.
  for (const heading of document.querySelectorAll('#servicos h2,#processo h2,#manutencao h2,#contato h2')) {
    const groups = [[]];
    for (const child of [...heading.childNodes]) child.nodeName==='BR' ? groups.push([]) : groups.at(-1).push(child);
    heading.replaceChildren();
    groups.forEach((nodes,index)=>{
      if(!nodes.length)return;
      const mask=document.createElement('span'),line=document.createElement('span');
      mask.className='type-mask';line.className='type-line';line.style.setProperty('--line-delay',index*85+'ms');
      line.append(...nodes);mask.append(line);heading.append(mask);
    });
  }

  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries){
      entry.target.classList.toggle('story-in-view',entry.isIntersecting);
      if(entry.isIntersecting)entry.target.classList.add('story-entered');
    }
    schedule();
  },{rootMargin:'0px 0px -6% 0px',threshold:0});
  chapters.forEach(chapter=>observer.observe(chapter));

  function draw(){
    frame=0;
    for(const {chapter,signal} of routes){
      const rect=chapter.getBoundingClientRect();
      if(rect.bottom<0||rect.top>innerHeight)continue;
      const progress=motionAllowed()?Math.max(0,Math.min(1,(innerHeight-rect.top)/(innerHeight+rect.height))):.5;
      chapter.style.setProperty('--chapter-progress',progress);
      chapter.style.setProperty('--chapter-shift',motionAllowed()?(progress-.5)*38+'px':'0px');
      chapter.style.setProperty('--chapter-wash',motionAllowed()?Math.min(1,progress*2.2):1);
      signal.style.strokeDashoffset=String(-progress*.9);
    }
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(draw)}
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});
  reducedMotion.addEventListener('change',schedule);
  new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['class']});
  document.addEventListener('btech:theme',schedule);

  const stage=document.querySelector('.solution-stage');
  const setMode=type=>{
    document.querySelector('.stage-mode').textContent=type==='store'?'LOJA PARA VENDER':'PÁGINA PARA CONECTAR';
    stage.dataset.composition=type;
    schedule();
  };
  document.addEventListener('btech:service',event=>setMode(event.detail.type));
  setMode(document.querySelector('#demo-store').hidden?'landing':'store');
  if(matchMedia('(hover:hover) and (pointer:fine)').matches){
    stage.addEventListener('pointermove',event=>{
      if(!motionAllowed())return;
      const rect=stage.getBoundingClientRect();
      stage.style.setProperty('--stage-x',(event.clientX-rect.left-rect.width/2)*.012+'px');
      stage.style.setProperty('--stage-angle',((event.clientY-rect.top)/rect.height-.5)*.7+'deg');
    },{passive:true});
    stage.addEventListener('pointerleave',()=>{stage.style.setProperty('--stage-x','0px');stage.style.setProperty('--stage-angle','0deg')});
  }
  // Touch works without hover; keyboard users get exactly the same controls.
  stage.addEventListener('focusin',()=>stage.classList.add('stage-engaged'));
  stage.addEventListener('focusout',event=>{if(!stage.contains(event.relatedTarget))stage.classList.remove('stage-engaged')});
  document.querySelector('#processo').addEventListener('btech:build',event=>{
    const process=document.querySelector('#processo');process.dataset.buildStage=String(event.detail.index);schedule();
  });
  document.fonts.ready.then(schedule);
  schedule();
})();
