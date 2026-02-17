/* =========================
   SLIDER
========================= */
let currentIndex = 0;

const slider = document.getElementById('slider');
const slides = slider ? slider.children : [];
const totalSlides = slides ? slides.length : 0;

function updateSlider() {
  if (!slider) return;
  slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function moveSlide(direction) {
  if (!slider) return;

  currentIndex += direction;
  if (currentIndex < 0) currentIndex = totalSlides - 1;
  if (currentIndex >= totalSlides) currentIndex = 0;

  updateSlider();
}

/* =========================
   MENÚ LATERAL (FIX DOBLE CLICK)
========================= */
const menu = document.getElementById('menuLateral');
const abrirMenuBtn = document.querySelector('.menu-toggle'); 
const cerrarMenuBtn = document.getElementById('cerrarMenu');

function openMenu() {
  if (!menu || !abrirMenuBtn) return;
  menu.classList.add('active');
  abrirMenuBtn.setAttribute('aria-expanded', 'true');

  // foco dentro del menú (opcional)
  setTimeout(() => {
    const first = menu.querySelector('button, a, input, select, textarea');
    if (first) first.focus();
  }, 0);
}

function closeMenu() {
  if (!menu || !abrirMenuBtn) return;
  menu.classList.remove('active');
  abrirMenuBtn.setAttribute('aria-expanded', 'false');
  abrirMenuBtn.focus();
}

if (abrirMenuBtn && menu) {
  abrirMenuBtn.addEventListener('click', (e) => {
    // CLAVE: si no paras, el listener global puede cerrarlo al instante
    e.preventDefault();
    e.stopPropagation();

    if (menu.classList.contains('active')) closeMenu();
    else openMenu();
  }, false);
}

if (cerrarMenuBtn && menu) {
  cerrarMenuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeMenu();
  }, false);
}

// Click fuera -> cierra (en captura para que no dependa del orden)
document.addEventListener('click', (e) => {
  if (!menu || !abrirMenuBtn) return;

  const clickDentroMenu = menu.contains(e.target);
  const clickEnBoton = abrirMenuBtn.contains(e.target);

  if (!clickDentroMenu && !clickEnBoton) {
    closeMenu();
  }
}, true);

// ESC cierra menú
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu && menu.classList.contains('active')) {
    closeMenu();
  }
});

/* =========================
   SUBMENÚS (categorías)
   (usa hidden, no display:flex)
========================= */
document.querySelectorAll(".categoria[aria-controls]").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const id = btn.getAttribute("aria-controls");
    const submenu = document.getElementById(id);
    if (!submenu) return;

    const expanded = btn.getAttribute("aria-expanded") === "true";

    // Cierra otros
    document.querySelectorAll(".submenu").forEach(s => {
      if (s !== submenu) s.hidden = true;
    });
    document.querySelectorAll(".categoria[aria-controls]").forEach(b => {
      if (b !== btn) b.setAttribute("aria-expanded", "false");
    });

    // Toggle actual
    btn.setAttribute("aria-expanded", String(!expanded));
    submenu.hidden = expanded;
  });
});

/* =========================
   FILTRO PANEL
========================= */
const filtroToggleBtn = document.querySelector(".filtro-toggle");
const filtroPanel = document.getElementById("filtroPanel");
const cerrarFiltroBtn = document.getElementById("cerrarFiltro");

function openFilter() {
  if (!filtroPanel || !filtroToggleBtn) return;
  filtroPanel.classList.add("active");
  filtroToggleBtn.setAttribute("aria-expanded", "true");
}

function closeFilter() {
  if (!filtroPanel || !filtroToggleBtn) return;
  filtroPanel.classList.remove("active");
  filtroToggleBtn.setAttribute("aria-expanded", "false");
  filtroToggleBtn.focus();
}

if (filtroToggleBtn && filtroPanel) {
  filtroToggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (filtroPanel.classList.contains("active")) closeFilter();
    else openFilter();
  });
}

if (cerrarFiltroBtn && filtroPanel) {
  cerrarFiltroBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeFilter();
  });

  // Click fuera del contenido del filtro
  filtroPanel.addEventListener("click", (e) => {
    if (!e.target.closest(".filtro-contenido")) {
      closeFilter();
    }
  });
}

// ESC cierra filtros
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && filtroPanel && filtroPanel.classList.contains("active")) {
    closeFilter();
  }
});

/* =========================
   CARRITO (localStorage)
========================= */
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarProducto(producto) {
  let carrito = obtenerCarrito();

  const existe = carrito.find(p => p.nombre === producto.nombre && (p.talla || "") === (producto.talla || ""));

  if (existe) existe.cantidad += producto.cantidad;
  else carrito.push(producto);

  guardarCarrito(carrito);
  alert("Producto añadido al carrito");
}

function reiniciarBotonesCarrito() {
  document.querySelectorAll(".add-carrito").forEach(btn => {
    if (btn.dataset.bound === "1") return;
    btn.dataset.bound = "1";

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const card = btn.closest(".product-card") || btn.closest(".slide");
      if (!card) return;

      const nombre =
        card.querySelector("h3")?.innerText ||
        card.querySelector(".titulo-producto")?.innerText ||
        "Producto";

      const imagen = card.querySelector("img")?.getAttribute("src") || "";

      const select = card.querySelector(".select-talla");
      const precio = select ? Number(select.value) : 0;
      const talla = select
        ? (select.options[select.selectedIndex]?.textContent.split("-")[0]?.trim() || "")
        : "";

      agregarProducto({
        id: card.dataset.id || null,
        nombre,
        precio,
        imagen,
        talla,
        cantidad: 1
      });
    });
  });
}

/* =========================
   INICIAL
========================= */
document.addEventListener("DOMContentLoaded", () => {
  reiniciarBotonesCarrito();

  // Click en slide -> detalle
  document.querySelectorAll(".slide").forEach(slide => {
    slide.addEventListener("click", (e) => {
      if (e.target.closest("button") || e.target.closest("select") || e.target.closest("a")) return;
      const id = slide.dataset.id;
      if (id) window.location.href = `detalle.html?id=${encodeURIComponent(id)}`;
    });
  });

  // Click en product-card -> detalle (si existe)
  document.querySelectorAll(".product-card").forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("button") || e.target.closest("select") || e.target.closest("a")) return;
      const id = card.dataset.id;
      if (id) window.location.href = `detalle.html?id=${encodeURIComponent(id)}`;
    });
  });

  // Carrito (en tu HTML actual es <a aria-label="Carrito">)
  const carritoLink = document.querySelector('header .icons-header a[aria-label="Carrito"]');
  if (carritoLink) {
    carritoLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "carrito.html";
    });
  }
});

// Por si otros scripts lo llaman
window.reiniciarBotonesCarrito = reiniciarBotonesCarrito;
