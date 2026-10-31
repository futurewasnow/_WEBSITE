/* Service showrooms. All photographs and films come from the existing YouSee360 catalog. */
window.YouSeeServiceExperiences = function (host, service, kit) {
  'use strict';
  const {element:el,button:btn,link,title,asset,t,es,shots,panorama,video,website}=kit;
  const kind=host.dataset.experience;
  host.classList.add('service-showroom','showroom-'+kind);
  const section=host.closest('section'); section.classList.add('service-immersive');
  const copy={
    photography:[t('One frame is only the beginning.','Una foto es solo el comienzo.'),t('Let guests discover what lies beyond the photograph.','Deja que tus huéspedes descubran lo que hay más allá de la foto.')],
    tour:[t('Be here. Before you get here.','Estar aquí. Antes de llegar.'),t('Explore Casa del Río, one space at a time.','Explora Casa del Río, espacio por espacio.')],
    drone:[t('The whole setting. In one view.','Todo el entorno. En una vista.'),t('A lake at sunset, Pacific coves and Arenal, all from above.','Un lago al atardecer, ensenadas del Pacífico y el Arenal, todo desde el aire.')],
    street:[t('Let the first visit start here.','Que la primera visita empiece aquí.'),t('Explore Kenko from above, photographed by YouSee360.','Explora Kenko desde el aire, fotografiado por YouSee360.')],
    vr:[t('A different sense of presence.','Una nueva sensación de presencia.'),t('Look around real destinations from our portfolio.','Mira a tu alrededor en destinos reales de nuestro portafolio.')],
    map:[t('Find a place. Step inside.','Encuentra un lugar. Entra.'),t('A schematic map, connected to real Casa del Río panoramas.','Un mapa esquemático conectado a panoramas reales de Casa del Río.')],
    ar:[t('Somewhere else. Right here.','Otro lugar. Justo aquí.'),t('Open a portal into your next destination.','Abre un portal hacia tu próximo destino.')],
    film:[t('You choose where to look.','Tú eliges hacia dónde mirar.'),t('Explore our Kenko 360° slideshow film.','Explora nuestro video de fotografías 360° de Kenko.')],
    media:[t('Make them feel the place.','Haz que sientan el lugar.'),t('Hotel and property photography at Casa del Río and El Genio.','Fotografía de hoteles y propiedades en Casa del Río y El Genio.')],
    website:[t('A beautiful stay starts online.','Una gran estadía comienza en línea.'),t('Try a website concept built around our Casa del Río imagery.','Prueba un concepto web con nuestras imágenes de Casa del Río.')],
    ai:[t('Answer every guest. Even at midnight.','Responde a cada cliente. Incluso a medianoche.'),t('AI assistants that reply from your own rates, menus and policies, with a person approving every message.','Asistentes de IA que responden con tus propias tarifas, menús y políticas, y una persona aprueba cada mensaje.')]
  };
  const [heading,description]=copy[kind];
  const h1=section.querySelector('h1');
  // Keep the original service name directly above the experience headline.
  const badge=el('div','experience-service',h1.textContent.trim());
  h1.textContent=heading;h1.before(badge);
  const sub=section.querySelector('.hero-subheading');if(sub)sub.textContent=description;
  let benefit;
  function explain(message){if(benefit)benefit.textContent=message;}
  function footer(message,action){
    const foot=el('div','experience-footer');
    const text=el('div');text.append(el('span','demo-eyebrow',t('What this makes possible','Lo que esto hace posible')));
    benefit=el('p','',message);benefit.setAttribute('aria-live','polite');text.append(benefit);
    const context=({photography:'360-photo',tour:'branded-tour',drone:'drone',street:'streetview',vr:'vr',map:'maps',ar:'ar',film:'360-video',media:'traditional',website:'website',ai:'ai'})[kind];
    foot.append(text,link(action,asset((es?'es/contacto.html':'contact.html')+'?service='+context+'#quote')));host.append(foot);
  }
  function selectButtons(items,onSelect){
    const bar=el('div','demo-controls experience-modes');
    items.forEach((name,n)=>{const b=btn(name,()=>{onSelect(n);Array.from(bar.children).forEach((x,i)=>x.setAttribute('aria-pressed',String(i===n)));});b.setAttribute('aria-pressed',String(n===0));bar.append(b);});
    return bar;
  }
  function sceneExperience(keys,name){
    host.dataset.shots=keys.join(',');host.dataset.demoTitle=name;
    const api=panorama(host);
    api.stage.append(el('span','experience-live',t('YOUSEE360 / REAL PLACES','YOUSEE360 / LUGARES REALES')));
    return api;
  }
  function sceneRail(api,keys){ return api.thumbs; }
  function photo(){
    const api=sceneExperience(['casa','pool','junglo'],t('One photograph. An entire surrounding world.','Una fotografía. Todo un mundo alrededor.'));
    const frame=el('div','experience-photo-frame');frame.hidden=true;api.stage.append(frame);
    const modes=selectButtons([t('Explore 360°','Explorar 360°'),t('A single frame','Un solo encuadre')],n=>{
      host.classList.toggle('is-framed',!!n);frame.hidden=!n;
      explain(n?t('A single frame leaves the rest of the space unseen. Switch back to explore it.','Un encuadre deja parte del espacio fuera de vista. Vuelve a explorar.'):t('Guests can look beyond the first impression and understand the space for themselves.','Los huéspedes pueden ver más allá de la primera impresión y conocer el espacio.'));
    });host.querySelector('.demo-heading').append(modes);
    footer(t('Guests can look beyond the first impression and understand the space for themselves.','Los huéspedes pueden conocer el espacio por sí mismos.'),t('Photograph my space →','Fotografiar mi espacio →'));
  }
  function tourExperience(){
    const keys=['casa','pool','aerial'];const api=sceneExperience(keys,t('Your first visit to Casa del Río.','Tu primera visita a Casa del Río.'));
    sceneRail(api,keys);const visited=new Set(['casa']);const progress=el('span','experience-progress');api.stage.append(progress);
    const update=()=>{progress.textContent=t(`${visited.size} of 3 perspectives explored`,`${visited.size} de 3 perspectivas exploradas`);};update();
    host.addEventListener('experience:scene',e=>{visited.add(e.detail.key);update();explain(t('Every explored space helps visitors decide whether this is the place for them.','Cada espacio explorado ayuda al visitante a decidir si este es su lugar.'));});
    footer(t('Choose a space. See how a self-guided visit answers questions before an enquiry.','Elige un espacio. Una visita autoguiada responde preguntas antes de una consulta.'),t('Create my virtual tour →','Crear mi tour virtual →'));
  }
  function drone(){
    const api=sceneExperience(['genio-sunset','twin-coves','sunset-bay','aerial'],t('Four places, one perspective: from above.','Cuatro lugares, una perspectiva: desde el aire.'));
    sceneRail(api,['genio-sunset','twin-coves','sunset-bay','aerial']);
    const orbit=btn(t('Slow orbit','Giro suave'),()=>{
      const v=api.getViewer();if(!v?.isLoaded())return;
      const active=orbit.getAttribute('aria-pressed')!=='true';orbit.setAttribute('aria-pressed',String(active));
      if(active)v.startAutoRotate(-2);else v.stopAutoRotate();
    },'experience-orbit');orbit.setAttribute('aria-pressed','false');api.stage.append(orbit);
    const stop=()=>{api.pause();orbit.setAttribute('aria-pressed','false');};api.view.addEventListener('pointerdown',stop);api.view.addEventListener('keydown',stop);host.addEventListener('experience:scene',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
    new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stop();}).observe(api.stage);
    footer(t('The landscape becomes part of the story, alongside the property itself.','El paisaje se convierte en parte de la historia de la propiedad.'),t('Show my location from above →','Mostrar mi ubicación desde el aire →'));
  }
  function street(){
    sceneExperience(['kenko'],t('Kenko from above. Before you arrive.','Kenko desde el aire. Antes de llegar.'));
    const card=el('div','experience-place');card.append(el('span','demo-eyebrow',t('REAL CLIENT / KENKO','CLIENTE REAL / KENKO')),el('h3','',t('From finding a place to knowing it.','De encontrar un lugar a conocerlo.')),el('p','',t('This is our panorama preview. Open the published location to see Kenko on Google Maps.','Esta es nuestra vista panorámica. Abre la ubicación publicada de Kenko en Google Maps.')));
    const maps=link(t('Explore Kenko on Google Maps ↗','Explorar Kenko en Google Maps ↗'),'https://maps.app.goo.gl/8ey7AsZZfN5rt9Ag9');maps.target='_blank';maps.rel='noopener';card.append(maps);host.querySelector('.demo-stage').after(card);
    footer(t('Let potential customers see the atmosphere before deciding to visit.','Permite que tus futuros clientes conozcan el ambiente antes de visitarte.'),t('Put my business on the map →','Mostrar mi negocio en el mapa →'));
  }
  function mapExperience(){
      const api=sceneExperience(['aerial','casa','pool'],t('Map → scene → return','Mapa → escena → volver'));
      const hint=host.querySelector('.demo-heading p');
      const mapHint=t('Choose a map pin to open a real panorama.','Elige un punto del mapa para abrir un panorama real.');
      if(hint)hint.textContent=mapHint;
    const map=el('div','schematic-map');
    map.innerHTML='<svg viewBox="0 0 700 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g fill="#174936" stroke="#6bcf9c" stroke-width="2"><path d="m70 90 180-24 35 83-150 30Z"/><path d="m384 158 175-39 67 81-186 45Z"/><path d="m198 290 145-45 72 73-166 53Z"/></g><path d="M130 30c-10 160 270 90 220 206s210 30 290 164" stroke="#01e4e4" stroke-width="6" stroke-linecap="round" fill="none" opacity=".5"/><path d="M180 99 456 187 294 307" stroke="#b4e3be" stroke-width="2" stroke-dasharray="8 9" fill="none"/></svg>';
      const back=btn(t('Return to map','Volver al mapa'),()=>{api.pause();map.hidden=false;back.hidden=true;if(hint)hint.textContent=mapHint;map.querySelector('button')?.focus({preventScroll:true});},'map-return');back.hidden=true;
    const names=[t('01 · Arenal view','01 · Vista del Arenal'),t('02 · Terrace','02 · Terraza'),t('03 · Sports court','03 · Cancha')];
      ['aerial','casa','pool'].forEach((key,i)=>map.append(btn(names[i],()=>{map.hidden=true;back.hidden=false;api.select(key);if(hint)hint.textContent=t('Drag to look around. Return to the map to choose another place.','Arrastra para explorar. Vuelve al mapa para elegir otro lugar.');back.focus({preventScroll:true});},'schematic-pin')));
    map.append(el('p','map-key',t('Illustrative layout · not surveyed positions','Esquema ilustrativo · no es topografía')));api.stage.append(map,back);
    host.addEventListener('click',e=>{if(e.target.closest('.demo-thumbnail,.demo-next,.demo-prev')){map.hidden=true;back.hidden=false;}});
    const note=el('p','experience-caption',t('Choose a pin to open a real panorama, then return to the map. This original UI walkthrough uses a schematic layout; it is not a delivered client map or surveyed geography.','Elige un punto para abrir un panorama real y vuelve al mapa. Este recorrido de interfaz usa una distribución esquemática; no es un mapa entregado al cliente ni topografía.'));api.stage.after(note);
    footer(t('Connect a map’s points of interest to panoramas or information. The base map and positions are agreed for each project.','Conecta los puntos de un mapa a panoramas o información. El mapa base y las posiciones se acuerdan para cada proyecto.'),t('Plan my interactive map →','Planificar mi mapa interactivo →'));
  }

  function vr(){
    const api=sceneExperience(['arboeden','junglo','casa'],t('Choose a place to be.','Elige dónde estar.'));
    const dialog=document.createElement('dialog');dialog.className='vr-preview-dialog';
    dialog.setAttribute('aria-label',t('Immersive panorama preview','Vista previa de panorama inmersivo'));
    document.body.append(dialog);
    let placeholder,returnFocus,scrollState;
    function restore(){
      if(!placeholder)return;
      placeholder.replaceWith(host);placeholder=null;
      host.classList.remove('is-theater');immersive.setAttribute('aria-pressed','false');
      immersive.textContent=t('Enter immersive view','Abrir vista inmersiva');
      document.body.style.overflow=scrollState.overflow;
      returnFocus?.focus({preventScroll:true});
      window.scrollTo({left:scrollState.x,top:scrollState.y,behavior:'instant'});
      document.documentElement.scrollTop=scrollState.html;
      document.body.scrollTop=scrollState.body;
      api.getViewer()?.resize();
    }
    function close(){if(dialog.open)dialog.close();restore();}
    const immersive=btn(t('Enter immersive view','Abrir vista inmersiva'),()=>{
      if(dialog.open){close();return;}
      returnFocus=document.activeElement;
      scrollState={x:scrollX,y:scrollY,html:document.documentElement.scrollTop,body:document.body.scrollTop,overflow:document.body.style.overflow};
      placeholder=document.createElement('div');placeholder.style.height=host.getBoundingClientRect().height+'px';
      host.before(placeholder);dialog.append(host);host.classList.add('is-theater');
      immersive.setAttribute('aria-pressed','true');immersive.textContent=t('Close immersive view','Cerrar vista inmersiva');
      document.body.style.overflow='hidden';dialog.showModal();immersive.focus({preventScroll:true});api.getViewer()?.resize();
    });immersive.setAttribute('aria-pressed','false');host.querySelector('.demo-heading').append(immersive);
    dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
    dialog.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();}},true);
    dialog.addEventListener('close',()=>{if(!dialog.open)restore();});
    dialog.addEventListener('click',e=>{if(e.target===dialog)close();});
    footer(t('An immersive browser preview using real photography. Headset VR depends on device and tour support.','Vista inmersiva en navegador con fotografía real. VR con visor depende del dispositivo y del tour.'),t('Plan my VR experience →','Planificar mi experiencia VR →'));
  }
  function ar(){
    const api=sceneExperience(['junglo','casa','arboeden'],t('A window into your next destination.','Una ventana hacia tu próximo destino.'));
    api.stage.classList.add('experience-portal');
    const launch=el('div','experience-ar-launch');launch.append(el('div','',t('Explore here. Step through on your phone.','Explora aquí. Entra desde tu teléfono.')),link(t('Launch my AR portal →','Abrir mi portal AR →'),asset('AR%20Version/')));
    host.querySelector('.demo-stage').after(launch);
    footer(t('The portal launcher includes scene selection and a phone handoff. Camera access begins only when you choose to launch.','El lanzador incluye selección de escenas y acceso desde el teléfono. La cámara se activa cuando decides iniciar.'),t('Create a portal for my business →','Crear un portal para mi negocio →'));
  }
  function films(){
    if(kind==='media'){regularPhotography();return;}
    video(host);
    host.append(link(t('Explore our property photography →','Explorar nuestra fotografía de propiedades →'),asset('services/traditional-media.html')));
    footer(t('Viewers choose where to look in your 360° story. Playback is hosted on YouTube.','El público elige hacia dónde mirar en tu historia 360°. Reproducción en YouTube.'),t('Create my visual story →','Crear mi historia visual →'));
  }
  function regularPhotography(){
    // Explicit paths keep every original 2D photo in the deployment package.
    const photos=[
      ['casa','images/airbnb/casadelrio-pool-dusk.webp','Casa del Río',t('Hotel pool at dusk','Piscina del hotel al atardecer')],
      ['casa','images/airbnb/casadelrio-arenal-aerial.webp','Casa del Río',t('The hotel and Arenal','El hotel y el Arenal')],
      ['genio','images/airbnb/elgenio-bedroom.webp','El Genio',t('Bedroom','Habitación')],
      ['genio','images/airbnb/elgenio-great-room.webp','El Genio',t('Great room','Sala principal')],
      ['genio','images/airbnb/elgenio-pool-deck.webp','El Genio',t('Pool deck','Terraza de la piscina')],
      ['genio','images/airbnb/elgenio-dining-ocean-view.webp','El Genio',t('Dining with an ocean view','Comedor con vista al mar')],
      ['genio','images/airbnb/elgenio-bathroom.webp','El Genio',t('Bathroom','Baño')],
      ['genio','images/airbnb/elgenio-kitchen.webp','El Genio',t('Kitchen','Cocina')],
      ['genio','images/airbnb/elgenio-estate-twilight.webp','El Genio',t('Estate at twilight','Propiedad al anochecer')],
      ['genio','images/airbnb/elgenio-ocean-lounge.webp','El Genio',t('Ocean lounge','Salón frente al mar')],
      ['genio','images/airbnb/elgenio-games-room.webp','El Genio',t('Games room','Sala de juegos')],
      ['genio','images/airbnb/elgenio-mangrove-boardwalk.webp','El Genio',t('Mangrove boardwalk','Sendero del manglar')],
      ['genio','images/airbnb/elgenio-aerial-estate.webp','El Genio',t('Estate from above','Vista aérea de la propiedad')],
      ['genio','images/airbnb/elgenio-boathouse-aerial.webp','El Genio',t('Boathouse','Casa de botes')],
      ['genio','images/airbnb/elgenio-aquarium-grotto.webp','El Genio',t('Aquarium grotto','Gruta del acuario')]
    ];
    title(host,t('Photography by YouSee360','Fotografía de YouSee360'),t('Casa del Río & El Genio / photo collection','Casa del Río y El Genio / colección fotográfica'),t('Choose a property. Discover the details.','Elige una propiedad. Descubre los detalles.'));
    const highlights=[photos[0],photos[8],photos[9],photos[1],photos[5],photos[4]];
    let visible=highlights,index=0;
    const figure=el('figure','experience-photo-feature');const image=el('img');image.decoding='async';image.fetchPriority='high';
    const caption=el('figcaption','photo-caption');
    const details=el('div','photo-details');details.setAttribute('aria-live','polite');
    const property=el('span','photo-property'),photoTitle=el('strong','photo-title'),count=el('span','photo-count');
    details.append(property,photoTitle);caption.append(details);figure.append(image,caption);
    const thumbs=el('div','demo-thumbnails photo-thumbnails');thumbs.setAttribute('aria-label',t('Choose a photograph','Elige una fotografía'));
    function show(next){index=(next+visible.length)%visible.length;const photo=visible[index];image.src=asset(photo[1]);image.alt=photo[2]+' · '+photo[3];property.textContent=photo[2];photoTitle.textContent=photo[3];count.textContent=String(index+1).padStart(2,'0')+' / '+String(visible.length).padStart(2,'0');Array.from(thumbs.children).forEach((b,n)=>b.setAttribute('aria-pressed',String(n===index)));}
    function filter(n){visible=n===0?highlights:n===1?photos:photos.filter(p=>p[0]===(n===2?'casa':'genio'));thumbs.replaceChildren();visible.forEach((photo,i)=>{const b=btn('',()=>show(i),'demo-thumbnail');b.setAttribute('aria-label',photo[2]+' · '+photo[3]);b.title=photo[2]+' · '+photo[3];const img=el('img');img.src=asset(photo[1]);img.alt='';img.loading='lazy';b.append(img);thumbs.append(b);});show(0);}
    const filters=selectButtons([t('Selected favourites','Selección destacada'),t('All photographs','Todas las fotos'),'Casa del Río','El Genio'],filter);
    const nav=el('div','demo-controls photo-navigation');
    const previous=btn('←',()=>show(index-1)),next=btn('→',()=>show(index+1));
    previous.setAttribute('aria-label',t('← Previous photo','← Foto anterior'));next.setAttribute('aria-label',t('Next photo →','Siguiente foto →'));
    nav.append(count,previous,next);caption.append(nav);
    host.append(filters,figure,thumbs);filter(0);
    footer(t('Show guests the rooms, atmosphere and setting through professional hotel and property photography.','Muestra las habitaciones, el ambiente y el entorno con fotografía profesional de hoteles y propiedades.'),t('Photograph my property →','Fotografiar mi propiedad →'));
    host.querySelector('.experience-footer .demo-eyebrow').textContent=t('Your next chapter','Tu próxima historia');
    explain(t('Photography that makes your property feel like their next stay.','Fotografía que convierte tu propiedad en su próxima estadía.'));
  }
  function web(){
    website(host);const preview=host.querySelector('.demo-site');
    const photos=[['images/tours/casadelrio-poster-2400.webp',t('The setting','El entorno')],['images/panoramas/casa-lounge-thumb.jpg',t('Garden lounge','Salón del jardín')],['images/panoramas/casa-pool-thumb.jpg',t('Covered sports court','Cancha deportiva cubierta')]];
    const gallery=selectButtons(photos.map(x=>x[1]),n=>{preview.querySelector('img').src=asset(photos[n][0]);preview.querySelector('img').alt='Casa del Río · '+photos[n][1];});preview.querySelector('.demo-site-body').prepend(gallery);
    const old=preview.querySelector('.demo-site-body>.demo-button');const form=el('form','experience-booking');form.hidden=true;
    const fields=[[t('Arrival','Llegada'),'date'],[t('Departure','Salida'),'date'],[t('Guests','Huéspedes'),'number']];
    const inputs=fields.map(([name,type])=>{const label=el('label','',name);const input=el('input');input.type=type;input.required=true;if(type==='number'){input.min='1';input.max='20';input.value='2';}label.append(input);form.append(label);return input;});
    const submit=el('button','demo-button',t('Preview enquiry','Ver consulta'));submit.type='submit';form.append(submit);
    const status=preview.querySelector('[role=status]');old.addEventListener('click',()=>{form.hidden=!form.hidden;old.setAttribute('aria-expanded',String(!form.hidden));if(!form.hidden)inputs[0].focus();});old.setAttribute('aria-expanded','false');old.after(form);
    form.addEventListener('submit',e=>{e.preventDefault();if(inputs[1].value<=inputs[0].value){status.textContent=t('Choose a departure after your arrival.','Elige una salida posterior a la llegada.');return;}status.textContent=t(`Demo enquiry: ${inputs[2].value} guests · ${inputs[0].value} to ${inputs[1].value}. No reservation or message has been sent.`,`Consulta de ejemplo: ${inputs[2].value} personas · ${inputs[0].value} al ${inputs[1].value}. No se envió ninguna reserva ni mensaje.`);});
    footer(t('Explore the place, choose dates, and preview an enquiry. One clear path through your website.','Explora el lugar, elige fechas y revisa una consulta. Un camino claro en tu sitio web.'),t('Build my website →','Crear mi sitio web →'));
  }
  // AI consulting: a late-night guest message for the visitor's own kind of business, answered from
  // their information, approved by a person, sent. Plays by itself and cycles through business types.
  function automation(){
    title(host,t('Live example / your business','Ejemplo en vivo / tu negocio'),t('A guest writes at 11:42 pm. You are asleep.','Un cliente escribe a las 11:42 pm. Tú duermes.'),t('Pick your business. The assistant drafts the reply from your own rates, menus and policies; a person approves it before anything is sent. Prepared example, no live AI.','Elige tu negocio. El asistente redacta la respuesta con tus propias tarifas, menús y políticas; una persona la aprueba antes de enviarla. Ejemplo preparado, sin IA en vivo.'));
    const cases=[
      {name:t('Hotel','Hotel'),from:'Laura',msg:t('Hi! Do you have a room for 2 adults and a child, 12–15 Dec? Is breakfast included?','¡Hola! ¿Tienen habitación para 2 adultos y un niño del 12 al 15 de dic? ¿Incluye desayuno?'),
       brief:[[t('Intent','Intención'),t('Booking','Reserva')],[t('Dates','Fechas'),t('12–15 Dec · 3 nights','12–15 dic · 3 noches')],[t('Guests','Personas'),t('2 adults + 1 child','2 adultos + 1 niño')],[t('Asks','Pregunta'),t('Breakfast','Desayuno')]],
       sources:[t('Rates & availability','Tarifas y disponibilidad'),t('Breakfast policy','Política de desayuno'),t('Child policy','Política de niños')],
       reply:t('Hi Laura! Yes, our Family Suite is free 12–15 Dec. Breakfast is included for all three of you, and children under 6 stay free. Shall I hold it for you until noon tomorrow?','¡Hola Laura! Sí, nuestra Suite Familiar está libre del 12 al 15 de dic. El desayuno está incluido para los tres y los niños menores de 6 no pagan. ¿Te la aparto hasta mañana al mediodía?'),
       done:t('Hold set for 12 h · lead saved to your CRM','Reserva retenida 12 h · contacto guardado en tu CRM')},
      {name:t('Restaurant','Restaurante'),from:'Diego',msg:t('Table for 6 tomorrow at 7? One of us is vegan.','¿Mesa para 6 mañana a las 7? Uno de nosotros es vegano.'),
       brief:[[t('Intent','Intención'),t('Reservation','Reservación')],[t('When','Cuándo'),t('Tomorrow · 7:00 pm','Mañana · 7:00 pm')],[t('Party','Grupo'),t('6 people','6 personas')],[t('Diet','Dieta'),t('1 vegan','1 vegano')]],
       sources:[t('Reservations','Reservaciones'),t('Menu','Menú'),t('Allergen guide','Guía de alérgenos')],
       reply:t('Hi Diego! We can seat 6 tomorrow at 7 pm on the upstairs terrace. We have four vegan mains, marked on the menu I’m attaching. Shall I book it under your name?','¡Hola Diego! Tenemos mesa para 6 mañana a las 7 pm en la terraza de arriba. Hay cuatro platos fuertes veganos, marcados en el menú que te adjunto. ¿La reservo a tu nombre?'),
       done:t('Table booked · menu sent · reminder scheduled','Mesa reservada · menú enviado · recordatorio programado')},
      {name:t('Tour operator','Tour operador'),from:'Sam',msg:t('Is the sunrise volcano hike on for Saturday? We are 4, one is 12.','¿Sigue en pie la caminata al amanecer del sábado? Somos 4, uno tiene 12 años.'),
       brief:[[t('Intent','Intención'),t('Book a tour','Reservar tour')],[t('Tour','Tour'),t('Sunrise hike · Sat','Caminata amanecer · sáb')],[t('Group','Grupo'),t('4 people, one aged 12','4 personas, una de 12')],[t('Check','Revisar'),t('Age limit','Edad mínima')]],
       sources:[t('Tour schedule','Horario de tours'),t('Age policy','Política de edad'),t('Pickup zones','Zonas de recogida')],
       reply:t('Good evening Sam! Saturday’s sunrise hike leaves at 5:00 am and has 4 spots left. Ages 10+ are welcome, so your group is all set. Pickup from your hotel is at 4:30. Want me to reserve all 4?','¡Buenas noches Sam! La caminata del sábado sale a las 5:00 am y quedan 4 cupos. Se aceptan mayores de 10 años, así que tu grupo puede ir. La recogida en tu hotel es a las 4:30. ¿Reservo los 4?'),
       done:t('4 spots held · pickup added to the driver’s list','4 cupos apartados · recogida agregada a la lista del chofer')},
      {name:t('Real estate','Bienes raíces'),from:'Ana',msg:t('Is the 2-bedroom villa still available? Can we visit next week?','¿Sigue disponible la villa de 2 habitaciones? ¿Podemos visitarla la próxima semana?'),
       brief:[[t('Intent','Intención'),t('Viewing','Visita')],[t('Listing','Propiedad'),t('2-bedroom villa','Villa de 2 habitaciones')],[t('When','Cuándo'),t('Next week','Próxima semana')],[t('Send','Enviar'),t('360° tour','Tour 360°')]],
       sources:[t('Listings','Propiedades'),t('Agent calendar','Agenda del agente'),t('360° tour links','Enlaces de tours 360°')],
       reply:t('Hi Ana! Yes, the villa is still available. Here is its 360° tour so you can look around tonight. Our agent can show it Tuesday at 10 am or Thursday at 3 pm. Which suits you?','¡Hola Ana! Sí, la villa sigue disponible. Aquí está su tour 360° para que la recorras hoy mismo. Nuestro agente puede mostrarla el martes a las 10 am o el jueves a las 3 pm. ¿Cuál te sirve?'),
       done:t('Viewing slots offered · tour link tracked','Horarios de visita ofrecidos · enlace del tour registrado')}
    ];
    const bar=selectButtons(cases.map(c=>c.name),n=>play(n,true));host.append(bar);
    const stage=el('div','ai-live');
    const phone=el('div','ai-phone');const head=el('div','ai-head');head.append(el('b','',''),el('small','','WhatsApp Business · 11:42 pm'));
    const thread=el('div','ai-thread');phone.append(head,thread);
    const side=el('div','ai-side');
    const briefBox=el('div','ai-card ai-brief');briefBox.append(el('span','demo-eyebrow',t('01 / What the guest needs','01 / Lo que necesita')));const briefList=el('dl');briefBox.append(briefList);
    const srcBox=el('div','ai-card ai-sources');srcBox.append(el('span','demo-eyebrow',t('02 / Answered from your information','02 / Respondido con tu información')));const srcList=el('div','ai-chips');srcBox.append(srcList);
    const resultBox=el('div','ai-card ai-result');resultBox.append(el('span','demo-eyebrow',t('03 / Approved by your team','03 / Aprobado por tu equipo')),el('p','',''));
    side.append(briefBox,srcBox,resultBox);stage.append(phone,side);host.append(stage);
    let run=0,timer;
    const wait=(ms,id)=>new Promise((res,rej)=>setTimeout(()=>id===run?res():rej(0),ms));
    async function play(n,manual){
      const id=++run;clearTimeout(timer);const c=cases[n];
      Array.from(bar.children).forEach((x,i)=>x.setAttribute('aria-pressed',String(i===n)));
      head.firstChild.textContent=c.from;thread.replaceChildren();briefList.replaceChildren();srcList.replaceChildren();resultBox.lastChild.textContent='';stage.dataset.step='0';
      try{
        const bubble=(cls,text)=>{const b=el('div','ai-msg '+cls,text);thread.append(b);requestAnimationFrame(()=>b.classList.add('on'));return b;};
        await wait(400,id);bubble('in',c.msg);
        await wait(900,id);stage.dataset.step='1';
        for(const [k,v] of c.brief){briefList.append(el('dt','',k),el('dd','',v));await wait(260,id);}
        stage.dataset.step='2';
        for(const s of c.sources){srcList.append(el('span','ai-chip','✓ '+s));await wait(330,id);}
        const typing=bubble('typing','');typing.append(el('i'),el('i'),el('i'));await wait(1100,id);typing.remove();
        const draft=bubble('draft','');draft.append(el('small','',t('✦ Draft · needs your OK','✦ Borrador · necesita tu OK')),el('p','',c.reply));
        const ok=el('span','ai-approve',t('Approve & send','Aprobar y enviar'));draft.append(ok);
        await wait(1800,id);ok.classList.add('press');await wait(450,id);
        draft.remove();const sent=bubble('out',c.reply);sent.append(el('em','','✓✓'));
        stage.dataset.step='3';resultBox.lastChild.textContent=t('Replied in 38 seconds. ','Respondido en 38 segundos. ')+c.done;
        explain(t('Every late-night question gets a fast, correct answer from your own information, and a person still signs off on each reply.','Cada pregunta nocturna recibe una respuesta rápida y correcta con tu propia información, y una persona aprueba cada respuesta.'));
        timer=setTimeout(()=>{if(id===run)play((n+1)%cases.length,false);},manual?9000:6000);
      }catch(e){}
    }
    footer(t('An assistant trained on your rates, menus and policies answers the questions you get every day. Your team approves; nothing goes out unchecked.','Un asistente entrenado con tus tarifas, menús y políticas responde las preguntas de todos los días. Tu equipo aprueba; nada sale sin revisión.'),t('Find my first automation →','Encontrar mi primera automatización →'));
    new IntersectionObserver((en,io)=>{if(en[0].isIntersecting){io.disconnect();play(0,false);}},{rootMargin:'100px'}).observe(stage);
  }
  ({photography:photo,tour:tourExperience,drone,street,vr,map:mapExperience,ar,film:films,media:films,website:web,ai:automation})[kind]();
};
