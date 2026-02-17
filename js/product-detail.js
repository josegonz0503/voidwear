function formatoEuro(n) {
  const num = Number(n) || 0;
  return num.toFixed(2).replace(".", ",") + " €";
}

function estrellasTexto(rating, numReviews) {
  const r = Math.max(0, Math.min(5, Number(rating) || 0));
  const full = Math.floor(r);
  const half = (r - full) >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  const stars = "★".repeat(full) + (half ? "☆" : "") + "☆".repeat(empty);
  const n = Number(numReviews) || 0;
  return `${stars} (${n})`;
}

function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}
function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

async function cargarProducto(id) {
  try {
    const r = await fetch(`api/product.php?id=${encodeURIComponent(id)}`, { cache: "no-store" });
    if (r.ok) {
      const j = await r.json();
      if (j && j.ok && j.producto) return j.producto;
    }
  } catch (e) {}

  try {
    const r2 = await fetch("data/products.json", { cache: "no-store" });
    if (r2.ok) {
      const data = await r2.json();
      return (data || []).find(p => String(p.id) === String(id)) || null;
    }
  } catch (e) {}

  return null;
}

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  const producto = await cargarProducto(id);
  if (!producto) return;

  const elNombre = document.getElementById("detalleNombre");
  const elImg = document.getElementById("detalleImagen");
  const elPrecio = document.getElementById("detallePrecio");
  const elSelect = document.getElementById("detalleTalla");
  const elCant = document.getElementById("detalleCantidad");
  const btnAdd = document.getElementById("btnAddDetalle");
  const msg = document.getElementById("detalleMsg");

  const elDescCorta = document.getElementById("detalleDescripcionCorta");
  const elDescLarga = document.getElementById("detalleDescripcionLarga");
  const elRating = document.getElementById("detalleRating");
  const elLista = document.getElementById("detalleLista");
  const elOpiniones = document.getElementById("opinionesContenedor");

  if (elNombre) elNombre.textContent = producto.nombre || "Producto";
  if (elImg) {
    elImg.src = producto.imagen || "";
    elImg.alt = producto.nombre || "Producto";
  }

  if (elDescCorta && producto.descripcion_corta) elDescCorta.textContent = producto.descripcion_corta;
  if (elDescLarga && producto.descripcion_larga) elDescLarga.textContent = producto.descripcion_larga;

  if (elRating) {
    const rating = producto.rating ?? 4.0;
    const numReviews = producto.num_reviews ?? 0;
    elRating.textContent = estrellasTexto(rating, numReviews);
  }

  const precios = Array.isArray(producto.precios) ? producto.precios : [];

  if (elSelect) {
    elSelect.innerHTML = precios.length
      ? precios.map(p => `<option value="${Number(p.precio)}">${p.talla}</option>`).join("")
      : `<option value="0">Única</option>`;
  }

  const precioInicial = precios.length ? Number(precios[0].precio) : 0;
  if (elPrecio) elPrecio.textContent = formatoEuro(precioInicial);

  if (elSelect && elPrecio) {
    elSelect.addEventListener("change", () => {
      const pr = Number(elSelect.value) || 0;
      elPrecio.textContent = formatoEuro(pr);
    });
  }

  const detalles = Array.isArray(producto.detalles) ? producto.detalles : null;
  if (elLista && detalles && detalles.length) {
    elLista.innerHTML = detalles.map(d => `<li>${String(d)}</li>`).join("");
  }

  // Opiniones
  const opiniones = Array.isArray(producto.opiniones) ? producto.opiniones : null;
  if (elOpiniones && opiniones && opiniones.length) {
    elOpiniones.innerHTML = opiniones.map(op => {
      const autor = op.autor || "Cliente";
      const estrellas = "★".repeat(Math.max(0, Math.min(5, Number(op.estrellas)||0))) + "☆".repeat(5 - Math.max(0, Math.min(5, Number(op.estrellas)||0)));
      const comentario = op.comentario || "";
      return `
        <div class="review-card mb-5">
          <p class="font-semibold text-negro">${autor}</p>
          <p class="text-negro">${estrellas}</p>
          <p class="mt-2 text-negro">${comentario}</p>
        </div>
      `;
    }).join("");
  }

  if (btnAdd) {
    btnAdd.addEventListener("click", () => {
      const cantidad = Math.max(1, Number(elCant?.value) || 1);
      const precio = elSelect ? (Number(elSelect.value) || 0) : precioInicial;
      const talla = elSelect ? (elSelect.options[elSelect.selectedIndex]?.textContent || "") : "";

      let carrito = obtenerCarrito();

      const existe = carrito.find(p => String(p.id) === String(producto.id) && (p.talla || "") === talla);

      if (existe) {
        existe.cantidad += cantidad;
      } else {
        carrito.push({
          id: producto.id,
          nombre: producto.nombre,
          precio: precio,
          imagen: producto.imagen,
          talla: talla,
          cantidad: cantidad
        });
      }

      guardarCarrito(carrito);

      if (msg) {
        msg.textContent = "Producto añadido al carrito ✅";
        setTimeout(() => (msg.textContent = ""), 1500);
      } else {
        alert("Producto añadido al carrito");
      }
    });
  }
});
