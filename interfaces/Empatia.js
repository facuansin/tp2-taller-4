class Empatia {

  constructor() {

    this.personas = [];

    this.colorGrupo = color(80, 180, 255);
    this.colorAyuda = color(255, 60, 60);

    for (let i = 0; i < 45; i++) {

      this.personas.push(
        new PersonaEmpatia(
          random(30, width - 30),
          random(30, height - 30),
          this.colorGrupo
        )
      );

    }

  }


  actualizar() {

    // =========================
    // MOVIMIENTO NORMAL
    // =========================

    for (let persona of this.personas) {

      persona.actualizar();

    }


    // =========================
    // AYUDA
    // =========================

    for (let afectado of this.personas) {

      if (!afectado.afectado) {
        continue;
      }


      let cantidadAyuda = 0;


      for (let ayudante of this.personas) {

        // No puede ayudarse a sí mismo
        if (ayudante === afectado) {
          continue;
        }


        // Solo los azules ayudan
        if (ayudante.afectado) {
          continue;
        }


        let distancia = dist(
          ayudante.x,
          ayudante.y,
          afectado.x,
          afectado.y
        );


        // =========================
        // CÍRCULO CERCANO
        // =========================

        if (distancia < 180) {

          cantidadAyuda++;

          // Se acerca CONSTANTEMENTE
          ayudante.acercarse(
            afectado.x,
            afectado.y
          );

        }

      }


      // =========================
      // RECUPERACIÓN
      // =========================

      // Solamente empieza a recuperarse
      // cuando al menos un azul está
      // realmente tocándolo.

      let estaSiendoAyudado = false;


      for (let ayudante of this.personas) {

        if (ayudante === afectado) {
          continue;
        }

        if (ayudante.afectado) {
          continue;
        }


        let distancia = dist(
          ayudante.x,
          ayudante.y,
          afectado.x,
          afectado.y
        );


        if (
          distancia <
          ayudante.radio +
          afectado.radio +
          5
        ) {

          estaSiendoAyudado = true;

          break;

        }

      }


      if (estaSiendoAyudado) {

        let velocidadRecuperacion = map(
          cantidadAyuda,
          1,
          10,
          0.002,
          0.015
        );

        velocidadRecuperacion =
          constrain(
            velocidadRecuperacion,
            0.002,
            0.015
          );


        afectado.recuperar(
          velocidadRecuperacion
        );

      }

    }

  }


  dibujar() {

    background(20);


    // =========================
    // LÍNEAS DE AYUDA
    // =========================

    for (let afectado of this.personas) {

      if (!afectado.afectado) {
        continue;
      }


      for (let ayudante of this.personas) {

        if (ayudante === afectado) {
          continue;
        }

        if (ayudante.afectado) {
          continue;
        }


        let distancia = dist(
          ayudante.x,
          ayudante.y,
          afectado.x,
          afectado.y
        );


        // Línea solamente mientras
        // el azul está cerca.

        if (distancia < 180) {

          let alpha = map(
            distancia,
            0,
            180,
            140,
            0
          );


          stroke(
            255,
            alpha
          );

          strokeWeight(1.5);


          line(
            ayudante.x,
            ayudante.y,
            afectado.x,
            afectado.y
          );

        }

      }

    }


    // =========================
    // CÍRCULOS
    // =========================

    for (let persona of this.personas) {

      persona.dibujar();

    }

  }


  // =========================
  // COMPUTADORA
  // =========================

  mousePressed() {

    this.intentarAfectar(
      mouseX,
      mouseY
    );

  }


  // =========================
  // CELULAR
  // =========================

  touchStarted() {

    for (let i = 0; i < touches.length; i++) {

      this.intentarAfectar(
        touches[i].x,
        touches[i].y
      );

    }

    return false;

  }


  // =========================
  // INTENTAR AFECTAR
  // =========================

  intentarAfectar(x, y) {

  let objetivo = null;

  for (let persona of this.personas) {

    let distancia = dist(
      x,
      y,
      persona.x,
      persona.y
    );

    if (
      distancia <
      persona.radio + 20
    ) {

      objetivo = persona;
      break;

    }

  }

  if (objetivo === null) {
    return;
  }

  if (objetivo.afectado) {
    return;
  }


  // Contar azules
  let cantidadAzules = 0;

  for (let persona of this.personas) {

    if (!persona.afectado) {
      cantidadAzules++;
    }

  }


  // Siempre dejamos uno azul
  if (cantidadAzules <= 1) {
    return;
  }


  // Se vuelve rojo
  objetivo.afectar(
    this.colorAyuda
  );

}

}


class PersonaEmpatia {

  constructor(
    x,
    y,
    colorInicial
  ) {

    this.x = x;
    this.y = y;

    this.radio = random(12, 20);


    // =========================
    // COLOR
    // =========================

    this.colorOriginal =
      colorInicial;

    this.colorActual =
      colorInicial;


    // =========================
    // MOVIMIENTO
    // =========================

    this.direccion =
      p5.Vector.random2D();

    this.velocidad =
      random(0.3, 0.8);


    // =========================
    // ESTADO
    // =========================

    this.afectado = false;

    this.retorno = 0;
    this.velocidadBase = random(0.3, 0.8);

this.velocidad = this.velocidadBase;
this.velocidadObjetivo = this.velocidadBase;
  }


  // =========================
  // ACTUALIZAR
  // =========================

  actualizar() {

  // Los círculos rojos permanecen quietos
  if (this.afectado) {
    return;
  }

  // La velocidad actual se acerca
  // progresivamente a la velocidad objetivo
  this.velocidad = lerp(
    this.velocidad,
    this.velocidadObjetivo,
    0.03
  );

  // Movimiento
  this.x +=
    this.direccion.x *
    this.velocidad;

  this.y +=
    this.direccion.y *
    this.velocidad;

  // Pequeños cambios de dirección
  if (random() < 0.01) {

    this.direccion.rotate(
      random(-0.4, 0.4)
    );

  }

  this.chequearPantalla();

}


  // =========================
  // ACERCARSE AL AFECTADO
  // =========================

  acercarse(x, y) {

  let objetivo = createVector(x, y);

  let posicion = createVector(
    this.x,
    this.y
  );

  let direccion = p5.Vector.sub(
    objetivo,
    posicion
  );

  if (direccion.mag() > 1) {

    direccion.normalize();

    // Cambia de dirección suavemente
    this.direccion.lerp(
      direccion,
      0.025
    );

    this.direccion.normalize();

    // En vez de aumentar la velocidad
    // de golpe, establecemos un objetivo
    this.velocidadObjetivo = 1.2;

  }

}


  // =========================
  // VOLVERSE ROJO
  // =========================

  afectar(colorNuevo) {

    this.afectado = true;

    this.retorno = 0;

    this.colorActual =
      colorNuevo;

  }


  // =========================
  // RECUPERARSE
  // =========================

  recuperar(velocidad) {

    this.retorno +=
      velocidad;


    this.retorno =
      constrain(
        this.retorno,
        0,
        1
      );


    // Rojo → azul
    this.colorActual =
      lerpColor(
        color(255, 60, 60),
        this.colorOriginal,
        this.retorno
      );


    // Recuperación completa
    if (
      this.retorno >= 1
    ) {

      this.terminarAyuda();

    }

  }


  // =========================
  // VOLVER A LA NORMALIDAD
  // =========================

  terminarAyuda() {

  this.afectado = false;

  this.retorno = 1;

  this.colorActual =
    this.colorOriginal;

  // Nueva dirección
  this.direccion =
    p5.Vector.random2D();

  this.direccion.normalize();

  // Vuelve progresivamente
  // a su velocidad normal
  this.velocidadObjetivo =
    this.velocidadBase;

}


  // =========================
  // BORDES
  // =========================

  chequearPantalla() {

    if (
      this.x < this.radio ||
      this.x > width - this.radio
    ) {

      this.direccion.x *= -1;

    }


    if (
      this.y < this.radio ||
      this.y > height - this.radio
    ) {

      this.direccion.y *= -1;

    }


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


  // =========================
  // DIBUJAR
  // =========================

  dibujar() {

    // Aura
    noStroke();

    fill(
      red(this.colorActual),
      green(this.colorActual),
      blue(this.colorActual),
      35
    );

    circle(
      this.x,
      this.y,
      this.radio * 3
    );


    // Círculo
    fill(
      this.colorActual
    );

    circle(
      this.x,
      this.y,
      this.radio * 2
    );


    // Contorno
    noFill();

    stroke(
      this.colorActual
    );

    strokeWeight(2);

    circle(
      this.x,
      this.y,
      this.radio * 2
    );

  }

}