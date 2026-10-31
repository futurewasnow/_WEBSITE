/* Topic-specific, progressively enhanced demos. No external data or visitor input is sent. */
(() => {
  'use strict';
  const root = new URL('../', document.currentScript.src);
  const asset = path => new URL(path, root).href;
  const es = document.documentElement.lang.startsWith('es');
  const t = (en, sp) => es ? sp : en;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const shots = {
    aerial: ['Casa del Río', t('Arenal from above', 'Arenal desde el aire'), 'images/hero-360-arenal-4k.jpg', 'https://tours.yousee360.com/casadelrio/'],
    casa: ['Casa del Río', t('Volcano-view terrace', 'Terraza con vista al volcán'), 'images/panoramas/casa-lounge.jpg', 'https://tours.yousee360.com/casadelrio/'],
    pool: ['Casa del Río', t('Covered sports court', 'Cancha deportiva cubierta'), 'images/panoramas/casa-pool.jpg', 'https://tours.yousee360.com/casadelrio/'],
    junglo: ['Junglo Resort & Spa', t('Poolside terrace', 'Terraza junto a la piscina'), 'images/panoramas/junglo-deck.jpg', 'https://tours.yousee360.com/Junglo/'],
    elgenio: ['El Genio', t('Pool & garden', 'Piscina y jardín'), 'images/panoramas/elgenio-pool.jpg', 'https://tours.yousee360.com/Elgenio/'],
    arboeden: ['Arbor Eden', t('Lot plan from the drone', 'Plano de lotes desde el dron'), 'images/panoramas/arboeden-lots.jpg', 'https://tours.yousee360.com/arboreden/'],
    dragonfly: ['Dragonfly Awakening', t('Retreat pavilion', 'Pabellón del retiro'), 'images/tours/dragonfly_360.jpg', 'https://tours.yousee360.com/dragonfly'],
    kenko: ['Kenko', t('Kenko from the drone', 'Kenko desde el aire'), 'images/kenko-guide/aerial-4k.jpg', 'https://yousee360.com/Kenko/preview.htm'],
    planetarium: ['Planetarium', t('Visitor foyer · Imagine360 archive', 'Vestíbulo · archivo Imagine360'), '', null],
    oasis: ['Arenal Oasis', t('Butterfly dome beneath Arenal', 'Domo de mariposas al pie del Arenal'), '', 'https://arenaloasis.yousee360.com/'],
    'genio-sunset': ['El Genio', t('Sunset over the lake from the drone', 'Atardecer sobre el lago desde el dron'), '', 'https://tours.yousee360.com/Elgenio/'],
    'genio-lake': ['El Genio', t('Lake and forest from the drone', 'Lago y bosque desde el dron'), '', 'https://tours.yousee360.com/Elgenio/'],
    'oasis-aerial': ['Arenal Oasis', t('Above the dome, Arenal volcano ahead', 'Sobre el domo, con el volcán Arenal'), '', 'https://arenaloasis.yousee360.com/'],
    // Capture examples from a Costa Rica trip: real places, but not client projects, so no venue is named.
    'cove-dusk': [t('Pacific coast', 'Costa del Pacífico'), t('Resort cove at dusk from the drone', 'Ensenada de un resort al atardecer desde el dron'), '', null],
    'thermal-pools': [t('Thermal pools', 'Pozas termales'), t('Hot-spring pools at ground level', 'Pozas de aguas termales a pie de suelo'), '', null],
    'thermal-trees': [t('Thermal pools', 'Pozas termales'), t('Pools under the trees', 'Pozas bajo los árboles'), '', null],
    'waterfall-canyon': [t('Waterfall canyon', 'Cañón de la cascada'), t('Above the falls from the drone', 'Sobre la cascada desde el dron'), '', null],
    'hanging-bridge': [t('Rainforest bridge', 'Puente en el bosque'), t('Hanging bridge in the canopy', 'Puente colgante entre el dosel'), '', null],
    'tortuga-rocks': ['Isla Tortuga', t('Rock formations from the drone', 'Formaciones rocosas desde el dron'), '', null],
    'twin-coves': [t('Pacific coast', 'Costa del Pacífico'), t('Twin coves from the drone', 'Ensenadas gemelas desde el dron'), '', null],
    'jobo-cove': ['Playa El Jobo', t('Cove and beach from the drone', 'Ensenada y playa desde el dron'), '', null],
    'sunset-bay': [t('Pacific sunset', 'Atardecer en el Pacífico'), t('Sunset over the bay from the drone', 'Atardecer sobre la bahía desde el dron'), '', null],
    'lodge-overlook': [t('Mountain lodge', 'Lodge de montaña'), t('Overlook from the drone', 'Mirador desde el dron'), '', null]
  };
  const examples = new Set(['cove-dusk', 'thermal-pools', 'thermal-trees', 'waterfall-canyon', 'hanging-bridge', 'tortuga-rocks', 'twin-coves', 'jobo-cove', 'sunset-bay', 'lodge-overlook']);
  function element(tag, cls, text) {
    const el = document.createElement(tag); if (cls) el.className = cls;
    if (text !== undefined) el.textContent = text; return el;
  }
  function button(text, action, cls = '') {
    const b = element('button', 'demo-button ' + cls, text); b.type = 'button'; b.addEventListener('click', action); return b;
  }
  function link(text, url) { const a = element('a', 'demo-button', text); a.href = url; return a; }
  function title(host, eyebrow, name, hint) {
    const top = element('div', 'demo-heading'); top.append(element('span', 'demo-eyebrow', eyebrow), element('h2', '', name));
    if (hint) top.append(element('p', '', hint)); host.append(top);
  }
  let library;
  let panoramaSources;
  function loadPanoramaSources() {
    if (!panoramaSources) panoramaSources = fetch(asset('images/panoramas/tiles/sources.json'))
      .then(response => { if (!response.ok) throw new Error('Panorama sources unavailable'); return response.json(); })
      .catch(error => { panoramaSources = null; throw error; });
    return panoramaSources;
  }
  function sceneConfig(key, sources) {
    if(key==="kenko")return {type:"equirectangular",panorama:asset("images/kenko-guide/aerial-4k.jpg"),yaw:-20,pitch:-55,hfov:100};
    // Never infer projection from a filename, dimensions, or a page-provided URL.
    const source = sources[key];
    if (!source || source.projection !== 'cubemap' || !Number.isInteger(source.cubeResolution) || !Number.isInteger(source.maxLevel)) {
      throw new Error('Unverified panorama: ' + key);
    }
    const opening = {aerial:[-90,-12,90],junglo:[45,-8,100],pool:[-90,-8,100],planetarium:[-90,0,90],oasis:[0,-12,90],arboeden:[80,-90,108],'genio-sunset':[0,-8,100],'genio-lake':[0,-10,100],'oasis-aerial':[0,-12,100],'cove-dusk':[0,-12,100],'thermal-pools':[0,-6,100],'thermal-trees':[0,-6,100],'waterfall-canyon':[0,-25,100],'hanging-bridge':[0,-5,100],'tortuga-rocks':[0,-10,100],'twin-coves':[0,-14,100],'jobo-cove':[0,-12,100],'sunset-bay':[0,-6,100],'lodge-overlook':[0,-10,100]}[key] || [0,0,100];
    return {type:'multires', hfov:opening[2], pitch:opening[1], yaw:opening[0], multiRes:{
      basePath:asset('images/panoramas/tiles/' + key + '/'),
      path:'%l/%s%y_%x', fallbackPath:'fallback/%s', extension:source.extension || 'jpg',
      tileResolution:source.tileResolution, cubeResolution:source.cubeResolution, maxLevel:source.maxLevel
    }};
  }
  function previewFor(key) {
    if(key==="kenko")return asset("images/kenko-guide/aerial-card.jpg");
    if (key === 'arboeden') return asset('images/tours/arboeden-lots-1600.webp');
    return asset('images/panoramas/tiles/' + key + '/fallback/' + (['aerial','pool','planetarium'].includes(key)?'l':'f') + '.jpg');
  }
  function loadPannellum() {
    if (window.pannellum) return Promise.resolve(window.pannellum);
    if (library) return library;
    const css = element('link'); css.rel = 'stylesheet'; css.href = asset('js/vendor/pannellum.css'); document.head.append(css);
    library = new Promise((resolve, reject) => {
      const s = element('script'); s.src = asset('js/vendor/pannellum.js');
      const timer = setTimeout(() => reject(new Error('viewer timeout')), 12000);
      s.onload = () => { clearTimeout(timer); window.pannellum ? resolve(window.pannellum) : reject(new Error('viewer unavailable')); };
      s.onerror = () => { clearTimeout(timer); reject(new Error('viewer unavailable')); }; document.head.append(s);
    }).catch(error => { library = null; throw error; }); return library;
  }
  function panorama(host) {
    host.classList.add('demo-compact');
    const keys = (host.dataset.shots || 'casa,junglo,aerial').split(',').filter(k => shots[k]);
    // data-labels="junglo=Hotels|elgenio=Rentals" names each scene by the industry it represents
    const labels = Object.fromEntries((host.dataset.labels || '').split('|').map(x => x.split('=')).filter(x => x.length === 2 && shots[x[0].trim()]).map(([k, v]) => [k.trim(), v.trim()]));
    const credits = host.parentElement.querySelector(':scope > .demo-source');
    if (credits) {
      const tours = new Map(keys.filter(key=>shots[key][3]).map(key => [shots[key][3], shots[key][0]]));
      const note = keys.some(key=>examples.has(key)) ? t('Capture examples photographed by YouSee360 on a Costa Rica trip; the places shown are not client projects. ', 'Ejemplos de captura fotografiados por YouSee360 en un viaje por Costa Rica; los lugares mostrados no son proyectos de clientes. ') : '';
      credits.replaceChildren(document.createTextNode(note + t('360° photography by YouSee360.', 'Fotografía 360° de YouSee360.') + (tours.size ? t(' Full tours: ', ' Tours completos: ') : '')));
      if(keys.includes('planetarium')) credits.replaceChildren(document.createTextNode(t('Planetarium visitor foyer · Original Imagine360 archive. An example of cultural-venue navigation, not a Costa Rica location.', 'Vestíbulo del planetario · Archivo original Imagine360. Ejemplo de navegación cultural; no es una ubicación en Costa Rica.')), document.createTextNode(keys.length>1?t(' Full tours: ',' Tours completos: '):' '));
      Array.from(tours).forEach(([url, name], index) => {
        if (index) credits.append(document.createTextNode(' · '));
        const source = element('a', '', name); source.href = url; source.target = '_blank'; source.rel = 'noopener'; credits.append(source);
      });
    }
    const portfolio = host.dataset.demo === 'portfolio';
    title(host, portfolio ? t('Selected work / photographed by YouSee360', 'Selección / fotografía de YouSee360') : t('Try the experience', 'Prueba la experiencia'),
      host.dataset.demoTitle || t('A place you can actually explore.', 'Un lugar que puedes explorar.'),
      keys.length>1?t('Drag to look around. Choose a scene below.', 'Arrastra para mirar alrededor. Elige una escena abajo.'):t('Drag to look around. Zoom in to explore the details.', 'Arrastra para mirar alrededor. Acércate para explorar los detalles.'));
    const stage = element('div', 'demo-stage'); const view = element('div', 'demo-panorama');
    view.setAttribute('role', 'region');
    view.setAttribute('aria-label', t('Interactive 360 panorama', 'Panorama 360 interactivo')); view.tabIndex = 0;
    const poster = element('img', 'demo-poster'); poster.src = previewFor(keys[0]); poster.alt = shots[keys[0]][0] + ' · ' + shots[keys[0]][1]; poster.decoding = 'async'; poster.fetchPriority = 'high'; poster.width = 512; poster.height = 512;
    // Keep a real perspective preview above the canvas until its first tiles
    // have rendered; a successfully initialized renderer can still be black.
    poster.style.zIndex='1';poster.style.pointerEvents='none';stage.append(view,poster);
    const start = button(t('Explore in 360°', 'Explorar en 360°'), () => { start.hidden = true; init(); }, 'demo-start'); stage.append(start);
    const status = element('p', 'demo-status'); status.setAttribute('role', 'status');stage.append(status);host.append(stage);
    const bar = element('div', 'demo-toolbar'); const label = element('div', 'demo-scene-label'); label.setAttribute('aria-live', 'polite');
    const controls = element('div', 'demo-controls'); let index = 0, viewer, busy = false, playing = !reduced && !navigator.connection?.saveData, timer, visible = true, renderTimer, pendingSelection;
    const external = link(t('Open full tour ↗', 'Abrir tour completo ↗'), shots[keys[0]][3] || '#'); external.target = '_blank';external.rel = 'noopener';
    const play = button(t('Play slideshow', 'Reproducir selección'), () => { playing = !playing; paintPlay(); schedule(); });
    function paintPlay() {play.textContent=playing?'Ⅱ':'▶';play.setAttribute('aria-label',playing?t('Pause slideshow','Pausar selección'):t('Play slideshow','Reproducir selección'));play.title=play.getAttribute('aria-label');play.setAttribute('aria-pressed',String(playing));}
    function pause() {playing=false;clearTimeout(timer);paintPlay();if(viewer)viewer.stopAutoRotate();}
    function schedule() { clearTimeout(timer); if (playing && visible && !document.hidden && !busy) timer=setTimeout(()=>select((index+1)%keys.length,false),+host.dataset.interval||9000); }
    function paint() {
      const s=shots[keys[index]],tag=labels[keys[index]];label.replaceChildren(element('strong','',tag||s[0]),element('span','',(tag?s[0]+' · ':'')+s[1]+' · '+(index+1)+' / '+keys.length));external.hidden=!s[3];external.href=s[3] || '#';
      thumbs.querySelectorAll('button').forEach((b,n)=>{b.setAttribute('aria-pressed',String(n===index));});
      host.dispatchEvent(new CustomEvent('experience:scene', {detail:{key:keys[index],shot:s}}));
    }
    function select(next, manual=true) {
      if(manual)pause();if(busy){pendingSelection={next,manual};return;}
      const target=(next+keys.length)%keys.length;
      if(viewer && target===index && viewer.isLoaded())return;
      index=target;paint();
      poster.src=previewFor(keys[index]);poster.alt=shots[keys[index]][0];poster.hidden=false;
      if(viewer){busy=true;status.textContent=t('Loading scene…','Cargando escena…');viewer.loadScene(keys[index]);}else{init();}
    }
    if(keys.length>1) {
      const previous=button('‹',()=>select(index-1),'demo-prev'),next=button('›',()=>select(index+1),'demo-next');
      previous.setAttribute('aria-label',t('Previous scene','Escena anterior'));next.setAttribute('aria-label',t('Next scene','Escena siguiente'));
      controls.append(previous,next,play);
    }
    const zoomOut=button('−',()=>{if(viewer)viewer.setHfov(viewer.getHfov()+10);}),zoomIn=button('+',()=>{if(viewer)viewer.setHfov(viewer.getHfov()-10);});
    zoomOut.setAttribute('aria-label',t('Zoom out','Alejar'));zoomIn.setAttribute('aria-label',t('Zoom in','Acercar'));controls.append(zoomOut,zoomIn);
    const fullscreen=button('⛶',()=>{if(document.fullscreenElement===stage)document.exitFullscreen?.();else if(stage.requestFullscreen)stage.requestFullscreen().catch(()=>{});else if(viewer)viewer.toggleFullscreen();});
    const paintFullscreen=()=>{fullscreen.setAttribute('aria-label',document.fullscreenElement===stage?t('Exit fullscreen','Salir de pantalla completa'):t('Enter fullscreen','Abrir pantalla completa'));fullscreen.title=fullscreen.getAttribute('aria-label');viewer?.resize();};document.addEventListener('fullscreenchange',paintFullscreen);paintFullscreen();controls.append(fullscreen);
    external.textContent='↗';external.setAttribute('aria-label',t('Open full tour','Abrir tour completo'));external.title=external.getAttribute('aria-label');bar.append(label,controls,external);stage.append(bar);
    const thumbs=element('div','demo-thumbnails');thumbs.setAttribute('role','group');thumbs.setAttribute('aria-label',t('Choose a panorama','Elige un panorama'));thumbs.hidden=keys.length===1;
    keys.forEach((key,n)=>{const s=shots[key];const b=button('',()=>select(n),'demo-thumbnail');const img=element('img');img.src=previewFor(key);img.alt='';img.loading='lazy';b.append(img,element('span','',labels[key]||(s[0]+' · '+s[1])));b.setAttribute('aria-label',(labels[key]?labels[key]+' — ':'')+s[0]+' · '+s[1]);b.title=s[1];thumbs.append(b);});stage.append(thumbs);paint();paintPlay();
    let initPending=false;
    async function init() {
      if(viewer||initPending)return;initPending=true;busy=true;status.textContent=t('Opening your 360° view…','Abriendo vista 360°…');
      try {
        const [lib,sources]=await Promise.all([loadPannellum(),loadPanoramaSources()]);start.hidden=true;
        const scenes={};keys.forEach(key=>{scenes[key]=sceneConfig(key,sources);});
        viewer=lib.viewer(view,{default:{firstScene:keys[index],autoLoad:true,autoRotate:0,showControls:false,mouseZoom:false,keyboardZoom:true,sceneFadeDuration:reduced?0:600,escapeHTML:true},scenes});
        view._viewer=viewer;
        const loaded=()=>{
          clearTimeout(renderTimer);busy=false;
          if(pendingSelection){const pending=pendingSelection;pendingSelection=null;select(pending.next,pending.manual);if(busy)return;}
          const until=Date.now()+15000;
          const reveal=()=>{
            if(viewer.isLoaded()&&!viewer.getRenderer().isLoading()){
              poster.hidden=true;status.textContent='';host.dataset.ready='true';host.dispatchEvent(new CustomEvent('experience:ready'));schedule();
            }else if(Date.now()<until){renderTimer=setTimeout(reveal,80);}
            else status.textContent=t('Still loading. You can also open the full tour.','Sigue cargando. También puedes abrir el tour completo.');
          };
          requestAnimationFrame(reveal);
        };
        viewer.on('load',loaded);
        viewer.on('error',()=>{clearTimeout(renderTimer);busy=false;status.textContent=t('This scene could not load. Select another or open the full tour.','No se pudo cargar esta escena. Elige otra o abre el tour completo.');pause();});
        viewer.on('scenechange',id=>{index=keys.indexOf(id);paint();});
        // Tiled viewers can initialize synchronously before listeners attach.
        if(viewer.isLoaded())loaded();
      }catch(e){busy=false;status.textContent=t('The 360 viewer is unavailable. You can still open the full tour.','El visor no está disponible. Puedes abrir el tour completo.');start.hidden=false;}
      finally{initPending=false;}
    }
    window.addEventListener('pagehide',()=>{pause();clearTimeout(renderTimer);viewer?.destroy();viewer=undefined;delete view._viewer;poster.hidden=false;});
    view.addEventListener('pointerdown',pause);view.addEventListener('keydown',event=>{pause();if(!viewer||event.target!==view)return;const moves={ArrowLeft:()=>viewer.setYaw(viewer.getYaw()-10,0),ArrowRight:()=>viewer.setYaw(viewer.getYaw()+10,0),ArrowUp:()=>viewer.setPitch(viewer.getPitch()+10,0),ArrowDown:()=>viewer.setPitch(viewer.getPitch()-10,0),'+':()=>viewer.setHfov(viewer.getHfov()-10,0),'-':()=>viewer.setHfov(viewer.getHfov()+10,0)};if(moves[event.key]){event.preventDefault();moves[event.key]();}});window.addEventListener('pageshow',event=>{if(event.persisted&&visible&&!navigator.connection?.saveData)init();});
    document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimeout(timer);if(viewer)viewer.stopAutoRotate();}else schedule();});
    const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){if(!navigator.connection?.saveData)init();schedule();}else{clearTimeout(timer);if(viewer)viewer.stopAutoRotate();}},{threshold:0.12});io.observe(stage);
    return {thumbs,select: key=>{const next=keys.indexOf(key);if(next>=0)select(next);}, getViewer:()=>viewer, stage, view, pause};
  }
  function ai(host) {
    title(host,t('AI workflow / interactive sample','Flujo de IA / ejemplo interactivo'),t('From enquiry to a useful first draft.','De consulta a un borrador útil.'),t('Choose a task and run a sample. Illustrative demo with prepared responses.','Elige una tarea y prueba el flujo. Demostración con respuestas preparadas.'));
    const scenarios=[
      ['Booking enquiry','Consulta de reserva','Hi! We are 4 guests visiting La Fortuna. Do you have a family room for 3 nights?','¡Hola! Somos 4 personas y visitamos La Fortuna. ¿Tienen habitación familiar para 3 noches?', 'Reservation request · 4 guests · 3 nights · Dates needed','Solicitud de reserva · 4 personas · 3 noches · Faltan fechas','Thanks for getting in touch! Which dates are you considering? Once we have your dates, our team can check family-room availability and confirm a quote.','¡Gracias por escribirnos! ¿Qué fechas tienen en mente? Con las fechas, nuestro equipo puede consultar disponibilidad y confirmar una cotización.'],
      ['Review digest','Resumen de reseñas','“Loved the garden.” “Beautiful setting, check-in took a while.” “Wonderful staff and gardens.”','“Nos encantó el jardín.” “Hermoso lugar, el ingreso fue lento.” “Excelente personal y jardines.”','3 sample reviews · 2 garden mentions · 1 check-in issue','3 reseñas de ejemplo · 2 menciones del jardín · 1 demora','Guests value the gardens and staff. Review the check-in process with your team; this small sample suggests a possible delay, not a confirmed trend.','Los huéspedes valoran los jardines y el personal. Revisa el proceso de ingreso; esta muestra pequeña sugiere una posible demora, no una tendencia confirmada.'],
      ['Quote follow-up','Seguimiento de cotización','A guest asked for a virtual tour quote. No reply after 3 days.','Un cliente pidió una cotización de tour virtual. No respondió en 3 días.','Quote pending · 3 days · Draft for human approval','Cotización pendiente · 3 días · Requiere aprobación','Hello! Following up on your virtual tour enquiry. Would you like to discuss the spaces you want to showcase? We can help you choose the right scope before confirming pricing.','¡Hola! Damos seguimiento a tu consulta de tour virtual. ¿Te gustaría conversar sobre los espacios que quieres mostrar? Te ayudamos a definir el alcance antes de confirmar el precio.']
    ];
    const tabs=element('div','demo-controls');const flow=element('div','demo-flow');const input=element('div','demo-flow-card');const record=element('div','demo-flow-card');const output=element('div','demo-flow-card');
    let selected=0;function show(){const s=scenarios[selected];input.replaceChildren(element('span','demo-eyebrow','01 / '+t('Incoming message','Mensaje entrante')),element('p','',s[es?3:2]));record.replaceChildren(element('span','demo-eyebrow','02 / '+t('Structured record','Registro estructurado')),element('p','',t('Run the workflow to extract the details.','Ejecuta el flujo para extraer los detalles.')));output.replaceChildren(element('span','demo-eyebrow','03 / '+t('Draft for approval','Borrador para aprobar')),element('p','',t('Your team stays in control.','Tu equipo mantiene el control.')));tabs.querySelectorAll('button').forEach((b,n)=>b.setAttribute('aria-pressed',String(n===selected)));}
    scenarios.forEach((s,n)=>tabs.append(button(s[es?1:0],()=>{selected=n;show();})));host.append(tabs);flow.append(input,record,output);host.append(flow);output.setAttribute('aria-live','polite');
    host.append(button(t('Run sample workflow →','Ejecutar flujo de ejemplo →'),()=>{const s=scenarios[selected];record.lastChild.textContent=s[es?5:4];output.lastChild.textContent=s[es?7:6];}));
    const estimate=element('label','demo-estimate',t('Repetitive work per week: ','Trabajo repetitivo semanal: '));const range=element('input');range.type='range';range.min='2';range.max='40';range.value='12';range.setAttribute('aria-label',t('Hours of repetitive work per week','Horas de trabajo repetitivo por semana'));const result=element('output');function calc(){result.textContent=t(`${range.value} hours → ${Math.round(Number(range.value)*0.5)} hours potentially freed at 50% automation.`,`${range.value} horas → ${Math.round(Number(range.value)*0.5)} horas potencialmente libres al automatizar el 50%.`);}range.addEventListener('input',calc);calc();estimate.append(range,result);host.append(estimate,link(t('Book an AI audit →','Solicitar auditoría de IA →'),asset('contact.html#quote')));show();
  }
  function map(host) {
    const locations={ 'la-fortuna-arenal':['La Fortuna / Arenal',10.47,-84.645],guanacaste:['Guanacaste',10.48,-85.45],nosara:['Nosara',9.98,-85.65], 'san-jose':['San José',9.934,-84.08], 'santa-teresa':['Santa Teresa',9.645,-85.168],tamarindo:['Tamarindo',10.30,-85.84],monteverde:['Monteverde',10.30,-84.81],'manuel-antonio':['Manuel Antonio',9.40,-84.155]};
    title(host,t('Explore the map','Explora el mapa'),host.dataset.demoTitle||t('Find your next perspective.','Encuentra tu próxima perspectiva.'),t('Select a destination, then explore the map.','Elige un destino y explora el mapa.'));
    const tabs=element('div','demo-controls');const frame=element('iframe','demo-map');frame.title=t('Interactive destination map © OpenStreetMap contributors','Mapa interactivo © colaboradores de OpenStreetMap');frame.loading='lazy';frame.referrerPolicy='no-referrer';
    const out=link(t('Open map ↗','Abrir mapa ↗'),'#');out.target='_blank';out.rel='noopener';
    function select(key){const [name,lat,lon]=locations[key];frame.src=`https://www.openstreetmap.org/export/embed.html?bbox=${lon-.06}%2C${lat-.045}%2C${lon+.06}%2C${lat+.045}&layer=mapnik&marker=${lat}%2C${lon}`;out.href=`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=13/${lat}/${lon}`;frame.title=name+' — '+t('interactive map','mapa interactivo');tabs.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.key===key)));}
    Object.entries(locations).forEach(([key,[name]])=>{const b=button(name,()=>select(key));b.dataset.key=key;tabs.append(b);});host.append(tabs,frame,out);select(locations[host.dataset.location]?host.dataset.location:'la-fortuna-arenal');
  }
  function website(host) {
    title(host,t('Responsive website / interactive concept','Sitio adaptable / concepto interactivo'),t('One destination. Every screen.','Un destino. Todas las pantallas.'),t('Switch screen sizes and try the booking interaction.','Cambia de tamaño y prueba la interacción de reserva.'));
    const controls=element('div','demo-controls');const preview=element('div','demo-site');const top=element('div','demo-site-nav','CASA / STAY');const photo=element('img');photo.src=asset('images/tours/casadelrio-poster-2400.jpg');photo.alt=t('Casa del Río photographed by YouSee360','Casa del Río, fotografía de YouSee360');
    const body=element('div','demo-site-body');body.append(element('span','demo-eyebrow',t('Website concept','Concepto de sitio')),element('h3','',t('Wake up somewhere extraordinary.','Despierta en un lugar extraordinario.')));const note=element('p','');note.setAttribute('role','status');body.append(button(t('Check availability','Consultar disponibilidad'),()=>{note.textContent=t('Demo: your booking engine would open here. No reservation has been made.','Demo: aquí se abriría tu motor de reservas. No se realizó ninguna reserva.');}),note);preview.append(top,photo,body);
    ['Desktop','Mobile'].forEach((name,n)=>{const b=button(t(name,n?'Móvil':'Escritorio'),()=>{preview.classList.toggle('is-mobile',!!n);controls.querySelectorAll('button').forEach((x,i)=>x.setAttribute('aria-pressed',String(i===n)));});b.setAttribute('aria-pressed',String(n===0));controls.append(b);});host.append(controls,preview);
  }
  function video(host) {
    host.dataset.shots='kenko';host.dataset.demoTitle=t('Real aerial 360° photograph — Kenko','Fotografía aérea 360° real — Kenko');
    panorama(host);
    host.append(element('p','demo-source',t('This is a still panorama, not filmed motion.','Este es un panorama fijo, no movimiento filmado.')));
  }
  function pricing(host) {
    title(host,t('Build your brief','Arma tu proyecto'),t('Choose the right starting point.','Elige el punto de partida.'),t('Published starting prices in USD. Final scope and price are agreed before the shoot.','Precios iniciales publicados en USD. Acordamos el alcance y precio antes de la sesión.'));
    const options=[
      [t('Property photography','Fotografía de propiedades'),'425',t('A focused photography package for your property listing.','Un paquete de fotografía para anunciar tu propiedad.')],
      [t('360° virtual tour','Tour virtual 360°'),'650',t('A small-property tour with up to five scenes.','Un tour de una propiedad pequeña con hasta cinco escenas.')],
      [t('Photography + tour','Fotografía + tour'),'925',t('A combined package for a listing and an immersive preview.','Un paquete combinado para anunciar y explorar tu propiedad.')]
    ];
    const tabs=element('div','demo-controls');const result=element('div','demo-flow-card');result.setAttribute('aria-live','polite');
    options.forEach(([name,price,description],n)=>tabs.append(button(name,()=>{tabs.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===n)));result.replaceChildren(element('span','demo-eyebrow',name),element('h3','',t('From $','Desde $')+price+' USD'),element('p','',description));})));
    host.append(tabs,result,link(t('Get a scoped quote →','Solicitar cotización →'),asset(es?'es/contacto.html':'contact.html#quote')));tabs.firstChild.click();
  }
  function tour(host) {
    title(host,t('Arenal Oasis / live client tour','Arenal Oasis / tour de cliente'),t('Step into the butterfly sanctuary.','Entra al santuario de mariposas.'),t('Open the tour, then use its hotspots to move through the space.','Abre el tour y usa sus puntos interactivos para recorrer el espacio.'));
    const stage=element('div','demo-film');const img=element('img');img.src=asset('images/tours/arenaloasis.jpg');img.alt=t('Arenal Oasis tour preview','Vista previa del tour Arenal Oasis');stage.append(img,button(t('Enter the live tour','Entrar al tour'),()=>{const f=element('iframe');f.src='https://arenaloasis.yousee360.com/';f.title='Arenal Oasis — '+t('interactive virtual tour','tour virtual interactivo');f.allow='fullscreen; accelerometer; gyroscope';f.allowFullscreen=true;stage.replaceChildren(f);},'demo-start'));host.append(stage);
    const a=link(t('Open full tour ↗','Abrir tour completo ↗'),'https://arenaloasis.yousee360.com/');a.target='_blank';a.rel='noopener';host.append(a);
  }
  function workplace(host) {
    title(host,'Office tour / interactive concept','Make the first visit feel familiar.','Choose a space to see what a remote visitor could discover. Illustrative layout, ready to adapt to your workplace.');
    const stage=element('div','demo-workplace-map');
    stage.innerHTML='<svg viewBox="0 0 800 440" role="img" aria-label="Illustrative office plan with reception, workspaces, meeting room and lounge"><defs><pattern id="workplace-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#ffffff08"/></pattern></defs><rect width="800" height="440" fill="url(#workplace-grid)"/><g fill="#172e25" stroke="#718b7c" stroke-width="2"><path d="M60 45H740V395H450V345H320V395H60Z"/><path d="M320 45V145M320 225V345M490 45V210H740M490 290V395"/></g><path class="demo-workplace-route" d="M385 395V275H185"/><g fill="#283f34" stroke="#91a58c" stroke-width="1.5"><rect x="98" y="285" width="120" height="38" rx="8"/><rect x="358" y="74" width="95" height="50" rx="6"/><rect x="358" y="154" width="95" height="50" rx="6"/><rect x="545" y="83" width="142" height="65" rx="25"/><rect x="555" y="282" width="100" height="28" rx="10"/><rect x="555" y="340" width="100" height="28" rx="10"/><circle cx="605" cy="325" r="10"/></g><g fill="#72856c"><circle cx="345" cy="90" r="8"/><circle cx="345" cy="172" r="8"/><circle cx="390" cy="137" r="8"/><circle cx="570" cy="70" r="8"/><circle cx="615" cy="70" r="8"/><circle cx="660" cy="70" r="8"/><circle cx="570" cy="162" r="8"/><circle cx="615" cy="162" r="8"/><circle cx="660" cy="162" r="8"/></g><g fill="#94b97d"><circle cx="92" cy="82" r="16"/><circle cx="709" cy="363" r="16"/></g><g fill="#c4d8cb" font-family="system-ui,sans-serif" font-size="15" text-anchor="middle"><text x="180" y="360">RECEPTION</text><text x="407" y="252">WORKSPACE</text><text x="615" y="190">MEETING ROOM</text><text x="611" y="387">LOUNGE</text></g></svg>';
    const rooms=[
      ['Reception',23,51,'Arrive with confidence.','Show visitors where to check in and how to find the people they are meeting.','M385 395V275H185'],
      ['Workspace',51,68,'Picture a day at work.','Help candidates and prospective tenants understand the working environment before arranging a visit.','M385 395V305H408'],
      ['Meeting room',77,53,'Find the right place to collaborate.','Let clients explore the meeting spaces and see the facilities available for their visit.','M385 395V250H615V233'],
      ['Lounge',87,73,'Discover the spaces between meetings.','Introduce shared amenities and the places where your team can take a break.','M385 395V250H697V325']
    ];
    const detail=element('div','demo-workplace-detail');detail.setAttribute('aria-live','polite');
    rooms.forEach(([name,x,y,heading,copy,path],i)=>{const marker=button(String(i+1).padStart(2,'0'),()=>{stage.querySelectorAll('button').forEach((b,n)=>b.setAttribute('aria-pressed',String(n===i)));stage.querySelector('.demo-workplace-route').setAttribute('d',path);detail.replaceChildren(element('span','demo-eyebrow',name),element('h3','',heading),element('p','',copy));},'demo-workplace-marker');marker.style.left=x+'%';marker.style.top=y+'%';marker.setAttribute('aria-label',name);stage.append(marker);});
    host.append(stage,detail,link('Plan my workplace tour →',asset('contact.html#quote')));stage.querySelector('button').click();
  }
  function venue(host) {
    title(host,'Le Crystal / Imagine360 archive','Picture the occasion.','Explore what an event planner needs to see before booking a visit.');
    const figure=element('figure','demo-venue-photo'),photo=element('img');photo.src=asset('images/hero/le-crystal-event-hall.jpg');photo.alt='Le Crystal event hall with banquet seating and an illuminated central runway';photo.width=3475;photo.height=780;
    figure.append(photo,element('figcaption','','Le Crystal · Original archive photograph · Venue outside Costa Rica'));host.append(figure);
    const tabs=element('div','demo-controls');const detail=element('div','demo-photo-detail');detail.setAttribute('aria-live','polite');
    const choices=[['Layout','Understand the room before the site visit.','Show seating areas, circulation routes and the relationship between the stage and guest tables.'],['Atmosphere','Let the lighting tell part of the story.','Photograph the venue in its event lighting so planners can picture the mood of their occasion.'],['Guest experience','Follow the route your guests will take.','Connect the arrival, reception and main event spaces in a guided tour of your own venue.']];
    choices.forEach(([name,heading,copy],n)=>{const b=button(name,()=>{tabs.querySelectorAll('button').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===n)));detail.replaceChildren(element('h3','',heading),element('p','',copy));});tabs.append(b);});host.append(tabs,detail);tabs.firstChild.click();
  }
  function preparation(host) {
    title(host,'Before the camera arrives','Make every angle ready.','Work through the four essentials from this guide. Tick each one as you prepare your property.');
    const figure=element('figure','demo-prep-photo'),photo=element('img');
    photo.src=asset('images/airbnb/elgenio-bedroom.webp');photo.alt='Staged bedroom at El Genio with arranged bedding and clear floor space';photo.width=1000;photo.height=666;
    figure.append(photo,element('figcaption','','El Genio · Property photography by YouSee360'));host.append(figure);
    const items=[['Clear every surface','Put away personal items, remote controls and visible cables. A 360° camera sees behind you, too.'],['Check the lights','Replace burnt-out bulbs and check that the practical lights work.'],['Clean glass and mirrors','Remove smudges from windows and mirrors before the shoot.'],['Finish the staging','Arrange the furniture, straighten bedding and fluff the pillows.']];
    const list=element('fieldset','demo-prep-checklist');list.append(element('legend','','Your shoot preparation'));
    const status=element('p','demo-prep-progress');status.setAttribute('role','status');
    const meter=element('progress');meter.max=items.length;meter.value=0;meter.setAttribute('aria-label','Preparation checklist progress');
    function update(){const count=list.querySelectorAll('input:checked').length;meter.value=count;status.textContent=count===items.length?'All four essentials checked. Walk through each room once more before the photographer arrives.':count+' of '+items.length+' essentials checked';}
    items.forEach(([name,description])=>{const label=element('label','demo-prep-item'),check=element('input');check.type='checkbox';check.addEventListener('change',update);const text=element('span');text.append(element('strong','',name),element('small','',description));label.append(check,text);list.append(label);});
    host.append(list,meter,status);update();
  }
  function plan(host) {
    const industry=host.dataset.topic||t('your space','tu espacio');
    title(host,t('Interactive tour concept','Concepto de tour interactivo'),t('Explore the possibilities for ','Explora las posibilidades para ')+industry,t('Select a hotspot to see what a visitor could discover. Illustrative layout.','Elige un punto para ver qué podría descubrir un visitante. Plano ilustrativo.'));
    const canvas=element('div','demo-plan');const detail=element('div','demo-plan-detail');detail.setAttribute('aria-live','polite');
    const points=es?['Bienvenida','Espacio principal','Información y accesibilidad','Planificar visita']:['Welcome','Main space','Information & accessibility','Plan your visit'];
    const descriptions=es?['Orienta al visitante antes de llegar: entrada, instrucciones y navegación.','Muestra el espacio con fotografía 360° y puntos de navegación entre escenas.','Agrega contexto, audio, información práctica y detalles de accesibilidad verificados.','Conecta la experiencia con una consulta, entradas o una reserva.']:['Orient visitors before arrival with an entrance view, instructions and scene navigation.','Show the space through 360° photography and navigation between connected scenes.','Add context, audio, practical information and verified accessibility details.','Connect the experience to an enquiry, tickets or a booking.'];
    points.forEach((text,n)=>{const b=button((n+1)+' · '+text,()=>{canvas.querySelectorAll('button').forEach((x,i)=>x.setAttribute('aria-pressed',String(i===n)));detail.replaceChildren(element('h3','',text),element('p','',descriptions[n]));},'demo-hotspot');canvas.append(b);});host.append(canvas,detail);canvas.firstChild.click();
  }
  function farm(host) {
    title(host,'Finca Paraíso Orgánico',t('Explore the farm from above.','Explora la finca desde arriba.'),
      t('Choose a marker. An aerial photograph with an interactive orientation guide.','Elige un punto. Una fotografía aérea con una guía interactiva de orientación.'));
    const map=element('div','demo-photo-map');const photo=element('img');
    photo.src=asset('images/hero/finca-paraiso-aerial.jpg');photo.alt=t('Aerial view of the planted beds, ponds and buildings at Finca Paraíso Orgánico','Vista aérea de cultivos, estanques y edificios en Finca Paraíso Orgánico');
    photo.width=1024;photo.height=525;map.append(photo);
    const detail=element('div','demo-photo-detail');detail.setAttribute('aria-live','polite');
    const areas=[
      [49,43,t('Growing areas','Áreas de cultivo'),t('Help visitors understand the planted areas and the scale of the farm before arriving.','Ayuda a los visitantes a conocer las áreas cultivadas y la extensión de la finca antes de llegar.')],
      [22,14,t('Water and surroundings','Agua y entorno'),t('Use a visual guide to explain the surroundings and add information about your land.','Usa una guía visual para explicar el entorno y compartir información sobre el terreno.')],
      [34,82,t('Buildings and paths','Edificios y senderos'),t('Connect key places with clear arrival instructions and a guided route through your property.','Conecta los puntos principales con instrucciones de llegada y una ruta guiada por la propiedad.')]
    ];
    areas.forEach(([x,y,name,description],index)=>{
      const marker=button(String(index+1).padStart(2,'0'),()=>{
        map.querySelectorAll('button').forEach((b,n)=>b.setAttribute('aria-pressed',String(n===index)));
        detail.replaceChildren(element('h3','',name),element('p','',description));
      },'demo-photo-marker');
      marker.style.left=x+'%';marker.style.top=y+'%';marker.setAttribute('aria-label',name);map.append(marker);
    });
    host.append(map,detail);map.querySelector('button').click();
  }
  function ar(host) {
    title(host,t('WebAR / portal preview','WebAR / vista previa del portal'),t('A doorway to somewhere else.','Una puerta a otro lugar.'),t('Explore a real scene here, then launch the camera portal on your phone.','Explora una escena real y abre el portal con la cámara del teléfono.'));
    const doorway=element('div','demo-doorway');const sub=element('div');sub.dataset.shots='junglo,casa,arboeden';sub.dataset.demoTitle=t('Choose the view through your portal.','Elige la vista de tu portal.');doorway.append(sub);host.append(doorway);panorama(sub);host.append(link(t('Launch AR portal →','Abrir portal AR →'),asset('AR%20Version/')));
  }
  const demos={panorama,portfolio:panorama,ai,map,website,video,plan,pricing,tour,ar,farm,preparation,venue,workplace};
  document.querySelectorAll('[data-demo]').forEach(host=>{try{
    const service=host.closest('[data-service]')?.dataset.service;
    if(host.dataset.experience && window.YouSeeServiceExperiences){
      window.YouSeeServiceExperiences(host,service,{element,button,link,title,asset,t,es,shots,panorama,video,ai,website});
    }else (demos[host.dataset.demo]||panorama)(host);
  }catch(e){console.warn('Demo could not initialize',e);host.append(link(t('Explore our work →','Explora nuestro trabajo →'),asset('portfolio.html')));}});
})();
