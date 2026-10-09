/* Seattle's meteorological seasons select a complete wedding setting. */
(() => {
  const month = Number(new Intl.DateTimeFormat('en-US', {timeZone:'America/Los_Angeles',month:'numeric'}).format(new Date()));
  const season = month >= 3 && month <= 5 ? 'spring' : month >= 6 && month <= 8 ? 'summer' : month >= 9 && month <= 11 ? 'autumn' : 'winter';
  const wedding = {
    spring:['weddings-spring.png','a spring garden estate wedding with blush linens, blossoms, and silver cutlery'],
    summer:['weddings.png','a summer glasshouse wedding with ivory linens, green foliage, and gold cutlery'],
    autumn:['weddings-autumn.png','an autumn woodland lodge wedding with terracotta linens, seasonal flowers, and bronze cutlery'],
    winter:['weddings-winter.png','a winter ballroom wedding with evergreen linens, winter florals, and silver cutlery']
  };
  const mood = {
    spring:['Soft blush','Fresh blossoms','Garden romance'],
    summer:['Soft ivory','Forest greens','Summer light'],
    autumn:['Warm terracotta','Autumn florals','Woodland warmth'],
    winter:['Deep evergreen','Winter ivory','Candlelit elegance']
  };
  document.body.dataset.weddingSeason = season;
  const description=document.querySelector('.wedding-copy .hero-description');
  if(description)description.textContent=`${mood[season][0]}. ${mood[season][1]}. The people who know you best. A celebration as naturally beautiful as your story.`;
  document.querySelectorAll('.wedding-ribbon span').forEach((span,i)=> {span.textContent=mood[season][i];});
  document.querySelectorAll('[data-seasonal-wedding]').forEach((image) => {
    const fallback = image.getAttribute('src');
    const fallbackAlt = image.alt;
    image.addEventListener('error', () => {
      if (image.getAttribute('src') === fallback) return;
      image.src = fallback;
      image.alt = fallbackAlt;
    }, {once:true});
    image.src = `/assets/${wedding[season][0]}`;
    image.alt = `Wedding inspiration: ${wedding[season][1]}`;
  });

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const surfaces = [];
  let frame = 0;
  let lastDraw = 0;
  let elapsed = 0;
  let previous = 0;
  const targets = [
    ['.hero-slide[data-occasion="Weddings"],.wedding-photo','leaves'],
    ['.hero-slide[data-occasion="Tea Ceremony"],.tea-hero','steam'],
    ['.hero-slide[data-occasion="XV años"],.xv-photo','stars'],
    ['.hero-slide[data-occasion="Corporate"],.corporate-hero','glow']
  ];
  const percent = (value) => value === 'left' || value === 'top' ? 0 : value === 'right' || value === 'bottom' ? 1 : value === 'center' ? .5 : parseFloat(value)/100;

  function resize(surface) {
    const {image,canvas,container} = surface;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const pixelRatio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width*pixelRatio);
    canvas.height = Math.round(height*pixelRatio);
    surface.context.setTransform(pixelRatio,0,0,pixelRatio,0,0);
    const positions = getComputedStyle(image).objectPosition.split(' ');
    const scale = Math.max(width/(image.naturalWidth || 1536),height/(image.naturalHeight || 1024));
    surface.layout = {width,height,scale:scale*(image.naturalWidth || 1536)/1536,
      x:(width-(image.naturalWidth || 1536)*scale)*percent(positions[0]),
      y:(height-(image.naturalHeight || 1024)*scale)*percent(positions[1] || '50%')};
  }

  // Isolate the actual bright letter faces, so the glow follows the photograph.
  function letterMasks(image) {
    const factor = image.naturalWidth/1536;
    return [[880,64],[946,53],[1002,50],[1057,75],[1134,66],[1203,71]].map(([x,width],letter) => {
      const mask = document.createElement('canvas');
      mask.width = Math.round(width*factor);mask.height = Math.round(66*factor);
      const context = mask.getContext('2d',{willReadFrequently:true});
      context.drawImage(image,x*factor,477*factor,width*factor,66*factor,0,0,mask.width,mask.height);
      const pixels = context.getImageData(0,0,mask.width,mask.height);
      for (let i=0;i<pixels.data.length;i+=4) {
        const low = Math.min(pixels.data[i],pixels.data[i+1],pixels.data[i+2]);
        pixels.data[i]=letter%2 ? 222 : 126;pixels.data[i+1]=letter%2 ? 181 : 234;pixels.data[i+2]=255;
        pixels.data[i+3]=Math.max(0,Math.min(255,(low-95)*4.5));
      }
      context.putImageData(pixels,0,0);
      return {mask,x,width};
    });
  }

  function draw(surface,time) {
    const {context:c,layout:l,kind} = surface;
    c.clearRect(0,0,l.width,l.height);
    if (kind === 'leaves') {
      for(let i=0;i<8;i++) {
        const progress = (time/(14+i%3*2)+i*.137)%1;
        const x = l.width*(.16+i*.112)+Math.sin(progress*8+i)*22;
        const y = progress*(l.height+60)-30;
        c.save();c.translate(x,y);c.rotate(Math.sin(progress*6+i)*.7+progress*2);
        c.globalAlpha = Math.sin(progress*Math.PI)*.48;
        c.fillStyle = ['#bc8248','#a76b3e','#d1a563'][i%3];
        c.beginPath();c.moveTo(0,-9);c.bezierCurveTo(9,-3,8,5,0,10);c.bezierCurveTo(-8,3,-7,-5,0,-9);c.fill();
        c.strokeStyle='#6c492c';c.lineWidth=.6;c.beginPath();c.moveTo(0,-7);c.lineTo(0,11);c.stroke();c.restore();
      }
    } else if (kind === 'steam') {
      c.save();c.translate(l.x,l.y);c.scale(l.scale,l.scale);
      for (const [cupX,cupY] of [[775,550],[902,582]]) {
        for(let i=0;i<3;i++) {
          const p=(time/5.5+i/3+cupX/1000)%1;
          const rise=p*108;
          const sway=Math.sin(time*.8+i)*8;
          c.globalAlpha=Math.sin(p*Math.PI)*.28;c.strokeStyle='#fff7e9';c.lineWidth=3+i*.7;c.filter='blur(3px)';
          c.beginPath();c.moveTo(cupX+i*8-8,cupY-rise*.35);
          c.bezierCurveTo(cupX-18+sway,cupY-28-rise,cupX+20+sway,cupY-48-rise,cupX+sway,cupY-68-rise);
          c.stroke();
        }
      }
      c.restore();
    } else if (kind === 'stars') {
      [[.62,.15],[.8,.22],[.92,.42],[.55,.37],[.72,.51],[.9,.7],[.43,.2],
        [.75,.1],[.95,.17],[.64,.34],[.86,.54],[.52,.65],[.77,.77],[.96,.85],
        [.58,.85],[.39,.48],[.68,.64],[.83,.36]].forEach(([x,y],i) => {
        const shine=Math.pow((1+Math.sin(time*1.7+i*1.8))/2,3);
        c.save();c.translate(x*l.width,y*l.height);c.rotate(Math.sin(time*.45+i)*.15);
        c.globalAlpha=.18+shine*.82;c.fillStyle=i%3 ? '#fff8e5' : '#ffe5a6';
        const size=3+shine*(i%4===0 ? 12 : 7);c.shadowColor='#fff1ce';c.shadowBlur=8+shine*24;
        c.beginPath();c.moveTo(0,-size);c.lineTo(size*.25,-size*.25);c.lineTo(size,0);c.lineTo(size*.25,size*.25);c.lineTo(0,size);c.lineTo(-size*.25,size*.25);c.lineTo(-size,0);c.lineTo(-size*.25,-size*.25);c.closePath();c.fill();c.restore();
      });
    } else if (kind === 'glow' && surface.masks) {
      c.save();c.translate(l.x,l.y);c.scale(l.scale,l.scale);c.globalCompositeOperation='screen';
      surface.masks.forEach(({mask,x,width},i) => {
        const wave=Math.pow((1+Math.sin(time*1.65-i*.82))/2,3);
        c.globalAlpha=.12+wave*.88;c.filter='blur(18px)';c.drawImage(mask,x,477,width,66);
        c.globalAlpha=.14+wave*.86;c.filter='blur(6px)';c.drawImage(mask,x,477,width,66);
        c.globalAlpha=.1+wave*.9;c.filter='none';c.drawImage(mask,x,477,width,66);
        c.save();c.translate(0,1096);c.scale(1,-1);
        c.globalAlpha=wave*.3;c.filter='blur(9px)';c.drawImage(mask,x,477,width,66);c.restore();
      });c.restore();
    }
  }

  function enabled(surface) {
    return surface.visible && surface.image.complete && surface.image.naturalWidth &&
      (surface.kind !== 'leaves' || season === 'autumn') &&
      (!surface.container.classList.contains('hero-slide') || surface.container.classList.contains('is-active'));
  }
  function paused() {
    return motion.matches || document.hidden || document.body.dataset.motionPaused === 'true' ||
      document.querySelector('.hero')?.dataset.effectsPaused === 'true';
  }
  function tick(now) {
    frame=0;
    if (paused()) {previous=0;return;}
    const active=surfaces.filter(enabled);
    if (!active.length) {previous=0;return;}
    if (previous) elapsed+=Math.min((now-previous)/1000,.1);
    previous=now;
    if (now-lastDraw>32) {active.forEach(surface=>draw(surface,elapsed));lastDraw=now;}
    frame=requestAnimationFrame(tick);
  }
  function refresh() {
    document.body.dataset.motionHidden=String(document.hidden);
    if (motion.matches) surfaces.forEach(s=>s.context.clearRect(0,0,s.layout.width,s.layout.height));
    if (!frame && !paused()) {previous=0;frame=requestAnimationFrame(tick);}
  }
  const visibility = new IntersectionObserver(entries => {
    entries.forEach(entry=> {
      const s=surfaces.find(s=>s.container===entry.target);if(s)s.visible=entry.isIntersecting;
      if(entry.target.classList.contains('xv-hero'))document.body.dataset.starsVisible=String(entry.isIntersecting);
    });refresh();
  });
  const starHero=document.querySelector('.xv-hero');if(starHero)visibility.observe(starHero);
  targets.forEach(([selector,kind]) => document.querySelectorAll(selector).forEach(container => {
    const image=container.querySelector('img');
    const canvas=document.createElement('canvas');canvas.className='event-effects';canvas.setAttribute('aria-hidden','true');
    container.appendChild(canvas);container.dataset.effectKind=kind;
    const surface={container,image,canvas,context:canvas.getContext('2d'),kind,visible:false};surfaces.push(surface);
    function loaded() {resize(surface);if(kind==='glow')surface.masks=letterMasks(image);refresh();}
    image.addEventListener('load',loaded);if(image.complete&&image.naturalWidth)loaded();else resize(surface);
    new ResizeObserver(()=>resize(surface)).observe(container);visibility.observe(container);
  }));
  const hero=document.querySelector('.hero');
  new MutationObserver(refresh).observe(hero || document.body,{attributes:true,subtree:!!hero,attributeFilter:['class','data-effects-paused','data-motion-paused']});
  document.addEventListener('visibilitychange',refresh);motion.addEventListener('change',refresh);
  // Dedicated occasion pages have the same pause option as the homepage slideshow.
  if (!hero && surfaces.length && (surfaces[0].kind !== 'leaves' || season === 'autumn')) {
    const button=document.createElement('button');button.type='button';button.className='motion-toggle';button.textContent='Pause motion';button.setAttribute('aria-pressed','false');
    button.addEventListener('click',()=> {
      const pause=document.body.dataset.motionPaused!=='true';document.body.dataset.motionPaused=String(pause);
      button.textContent=pause?'Play motion':'Pause motion';button.setAttribute('aria-pressed',String(pause));refresh();
    });surfaces[0].container.appendChild(button);
  }
})();
