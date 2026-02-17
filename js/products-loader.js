async function cargarProductos() {
  const grid = document.getElementById("productosGrid");
  if (!grid) return;

  let productos = null;
  let bdDisponible = false;

  try {
    const r = await fetch("api/products.php", { cache: "no-store" });
    if (r.ok) {
      const j = await r.json();
      if (j && j.ok && Array.isArray(j.productos)) {
        bdDisponible = true;
        productos = j.productos; 
      }
    }
  } catch (e) {
    bdDisponible = false;
  }

  if (!bdDisponible) {
    try {
      const r2 = await fetch("data/products.json", { cache: "no-store" });
      if (r2.ok) productos = await r2.json();
    } catch (e) {}
  }

  if (!productos || !Array.isArray(productos) || productos.length === 0) {
    grid.innerHTML = bdDisponible
      ? "<p style='text-align:center;'>No hay productos en la base de datos.</p>"
      : "<p style='text-align:center;'>No se han podido cargar productos.</p>";
    return;
  }

  grid.innerHTML = productos.map(p => {
    const options = (p.precios || []).map(pr =>
      `<option value="${Number(pr.precio)}">${pr.talla} - ${Number(pr.precio).toFixed(2)}€</option>`
    ).join("");

    return `
      <div class="product-card" data-id="${p.id}">
        <img src="${p.imagen}" class="producto-imagen" alt="${p.nombre}">
        <h3>${p.nombre}</h3>

        <div class="producto-inferior">
          <select class="select-talla">
            ${options || `<option value="0">Única</option>`}
          </select>

          <button type="button">
            <img class="add-carrito" src="iconos/add_cart.png" alt="Añadir al carrito">
          </button>
        </div>
      </div>
    `;
  }).join("");

  grid.querySelectorAll(".product-card").forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("select") || e.target.closest("button")) return;
      const id = card.dataset.id;
      window.location.href = `detalle.html?id=${encodeURIComponent(id)}`;
    });
  });

  if (typeof window.reiniciarBotonesCarrito === "function") {
    window.reiniciarBotonesCarrito();
  }
}

document.addEventListener("DOMContentLoaded", cargarProductos);
