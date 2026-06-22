/* =======================================================
   BLOKK. — carrito.js
   Módulo compartido del carrito (localStorage)
   ======================================================= */

const CLAVE = 'blokk_carrito';

export function obtenerCarrito() {
  try { return JSON.parse(localStorage.getItem(CLAVE)) || []; }
  catch { return []; }
}

export function guardarCarrito(items) {
  localStorage.setItem(CLAVE, JSON.stringify(items));
  actualizarContador();
}

export function agregarAlCarrito(nombre, precio, imagen = '') {
  const carrito = obtenerCarrito();
  const existente = carrito.find(i => i.nombre === nombre);
  if (existente) {
    existente.cantidad = (existente.cantidad || 1) + 1;
  } else {
    carrito.push({ nombre, precio, imagen, cantidad: 1 });
  }
  guardarCarrito(carrito);
  return carrito;
}

export function eliminarDelCarrito(nombre) {
  const carrito = obtenerCarrito().filter(i => i.nombre !== nombre);
  guardarCarrito(carrito);
  return carrito;
}

export function calcularTotal(carrito) {
  return carrito.reduce((s, i) => s + i.precio * (i.cantidad || 1), 0);
}

export function actualizarContador() {
  const carrito = obtenerCarrito();
  const total = carrito.reduce((s, i) => s + (i.cantidad || 1), 0);
  document.querySelectorAll('.contador-carrito').forEach(el => {
    el.textContent = total;
  });
}

/* ----- Panel de carrito (HTML inyectado en cada página) ----- */
export function inicializarCarritoUI() {
  actualizarContador();

  const btn = document.getElementById('btn-carrito');
  const panel = document.getElementById('carrito-panel');
  if (!btn || !panel) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.classList.toggle('abierto');
    if (panel.classList.contains('abierto')) renderizarPanel();
  });

  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !panel.contains(e.target)) {
      panel.classList.remove('abierto');
    }
  });
}

export function renderizarPanel() {
  const lista = document.getElementById('carrito-lista');
  const totalEl = document.getElementById('carrito-total');
  if (!lista || !totalEl) return;

  const carrito = obtenerCarrito();
  if (carrito.length === 0) {
    lista.innerHTML = '<li class="carrito-vacio">Aún no agregas nada</li>';
    totalEl.textContent = '$0';
    return;
  }

  lista.innerHTML = carrito.map(item => `
    <li>
      <span>${item.nombre} ${item.cantidad > 1 ? `×${item.cantidad}` : ''}</span>
      <span class="item-controles">
        <span>$${(item.precio * item.cantidad).toLocaleString('es-MX')}</span>
        <button class="btn-quitar" data-nombre="${item.nombre}">✕</button>
      </span>
    </li>`).join('');

  totalEl.textContent = '$' + calcularTotal(carrito).toLocaleString('es-MX');

  lista.querySelectorAll('.btn-quitar').forEach(b => {
    b.addEventListener('click', () => {
      eliminarDelCarrito(b.dataset.nombre);
      renderizarPanel();
    });
  });
}