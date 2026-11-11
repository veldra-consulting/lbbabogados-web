/* LBB Abogados — lo mínimo de JavaScript.
   Sin JavaScript todo sigue funcionando: el vídeo y el calendario son enlaces normales
   y las preguntas se abren con <details>. Nada de terceros se carga hasta que la persona pulsa. */
(function () {
  'use strict';
  var d = document;
  d.documentElement.classList.add('js');

  function esClicNormal(e) {
    return !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button);
  }

  function ponerMarco(caja, src, titulo, permisos) {
    var f = d.createElement('iframe');
    f.src = src;
    f.title = titulo;
    if (permisos) { f.allow = permisos; f.allowFullscreen = true; }
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    while (caja.firstChild) { caja.removeChild(caja.firstChild); }
    caja.appendChild(f);
    f.focus();
  }

  /* Vídeo: YouTube (modo sin cookies) solo al pulsar */
  var video = d.querySelector('[data-youtube]');
  if (video) {
    video.querySelector('a').addEventListener('click', function (e) {
      if (!esClicNormal(e)) { return; }
      e.preventDefault();
      ponerMarco(
        video,
        'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(video.getAttribute('data-youtube')) +
          '?autoplay=1&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&color=white',
        video.getAttribute('data-titulo') || 'Vídeo',
        'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen'
      );
    });
  }

  /* Reserva: el calendario de Calendly solo al pulsar */
  var calendly = d.querySelector('[data-calendly]');
  if (calendly) {
    calendly.querySelector('a').addEventListener('click', function (e) {
      if (!esClicNormal(e)) { return; }
      e.preventDefault();
      ponerMarco(
        calendly,
        calendly.getAttribute('data-calendly') + '?embed_type=Inline&embed_domain=' + encodeURIComponent(location.hostname || 'localhost'),
        'Calendario de Calendly para reservar la llamada'
      );
    });
  }

  /* Preguntas: una sola abierta a la vez (para navegadores sin <details name>) */
  var preguntas = d.querySelectorAll('details.pregunta');
  if (preguntas.length && !('name' in d.createElement('details'))) {
    Array.prototype.forEach.call(preguntas, function (p) {
      p.addEventListener('toggle', function () {
        if (!p.open) { return; }
        Array.prototype.forEach.call(preguntas, function (otra) { if (otra !== p) { otra.open = false; } });
      });
    });
  }

  /* Cinta de mensajes: se pausa al pulsar (ratón, dedo o teclado) */
  var cinta = d.querySelector('.cinta');
  if (cinta) {
    cinta.addEventListener('click', function () { cinta.classList.toggle('pausada'); });
    cinta.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cinta.classList.toggle('pausada'); }
    });
  }

  /* Pie: está debajo del contenido; si el foco del teclado entra, se baja hasta el final para que se vea */
  var pie = d.querySelector('.pie');
  if (pie) {
    pie.addEventListener('focusin', function () {
      window.scrollTo(0, d.documentElement.scrollHeight);
    });
  }
})();
