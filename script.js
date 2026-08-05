/* ═══════════════════════════════════════════════════════
   DATOS — el único lugar que debes editar

   Para agregar un proyecto nuevo, copia el bloque
   de uno existente, pega al final del array y
   cambia los valores. Nada más.

   Estructura de cada objeto:
     id          → número único autoincremental
     titulo      → nombre del proyecto (string)
     descripcion → una o dos oraciones (string)
     url         → enlace completo al proyecto (string)
     destacado   → aparece con badge azul (boolean)
     autores     → array de objetos { nombre, rol }
                   Puede tener uno o varios autores.
═══════════════════════════════════════════════════════ */
const proyectos = [
  {
    id: 1,
    titulo: "PI-FORM",
    descripcion: "Plataforma de formularios inteligentes para instituciones y desarrolladores. Automatiza el análisis de proyectos.",
    url: "https://joseluisrt2007.github.io/PI-Form/",
    destacado: true,
    autores: [
      { nombre: "Dr. Salvador González García", rol: "Project Manager"},
      { nombre: "José Luis Rodríguez Téllez", rol: "Lead Dev"}
    ]
  },
  {
    id: 2,
    titulo: "PromediaTec",
    descripcion: "Calculadora académica para estudiantes de nivel universitario del ITESM. Simula escenarios y proyecta el promedio final del período.",
    url: "https://joseluisrt2007.github.io/PromediaTec/",
    destacado: true,
    autores: [
      { nombre: "José Luis Rodríguez Téllez", rol: "Project Manager" }
    ]
  },
  {
    id: 3,
    titulo: "Duks In The Garden",
    descripcion: "Juego estilo pixel art para niños. Ayuda a mejorar la memoria visual de forma interactiva y divertida para los niños.",
    url: "https://joseluisrt2007.github.io/Ducks-In-The-Garden/",
    destacado: true,
    autores: [
      { nombre: "Juan Jordan", rol: "Lead Dev" },
      { nombre: "Cristiano Gerardo", rol: "Full Stack Dev" },
      { nombre: "Alessa Castellanos", rol: "Creative Designer" },
      { nombre: "José Luis Rodríguez Téllez", rol: "DevOps" }
    ]
  },
  {
    id: 4,
    titulo: "Space Invaders",
    descripcion: "Juego educativo estilo pixel art. Ayuda a mejorar la memoria visual de forma interactiva y divertida para los niños.",
    url: "https://joseluisrt2007.github.io/Space-Inviders/",
    destacado: true,
    autores: [
      { nombre: "Najib Lases García", rol: "Lead Dev" },
      { nombre: "José Luis Rodríguez Téllez", rol: "DevOps" }
    ]
  },
  {
    id: 5,
    titulo: "Pong",
    descripcion: "Juego clásico de Pong. Compite en un emocionante duelo de reflejos y precisión mientras mantienes la pelota en juego y superas a tu oponente.",
    url: "https://joseluisrt2007.github.io/Pong/",
    destacado: true,
    autores: [
      { nombre: "Najib Lases García", rol: "Lead Dev" },
      { nombre: "José Luis Rodríguez Téllez", rol: "DevOps" }
    ]
  },
  {
    id: 6,
    titulo: "Hypertymessi",
    descripcion: "Juego interactivo de memoria. Pon a prueba tu capacidad para recordar números mientras superas diferentes niveles de dificultad.",
    url: "https://joseluisrt2007.github.io/Hypertymessi/",
    destacado: true,
    autores: [
      { nombre: "Najib Lases García", rol: "Lead Dev" },
      { nombre: "José Luis Rodríguez Téllez", rol: "DevOps" }
    ]
  }


];


/* ═══════════════════════════════════════════════════════
   UTILIDADES
═══════════════════════════════════════════════════════ */

function cleanUrl(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); }
  catch { return url; }
}

/* Quita acentos y pasa a minúsculas, para que la búsqueda
   encuentre "jose" aunque el dato tenga "José" */
function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/* Determina si un proyecto coincide con el texto buscado,
   revisando título, descripción y nombres de autores */
function coincideConBusqueda(p, query) {
  if (!query) return true;
  const q = normalizar(query);
  if (normalizar(p.titulo).includes(q)) return true;
  if (normalizar(p.descripcion).includes(q)) return true;
  if (p.autores.some(a => normalizar(a.nombre).includes(q))) return true;
  return false;
}

/* Iniciales a partir del nombre completo */
function initials(nombre) {
  return nombre
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
}

/* Nombres para mostrar junto a los avatares */
function authorLabel(autores) {
  if (autores.length === 0) return '';
  if (autores.length === 1) return autores[0].nombre;
  if (autores.length === 2) return `${autores[0].nombre} & ${autores[1].nombre}`;
  return `${autores[0].nombre} +${autores.length - 1}`;
}

/* HTML de los avatares apilados */
function renderAvatars(autores) {
  return autores
    .slice(0, 4) // máximo 4 avatares visibles
    .map((a, i) => `<div class="avatar avatar--${i % 6}" title="${a.nombre} · ${a.rol}">${initials(a.nombre)}</div>`)
    .join('');
}


/* ═══════════════════════════════════════════════════════
   RENDER
═══════════════════════════════════════════════════════ */
function render(query = '') {
  const grid = document.getElementById('grid-proyectos');

  // Destacados primero, luego por id
  const ordenados = [...proyectos].sort((a, b) => {
    if (a.destacado && !b.destacado) return -1;
    if (!a.destacado &&  b.destacado) return  1;
    return a.id - b.id;
  });

  const filtrados = ordenados.filter(p => coincideConBusqueda(p, query));

  if (proyectos.length === 0) {
    grid.innerHTML = '<div class="empty">Aún no hay proyectos registrados.</div>';
  } else if (filtrados.length === 0) {
    grid.innerHTML = `<div class="empty">No se encontraron proyectos para "${query}".</div>`;
  } else {
    grid.innerHTML = filtrados.map((p, i) => `
    <a
      href="${p.url}"
      target="_blank"
      rel="noopener noreferrer"
      class="card${p.destacado ? ' card--featured' : ''}"
      style="animation-delay:${i * 50}ms"
      aria-label="Abrir ${p.titulo}"
    >
      ${p.destacado ? `
      <div class="card__badge">
        <span class="card__badge-dot"></span>
        Destacado
      </div>` : ''}

      <div class="card__head">
        <h2 class="card__title">${p.titulo}</h2>
        <svg class="card__arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 13L13 3M13 3H6M13 3v7"/>
        </svg>
      </div>

      <p class="card__description">${p.descripcion}</p>

      <div class="card__footer">
        <div class="authors">
          <div class="authors__avatars">
            ${renderAvatars(p.autores)}
          </div>
          <span class="authors__names">${authorLabel(p.autores)}</span>
        </div>
        <span class="card__url">${cleanUrl(p.url)}</span>
      </div>
    </a>
  `).join('');
  }

  // Contador en header (siempre muestra el total, no el filtrado)
  document.getElementById('count-num').textContent =
    String(proyectos.length).padStart(2, '0');
}

/* ═══════════════════════════════════════════════════════
   BUSCADOR — eventos
═══════════════════════════════════════════════════════ */
const buscadorInput = document.getElementById('buscador');
const limpiarBtn = document.getElementById('limpiar-busqueda');

buscadorInput.addEventListener('input', () => {
  const query = buscadorInput.value.trim();
  limpiarBtn.classList.toggle('hidden', query.length === 0);
  render(query);
});

limpiarBtn.addEventListener('click', () => {
  buscadorInput.value = '';
  limpiarBtn.classList.add('hidden');
  buscadorInput.focus();
  render();
});

render();
