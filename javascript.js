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

const menu = document.getElementById('menuLateral');
const abrirMenu = document.querySelector('.menu-toggle'); 
const cerrarMenu = document.getElementById('cerrarMenu');

if (abrirMenu && menu) {
  abrirMenu.addEventListener('click', () => {
      menu.classList.add('active');
  });
}

if (cerrarMenu && menu) {
  cerrarMenu.addEventListener('click', () => {
      menu.classList.remove('active');
  });
}

document.addEventListener('click', (e) => {
    if (menu && abrirMenu) {
      if (!menu.contains(e.target) && !abrirMenu.contains(e.target)) {
          menu.classList.remove('active');
      }
    }
});

const categorias = document.querySelectorAll(".categoria");

categorias.forEach(categoria => {
    categoria.addEventListener("click", () => {
        const submenu = categoria.nextElementSibling;

        document.querySelectorAll(".submenu").forEach(s => {
            if (s !== submenu) s.style.display = "none";
        });
        document.querySelectorAll(".categoria").forEach(c => {
            if (c !== categoria) c.classList.remove("active");
        });

        submenu.style.display = submenu.style.display === "flex" ? "none" : "flex";
        categoria.classList.toggle("active");
    });
});


const filtroToggle = document.querySelector(".filtro-toggle");
const filtroPanel = document.getElementById("filtroPanel");
const cerrarFiltro = document.getElementById("cerrarFiltro");

if (filtroToggle && filtroPanel) {
  filtroToggle.addEventListener("click", () => {
      filtroPanel.classList.add("active");
  });
}

if (cerrarFiltro && filtroPanel) {
  cerrarFiltro.addEventListener("click", () => {
      filtroPanel.classList.remove("active");
  });

  filtroPanel.addEventListener("click", (e) => {
      if (!e.target.closest(".filtro-contenido")) {
          filtroPanel.classList.remove("active");
      }
  });
}




function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarProducto(producto) {
  let carrito = obtenerCarrito();

  const existe = carrito.find(p => p.nombre === producto.nombre && (p.talla || "") === (producto.talla || ""));

  if (existe) {
    existe.cantidad += producto.cantidad;
  } else {
    carrito.push(producto);
  }

  guardarCarrito(carrito);
  alert("Producto añadido al carrito");
}

function reiniciarBotonesCarrito(){
  document.querySelectorAll(".add-carrito").forEach(btn => {
    if (btn.dataset.bound === "1") return;
    btn.dataset.bound = "1";

    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      const card = btn.closest(".product-card") || btn.closest(".slide");
      if (!card) return;

      const nombre =
        card.querySelector("h3")?.innerText ||
        card.querySelector(".titulo-producto")?.innerText ||
        "Producto";

      const imagen =
        card.querySelector("img")?.getAttribute("src") || "";

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

// Inicial
document.addEventListener("DOMContentLoaded", () => {
  reiniciarBotonesCarrito();

  document.querySelectorAll(".slide").forEach(slide => {
    slide.addEventListener("click", (e) => {
      if (e.target.closest("button") || e.target.closest("select")) return;
      const id = slide.dataset.id;
      if (id) window.location.href = `detalle.html?id=${encodeURIComponent(id)}`;
    });
  });

  document.querySelectorAll(".product-card").forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("button") || e.target.closest("select") || e.target.closest("a")) return;
      const id = card.dataset.id;
      if (id) window.location.href = `detalle.html?id=${encodeURIComponent(id)}`;
    });
  });

  const carritoIcon = document.querySelector('header .icons-header img[alt="Carrito"]');
  if (carritoIcon) {
    carritoIcon.addEventListener("click", () => {
      window.location.href = "carrito.html";
    });
  }
});

window.reiniciarBotonesCarrito = reiniciarBotonesCarrito;
