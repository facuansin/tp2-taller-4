class Memoria {

  constructor() {

    this.registros = [];

    this.colores = [
      color(255, 80, 100),
      color(80, 180, 255),
      color(255, 190, 70),
      color(130, 255, 150),
      color(190, 120, 255),
      color(255, 120, 200)
    ];

    // Evita que un touch genere también un click
    this.ultimoTouch = 0;

    // Para controlar la distancia entre recuerdos al arrastrar
    this.ultimaX = -1000;
    this.ultimaY = -1000;

    this.distanciaMinima = 25;

  }

  crearSiHayDistancia(x, y) {

    let distancia = dist(
      x,
      y,
      this.ultimaX,
      this.ultimaY
    );

    if (distancia >= this.distanciaMinima) {

      this.crearMemoria(x, y);

      this.ultimaX = x;
      this.ultimaY = y;

    }

  }

  actualizar() {

  for (let r of this.registros) {

    // =========================
    // EXPANSIÓN DEL CÍRCULO
    // =========================

    // Se expande cada vez más lentamente
    r.velocidad *= 0.97;

    r.radio += r.velocidad;

    // Cuando llega a una velocidad mínima,
    // queda completamente quieto
    if (r.velocidad < 0.05) {

      r.velocidad = 0;

    }


    // =========================
    // DESGASTE DEL COLOR
    // =========================

    // El color tiene su propio ritmo,
    // independiente de la expansión
    r.colorProgreso += r.velocidadColor;

    r.colorProgreso = constrain(
      r.colorProgreso,
      0,
      1
    );


    // Calculamos el gris propio
    // de este color
    let gris = (
      red(r.colorOriginal) +
      green(r.colorOriginal) +
      blue(r.colorOriginal)
    ) / 3;


    // Creamos una versión
    // desaturada del color original
    let colorDesgastado = color(

      lerp(
        red(r.colorOriginal),
        gris,
        0.85
      ),

      lerp(
        green(r.colorOriginal),
        gris,
        0.85
      ),

      lerp(
        blue(r.colorOriginal),
        gris,
        0.85
      )

    );


    // Transición:
    // color vivo → color lavado
    r.colorActual = lerpColor(
      r.colorOriginal,
      colorDesgastado,
      r.colorProgreso
    );

  }

}

  dibujar() {

    background(20);

    for (let r of this.registros) {

      // Relleno
      noStroke();

      fill(r.colorActual);

      circle(
        r.x,
        r.y,
        r.radio * 2
      );

      // Marco
      noFill();

      stroke(r.colorActual);
      strokeWeight(3);

      circle(
        r.x,
        r.y,
        r.radio * 2
      );

    }

  }

  // =========================
  // COMPUTADORA
  // =========================

  mousePressed() {

    // Si acabamos de recibir un touch,
    // ignoramos el click generado por el celular
    if (millis() - this.ultimoTouch < 500) {

      return;

    }

    this.crearMemoria(
      mouseX,
      mouseY
    );

    this.ultimaX = mouseX;
    this.ultimaY = mouseY;

  }

  mouseDragged() {

    if (millis() - this.ultimoTouch < 500) {

      return;

    }

    this.crearSiHayDistancia(
      mouseX,
      mouseY
    );

  }

  // =========================
  // CELULAR
  // =========================

  touchStarted() {

    this.ultimoTouch = millis();

    // Creamos un recuerdo por cada dedo
    for (let i = 0; i < touches.length; i++) {

      this.crearMemoria(
        touches[i].x,
        touches[i].y
      );

      this.ultimaX = touches[i].x;
      this.ultimaY = touches[i].y;

    }

    // Evita scroll/zoom accidental del navegador
    return false;

  }

  touchMoved() {

    this.ultimoTouch = millis();

    for (let i = 0; i < touches.length; i++) {

      this.crearSiHayDistancia(
        touches[i].x,
        touches[i].y
      );

    }

    return false;

  }

  // =========================
  // CREAR MEMORIA
  // =========================

  crearMemoria(x, y) {

    let colorOriginal = random(this.colores);

    // Antes era random(3, 6)
    // Ahora los círculos se expanden aproximadamente la mitad
    let velocidadInicial = random(1.5, 3);

    this.registros.push({

  x: x,
  y: y,

  radio: 5,

  velocidad: velocidadInicial,
  velocidadInicial: velocidadInicial,

  colorOriginal: colorOriginal,
  colorActual: colorOriginal,

  colorProgreso: 0,
  velocidadColor: random(0.002, 0.005)

});

  }

}