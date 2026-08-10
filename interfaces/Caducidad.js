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
this.particulas = [];
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

this.actualizarParticulas(desgaste);
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

// La esfera terminó de caducar.
// Pero esperamos a que desaparezcan
// todas las partículas.

if (
  progreso >= 1 &&
  this.particulas.length === 0
) {

  this.termino = true;

}

  }
actualizarParticulas(desgaste) {

  // Solo genera partículas cuando está caducando
  if (desgaste > 0 && desgaste < 1) {

    // Probabilidad de generar una partícula
    if (random() < 0.35) {

      // Altura de la línea de desaparición
      let lineaY =
        this.y - this.radio +
        this.radio * 2 * desgaste;

      this.particulas.push({

        x:
          this.x +
          random(
            -this.radio,
            this.radio
          ),

        y: lineaY,

        vx: random(-0.4, 0.4),

        vy: random(-1.5, -0.5),

        tam: random(1.5, 4),

        alpha: random(120, 220)

      });

    }

  }


  // Actualizar partículas
  for (
    let i = this.particulas.length - 1;
    i >= 0;
    i--
  ) {

    let p = this.particulas[i];

    p.x += p.vx;
    p.y += p.vy;

    // Se frena un poquito
    p.vy += 0.01;

    p.alpha -= 4;


    // Eliminar cuando desaparece
    if (p.alpha <= 0) {

      this.particulas.splice(i, 1);

    }

  }

}
 dibujar() {

  let tiempoVivido =
    millis() - this.nacimiento;

  let progreso =
    constrain(
      tiempoVivido / this.vidaMaxima,
      0,
      1
    );


  // =========================
  // DESGASTE
  // =========================

  let desgaste =
    map(
      progreso,
      0.35,
      1,
      0,
      1
    );

  desgaste =
    constrain(
      desgaste,
      0,
      1
    );


  push();


  // =========================
  // ESFERA
  // =========================

  noStroke();

  fill(this.colorActual);

  circle(
    this.x,
    this.y,
    this.radio * 2
  );


  // =========================
  // MÁSCARA
  // =========================

  if (desgaste > 0) {

    let altura =
      this.radio * 2 * desgaste;

    noStroke();

    fill(20);

    rectMode(CENTER);

    rect(
      this.x,
      this.y - this.radio + altura / 2 -5,
      this.radio * 2 + 4,
      altura
    );

  }


  // =========================
  // PARTÍCULAS
  // =========================

  noStroke();

  for (let p of this.particulas) {

    fill(
      red(this.colorOriginal),
      green(this.colorOriginal),
      blue(this.colorOriginal),
      p.alpha
    );

    circle(
      p.x,
      p.y,
      p.tam
    );

  }


  pop();

}

}