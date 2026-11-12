/* B·Tech — configure os canais reais aqui. WhatsApp é opcional. */
const BTECH_CONFIG = Object.freeze({
  whatsappNumber: '', // Futuro: 55 + DDD + número, somente dígitos.
  contactEmail: 'btech.inovacao@gmail.com',
  instagramUser: 'btech.start',
  enableAmbientBees: true,
  demoAutoplayMs: 8000,
  enablePreloader: true
});
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = false;
try { motionPaused = localStorage.getItem('btech-motion') === 'paused'; } catch {}
const motionAllowed = () => !reducedMotion.matches && !motionPaused;
const storage = {get(key){try{return sessionStorage.getItem(key)}catch{return null}},set(key,value){try{sessionStorage.setItem(key,value)}catch{}}};
const extras = new Set();
let preparedBrief = '';
let beeDock = null;
const serviceNames = {landing:'Landing page',store:'Loja Nuvemshop',maintenance:'Manutenção e hospedagem',other:'Entender o que meu negócio precisa'};
const processCopy = {
  landing:[['Conversa e briefing','Entendemos seu negócio, seu público e seu objetivo. Definimos o escopo e o valor.'],['Estrutura e conteúdo','Organizamos a página e reunimos seus textos, fotos e logotipo.'],['Design','Você conhece a proposta visual, participa e pede os ajustes combinados.'],['Desenvolvimento','A página ganha vida: responsiva, rápida e com cada detalhe no lugar.'],['Revisão final','Testamos a navegação, os formulários e a experiência em diferentes telas.'],['Publicação e acompanhamento','Seu site no ar, domínio configurado e 30 dias de acompanhamento.']],
  store:[['Conversa e estrutura','Entendemos o negócio, definimos o escopo e organizamos a conta da loja no seu nome.'],['Design da loja','Personalizamos o tema com a sua marca e ajustamos a navegação.'],['Produtos, pagamento e frete','Cadastramos os produtos combinados e configuramos os meios de pagamento e entrega.'],['Revisão e compra de teste','Conferimos catálogo, navegação e uma compra de teste antes do lançamento.'],['Treinamento','Você aprende a cuidar da loja e dos pedidos em um treinamento de 1 hora.'],['Lançamento e acompanhamento','Configuramos o domínio, colocamos a loja no ar e acompanhamos por 30 dias.']]
};
function setupTheme(){
  const button=$('#theme-toggle');
  const sync=()=>{const light=document.documentElement.dataset.theme==='light';button.setAttribute('aria-pressed',String(light));button.setAttribute('aria-label',light?'Ativar tema escuro':'Ativar tema claro');button.title=button.getAttribute('aria-label');$('.theme-label',button).textContent=light?'Claro':'Escuro'};
  button.addEventListener('click',()=>{
    const theme=document.documentElement.dataset.theme==='light'?'dark':'light';
    document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;
    $('meta[name="theme-color"]').content=theme==='light'?'#F7F5F2':'#0E0D0C';
    try{localStorage.setItem('btech-theme',theme)}catch{}
    sync();document.dispatchEvent(new CustomEvent('btech:theme',{detail:{theme}}));
  });
  window.addEventListener('storage',event=>{if(event.key==='btech-theme'){const theme=event.newValue==='light'?'light':'dark';document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;$('meta[name="theme-color"]').content=theme==='light'?'#F7F5F2':'#0E0D0C';sync();document.dispatchEvent(new CustomEvent('btech:theme',{detail:{theme}}))}});
  sync();
}
function setupIntro(){
  const intro=$('#brand-opening'),skip=$('.opening-skip',intro),replay=$('#replay-opening');
  let running=false,closing=false,timer,safety,assembly,previousFocus,previousOverflow,inertStates=[],portal;
  const finish=()=>{
    if(!running)return;
    clearTimeout(timer);clearTimeout(safety);clearTimeout(assembly);portal?.cancel();portal=null;
    intro.hidden=true;intro.classList.remove('play','opening-exit');
    document.body.classList.remove('opening-active');document.body.classList.add('opening-complete');
    document.body.style.overflow=previousOverflow;
    inertStates.forEach(([el,value])=>{el.inert=value});inertStates=[];
    running=false;closing=false;
    if(previousFocus&&previousFocus!==document.body)previousFocus.focus({preventScroll:true});
  };
  const close=(immediate=false)=>{
    if(!running||closing)return;
    clearTimeout(timer);closing=true;
    if(immediate||!motionAllowed()){finish();return}
    intro.classList.add('opening-exit');
    const bee=$('.opening-bee',intro),target=$('.hero-art .hero-bee');
    const from=bee.getBoundingClientRect(),to=target.getBoundingClientRect();
    if(to.top>=0&&to.bottom<innerHeight&&to.width>0){
      const dx=to.left+to.width/2-from.left-from.width/2,dy=to.top+to.height/2-from.top-from.height/2;
      portal=bee.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${dx}px,${dy}px) scale(${to.width/from.width})`,opacity:1}],{duration:850,easing:'cubic-bezier(.65,0,.2,1)',fill:'forwards'});
    }else intro.classList.add('opening-fade');
    timer=setTimeout(finish,880);
  };
  const start=(manual=false)=>{
    if(running)return;
    previousFocus=document.activeElement;previousOverflow=document.body.style.overflow;
    if(manual)window.scrollTo({top:0,behavior:'instant'});
    inertStates=[...document.body.children].filter(el=>el!==intro&& !['SCRIPT','STYLE'].includes(el.tagName)).map(el=>[el,el.inert]);
    inertStates.forEach(([el])=>{el.inert=true});
    running=true;closing=false;intro.dataset.phase='assembling';intro.hidden=false;intro.classList.remove('opening-exit','opening-fade','opening-static');
    document.body.classList.add('opening-active');document.body.style.overflow='hidden';
    void intro.offsetWidth;intro.classList.add('play');
    if(!motionAllowed())intro.classList.add('opening-static');
    skip.focus({preventScroll:true});storage.set('btech-opening-seen','seen');
    assembly=setTimeout(()=>{intro.dataset.phase='assembled'},1400);
    timer=setTimeout(()=>close(),motionAllowed()?2350:450);safety=setTimeout(finish,5000);
  };
  skip.addEventListener('click',()=>close(true));replay.addEventListener('click',()=>start(true));
  document.addEventListener('keydown',event=>{if(!running)return;if(event.key==='Escape'){event.preventDefault();close(true)}if(event.key==='Tab'){event.preventDefault();skip.focus()}});
  reducedMotion.addEventListener('change',()=>{if(running&&!motionAllowed())finish()});
  const force=new URLSearchParams(location.search).get('abertura')==='1';
  if(BTECH_CONFIG.enablePreloader&&(force||(!storage.get('btech-opening-seen')&&!location.hash)))start();
}
function setupMotion(){
  document.body.classList.toggle('motion-paused',motionPaused);
  const btn=$('#motion-toggle');
  const sync=()=>{btn.setAttribute('aria-pressed',String(motionPaused));btn.textContent=reducedMotion.matches?'Movimento reduzido pelo sistema':motionPaused?'Ativar animações':'Pausar animações';btn.disabled=reducedMotion.matches;document.body.classList.toggle('motion-on',motionAllowed());if(!motionAllowed())$$('.reveal').forEach(el=>el.classList.add('visible'));};
  btn.addEventListener('click',()=>{motionPaused=!motionPaused;document.body.classList.toggle('motion-paused',motionPaused);try{localStorage.setItem('btech-motion',motionPaused?'paused':'on')}catch{}sync();scheduleScroll()});
  reducedMotion.addEventListener('change',()=>{sync();scheduleScroll()});sync();
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.08});$$('.reveal').forEach(el=>observer.observe(el));}else{$$('.reveal').forEach(el=>el.classList.add('visible'))}
}
function setupMenu(){
  const btn=$('.menu-toggle'),menu=$('#mobile-menu');
  const setOpen=open=>{btn.setAttribute('aria-expanded',String(open));btn.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');menu.inert=!open;menu.classList.toggle('open',open);document.body.style.overflow=open?'hidden':'';$('#conteudo').inert=open;$('footer').inert=open;$('.header-cta').inert=open;$('.brand').inert=open;if(!open)btn.focus({preventScroll:true})};
  btn.addEventListener('click',()=>setOpen(btn.getAttribute('aria-expanded')!=='true'));
  $$('a',menu).forEach(link=>link.addEventListener('click',()=>setOpen(false)));
  document.addEventListener('keydown',event=>{if(btn.getAttribute('aria-expanded')!=='true')return;if(event.key==='Escape')setOpen(false);if(event.key==='Tab'){const targets=[$('#theme-toggle'),btn,...$$('a',menu)],first=targets[0],last=targets.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}});
  matchMedia('(min-width:901px)').addEventListener('change',event=>{if(event.matches&&menu.classList.contains('open'))setOpen(false)});
}
function setupServices(){
  $$('.service-cta').forEach(link=>link.addEventListener('click',()=>{const field=$('[name=service]');field.value=link.dataset.service;field.dispatchEvent(new Event('change'));}));
}
// Motion always yields immediately to the visitor's pause preference.
const activeMotions=new Set();
function playMotion(element,frames,options={}){
  if(!motionAllowed())return null;
  const animation=element.animate(frames,{duration:650,easing:'cubic-bezier(.22,1,.36,1)',...options});
  activeMotions.add(animation);animation.finished.catch(()=>{}).finally(()=>activeMotions.delete(animation));return animation;
}
let demoMotions=[];
function transitionDemo(type){
  demoMotions.forEach(a=>a?.cancel());demoMotions=[];$$('.morph-ghost').forEach(el=>el.remove());
  const old=$('.demo-page:not([hidden])'),viewport=$('.demo-viewport');
  const oldHeading=$('h3',old).getBoundingClientRect();
  const visual=$('.architecture-art,.product-grid',old),visualRect=visual.getBoundingClientRect();
  const ghost=motionAllowed()?visual.cloneNode(true):null;
  const viewportRect=viewport.getBoundingClientRect();
  $$('.demo-page').forEach(page=>page.hidden=page.id!==`demo-${type}`);
  $$('.solution-copy article').forEach(article=>article.hidden=article.id!==`solution-${type}`);
  $('#mostruario').setAttribute('aria-labelledby',`tab-${type}`);
  $('#servicos').dataset.solution=type;
  $('#demo-address').textContent=type==='store'?'origem.exemplo':'estudio.exemplo';viewport.scrollTop=0;
  $('.phone-brand').innerHTML=type==='store'?'ORIGEM<br><small>OBJETOS COM AFETO</small>':'FORMA<br><small>ESTÚDIO</small>';
  $('.phone-title').innerHTML=type==='store'?'O essencial.<br>Com afeto.':'Seu próximo<br>começo.';
  $('#servicos').dispatchEvent(new Event('btech:layout'));
  document.dispatchEvent(new CustomEvent('btech:service',{detail:{type}}));
  if(!motionAllowed())return;
  if(ghost){
    ghost.classList.add('morph-ghost');ghost.setAttribute('aria-hidden','true');ghost.inert=true;
    Object.assign(ghost.style,{position:'absolute',left:visualRect.left-viewportRect.left+'px',top:visualRect.top-viewportRect.top+'px',width:visualRect.width+'px',height:visualRect.height+'px',margin:'0',zIndex:'4',pointerEvents:'none'});
    viewport.append(ghost);
    const exit=playMotion(ghost,[{opacity:.65,transform:'scale(1)'},{opacity:0,transform:'scale(.88) translateY(-12px)'}],{duration:400});
    exit?.finished.catch(()=>{}).finally(()=>ghost.remove());demoMotions.push(exit);
  }
  const next=$('.demo-page:not([hidden])'),heading=$('h3',next),r=heading.getBoundingClientRect();
  demoMotions.push(playMotion(heading,[{opacity:.2,transform:`translate(${oldHeading.left-r.left}px,${Math.max(-35,Math.min(35,oldHeading.top-r.top))}px)`},{opacity:1,transform:'translate(0,0)'}]));
  const tiles=type==='store'?$$('.product',next):[$('.architecture-art',next)];
  tiles.forEach((tile,index)=>{const bounds=tile.getBoundingClientRect();const dx=Math.max(-75,Math.min(75,visualRect.left+visualRect.width/2-bounds.left-bounds.width/2));demoMotions.push(playMotion(tile,[{opacity:0,transform:`translate(${dx}px,28px) scale(.88)`},{opacity:1,transform:'translate(0,0) scale(1)'}],{delay:80+index*85,fill:'backwards'}))});
  demoMotions.push(playMotion($(`#solution-${type}`),[{opacity:0,transform:'translateY(15px)'},{opacity:1,transform:'none'}],{delay:80,fill:'backwards'}));
  playMotion($('.phone-art'),[{opacity:.4,transform:'translateY(9px) scale(.96)'},{opacity:1,transform:'none'}]);
}
function wireTabs(container,selector,callback){
  const buttons=$$(selector,container);
  const activate=(button,source='manual')=>{buttons.forEach(btn=>{const active=btn===button;btn.setAttribute('aria-selected',String(active));btn.tabIndex=active?0:-1});callback(button,{source})};
  buttons.forEach((button,index)=>{button.addEventListener('click',()=>activate(button));button.addEventListener('keydown',event=>{let target;if(event.key==='ArrowRight')target=buttons[(index+1)%buttons.length];if(event.key==='ArrowLeft')target=buttons[(index+buttons.length-1)%buttons.length];if(event.key==='Home')target=buttons[0];if(event.key==='End')target=buttons.at(-1);if(target){event.preventDefault();activate(target);target.focus()}})});
  return {buttons,activate};
}
function setupDemos(){
  const viewport=$('.demo-viewport');
  const demoTabs=wireTabs($('#servicos'), '[data-demo]', (button,{source})=>{
    if($('.demo-page:not([hidden])').id!==`demo-${button.dataset.demo}`)transitionDemo(button.dataset.demo);
    // Watching an automatic example is not a statement of purchase intent.
    if(source==='manual'){
      const field=$('[name=service]');field.value=button.dataset.demo;
      selectProcess(button.dataset.demo);
    }
    scheduleScroll();
  });
  setupDemoPlayback(demoTabs);
  $('.demo-nav a').addEventListener('click',event=>{event.preventDefault();viewport.scrollTo({top:$('#demo-projects').offsetTop-$('.demo-page').offsetTop,behavior:motionAllowed()?'smooth':'instant'})});
  $('.demo-action').addEventListener('click',()=>{$('.demo-feedback').textContent='Sua próxima conversa pode começar assim. Gostou? Fale com a B·Tech no formulário abaixo.';viewport.scrollTo({top:viewport.scrollHeight,behavior:motionAllowed()?'smooth':'instant'})});
  const cart=new Map();
  const updateCart=()=>{const count=[...cart.values()].reduce((a,b)=>a+b,0);$('#cart-count').textContent=String(count);$('.cart-feedback').textContent=count?[...cart].map(([name,n])=>`${name} × ${n}`).join(' · ')+'. Sacola demonstrativa, sem compra real.':'Sua sacola de exemplo está vazia.'};
  $$('.product').forEach(button=>button.addEventListener('click',()=>{cart.set(button.dataset.product,(cart.get(button.dataset.product)||0)+1);updateCart();playMotion(button,[{transform:'translateY(-4px)'},{transform:'translateY(0)'}],{duration:400})}));
  $('.cart-reset').addEventListener('click',()=>{cart.clear();updateCart()});
  $('.cart-label').addEventListener('click',()=>{updateCart();viewport.scrollTo({top:viewport.scrollHeight,behavior:motionAllowed()?'smooth':'instant'})});
  // Automatic demonstration yields permanently to a visitor's wheel, touch or key.
  let interacted=false;['wheel','touchstart','pointerdown','keydown'].forEach(name=>viewport.addEventListener(name,()=>interacted=true,{passive:true}));
  const obs=new IntersectionObserver(entries=>{if(entries[0].isIntersecting&&!interacted&&motionAllowed()&&innerWidth>640)viewport.scrollTo({top:80,behavior:'smooth'})},{threshold:.65});obs.observe(viewport);
}
function setupDemoPlayback(tabs){
  const section=$('#servicos'),stage=$('.solution-stage'),control=$('#demo-playback-toggle');
  const bar=$('.demo-countdown span'),status=$('#demo-playback-status');
  const duration=Math.max(6000,Number(BTECH_CONFIG.demoAutoplayMs)||8000);
  let visible=false,pausedByUser=false,hovering=false,elapsed=0,startedAt=0,timer=0,progressAnimation=null;
  const canPlay=()=>visible&&!pausedByUser&&!hovering&&!document.hidden&&!$('#conteudo').inert&&!$('dialog[open]')&&motionAllowed();
  const stopTimer=()=>{
    if(timer){elapsed=Math.min(duration,elapsed+performance.now()-startedAt);clearTimeout(timer);timer=0}
    progressAnimation?.cancel();progressAnimation=null;bar.style.transform=`scaleX(${elapsed/duration})`;
  };
  function sync(){
    stopTimer();
    const allowed=motionAllowed();control.disabled=!allowed;
    const playing=canPlay();
    section.dataset.autoplay=!allowed?'reduced':pausedByUser||hovering?'paused':playing?'playing':'waiting';
    const current=tabs.buttons.find(button=>button.getAttribute('aria-selected')==='true');
    $('.demo-next').textContent=`A seguir: ${current.dataset.demo==='landing'?'Loja virtual':'Landing page'}`;
    status.textContent=!allowed?'Troca manual':pausedByUser||hovering?'Prévia pausada':'Prévia automática';
    $('.playback-label',control).textContent=!allowed?'Manual':pausedByUser?'Retomar':'Pausar';
    $('.playback-symbol',control).textContent=!allowed?'↔':pausedByUser?'▷':'Ⅱ';
    control.setAttribute('aria-label',!allowed?'Alternância automática desativada pela preferência de movimento':pausedByUser?'Retomar alternância automática':'Pausar alternância automática');
    if(!playing)return;
    startedAt=performance.now();
    const remaining=Math.max(1,duration-elapsed);
    progressAnimation=bar.animate([{transform:`scaleX(${elapsed/duration})`},{transform:'scaleX(1)'}],{duration:remaining,easing:'linear',fill:'forwards'});
    timer=setTimeout(()=>{
      if(!canPlay()){sync();return}
      stopTimer();elapsed=0;
      const next=tabs.buttons.find(button=>button.getAttribute('aria-selected')!=='true');
      tabs.activate(next,'auto');sync();
    },remaining);
  }
  const takeControl=event=>{
    if(control.contains(event.target))return;
    stopTimer();elapsed=0;pausedByUser=true;sync();
  };
  // Manual selection, exploration and keyboard focus always win over playback.
  section.addEventListener('pointerdown',takeControl);
  section.addEventListener('focusin',takeControl);
  $('.demo-viewport').addEventListener('wheel',takeControl,{passive:true});
  section.addEventListener('touchstart',takeControl,{passive:true});
  if(matchMedia('(hover:hover) and (pointer:fine)').matches){
    stage.addEventListener('pointerenter',()=>{hovering=true;sync()});
    stage.addEventListener('pointerleave',()=>{hovering=false;sync()});
  }
  control.addEventListener('click',()=>{pausedByUser=!pausedByUser;elapsed=0;sync()});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting&&entries[0].intersectionRatio>=.4;sync()},{threshold:[0,.4]}).observe(stage);
  new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
  const overlays=new MutationObserver(sync);
  overlays.observe($('#conteudo'),{attributes:true,attributeFilter:['inert']});
  overlays.observe($('#privacy-dialog'),{attributes:true,attributeFilter:['open']});
  document.addEventListener('visibilitychange',sync);reducedMotion.addEventListener('change',sync);
  document.addEventListener('btech:service',sync);
  sync();
}
function renderProcess(type){
  const timeline=$('#process-steps');
  timeline.replaceChildren(...processCopy[type].map(([title,text],index)=>{
    const step=document.createElement('article');step.className='step'+(index===0?' active':'');
    const number=document.createElement('span');number.className='step-number';number.textContent=String(index+1).padStart(2,'0');
    const body=document.createElement('div'),h=document.createElement('h3'),button=document.createElement('button'),p=document.createElement('p');
    button.type='button';button.className='step-heading';button.textContent=title;
    button.setAttribute('aria-expanded',String(index===0));button.setAttribute('aria-controls',`step-${type}-${index}`);
    p.id=`step-${type}-${index}`;p.textContent=text;p.hidden=index!==0;
    button.addEventListener('click',()=>{
      const opening=button.getAttribute('aria-expanded')!=='true';
      $$('.step',timeline).forEach(other=>{other.classList.remove('active');$('.step-heading',other).setAttribute('aria-expanded','false');$('p',other).hidden=true});
      if(opening){step.classList.add('active');button.setAttribute('aria-expanded','true');p.hidden=false;playMotion(p,[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:450});updateBuild(index,type)}
      scheduleScroll();
    });
    h.append(button);body.append(h,p);step.append(number,body);return step;
  }));
  timeline.setAttribute('aria-labelledby',`process-${type}`);updateBuild(0,type);
}
function updateBuild(index,type){
  const preview=$('.build-preview');preview.dataset.build=String(index);preview.dataset.kind=type;
  const labels=type==='store'?['Uma conversa. A sua futura loja.','A identidade da sua marca.','Produtos, pagamento e frete.','Tudo testado antes de vender.','Você no controle da loja.','Sua loja, pronta para receber pedidos.']:['Uma conversa. Um ponto de partida.','A estrutura encontra seu lugar.','Sua identidade ganha forma.','Cada detalhe ganha vida.','Testado em diferentes telas.','Seu site, aberto para novos clientes.'];
  $('.build-caption').textContent=labels[index];$('.build-address').textContent=index===5?'seu-negocio.exemplo':'sua-ideia.exemplo';
  playMotion($('.build-caption'),[{opacity:0,transform:'translateY(5px)'},{opacity:1,transform:'none'}],{duration:400});
  $('#processo').dispatchEvent(new CustomEvent('btech:build',{detail:{index,type}}));
}
function selectProcess(type){$$('[data-process]').forEach(btn=>{const active=btn.dataset.process===type;btn.setAttribute('aria-selected',String(active));btn.tabIndex=active?0:-1});renderProcess(type)}
function setupProcess(){renderProcess('landing');wireTabs($('#processo'), '[data-process]',button=>{renderProcess(button.dataset.process);scheduleScroll()})}
function setupExtras(){
  $$('.extra input').forEach(input=>input.addEventListener('change',()=>{input.checked?extras.add(input.value):extras.delete(input.value);$('#extras-summary').textContent=extras.size?[...extras].join(' · '):'Marque os adicionais de interesse.';$('#extras-count').textContent=extras.size?`(${extras.size})`:'';playMotion(input.closest('.extra'),[{transform:'translateX(3px)'},{transform:'none'}],{duration:300});$('#form-extras').textContent=extras.size?`Adicionais para a conversa: ${[...extras].join(', ')}.`:''}));
}
function buildBrief(){
  const form=$('#contact-form'),data=new FormData(form);
  return `Olá, B·Tech!\n\nMeu nome é ${data.get('name').trim()}.\nMeu negócio: ${data.get('business').trim()||'Prefiro contar na conversa'}.\nInteresse: ${serviceNames[data.get('service')]}.\nE-mail: ${data.get('email').trim()}\nWhatsApp: ${data.get('phone').trim()||'Não informado'}\n\nAdicionais: ${[...extras].join(', ')||'A definir na conversa'}.\n\n${data.get('message').trim()||'Gostaria de receber uma proposta personalizada.'}\n\nPodemos marcar uma conversa rápida essa semana?`;
}
function setupContact(){
  const form=$('#contact-form'),status=$('#form-status');
  form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity()||form.elements.website.value)return;if(!form.elements.name.value.trim()){status.textContent='Conte seu nome para preparar a conversa.';form.elements.name.focus();return}preparedBrief=buildBrief();$('#prepared-actions').hidden=false;
    if(BTECH_CONFIG.whatsappNumber){const url=`https://wa.me/${BTECH_CONFIG.whatsappNumber}?text=${encodeURIComponent(preparedBrief)}`;window.open(url,'_blank','noopener,noreferrer');status.textContent='Seu pedido está preparado no WhatsApp. Revise a mensagem e envie para começar a conversa.'}
    else{const link=document.createElement('a');link.href=`mailto:${BTECH_CONFIG.contactEmail}?subject=${encodeURIComponent('Vamos conversar sobre meu projeto — B·Tech')}&body=${encodeURIComponent(preparedBrief)}`;link.click();status.textContent='Pedido preparado. Revise e envie no seu aplicativo de e-mail. Se ele não abrir, copie ou baixe seu pedido e envie para '+BTECH_CONFIG.contactEmail+'.'}
  });
  $('#copy-brief').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(preparedBrief);status.textContent='Pedido copiado. Envie para '+BTECH_CONFIG.contactEmail+'.'}catch{status.textContent='Seu navegador não permitiu copiar. Use “Baixar pedido em texto”.'}});
  $('#download-brief').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([preparedBrief],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='meu-projeto-btech.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
  if(BTECH_CONFIG.whatsappNumber){$('.submit-button').innerHTML='Preparar conversa no WhatsApp <span aria-hidden="true">↗</span>';$('.form-hint').textContent='O WhatsApp abre com sua mensagem. Você revisa e envia.';$('.floating-contact').href=`https://wa.me/${BTECH_CONFIG.whatsappNumber}?text=${encodeURIComponent('Olá, B·Tech! Quero conversar sobre um projeto.')}`;$('.floating-contact').target='_blank';$('.floating-contact').rel='noopener noreferrer'}
  // A prepared message is never reported as sent; fields are kept for review.
}
function setupPrivacy(){const dialog=$('#privacy-dialog');$$('.privacy-open').forEach(btn=>btn.addEventListener('click',()=>dialog.showModal()));$('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close()}})}
let scrollPending=false;
function scheduleScroll(){if(scrollPending)return;scrollPending=true;requestAnimationFrame(updateScroll)}
function updateScroll(){
  scrollPending=false;$('#header').classList.toggle('scrolled',scrollY>40);
  const contact=$('#contato').getBoundingClientRect(),hero=$('.hero').getBoundingClientRect();$('.floating-contact').classList.toggle('visible',hero.bottom<0&&contact.top>innerHeight*.6);
  const timeline=$('.timeline'),r=timeline.getBoundingClientRect(),progress=Math.min(1,Math.max(0,(innerHeight*.65-r.top)/r.height));timeline.style.setProperty('--progress',motionAllowed()?progress:1);$$('.step',timeline).forEach(step=>step.classList.toggle('seen',!motionAllowed()||step.getBoundingClientRect().top<innerHeight*.75));

  updateVisualMotion();
  updateBeeDock();
}
let visualScenes=[];
function setupVisualMotion(){
  visualScenes=[$('.motion-bridge'),$('.devices'),$('.brand-moment')];
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('scene-active',entry.isIntersecting)),{rootMargin:'60px'});
  [$('#servicos'),$('#manutencao'),...visualScenes].forEach(el=>observer.observe(el));
  // Native disclosure keeps details keyboard-accessible and optional.
  $$('details:not(.faq-list details)').forEach(details=>details.addEventListener('toggle',()=>{
    if(details.open&&motionAllowed()){const content=details.querySelector(':scope > div, :scope > ul, :scope > label');content?.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:'cubic-bezier(.22,1,.36,1)'})}
    scheduleScroll();
  }));
}
function updateVisualMotion(){
  for(const scene of visualScenes){
    if(!motionAllowed()){scene.style.setProperty('--scene-progress','.5');scene.style.setProperty('--scene-shift','0px');scene.style.setProperty('--scene-tilt','0deg');continue}
    const r=scene.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)continue;
    const p=Math.min(1,Math.max(0,(innerHeight-r.top)/(innerHeight+r.height)));
    scene.style.setProperty('--scene-progress',p);
    const shift=scene.classList.contains('motion-bridge')?(p-.5)*(innerWidth<641?-130:-340):(p-.5)*(innerWidth<641?-12:-35);
    scene.style.setProperty('--scene-shift',shift+'px');scene.style.setProperty('--scene-tilt',((.5-p)*(innerWidth<641?0:3))+'deg');
  }
}
// A scroll-driven journey from the hero to the header. Geometry is measured only
// on resize; each scroll frame writes transforms and opacity, never layout.
function setupBeeDock(){
  const clone=$('.hero-bee').cloneNode(true);clone.classList.add('bee-dock');
  clone.setAttribute('aria-hidden','true');clone.querySelector('.bee-trace')?.remove();
  document.body.append(clone);
  const measure=()=>{const r=$('.bee-flight').getBoundingClientRect(),target=$('.brand img').getBoundingClientRect();beeDock={clone,x:r.left+r.width/2,y:r.top+scrollY+r.height/2,width:r.width,tx:target.left+target.width/2,ty:38,end:Math.max(320,$('.hero').offsetHeight*.72)};clone.style.width=r.width+'px';scheduleScroll()};
  measure();document.fonts.ready.then(measure);window.addEventListener('resize',measure,{passive:true});
}
function updateBeeDock(){
  if(!beeDock)return;
  const {clone,x,y,width,tx,ty,end}=beeDock,p=Math.min(1,Math.max(0,scrollY/end));
  const active=motionAllowed()&&innerWidth>640&&p>0&&p<1;
  clone.style.visibility=active?'visible':'hidden';
  $('.bee-flight').style.opacity=active?'0':'1';
  $('.brand img').style.opacity=active?String(Math.max(0,(p-.82)/.18)):'1';
  if(!active)return;
  const ease=p*p*(3-2*p),scale=1+(64/width-1)*ease;
  clone.style.transform=`translate3d(${x+(tx-x)*ease}px,${(y-scrollY)*(1-ease)+ty*ease}px,0) translate(-50%,-50%) scale(${scale})`;
}
function setupPointer(){
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  const dot=document.createElement('div');dot.className='cursor-dot';dot.setAttribute('aria-hidden','true');document.body.append(dot);
  document.addEventListener('pointermove',event=>{if(!motionAllowed()){dot.style.opacity=0;return}dot.style.opacity=1;dot.style.transform=`translate3d(${event.clientX}px,${event.clientY}px,0) translate(-50%,-50%)`;dot.classList.toggle('hover',!!event.target.closest('a,button,summary,.extra'));},{passive:true});document.documentElement.addEventListener('pointerleave',()=>dot.style.opacity=0);
  const hero=$('.hero'),bee=$('.bee-parallax');hero.addEventListener('pointermove',event=>{if(!motionAllowed())return;const r=hero.getBoundingClientRect(),x=(event.clientX/r.width-.5)*16,y=((event.clientY-r.top)/r.height-.5)*12;bee.style.transform=`translate3d(${x}px,${y}px,0)`},{passive:true});hero.addEventListener('pointerleave',()=>bee.style.transform='');
  $$('.magnetic').forEach(button=>{button.addEventListener('pointermove',event=>{if(!motionAllowed())return;const r=button.getBoundingClientRect();button.style.transform=`translate(${(event.clientX-r.left-r.width/2)*.12}px,${(event.clientY-r.top-r.height/2)*.16}px)`});button.addEventListener('pointerleave',()=>button.style.transform='')});
}
function setupChoreography(){
  $$('.section-heading').forEach(heading=>{heading.style.setProperty('--reveal-delay','0ms')});
  $('.solution-copy').style.setProperty('--reveal-delay','90ms');$('.solution-stage').style.setProperty('--reveal-delay','190ms');
  let pressed=null;
  const release=()=>{pressed?.classList.remove('is-pressed');pressed=null};
  document.addEventListener('pointerdown',event=>{release();pressed=event.target.closest('.button,.tablist button,.step-heading,.extra');pressed?.classList.add('is-pressed')});
  ['pointerup','pointercancel','focusout'].forEach(name=>document.addEventListener(name,release));
  document.documentElement.addEventListener('pointerleave',release);
  new MutationObserver(()=>{if(!motionAllowed()){activeMotions.forEach(a=>a.cancel());$$('.morph-ghost').forEach(el=>el.remove())}}).observe(document.body,{attributes:true,attributeFilter:['class']});
}
function setupFaq(){$$('.faq-list details').forEach(item=>item.addEventListener('toggle',()=>{if(item.open)$$('.faq-list details').forEach(other=>{if(other!==item)other.open=false})}))}
setupTheme();setupIntro();setupMotion();setupMenu();setupServices();setupDemos();setupProcess();setupExtras();setupContact();setupPrivacy();setupPointer();setupFaq();setupBeeDock();setupVisualMotion();setupChoreography();
$('#year').textContent=new Date().getFullYear();
window.addEventListener('scroll',scheduleScroll,{passive:true});window.addEventListener('resize',scheduleScroll,{passive:true});scheduleScroll();
// Highlight navigation without measuring every section in every scroll frame.
const navObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){$$('.desktop-nav a').forEach(a=>a.classList.toggle('current',a.hash===`#${entry.target.id}`))}})},{rootMargin:'-20% 0px -55% 0px'});$$('main>section[id]').forEach(section=>navObserver.observe(section));
