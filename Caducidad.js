class Caducidad {

  constructor() {

    this.elementos = [];

    this.colores = [
      color(255, 80, 100),
      color(80, 180, 255),
      color(255, 190, 70),
      color(130, 255, 150),
      color(190, 120, 255),
      color(255, 120, 200)
    ];

  }

  actualizar() {

    // Actualizar todos los elementos
    for (let i = this.elementos.length - 1; i >= 0; i--) {

      let elemento = this.elementos[i];

      elemento.actualizar();

      // Cuando termina su vida,
      // se elimina
      if (elemento.termino) {

        this.elementos.splice(i, 1);

      }

    }

  }

  dibujar() {

    background(20);

    // Dibujar elementos
    for (let elemento of this.elementos) {

      elemento.dibujar();

    }

  }

  // =========================
  // COMPUTADORA
  // =========================

  mousePressed() {

    this.crearElemento(
      mouseX,
      mouseY
    );

  }

  // =========================
  // CELULAR
  // =========================

  touchStarted() {

    for (let i = 0; i < touches.length; i++) {

      this.crearElemento(
        touches[i].x,
        touches[i].y
      );

    }

    return false;

  }

  // =========================
  // CREAR ELEMENTO
  // =========================

  crearElemento(x, y) {

    let colorInicial =
      random(this.colores);

    this.elementos.push(

      new ElementoCaducidad(
        x,
        y,
        colorInicial
      )

    );

  }

}


class ElementoCaducidad {

  constructor(x, y, colorInicial) {

    this.x = x;
    this.y = y;

    this.colorOriginal = colorInicial;
    this.colorActual = colorInicial;

    // Tamaño inicial
    this.radio = 8;

    // Tamaño máximo
    this.radioMaximo = random(35, 60);

    // Vida total del elemento
    this.vidaMaxima = random(5000, 8000);

    this.nacimiento = millis();

    this.termino = false;

    // Pequeño movimiento
    this.velocidad = p5.Vector.random2D();

    this.velocidad.mult(
      random(0.1, 0.4)
    );

  }

  actualizar() {

    // =========================
    // TIEMPO DE VIDA
    // =========================

    let tiempoVivido =
      millis() - this.nacimiento;

    let progreso =
      tiempoVivido / this.vidaMaxima;

    progreso = constrain(
      progreso,
      0,
      1
    );


    // =========================
    // MOVIMIENTO
    // =========================

    this.x += this.velocidad.x;
    this.y += this.velocidad.y;


    // Rebote suave
    if (
      this.x < this.radio ||
      this.x > width - this.radio
    ) {

      this.velocidad.x *= -1;

    }

    if (
      this.y < this.radio ||
      this.y > height - this.radio
    ) {

      this.velocidad.y *= -1;

    }


    // =========================
    // CRECIMIENTO
    // =========================

    // Crece durante la primera parte
    // de su vida
    let crecimiento =
      map(
        progreso,
        0,
        0.35,
        8,
        this.radioMaximo
      );

    crecimiento = constrain(
      crecimiento,
      8,
      this.radioMaximo
    );

    this.radio = crecimiento;


    // =========================
    // CADUCIDAD
    // =========================

    // A partir de cierto punto
    // empieza a desaparecer
    let desgaste =
      map(
        progreso,
        0.35,
        1,
        0,
        1
      );

    desgaste = constrain(
      desgaste,
      0,
      1
    );


    // Transparencia
    let alpha =
      255 * (1 - desgaste);


    // El color se vuelve más apagado
    let gris = (
      red(this.colorOriginal) +
      green(this.colorOriginal) +
      blue(this.colorOriginal)
    ) / 3;


    this.colorActual = color(

      lerp(
        red(this.colorOriginal),
        gris,
        desgaste * 0.8
      ),

      lerp(
        green(this.colorOriginal),
        gris,
        desgaste * 0.8
      ),

      lerp(
        blue(this.colorOriginal),
        gris,
        desgaste * 0.8
      ),

      alpha

    );


    // =========================
    // FIN
    // =========================

    if (progreso >= 1) {

      this.termino = true;

    }

  }

  dibujar() {

    // Relleno
    noStroke();

    fill(this.colorActual);

    circle(
      this.x,
      this.y,
      this.radio * 2
    );


    // Contorno
    noFill();

    stroke(this.colorActual);

    strokeWeight(2);

    circle(
      this.x,
      this.y,
      this.radio * 2
    );

  }

}