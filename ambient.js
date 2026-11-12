/* Procedural bees: articulated wings, banded abdomen and tangent-led flight.
   One shared animation loop runs only for visible sections with motion enabled. */
(() => {
  if (!BTECH_CONFIG.enableAmbientBees) return;
  const mobile = matchMedia('(max-width:640px)');
  const scenes = [];
  let frame = 0;
  let previous = 0;
  let elapsed = 0;
  let lightTheme = document.documentElement.dataset.theme === 'light';

  const protectedContent = 'h1,h2,h3,p,.eyebrow,.button,.service-heading,.service-preview,.service-includes,.tablist,form,.brand-values,.contact-links,.art-caption,.hero-topline,.hero-bottom,.hero-art,.extras-disclosure,.solution-copy,.solution-stage,.build-preview';
  const measure = scene => {
    const bounds = scene.element.getBoundingClientRect();
    scene.width = bounds.width;
    scene.height = bounds.height;
    const ratio = Math.min(devicePixelRatio || 1, mobile.matches ? 1 : 1.5);
    scene.canvas.width = Math.round(bounds.width * ratio);
    scene.canvas.height = Math.round(bounds.height * ratio);
    scene.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    // Keep text, buttons, forms and the main bee entirely free of particles.
    scene.exclusions = [...scene.element.querySelectorAll(protectedContent)]
      .filter(el => el.getClientRects().length)
      .map(el => {
        const rect = el.getBoundingClientRect();
        return {x: rect.left - bounds.left - 14, y: rect.top - bounds.top - 12,
          width: rect.width + 28, height: rect.height + 24};
      });
  };

  // Broad, shallow arcs follow the free space above and below the composition.
  function point(scene, progress, lane) {
    const direction = lane % 2 === 0 ? 1 : -1;
    const x = (direction === 1 ? progress : 1 - progress) * (scene.width + 200) - 100;
    const upper = scene.element.id === 'inicio' ? (mobile.matches ? 142 : 160) : scene.height * .075;
    const wave = Math.sin(progress * Math.PI * 2 + scene.seed) * Math.min(28, scene.height * .035);
    const wander = Math.sin(progress * Math.PI * 18 + scene.seed + lane) * 8
      + Math.sin(progress * Math.PI * 31 + lane) * 3;
    return {x, y: (lane % 2 === 0 ? upper : scene.height * .925) + wave + wander};
  }

  // The insect is drawn anew each frame. This is deliberately independent of
  // the brand symbol: four translucent wings, six legs, antennae and body bands.
  function drawBee(ctx, time, phase, size) {
    ctx.scale(size / 42, size / 42);
    ctx.lineCap = 'round';
    // Legs trail behind the thorax, gently flexing during flight.
    ctx.strokeStyle = '#E8AE15'; ctx.lineWidth = .65;
    for (const side of [-1, 1]) {
      for (let leg = 0; leg < 3; leg++) {
        const flex = Math.sin(time * .008 + leg + phase) * .8;
        ctx.beginPath();ctx.moveTo(3 - leg * 3, side * 3);
        ctx.quadraticCurveTo(-1 - leg * 3, side * (6 + flex), -3 - leg * 3, side * (8 + flex));ctx.stroke();
      }
    }
    const beat = time * .057 + phase;
    for (const side of [-1, 1]) {
      const flap = .25 + .75 * Math.abs(Math.sin(beat + (side === 1 ? .17 : 0)));
      ctx.save();ctx.translate(1, side * 2);ctx.scale(1, side * flap);
      // Hind wing: shorter and slightly offset from the forewing.
      ctx.fillStyle = lightTheme ? 'rgba(110,106,99,.15)' : 'rgba(247,245,242,.18)';
      ctx.beginPath();ctx.ellipse(-7, -5.5, 7, 3.3, -.25, 0, Math.PI * 2);ctx.fill();
      ctx.fillStyle = lightTheme ? 'rgba(110,106,99,.24)' : 'rgba(247,245,242,.44)';
      ctx.strokeStyle = lightTheme ? 'rgba(14,13,12,.4)' : 'rgba(247,245,242,.48)';ctx.lineWidth = .45;
      ctx.beginPath();ctx.ellipse(-3.5, -8.5, 10, 4.3, -.72, 0, Math.PI * 2);ctx.fill();ctx.stroke();
      // Fine wing veins stay subtle at the background scale.
      ctx.strokeStyle = 'rgba(110,106,99,.65)';ctx.lineWidth = .4;
      ctx.beginPath();ctx.moveTo(0, 0);ctx.quadraticCurveTo(-7, -6, -10, -12);
      ctx.moveTo(-4, -5);ctx.lineTo(-1, -11);ctx.stroke();ctx.restore();
    }
    // Abdomen and its dark bands follow a tapered, organic silhouette.
    ctx.save();ctx.beginPath();ctx.ellipse(-6, 0, 9.5, 5.8, 0, 0, Math.PI * 2);ctx.clip();
    ctx.fillStyle = '#E8AE15';ctx.fillRect(-17, -7, 22, 14);
    ctx.fillStyle = '#0E0D0C';
    for (const stripe of [-12, -6, 0]) {
      ctx.beginPath();ctx.moveTo(stripe - 1, -7);ctx.quadraticCurveTo(stripe + 2, 0, stripe - 1, 7);
      ctx.lineTo(stripe + 2.2, 7);ctx.quadraticCurveTo(stripe + 5, 0, stripe + 2.2, -7);ctx.closePath();ctx.fill();
    }
    ctx.restore();
    // A compact, fuzzy thorax and smaller dark head distinguish the insect.
    ctx.fillStyle = '#6E6A63';ctx.beginPath();ctx.ellipse(2, 0, 5.4, 5.2, 0, 0, Math.PI * 2);ctx.fill();
    ctx.strokeStyle = '#E8AE15';ctx.lineWidth = .65;
    for (let hair = 0; hair < 15; hair++) {
      const a = hair * Math.PI * 2 / 15;
      ctx.beginPath();ctx.moveTo(2 + Math.cos(a) * 3.5, Math.sin(a) * 3.5);
      ctx.lineTo(2 + Math.cos(a) * 5.8, Math.sin(a) * 5.5);ctx.stroke();
    }
    ctx.fillStyle = '#0E0D0C';ctx.strokeStyle = '#E8AE15';ctx.lineWidth = .6;
    ctx.beginPath();ctx.ellipse(8, 0, 3.7, 3.6, 0, 0, Math.PI * 2);ctx.fill();ctx.stroke();
    for (const side of [-1, 1]) {
      ctx.beginPath();ctx.moveTo(10, side * 1.7);ctx.quadraticCurveTo(15, side * 3, 15.5, side * 5.5);ctx.stroke();
      ctx.fillStyle = '#F7F5F2';ctx.beginPath();ctx.ellipse(9, side * 2.1, .7, .45, 0, 0, Math.PI * 2);ctx.fill();
    }
  }

  function draw(scene, time, delta) {
    const ctx = scene.context;
    ctx.clearRect(0, 0, scene.width, scene.height);
    const count = mobile.matches ? 1 : 2;
    for (let lane = 0; lane < count; lane++) {
      const phase = scene.seed + lane * 2.3;
      const flight=scene.flights[lane] ||= {progress:(scene.seed*.13+lane*.51)%1,hover:0,visited:false};
      const waypoint=lane===0?.69:.31;
      const near=Math.exp(-Math.pow((flight.progress-waypoint)/.065,2));
      const speed=(1-near*.72)*(1+Math.sin(time/950+phase)*.22);
      const previousProgress=flight.progress;
      if(flight.hover>0)flight.hover=Math.max(0,flight.hover-delta);
      else flight.progress+=(delta/(24000+lane*7000))*speed;
      if(scene.element.id==='servicos'&&!flight.visited&&previousProgress<waypoint&&flight.progress>=waypoint){flight.hover=1500;flight.visited=true}
      if(flight.progress>=1){flight.progress-=1;flight.visited=false}
      const progress=flight.progress;
      const pos = point(scene, progress, lane);
      if(flight.hover>0){pos.x+=Math.sin(time*.007+phase)*2.8;pos.y+=Math.cos(time*.009+phase)*2}
      const samples = mobile.matches ? 34 : 58;
      // Individual dots taper away; no glow, blur or decorative gradients.
      for (let i = samples; i > 1; i--) {
        const t = progress - i * .0034;
        if (t < 0) continue;
        const tail = point(scene, t, lane);
        ctx.globalAlpha = (1 - i / samples) * .2;
        ctx.fillStyle = lightTheme ? '#6E6A63' : '#E8AE15';
        ctx.beginPath();
        ctx.arc(tail.x, tail.y, i % 4 === 0 ? 1.15 : .65, 0, Math.PI * 2);
        ctx.fill();
      }
      const size = mobile.matches ? 36 : 44;
      const height = size;
      // Fade the whole insect before entering any protected content.
      let clearance = 1;
      for (const area of scene.exclusions) {
        const dx = Math.max(area.x - pos.x, pos.x - area.x - area.width, 0);
        const dy = Math.max(area.y - pos.y, pos.y - area.y - area.height, 0);
        const gap = Math.max(dx - size / 2, dy - height / 2);
        clearance = Math.min(clearance, Math.max(0, Math.min(1, gap / 18)));
      }
      const ahead = point(scene, progress + .0006, lane);
      const behind = point(scene, progress - .0006, lane);
      const heading = Math.atan2(ahead.y - behind.y, ahead.x - behind.x);
      ctx.save();ctx.globalAlpha = .72 * clearance;
      ctx.translate(pos.x, pos.y);ctx.rotate(heading + Math.sin(time * .006 + phase) * (flight.hover>0?.11:.035));
      drawBee(ctx, time, phase, size);ctx.restore();
      ctx.globalAlpha = 1;
    }
    for (const area of scene.exclusions) ctx.clearRect(area.x, area.y, area.width, area.height);
    if (scene.element.id === 'inicio') ctx.clearRect(0, 0, scene.width, mobile.matches ? 84 : 108);
  }

  const canRun = () => motionAllowed() && !document.hidden && scenes.some(scene => scene.visible);
  function tick(now) {
    frame = 0;
    if (!canRun()) { previous = 0; return; }
    const delta=previous?Math.min(50,now-previous):0;
    elapsed += delta;
    previous = now;
    for (const scene of scenes) if (scene.visible) draw(scene, elapsed, delta);
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    if (canRun()) {
      if (!frame) { previous = 0; frame = requestAnimationFrame(tick); }
    } else {
      cancelAnimationFrame(frame); frame = 0; previous = 0;
      if (!motionAllowed()) for (const scene of scenes) scene.context.clearRect(0, 0, scene.width, scene.height);
    }
  }

  const intersection = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const scene = scenes.find(item => item.element === entry.target);
      scene.visible = entry.isIntersecting;
    }
    sync();
  });
  const resize = new ResizeObserver(entries => {
    for (const entry of entries) {
      const scene = scenes.find(item => item.element === entry.target);
      if (scene) measure(scene);
    }
  });
  for (const [index, element] of [...document.querySelectorAll('#inicio,#servicos,#sobre,#contato')].entries()) {
    const canvas = document.createElement('canvas');
    canvas.className = 'ambient-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    const context = canvas.getContext('2d', {alpha: true});
    if (!context) continue;
    element.classList.add('ambient-scene');
    element.prepend(canvas);
    const scene = {element, canvas, context, seed: index + 1.7, visible: false, exclusions: [],flights:[]};
    scenes.push(scene);
    measure(scene); intersection.observe(element); resize.observe(element);
    // Disclosures can move content without resizing the whole section.
    element.addEventListener('toggle', () => measure(scene), true);
    element.addEventListener('btech:layout', () => measure(scene));
  }
  new MutationObserver(sync).observe(document.body, {attributes: true, attributeFilter: ['class']});
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('btech:theme', () => {lightTheme=document.documentElement.dataset.theme==='light';sync()});
  reducedMotion.addEventListener('change', sync);
  document.fonts.ready.then(() => scenes.forEach(measure));
  sync();
})();
