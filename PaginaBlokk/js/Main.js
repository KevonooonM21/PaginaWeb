import {
  inicializarCarritoUI,
  agregarAlCarrito,
  renderizarPanel
} from './carrito.js';

inicializarCarritoUI();

document.querySelectorAll('.btn-agregar').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();

    const card = btn.closest('.producto-card');
    agregarAlCarrito(card.dataset.nombre, Number(card.dataset.precio));
    renderizarPanel();
    document.getElementById('carrito-panel').classList.add('abierto');

    btn.textContent = '✓ Agregado';
    btn.classList.add('agregado');
    setTimeout(() => {
      btn.textContent = '+ Agregar';
      btn.classList.remove('agregado');
    }, 1200);

    const btnNav = document.getElementById('btn-carrito');
    if (btnNav) {
      btnNav.classList.add('pulse');
      setTimeout(() => btnNav.classList.remove('pulse'), 400);
    }
  });
});

const targetDrop = new Date('2026-07-15T00:00:00');

function actualizarCountdown() {
  const dias     = document.getElementById('cd-days');
  const horas    = document.getElementById('cd-hours');
  const minutos  = document.getElementById('cd-mins');
  const segundos = document.getElementById('cd-secs');

  if (!dias) return;

  const diferencia = targetDrop - new Date();

  if (diferencia <= 0) {
    [dias, horas, minutos, segundos].forEach(el => (el.textContent = '00'));
    return;
  }

  dias.textContent     = String(Math.floor(diferencia / 86400000)).padStart(2, '0');
  horas.textContent    = String(Math.floor((diferencia % 86400000) / 3600000)).padStart(2, '0');
  minutos.textContent  = String(Math.floor((diferencia % 3600000) / 60000)).padStart(2, '0');
  segundos.textContent = String(Math.floor((diferencia % 60000) / 1000)).padStart(2, '0');
}

actualizarCountdown();
setInterval(actualizarCountdown, 1000);

const cards = document.querySelectorAll('.producto-card');

cards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    cards.forEach(c => c.classList.add('opaca'));
    card.classList.remove('opaca');
    card.classList.add('destacada');
  });

  card.addEventListener('mouseleave', () => {
    cards.forEach(c => c.classList.remove('opaca', 'destacada'));
  });
});

const formNewsletter    = document.getElementById('form-newsletter');
const inputEmail        = document.getElementById('input-email');
const mensajeNewsletter = document.getElementById('mensaje-newsletter');

if (formNewsletter) {
  formNewsletter.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const valor      = inputEmail.value.trim();
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (valor === '') {
      mostrarMensaje('Escribe tu correo antes de continuar.', 'error');
      inputEmail.classList.add('input-error');
      return;
    }

    if (!regexEmail.test(valor)) {
      mostrarMensaje('Ese correo no parece válido. Revísalo.', 'error');
      inputEmail.classList.add('input-error');
      return;
    }

    inputEmail.classList.remove('input-error');
    mostrarMensaje('¡Listo! Ya estás dentro del bloque 🔥', 'exito');
    formNewsletter.reset();
  });

  inputEmail.addEventListener('input', () => {
    inputEmail.classList.remove('input-error');
    mensajeNewsletter.textContent = '';
    mensajeNewsletter.className   = 'form-mensaje';
  });
}

function mostrarMensaje(texto, tipo) {
  mensajeNewsletter.textContent = texto;
  mensajeNewsletter.className   = 'form-mensaje ' + tipo;
}