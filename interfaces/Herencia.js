class Herencia {

  constructor() {

    this.elementos = [];

    // Primer elemento
    this.elementos.push(
      new Legado(
        width / 2,
        height / 2,
        60,
        color(80, 180, 255),
        0
      )
    );

  }

  actualizar() {

    // Actualizar movimiento
    for (let elemento of this.elementos) {

      elemento.actualizar();

    }

    // Colisiones entre todos los círculos
    for (let i = 0; i < this.elementos.length; i++) {

      for (let j = i + 1; j < this.elementos.length; j++) {

        this.elementos[i].colisionar(
          this.elementos[j]
        );

      }

    }

  }

  dibujar() {

    background(20);

    // Dibujar conexiones primero
    for (let elemento of this.elementos) {

      if (elemento.padre != null) {

        stroke(
          red(elemento.colorActual),
          green(elemento.colorActual),
          blue(elemento.colorActual),
          80
        );

        strokeWeight(2);

        line(
          elemento.padre.x,
          elemento.padre.y,
          elemento.x,
          elemento.y
        );

      }

    }

    // Dibujar círculos
    for (let elemento of this.elementos) {

      elemento.dibujar();

    }

  }

  mousePressed() {

    this.crearDescendiente(
      mouseX,
      mouseY
    );

  }

  touchStarted() {

    for (let i = 0; i < touches.length; i++) {

      this.crearDescendiente(
        touches[i].x,
        touches[i].y
      );

    }

    return false;

  }

  crearDescendiente(x, y) {

    let padre = this.buscarPadre(x, y);

    if (padre == null) {
      return;
    }

    let nuevoX = x;
    let nuevoY = y;

    // Hereda el tamaño
    let nuevoRadio =
      padre.radio * random(0.65, 0.8);

    nuevoRadio = constrain(
      nuevoRadio,
      15,
      70
    );

    // Hereda el color con pequeñas variaciones
    let colorPadre = padre.colorActual;

    let nuevoColor = color(

      constrain(
        red(colorPadre) + random(-25, 25),
        0,
        255
      ),

      constrain(
        green(colorPadre) + random(-25, 25),
        0,
        255
      ),

      constrain(
        blue(colorPadre) + random(-25, 25),
        0,
        255
      )

    );

    // Hereda la velocidad
    let nuevaVelocidad =
      padre.velocidad.copy();

    nuevaVelocidad.rotate(
      random(-0.5, 0.5)
    );

    nuevaVelocidad.mult(
      random(0.8, 1.2)
    );

   // =========================================
// CREAR DOS HIJOS
// =========================================

for (let i = 0; i < 2; i++) {

  let hijoX =
    nuevoX + random(-20, 20);

  let hijoY =
    nuevoY + random(-20, 20);


  // Cada hijo tiene una pequeña
  // variación de tamaño

  let radioHijo =
    nuevoRadio * random(0.85, 1.05);


  // Cada hijo hereda el color
  // con una pequeña variación

  let colorHijo = color(

    constrain(
      red(nuevoColor) + random(-15, 15),
      0,
      255
    ),

    constrain(
      green(nuevoColor) + random(-15, 15),
      0,
      255
    ),

    constrain(
      blue(nuevoColor) + random(-15, 15),
      0,
      255
    )

  );


  let hijo = new Legado(
    hijoX,
    hijoY,
    radioHijo,
    colorHijo,
    padre.generacion
  );


  hijo.padre = padre;


  // Cada hijo recibe una dirección
  // ligeramente diferente

  hijo.velocidad =
    padre.velocidad.copy();

  hijo.velocidad.rotate(
    i === 0
      ? random(-0.8, -0.2)
      : random(0.2, 0.8)
  );

  hijo.velocidad.mult(
    random(0.8, 1.2)
  );


  this.elementos.push(hijo);

}

  }

  buscarPadre(x, y) {

    let padreMasCercano = null;

    let distanciaMinima = Infinity;

    for (let elemento of this.elementos) {

      let d = dist(
        x,
        y,
        elemento.x,
        elemento.y
      );

      if (
        d < elemento.radio + 40 &&
        d < distanciaMinima
      ) {

        distanciaMinima = d;

        padreMasCercano = elemento;

      }

    }

    return padreMasCercano;

  }

}


class Legado {

  constructor(
    x,
    y,
    radio,
    colorInicial,
    generacion
  ) {

    this.x = x;
    this.y = y;

    this.radio = radio;
this.radioObjetivo = radio;
this.radioLerp = 0;
    this.colorActual = colorInicial;

    this.generacion = generacion + 1;

    this.padre = null;

    // Movimiento
    this.velocidad =
      p5.Vector.random2D();

    this.velocidad.mult(
      random(0.3, 1)
    );

  }

  actualizar() {

  this.x += this.velocidad.x;
  this.y += this.velocidad.y;

  // =========================================
  // ANIMACIÓN DE CRECIMIENTO
  // =========================================

  this.radioLerp++;

  let objetivo;

  // Primeros 15 frames:
  // crece hasta su tamaño normal

  if (this.radioLerp < 15) {

    objetivo = this.radioObjetivo * 1.25;

  }

  // Después vuelve a su tamaño normal

  else {

    objetivo = this.radioObjetivo;

  }

  this.radio = lerp(
    this.radio,
    objetivo,
    0.12
  );


  // =========================================
  // REBOTE CONTRA LOS BORDES
  // =========================================

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


  // Mantener dentro de la pantalla

  this.x = constrain(
    this.x,
    this.radio,
    width - this.radio
  );

  this.y = constrain(
    this.y,
    this.radio,
    height - this.radio
  );

}

  colisionar(otro) {

    let dx = otro.x - this.x;
    let dy = otro.y - this.y;

    let distancia = sqrt(
      dx * dx +
      dy * dy
    );

    let distanciaMinima =
      this.radio + otro.radio;

    // Hay colisión
    if (distancia < distanciaMinima) {

      // Evitar división por cero
      if (distancia === 0) {

        dx = random(-1, 1);
        dy = random(-1, 1);

        distancia = sqrt(
          dx * dx +
          dy * dy
        );

      }

      // Vector normalizado
      dx /= distancia;
      dy /= distancia;

      // Cuánto están superpuestos
      let solapamiento =
        distanciaMinima - distancia;

      // Separar ambos círculos
      this.x -=
        dx * solapamiento * 0.5;

      this.y -=
        dy * solapamiento * 0.5;

      otro.x +=
        dx * solapamiento * 0.5;

      otro.y +=
        dy * solapamiento * 0.5;

      // Pequeño cambio de dirección
      // para que la colisión se sienta más natural
      let temp = this.velocidad.copy();

      this.velocidad.x =
        otro.velocidad.x;

      this.velocidad.y =
        otro.velocidad.y;

      otro.velocidad.x =
        temp.x;

      otro.velocidad.y =
        temp.y;

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