class GestorEscenas {

  constructor() {

  this.escena = "menu";

  // Acá vamos a guardar SOLAMENTE
  // la interfaz que está actualmente abierta.
  this.interfazActual = null;

  this.crearBotones();

}


  // =========================================
  // CREAR BOTONES
  // =========================================

  crearBotones() {

    this.botones = [];

    let nombres = [

      "Memoria",
      "Herencia",
      "Caducidad",

      "Identidad",
      "Empatia",
      "Colaboracion",

      "Incertidumbre",
      "Ansiedad",
      "Expectativa"

    ];


    // =========================================
    // TAMAÑO RESPONSIVO
    // =========================================

    // Usamos la dimensión menor para que
    // los cuadrados entren tanto en celular
    // como en computadora.

    let ladoReferencia =
      min(width, height);


    let lado = ladoReferencia * 0.22;

    // Límites para evitar cuadrados
    // demasiado chicos o gigantes.

    lado = constrain(
      lado,
      90,
      260
    );


    let separacion =
      ladoReferencia * 0.035;


    // Ancho total de la grilla
    let anchoTotal =
      lado * 3 +
      separacion * 2;


    // Alto total
    let altoTotal =
      lado * 3 +
      separacion * 2;


    let inicioX =
      width / 2 -
      anchoTotal / 2 +
      lado / 2;


    let inicioY =
      height / 2 -
      altoTotal / 2 +
      lado / 2;


    for (let i = 0; i < nombres.length; i++) {

      let columna = i % 3;

      let fila = floor(i / 3);


      let x =
        inicioX +
        columna *
        (lado + separacion);


      let y =
        inicioY +
        fila *
        (lado + separacion);


      // Cada fila pertenece a un subsistema

      let grupo = fila;


      this.botones.push(

        new Boton(
          x,
          y,
          lado,
          lado,
          nombres[i],
          grupo
        )

      );

    }

  }


  // =========================================
  // ACTUALIZAR
  // =========================================

  actualizar() {

  if (this.escena != "menu" && this.interfazActual) {

    this.interfazActual.actualizar();

  }

}


  // =========================================
  // DIBUJAR
  // =========================================

dibujar() {

  if (this.escena == "menu") {

    this.dibujarMenu();

  } else {

  if (this.interfazActual) {

    this.interfazActual.dibujar();

  }

  this.dibujarFlechaAtras();

}

}
dibujarFlechaAtras() {

  let lado =
    min(width, height);

  let margen =
    lado * 0.035;

  let tamaño =
    lado * 0.07;

  tamaño = constrain(
    tamaño,
    45,
    80
  );


  let x =
    margen + tamaño / 2;

  let y =
    margen + tamaño / 2;


  // =========================
  // ÁREA DE LA FLECHA
  // =========================

  let estaEncima =
    mouseX > x - tamaño / 2 &&
    mouseX < x + tamaño / 2 &&
    mouseY > y - tamaño / 2 &&
    mouseY < y + tamaño / 2;


  // Fondo sutil

  noStroke();

  if (estaEncima) {

    fill(60);

  } else {

    fill(30);

  }


  circle(
    x,
    y,
    tamaño
  );


  // =========================
  // FLECHA
  // =========================

  stroke(255);

  strokeWeight(
    max(2, tamaño * 0.06)
  );

  strokeCap(ROUND);

  strokeJoin(ROUND);


  noFill();


  beginShape();

  vertex(
    x + tamaño * 0.18,
    y - tamaño * 0.25
  );

  vertex(
    x - tamaño * 0.18,
    y
  );

  vertex(
    x + tamaño * 0.18,
    y + tamaño * 0.25
  );

  endShape();


  // Línea horizontal

  line(
    x - tamaño * 0.15,
    y,
    x + tamaño * 0.25,
    y
  );

}
entrarAInterfaz(nombre) {

  this.escena = nombre;

  // =========================================
  // CREAR UNA INSTANCIA NUEVA
  // =========================================

  if (nombre === "Memoria") {

    this.interfazActual = new Memoria();

  }

  else if (nombre === "Herencia") {

    this.interfazActual = new Herencia();

  }

  else if (nombre === "Caducidad") {

    this.interfazActual = new Caducidad();

  }

  else if (nombre === "Identidad") {

    this.interfazActual = new Identidad();

  }

  else if (nombre === "Empatia") {

    this.interfazActual = new Empatia();

  }

  else if (nombre === "Colaboracion") {

    this.interfazActual = new Colaboracion();

  }

  else if (nombre === "Incertidumbre") {

    this.interfazActual = new Incertidumbre();

  }

  else if (nombre === "Ansiedad") {

    this.interfazActual = new Ansiedad();

  }

  else if (nombre === "Expectativa") {

    this.interfazActual = new Expectativa();

  }

}
volverAlMenu() {

  this.escena = "menu";

  // Destruir la interacción actual
  this.interfazActual = null;

  // Limpiar selecciones
  for (let b of this.botones) {

    b.seleccionado = false;

  }

}
  // =========================================
  // MENU
  // =========================================

  dibujarMenu() {

    background(15);


    // =========================================
    // TITULO
    // =========================================

    fill(255);

    noStroke();

    textAlign(
      CENTER,
      CENTER
    );

    textSize(
      min(width, height) * 0.035
    );


    

    textSize(
      min(width, height) * 0.018
    );

    fill(150);


    


    // =========================================
    // BOTONES
    // =========================================

    for (let b of this.botones) {

      b.dibujar();

    }

  }


  // =========================================
  // CLICK / TOUCH
  // =========================================

  mousePressed() {

  // =========================================
  // ESTAMOS DENTRO DE UNA INTERFAZ
  // =========================================

  if (this.escena != "menu") {

    let lado = min(width, height);

    let margen = lado * 0.035;

    let tamaño = constrain(
      lado * 0.07,
      45,
      80
    );

    let x = margen + tamaño / 2;
    let y = margen + tamaño / 2;


    // =========================================
    // FLECHA ATRÁS
    // =========================================

    if (
      mouseX > x - tamaño / 2 &&
      mouseX < x + tamaño / 2 &&
      mouseY > y - tamaño / 2 &&
      mouseY < y + tamaño / 2
    ) {

      this.volverAlMenu();

      return;

    }


    // =========================================
    // CLICK DENTRO DE LA INTERFAZ
    // =========================================

    if (
      this.interfazActual &&
      this.interfazActual.mousePressed
    ) {

      this.interfazActual.mousePressed();

    }

    return;

  }


  // =========================================
  // ESTAMOS EN EL MENÚ
  // =========================================

  for (let b of this.botones) {

    if (b.click()) {

      // Primera pulsación:
      // seleccionar botón

      if (!b.seleccionado) {

        for (let otro of this.botones) {

          otro.seleccionado = false;

        }

        b.seleccionar();

      }

      // Segunda pulsación:
      // entrar a la interfaz

      else {

        this.entrarAInterfaz(b.texto);

        b.seleccionado = false;

      }

      break;

    }

  }

}


  // =========================================
  // TOUCH
  // =========================================

  touchStarted() {

    // En p5 normalmente touchStarted
    // termina generando mousePressed.
    // No necesitamos duplicar la interacción.

    return false;

  }


  // =========================================
  // MOUSE DRAGGED
  // =========================================

  mouseDragged() {

  if (
    this.escena != "menu" &&
    this.interfazActual &&
    this.interfazActual.mouseDragged
  ) {

    this.interfazActual.mouseDragged();

  }

}


  // =========================================
  // MOUSE RELEASED
  // =========================================

 mouseReleased() {

  if (this.escena != "menu") {

    if (
      this.interfaces[
        this.escena
      ].mouseReleased
    ) {

      this.interfaces[
        this.escena
      ].mouseReleased();

    }

  }

}


  // =========================================
  // TECLADO
  // =========================================

 keyPressed() {

  if (key === "Escape") {

    this.volverAlMenu();

  }

}


  // =========================================
  // RESIZE
  // =========================================

  redimensionar() {

    this.crearBotones();

  }

}