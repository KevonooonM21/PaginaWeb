/* =======================================================
   BLOKK. — guard.js
   Redirige a 403.html si la página actual no está
   en la lista de páginas válidas del sitio.
   Incluir en TODAS las páginas como primer script:
   <script src="js/guard.js"></script>
   ======================================================= */

(function () {
  // Páginas válidas del sitio BLOKK.
  const PAGINAS_VALIDAS = [
    'index.html',
    'colecciones.html',
    'producto.html',
    'drops.html',
    'nosotros.html',
    '403.html',
    // Agrega aquí cualquier página nueva que crees
  ];

  // Obtiene el nombre del archivo actual (ej: "contacto.html")
  const ruta = window.location.pathname;
  const archivo = ruta.split('/').pop() || 'index.html';

  // Si es la raíz "/" o "/index.html" → válido
  if (archivo === '' || archivo === 'index.html') return;

  // Si el archivo actual NO está en la lista → 403
  if (!PAGINAS_VALIDAS.includes(archivo)) {
    window.location.replace('403.html');
  }
})();