/* =======================================================
   BLOKK. — main.js
   Validación de formulario, eventos y manipulación del DOM
   ======================================================= */

// Estado del carrito (se guarda en memoria mientras dura la sesión)
let carrito = [];

/* ---------------------------------------------------------
   1) MANIPULACIÓN DEL DOM: countdown del Drop 02
--------------------------------------------------------- */
const target = new Date('2025-07-15T00:00:00');

function actualizarCountdown() {
  const ahora = new Date();
  const diferencia = target - ahora;

  const dias    = document.getElementById('cd-days');
  const horas   = document.getElementById('cd-hours');
  const minutos = document.getElementById('cd-mins');
  const segundos = document.getElementById('cd-secs');

  if (!dias) return; // si la sección no existe, no truena

  if (diferencia <= 0) {
    dias.textContent = horas.textContent = minutos.textContent = segundos.textContent = '00';
    return;
  }

  dias.textContent     = String(Math.floor(diferencia / 86400000)).padStart(2, '0');
  horas.textContent    = String(Math.floor((diferencia % 86400000) / 3600000)).padStart(2, '0');
  minutos.textContent  = String(Math.floor((diferencia % 3600000) / 60000)).padStart(2, '0');
  segundos.textContent = String(Math.floor((diferencia % 60000) / 1000)).padStart(2, '0');
}

actualizarCountdown();
setInterval(actualizarCountdown, 1000);

/* ---------------------------------------------------------
   2) MANEJO DE EVENTOS + MANIPULACIÓN DEL DOM: agregar al carrito
--------------------------------------------------------- */
const botonesAgregar = document.querySelectorAll('.btn-agregar');
const contadorCarrito = document.getElementById('contador-carrito');
const btnCarrito = document.getElementById('btn-carrito');
const panelCarrito = document.getElementById('carrito-panel');
const listaCarrito = document.getElementById('carrito-lista');
const totalCarrito = document.getElementById('carrito-total');

botonesAgregar.forEach(boton => {
  boton.addEventListener('click', () => {
    const card = boton.closest('.producto-card');
    const nombre = card.dataset.nombre;
    const precio = Number(card.dataset.precio);

    // Agregar producto al arreglo del carrito
    carrito.push({ nombre, precio });

    // Manipulación del DOM: actualizar contador
    contadorCarrito.textContent = carrito.length;

    // Feedback visual en el botón clickeado
    boton.textContent = '✓ Agregado';
    boton.classList.add('agregado');
    setTimeout(() => {
      boton.textContent = '+ Agregar';
      boton.classList.remove('agregado');
    }, 1200);

    // Animación de pulso en el ícono del carrito
    btnCarrito.classList.add('pulse');
    setTimeout(() => btnCarrito.classList.remove('pulse'), 400);

    renderizarCarrito();
  });
});

/* ---------------------------------------------------------
   3) MANEJO DE EVENTOS: abrir/cerrar panel del carrito
--------------------------------------------------------- */
btnCarrito.addEventListener('click', () => {
  panelCarrito.classList.toggle('abierto');
});

// Cerrar el panel si se hace click fuera de él
document.addEventListener('click', (e) => {
  const esBotonCarrito = btnCarrito.contains(e.target);
  const esPanel = panelCarrito.contains(e.target);
  if (!esBotonCarrito && !esPanel) {
    panelCarrito.classList.remove('abierto');
  }
});

/* ---------------------------------------------------------
   MANIPULACIÓN DEL DOM: renderizar lista y total del carrito
--------------------------------------------------------- */
function renderizarCarrito() {
  if (carrito.length === 0) {
    listaCarrito.innerHTML = '<li class="carrito-vacio">Aún no agregas nada</li>';
    totalCarrito.textContent = '$0';
    return;
  }

  // Construye el HTML de la lista dinámicamente
  listaCarrito.innerHTML = carrito
    .map(item => `<li><span>${item.nombre}</span><span>$${item.precio}</span></li>`)
    .join('');

  const total = carrito.reduce((suma, item) => suma + item.precio, 0);
  totalCarrito.textContent = '$' + total.toLocaleString('es-MX');
}

/* ---------------------------------------------------------
   4) VALIDACIÓN DE FORMULARIO: newsletter
--------------------------------------------------------- */
const formNewsletter = document.getElementById('form-newsletter');
const inputEmail = document.getElementById('input-email');
const mensajeNewsletter = document.getElementById('mensaje-newsletter');

formNewsletter.addEventListener('submit', (evento) => {
  evento.preventDefault(); // evita que la página se recargue

  const valor = inputEmail.value.trim();
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validación 1: campo vacío
  if (valor === '') {
    mostrarMensaje('Escribe tu correo antes de continuar.', 'error');
    inputEmail.classList.add('input-error');
    return;
  }

  // Validación 2: formato de correo inválido
  if (!regexEmail.test(valor)) {
    mostrarMensaje('Ese correo no parece válido. Revísalo.', 'error');
    inputEmail.classList.add('input-error');
    return;
  }

  // Si todo está bien
  inputEmail.classList.remove('input-error');
  mostrarMensaje('¡Listo! Ya estás dentro del bloque 🔥', 'exito');
  formNewsletter.reset();
});

// Quita el mensaje de error en cuanto el usuario empieza a corregir
inputEmail.addEventListener('input', () => {
  inputEmail.classList.remove('input-error');
  mensajeNewsletter.textContent = '';
  mensajeNewsletter.className = 'form-mensaje';
});

function mostrarMensaje(texto, tipo) {
  mensajeNewsletter.textContent = texto;
  mensajeNewsletter.className = 'form-mensaje ' + tipo;
}