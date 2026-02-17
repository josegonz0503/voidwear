/* js/accs.js */
$(function () {
  const CLAVE_STORAGE = "voidwear_acc_v1";

  const $panel = $("#accPanel");
  const $btnAbrir = $("#openAccFromMenu");
  const $btnCerrar = $("#accClose");
  const $estadoTxt = $("#accStatus");

  const $contraste = $("#accContrast");
  const $interlineado = $("#accLineHeight");
  const $espPalabras = $("#accWordSpacing");
  const $espLetras = $("#accLetterSpacing");
  const $menos = $("#accFontMinus");
  const $mas = $("#accFontPlus");
  const $reset = $("#accReset");

  const valoresPorDefecto = {
    contraste: "none",
    tamaño: 1.0,        // em
    interlineado: 1.4,  // unitless
    palabras: 0.0,      // em
    letras: 0.0         // em
  };

  const limitar = (n, min, max) => Math.min(Math.max(n, min), max);

  function cargar() {
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE_STORAGE) || "null");
      return { ...valoresPorDefecto, ...(guardado || {}) };
    } catch {
      return { ...valoresPorDefecto };
    }
  }

  function guardar() {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(estado));
  }

  function avisar(txt) {
    if ($estadoTxt.length) $estadoTxt.text(txt);
  }

  function aplicarContraste(modo) {
    $("body").removeClass("acc-theme-dark acc-theme-light");
    $("html").css({ filter: "", "-webkit-filter": "" });

    if (modo === "grayscale") {
      $("html").css({ filter: "grayscale(1)", "-webkit-filter": "grayscale(1)" });
    } else if (modo === "dark") {
      $("body").addClass("acc-theme-dark");
      $("html").css({ filter: "contrast(1.15)", "-webkit-filter": "contrast(1.15)" });
    } else if (modo === "light") {
      $("body").addClass("acc-theme-light");
      $("html").css({ filter: "contrast(1.1)", "-webkit-filter": "contrast(1.1)" });
    } else if (modo === "satHigh") {
      $("html").css({ filter: "saturate(1.8)", "-webkit-filter": "saturate(1.8)" });
    } else if (modo === "satLow") {
      $("html").css({ filter: "saturate(0.4)", "-webkit-filter": "saturate(0.4)" });
    }
  }

  function aplicarTexto() {
    $("body").css({
      "font-size": estado.tamaño.toFixed(2) + "em",
      "line-height": estado.interlineado,
      "word-spacing": estado.palabras.toFixed(2) + "em",
      "letter-spacing": estado.letras.toFixed(2) + "em"
    });
  }

  function sincronizarUI() {
    $contraste.val(estado.contraste);
    $interlineado.val(estado.interlineado);
    $espPalabras.val(estado.palabras);
    $espLetras.val(estado.letras);
  }

  function aplicarTodo() {
    aplicarContraste(estado.contraste);
    aplicarTexto();
    sincronizarUI();
  }

  // ✅ panel pegado al menú cuando se abre desde el menú lateral
  function aplicarPosicionDesdeMenu() {
    // Solo si existe el menú lateral en la página
    if ($("#menuLateral").length) $panel.addClass("acc-desde-menu");
  }

  function abrirPanel() {
    aplicarPosicionDesdeMenu();
    $panel.prop("hidden", false);
    $btnAbrir.attr("aria-expanded", "true");
    setTimeout(() => $contraste.trigger("focus"), 0);
  }

  function cerrarPanel() {
    $panel.removeClass("acc-desde-menu");
    $panel.prop("hidden", true);
    $btnAbrir.attr("aria-expanded", "false");
    $btnAbrir.trigger("focus");
  }

  // INIT
  let estado = cargar();
  aplicarTodo();

  // Toggle abrir/cerrar
  $btnAbrir.on("click", function () {
    const abierto = $(this).attr("aria-expanded") === "true";
    abierto ? cerrarPanel() : abrirPanel();
  });

  $btnCerrar.on("click", cerrarPanel);

  // ESC cierra
  $(document).on("keydown", function (e) {
    if (e.key === "Escape" && !$panel.prop("hidden")) cerrarPanel();
  });

  // Click fuera cierra
  $(document).on("mousedown", function (e) {
    if ($panel.prop("hidden")) return;
    const dentro = $(e.target).closest("#accPanel, #openAccFromMenu").length > 0;
    if (!dentro) cerrarPanel();
  });

  // Controles
  $contraste.on("change", function () {
    estado.contraste = this.value;
    aplicarContraste(estado.contraste);
    guardar();
    avisar("Contraste actualizado");
  });

  $interlineado.on("input change", function () {
    estado.interlineado = parseFloat(this.value);
    aplicarTexto();
    guardar();
  });

  $espPalabras.on("input change", function () {
    estado.palabras = parseFloat(this.value);
    aplicarTexto();
    guardar();
  });

  $espLetras.on("input change", function () {
    estado.letras = parseFloat(this.value);
    aplicarTexto();
    guardar();
  });

  $mas.on("click", function () {
    estado.tamaño = limitar(estado.tamaño + 0.1, 0.8, 1.8);
    aplicarTexto();
    guardar();
    avisar("Tamaño de letra aumentado");
  });

  $menos.on("click", function () {
    estado.tamaño = limitar(estado.tamaño - 0.1, 0.8, 1.8);
    aplicarTexto();
    guardar();
    avisar("Tamaño de letra reducido");
  });

  $reset.on("click", function () {
    estado = { ...valoresPorDefecto };
    aplicarTodo();
    guardar();
    avisar("Accesibilidad restablecida");
  });
});
