class Identidad {

  constructor() {

    this.grupos = [];
    this.figuras = [];

    // Figura actualmente agarrada
    this.figuraArrastrada = null;

    // Desplazamiento del mouse respecto al centro
    this.offsetX = 0;
    this.offsetY = 0;

    this.tiempo = 0;


    // ==========================================================
    // COLORES
    // ==========================================================

    this.colores = [
      [255, 120, 30],   // NARANJA
      [80, 200, 255],   // CELESTE
      [240, 60, 60],    // ROJO
      [80, 220, 120]    // VERDE
    ];


    // ==========================================================
    // FORMAS DE CADA GRUPO
    // ==========================================================

    let formasGrupos = [

      "circulo",

      "cuadrado",

      "triangulo"

    ];


    // ==========================================================
    // CREAR LOS 3 GRUPOS
    // ==========================================================

    for (let i = 0; i < 3; i++) {

      let angulo =
        -HALF_PI +
        i * TWO_PI / 3;

      let radio =
        min(width, height) * 0.27;


      let x =
        width / 2 +
        cos(angulo) * radio;


      let y =
        height / 2 +
        sin(angulo) * radio;


      this.grupos.push({

        x: x,
        y: y,

        baseX: x,
        baseY: y,

        // Cada grupo tiene UNA forma
        forma: formasGrupos[i],

        figuras: [],

        ruido: random(1000)
      });
    }


    // ==========================================================
    // CREAR LAS FIGURAS
    // ==========================================================

    for (let g = 0; g < 3; g++) {

      for (let i = 0; i < 4; i++) {

        let grupo =
          this.grupos[g];


        let angulo =
          random(TWO_PI);


        let radio =
          random(45, 95);


        let figura = {

          // --------------------------------------------------
          // POSICIÓN
          // --------------------------------------------------

          x:
            grupo.x +
            cos(angulo) * radio,

          y:
            grupo.y +
            sin(angulo) * radio,


          objetivoX: 0,
          objetivoY: 0,


          // --------------------------------------------------
          // FORMA
          // --------------------------------------------------

          tipo:
            grupo.forma,


          // --------------------------------------------------
          // COLOR
          // --------------------------------------------------

          color:
            this.colores[i],


          // --------------------------------------------------
          // TAMAÑO
          // --------------------------------------------------

          tamano:
            random(25, 40),


          // --------------------------------------------------
          // IDENTIDAD
          // --------------------------------------------------

          grupoOriginal: g,


          // --------------------------------------------------
          // ESTADOS
          // --------------------------------------------------

          arrastrando: false,

          volviendo: false,


          // --------------------------------------------------
          // MOVIMIENTO
          // --------------------------------------------------

          ruido:
            random(1000),

          angulo:
            angulo,

          rotacion:
            random(TWO_PI)
        };


        grupo.figuras.push(figura);

        this.figuras.push(figura);
      }
    }
  }



  // ==========================================================
  // ACTUALIZAR
  // ==========================================================

  actualizar() {

    this.tiempo += 0.01;


    // ========================================================
    // DETECTAR SI EL MOUSE FUE SOLTADO
    // ========================================================

    if (
      this.figuraArrastrada != null &&
      !mouseIsPressed
    ) {

      this.soltarFigura();
    }



    // ========================================================
    // MOVIMIENTO DE LOS GRUPOS
    // ========================================================

    for (let grupo of this.grupos) {

      grupo.x =
        grupo.baseX +
        map(
          noise(
            grupo.ruido +
            this.tiempo * 0.15
          ),
          0,
          1,
          -25,
          25
        );


      grupo.y =
        grupo.baseY +
        map(
          noise(
            grupo.ruido +
            500 +
            this.tiempo * 0.15
          ),
          0,
          1,
          -25,
          25
        );
    }



    // ========================================================
    // ACTUALIZAR FIGURAS
    // ========================================================

    for (let figura of this.figuras) {


      // ======================================================
      // FIGURA ARRASTRADA
      // ======================================================

      if (figura.arrastrando) {

        if (mouseIsPressed) {

          figura.x =
            mouseX +
            this.offsetX;


          figura.y =
            mouseY +
            this.offsetY;
        }


        continue;
      }



      // ======================================================
      // FIGURA VOLVIENDO
      // ======================================================

      if (figura.volviendo) {

        let grupo =
          this.grupos[
            figura.grupoOriginal
          ];


        let angulo =
          figura.angulo +
          this.tiempo * 0.5;


        let radio = 55;


        figura.objetivoX =
          grupo.x +
          cos(angulo) * radio;


        figura.objetivoY =
          grupo.y +
          sin(angulo) * radio;


        // ATRACCIÓN

        figura.x =
          lerp(
            figura.x,
            figura.objetivoX,
            0.07
          );


        figura.y =
          lerp(
            figura.y,
            figura.objetivoY,
            0.07
          );


        // ¿YA VOLVIÓ?

        let distancia =
          dist(
            figura.x,
            figura.y,
            grupo.x,
            grupo.y
          );


        if (distancia < 70) {

          figura.volviendo =
            false;
        }


        continue;
      }



      // ======================================================
      // MOVIMIENTO NORMAL
      // ======================================================

      let grupo =
        this.grupos[
          figura.grupoOriginal
        ];


      let angulo =
        figura.angulo +
        this.tiempo * 0.4;


      let radio =
        45 +
        noise(
          figura.ruido +
          this.tiempo
        ) * 45;


      let objetivoX =
        grupo.x +
        cos(angulo) * radio;


      let objetivoY =
        grupo.y +
        sin(angulo) * radio;


      figura.x =
        lerp(
          figura.x,
          objetivoX,
          0.018
        );


      figura.y =
        lerp(
          figura.y,
          objetivoY,
          0.018
        );
    }
  }



  // ==========================================================
  // DIBUJAR
  // ==========================================================

  dibujar() {

    background(20);


    // ========================================================
    // CONEXIONES
    // ========================================================

    for (let grupo of this.grupos) {


      // ======================================================
      // GRUPO → FIGURAS
      // ======================================================

      for (let figura of grupo.figuras) {

        if (figura.arrastrando) {
          continue;
        }


        stroke(
          255,
          255,
          255,
          40
        );

        strokeWeight(1);


        line(
          grupo.x,
          grupo.y,
          figura.x,
          figura.y
        );
      }



      // ======================================================
      // FIGURA → FIGURA
      // ======================================================

      for (
        let i = 0;
        i < grupo.figuras.length;
        i++
      ) {

        let figuraA =
          grupo.figuras[i];


        if (figuraA.arrastrando) {
          continue;
        }


        for (
          let j = i + 1;
          j < grupo.figuras.length;
          j++
        ) {

          let figuraB =
            grupo.figuras[j];


          if (figuraB.arrastrando) {
            continue;
          }


          let distancia =
            dist(
              figuraA.x,
              figuraA.y,
              figuraB.x,
              figuraB.y
            );


          if (distancia < 150) {

            let alpha =
              map(
                distancia,
                0,
                150,
                80,
                0
              );


            stroke(
              255,
              255,
              255,
              alpha
            );


            line(
              figuraA.x,
              figuraA.y,
              figuraB.x,
              figuraB.y
            );
          }
        }
      }
    }



    // ========================================================
    // LÍNEAS DE REINCORPORACIÓN
    // ========================================================

    for (let figura of this.figuras) {

      if (!figura.volviendo) {
        continue;
      }


      let grupo =
        this.grupos[
          figura.grupoOriginal
        ];


      let distancia =
        dist(
          grupo.x,
          grupo.y,
          figura.x,
          figura.y
        );


      let alpha =
        map(
          distancia,
          50,
          600,
          220,
          40
        );


      alpha =
        constrain(
          alpha,
          40,
          220
        );


      // ------------------------------------------------------
      // LÍNEA PRINCIPAL
      // ------------------------------------------------------

      stroke(
        figura.color[0],
        figura.color[1],
        figura.color[2],
        alpha
      );

      strokeWeight(2);


      line(
        grupo.x,
        grupo.y,
        figura.x,
        figura.y
      );


      // ------------------------------------------------------
      // LÍNEAS SECUNDARIAS
      // ------------------------------------------------------

      stroke(
        figura.color[0],
        figura.color[1],
        figura.color[2],
        alpha * 0.35
      );

      strokeWeight(1);


      for (let i = 0; i < 5; i++) {

        let movimiento =
          sin(
            this.tiempo * 7 +
            i
          ) * 12;


        line(
          grupo.x + movimiento,
          grupo.y + movimiento,
          figura.x,
          figura.y
        );
      }
    }



    // ========================================================
    // DIBUJAR FIGURAS
    // ========================================================

    for (let figura of this.figuras) {

      push();


      translate(
        figura.x,
        figura.y
      );


      rotate(
        figura.rotacion
      );


      // ======================================================
      // ESCALA
      // ======================================================

      if (figura.arrastrando) {

        scale(1.45);

      } else if (figura.volviendo) {

        scale(
          1 +
          sin(
            this.tiempo * 8
          ) * 0.08
        );
      }


      // ======================================================
      // COLOR
      // ======================================================

      noFill();


      if (figura.arrastrando) {

        stroke(
          255,
          255,
          255
        );

      } else {

        stroke(
          figura.color[0],
          figura.color[1],
          figura.color[2]
        );
      }


      strokeWeight(3);



      // ======================================================
      // CÍRCULO
      // ======================================================

      if (
        figura.tipo ==
        "circulo"
      ) {

        ellipse(
          0,
          0,
          figura.tamano * 1.5,
          figura.tamano * 1.5
        );
      }



      // ======================================================
      // CUADRADO
      // ======================================================

      if (
        figura.tipo ==
        "cuadrado"
      ) {

        rectMode(CENTER);


        rect(
          0,
          0,
          figura.tamano * 1.5,
          figura.tamano * 1.5
        );
      }



      // ======================================================
      // TRIÁNGULO
      // ======================================================

      if (
        figura.tipo ==
        "triangulo"
      ) {

        let r =
          figura.tamano;


        triangle(
          0,
          -r,

          -r,
          r,

          r,
          r
        );
      }


      pop();
    }
  }



  // ==========================================================
  // AGARRAR FIGURA
  // ==========================================================

  agarrarFigura(x, y) {

    if (
      this.figuraArrastrada != null
    ) {
      return;
    }


    let encontrada = null;

    let distanciaMinima =
      Infinity;


    // Buscar la figura más cercana

    for (let figura of this.figuras) {

      if (figura.volviendo) {
        continue;
      }


      let distancia =
        dist(
          x,
          y,
          figura.x,
          figura.y
        );


      let radio =
        max(
          figura.tamano * 2,
          35
        );


      if (
        distancia < radio &&
        distancia < distanciaMinima
      ) {

        encontrada =
          figura;

        distanciaMinima =
          distancia;
      }
    }


    // ========================================================
    // SELECCIONAR
    // ========================================================

    if (encontrada != null) {

      this.figuraArrastrada =
        encontrada;


      encontrada.arrastrando =
        true;


      encontrada.volviendo =
        false;


      this.offsetX =
        encontrada.x - x;


      this.offsetY =
        encontrada.y - y;
    }
  }



  // ==========================================================
  // ARRASTRAR FIGURA
  // ==========================================================

  arrastrarFigura(x, y) {

    if (
      this.figuraArrastrada == null
    ) {
      return;
    }


    let figura =
      this.figuraArrastrada;


    figura.x =
      x +
      this.offsetX;


    figura.y =
      y +
      this.offsetY;
  }



  // ==========================================================
  // SOLTAR FIGURA
  // ==========================================================

  soltarFigura() {

    if (
      this.figuraArrastrada == null
    ) {
      return;
    }


    let figura =
      this.figuraArrastrada;


    // Dejar de arrastrar

    figura.arrastrando =
      false;


    // Su grupo la reclama

    figura.volviendo =
      true;


    // Liberar

    this.figuraArrastrada =
      null;
  }



  // ==========================================================
  // MOUSE PRESSED
  // ==========================================================

  mousePressed() {

    this.agarrarFigura(
      mouseX,
      mouseY
    );
  }



  // ==========================================================
  // MOUSE DRAGGED
  // ==========================================================

  mouseDragged() {

    this.arrastrarFigura(
      mouseX,
      mouseY
    );
  }



  // ==========================================================
  // MOUSE RELEASED
  // ==========================================================

  mouseReleased() {

    this.soltarFigura();
  }
}



// ============================================================
// VARIABLE PRINCIPAL
// ============================================================

let identidad;



// ============================================================
// SETUP
// ============================================================

function setup() {

  createCanvas(
    windowWidth,
    windowHeight
  );


  identidad =
    new Identidad();


  document.oncontextmenu =
    function() {
      return false;
    };
}



// ============================================================
// DRAW
// ============================================================

function draw() {

  identidad.actualizar();

  identidad.dibujar();
}



// ============================================================
// MOUSE
// ============================================================

function mousePressed() {

  identidad.mousePressed();
}


function mouseDragged() {

  identidad.mouseDragged();
}


function mouseReleased() {

  identidad.mouseReleased();
}



// ============================================================
// TOUCH
// ============================================================

function touchStarted() {

  if (touches.length > 0) {

    identidad.agarrarFigura(
      touches[0].x,
      touches[0].y
    );
  }

  return false;
}


function touchMoved() {

  if (touches.length > 0) {

    identidad.arrastrarFigura(
      touches[0].x,
      touches[0].y
    );
  }

  return false;
}


function touchEnded() {

  identidad.soltarFigura();

  return false;
}



// ============================================================
// REDIMENSIONAR
// ============================================================

function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );
}