class Colaboracion {

    constructor() {

        this.grupos = [];
        this.figurasAisladas = [];
        this.figuraArrastrada = null;

        this.iniciarSistema();
    }


    iniciarSistema() {

        // =========================================
        // TRIÁNGULOS
        // =========================================

        let triangulos = new Grupo(
            "triangulo",
            width * 0.25,
            height * 0.30
        );

        // =========================================
        // CUADRADOS
        // =========================================

        let cuadrados = new Grupo(
            "cuadrado",
            width * 0.70,
            height * 0.35
        );

        // =========================================
        // CÍRCULOS
        // =========================================

        let circulos = new Grupo(
            "circulo",
            width * 0.45,
            height * 0.70
        );


        // =========================================
        // CANTIDAD DE FIGURAS
        // =========================================

        for (let i = 0; i < 8; i++) {

            triangulos.agregarFigura(
                new Figura(
                    "triangulo",
                    triangulos.pos.x,
                    triangulos.pos.y
                )
            );


            cuadrados.agregarFigura(
                new Figura(
                    "cuadrado",
                    cuadrados.pos.x,
                    cuadrados.pos.y
                )
            );


            circulos.agregarFigura(
                new Figura(
                    "circulo",
                    circulos.pos.x,
                    circulos.pos.y
                )
            );
        }


        this.grupos.push(triangulos);
        this.grupos.push(cuadrados);
        this.grupos.push(circulos);
    }


    // =====================================================
    // ACTUALIZAR
    // =====================================================

    actualizar() {

        // =========================================
        // ACTUALIZAR GRUPOS
        // =========================================

        for (let grupo of this.grupos) {

            grupo.actualizar();
        }


        // =========================================
        // FIGURAS AISLADAS
        // =========================================

        for (
            let i = this.figurasAisladas.length - 1;
            i >= 0;
            i--
        ) {

            let figura =
                this.figurasAisladas[i];


            // Mientras el usuario la arrastra
            // no puede reincorporarse.

            if (
                figura ===
                this.figuraArrastrada
            ) {

                continue;
            }


            let grupo =
                this.buscarGrupoCercano(
                    figura
                );


            if (grupo !== null) {

                figura.reincorporando = true;


                let objetivo =
                    grupo.pos.copy();


                let direccion =
                    p5.Vector.sub(
                        objetivo,
                        figura.pos
                    );


                let distancia =
                    direccion.mag();


                // =====================================
                // MOVIMIENTO HACIA EL GRUPO
                // =====================================

                if (distancia > 45) {

                    direccion.normalize();


                    // Aceleración hacia el grupo

                    direccion.mult(0.22);


                    figura.vel.add(
                        direccion
                    );


                    figura.vel.limit(
                        4.5
                    );


                    figura.pos.add(
                        figura.vel
                    );
                }


                // =====================================
                // INCORPORACIÓN
                // =====================================

                else {

                    grupo.reincorporar(
                        figura
                    );


                    this.figurasAisladas.splice(
                        i,
                        1
                    );
                }

            } else {

                figura.reincorporando = false;

                // La figura permanece quieta
                // hasta que un grupo se acerque.

                figura.vel.set(
                    0,
                    0
                );
            }
        }
    }


    // =====================================================
    // DIBUJAR
    // =====================================================

    dibujar() {

        background(20);


        // Dibujar grupos

        for (let grupo of this.grupos) {

            grupo.dibujar();
        }


        // Dibujar figuras aisladas

        for (
            let figura of this.figurasAisladas
        ) {

            figura.dibujar();
        }
    }


    // =====================================================
    // BUSCAR GRUPO CERCANO
    // =====================================================

    buscarGrupoCercano(figura) {

        let distanciaMinima = 220;

        let grupoCercano = null;


        for (let grupo of this.grupos) {

            let distancia =
                dist(
                    figura.pos.x,
                    figura.pos.y,
                    grupo.pos.x,
                    grupo.pos.y
                );


            if (
                distancia <
                distanciaMinima
            ) {

                distanciaMinima =
                    distancia;

                grupoCercano =
                    grupo;
            }
        }


        return grupoCercano;
    }


    // =====================================================
    // BUSCAR FIGURA
    // =====================================================

    buscarFigura(x, y) {

        // =========================================
        // FIGURAS DE LOS GRUPOS
        // =========================================

        for (let grupo of this.grupos) {

            for (
                let i =
                    grupo.figuras.length - 1;
                i >= 0;
                i--
            ) {

                let figura =
                    grupo.figuras[i];


                if (
                    figura.contiene(
                        x,
                        y
                    )
                ) {

                    return figura;
                }
            }
        }


        // =========================================
        // FIGURAS AISLADAS
        // =========================================

        for (
            let i =
                this.figurasAisladas.length - 1;
            i >= 0;
            i--
        ) {

            let figura =
                this.figurasAisladas[i];


            if (
                figura.contiene(
                    x,
                    y
                )
            ) {

                return figura;
            }
        }


        return null;
    }


    // =====================================================
    // SEPARAR FIGURA
    // =====================================================

    separarFigura(figura) {

        // Si ya está aislada,
        // no hacer nada.

        if (
            this.figurasAisladas.includes(
                figura
            )
        ) {

            return;
        }


        // Sacarla del grupo

        if (
            figura.grupo !== null
        ) {

            figura.grupo.separar(
                figura
            );
        }


        figura.grupo = null;

        figura.offset = null;

        figura.vel.set(
            0,
            0
        );

        figura.reincorporando =
            false;


        this.figurasAisladas.push(
            figura
        );
    }


    // =====================================================
    // MOUSE
    // =====================================================

    mousePressed() {

        let figura =
            this.buscarFigura(
                mouseX,
                mouseY
            );


        if (
            figura !== null
        ) {

            this.separarFigura(
                figura
            );


            this.figuraArrastrada =
                figura;
        }
    }


    mouseDragged() {

        if (
            this.figuraArrastrada !== null
        ) {

            this.figuraArrastrada.pos.x =
                mouseX;

            this.figuraArrastrada.pos.y =
                mouseY;


            this.figuraArrastrada.vel.set(
                0,
                0
            );
        }
    }


    mouseReleased() {

        if (
            this.figuraArrastrada !== null
        ) {

            this.figuraArrastrada.vel.set(
                0,
                0
            );


            this.figuraArrastrada =
                null;
        }
    }


    // =====================================================
    // TOUCH
    // =====================================================

    touchStarted() {

        if (
            touches.length === 0
        ) {

            return false;
        }


        let toque =
            touches[0];


        let figura =
            this.buscarFigura(
                toque.x,
                toque.y
            );


        if (
            figura !== null
        ) {

            this.separarFigura(
                figura
            );


            this.figuraArrastrada =
                figura;
        }


        return false;
    }


    touchMoved() {

        if (
            this.figuraArrastrada !== null &&
            touches.length > 0
        ) {

            let toque =
                touches[0];


            this.figuraArrastrada.pos.x =
                toque.x;

            this.figuraArrastrada.pos.y =
                toque.y;


            this.figuraArrastrada.vel.set(
                0,
                0
            );
        }


        return false;
    }


    touchEnded() {

        if (
            this.figuraArrastrada !== null
        ) {

            this.figuraArrastrada.vel.set(
                0,
                0
            );


            this.figuraArrastrada =
                null;
        }


        return false;
    }
}



// =====================================================
// GRUPO
// =====================================================

class Grupo {

    constructor(
        tipo,
        x,
        y
    ) {

        this.tipo =
            tipo;


        this.pos =
            createVector(
                x,
                y
            );


        // =========================================
        // VELOCIDAD INICIAL
        // =========================================

        this.vel =
            p5.Vector.random2D();


        this.vel.setMag(
            random(
                1.5,
                2.4
            )
        );


        this.direccion =
            this.vel.copy();


        this.figuras = [];


        // Radio de distribución
        // de las figuras

        this.radio =
            140;


        // Semilla independiente
        // para el movimiento

        this.ruido =
            random(10000);
    }


    // =====================================================
    // AGREGAR FIGURA
    // =====================================================

    agregarFigura(figura) {

        figura.grupo =
            this;


        figura.offset =
            p5.Vector.random2D();


        figura.offset.mult(
            random(
                35,
                this.radio
            )
        );


        this.figuras.push(
            figura
        );


        this.actualizarPosicionFigura(
            figura
        );
    }


    // =====================================================
    // ACTUALIZAR GRUPO
    // =====================================================

    actualizar() {

        // =========================================
        // CAMBIO SUAVE DE DIRECCIÓN
        // =========================================

        let variacion =
            noise(
                this.ruido,
                frameCount * 0.001
            );


        let giro =
            map(
                variacion,
                0,
                1,
                -0.025,
                0.025
            );


        this.vel.rotate(
            giro
        );


        // =========================================
        // VELOCIDAD MÍNIMA
        // =========================================

        if (
            this.vel.mag() < 1.5
        ) {

            this.vel.setMag(
                1.5
            );
        }


        // =========================================
        // VELOCIDAD MÁXIMA
        // =========================================

        this.vel.limit(
            3.8
        );


        // =========================================
        // MOVIMIENTO
        // =========================================

        this.pos.add(
            this.vel
        );


        this.direccion =
            this.vel.copy();


        // =========================================
        // BORDES
        // =========================================
        //
        // Rebote físico.
        // NO hay teletransportación.

        let margen =
            this.radio;


        if (
            this.pos.x <
            margen
        ) {

            this.pos.x =
                margen;


            this.vel.x =
                abs(
                    this.vel.x
                );
        }


        if (
            this.pos.x >
            width - margen
        ) {

            this.pos.x =
                width - margen;


            this.vel.x =
                -abs(
                    this.vel.x
                );
        }


        if (
            this.pos.y <
            margen
        ) {

            this.pos.y =
                margen;


            this.vel.y =
                abs(
                    this.vel.y
                );
        }


        if (
            this.pos.y >
            height - margen
        ) {

            this.pos.y =
                height - margen;


            this.vel.y =
                -abs(
                    this.vel.y
                );
        }


        // =========================================
        // MOVIMIENTO DE LAS FIGURAS
        // =========================================

        for (
            let figura of this.figuras
        ) {

            // Rotación lenta del sistema

            figura.offset.rotate(
                0.002
            );


            this.actualizarPosicionFigura(
                figura
            );
        }
    }


    // =====================================================
    // POSICIÓN DE FIGURAS
    // =====================================================

    actualizarPosicionFigura(
        figura
    ) {

        let objetivo =
            p5.Vector.add(
                this.pos,
                figura.offset
            );


        // Las figuras siguen al grupo
        // con mayor respuesta.

        figura.pos.lerp(
            objetivo,
            0.12
        );


        // Dirección colectiva

        figura.vel.lerp(
            this.vel,
            0.08
        );
    }


    // =====================================================
    // DIBUJAR
    // =====================================================

    dibujar() {

        // =========================================
        // LÍNEAS DE CONEXIÓN
        // =========================================

        for (
            let i = 0;
            i < this.figuras.length;
            i++
        ) {

            for (
                let j = i + 1;
                j < this.figuras.length;
                j++
            ) {

                let a =
                    this.figuras[i];


                let b =
                    this.figuras[j];


                let distancia =
                    dist(
                        a.pos.x,
                        a.pos.y,
                        b.pos.x,
                        b.pos.y
                    );


                let opacidad =
                    map(
                        distancia,
                        0,
                        260,
                        100,
                        0,
                        true
                    );


                // =================================
                // COLOR TRIÁNGULOS
                // =================================

                if (
                    this.tipo ===
                    "triangulo"
                ) {

                    stroke(
                        50,
                        255,
                        100,
                        opacidad
                    );
                }


                // =================================
                // COLOR CÍRCULOS
                // =================================

                if (
                    this.tipo ===
                    "circulo"
                ) {

                    stroke(
                        70,
                        200,
                        255,
                        opacidad
                    );
                }


                // =================================
                // COLOR CUADRADOS
                // =================================

                if (
                    this.tipo ===
                    "cuadrado"
                ) {

                    stroke(
                        255,
                        150,
                        40,
                        opacidad
                    );
                }


                strokeWeight(
                    1
                );


                line(
                    a.pos.x,
                    a.pos.y,
                    b.pos.x,
                    b.pos.y
                );
            }
        }


        // =========================================
        // FIGURAS
        // =========================================

        for (
            let figura of this.figuras
        ) {

            figura.dibujar();
        }
    }


    // =====================================================
    // SEPARAR
    // =====================================================

    separar(figura) {

        let indice =
            this.figuras.indexOf(
                figura
            );


        if (
            indice !== -1
        ) {

            this.figuras.splice(
                indice,
                1
            );
        }


        figura.grupo =
            null;
    }


    // =====================================================
    // REINCORPORAR
    // =====================================================

    reincorporar(figura) {

        figura.grupo =
            this;


        // Adopta la dirección
        // actual del grupo.

        figura.vel =
            this.vel.copy();


        figura.vel.mult(
            0.8
        );


        // Nueva posición dentro
        // del grupo.

        figura.offset =
            p5.Vector.random2D();


        figura.offset.mult(
            random(
                35,
                this.radio
            )
        );


        figura.reincorporando =
            false;


        this.figuras.push(
            figura
        );
    }
}



// =====================================================
// FIGURA
// =====================================================

class Figura {

    constructor(
        tipo,
        x,
        y
    ) {

        this.tipo =
            tipo;


        this.pos =
            createVector(
                x,
                y
            );


        this.vel =
            createVector(
                0,
                0
            );


        this.grupo =
            null;


        this.offset =
            null;


        this.tamano =
            random(
                18,
                28
            );


        this.rotacion =
            random(
                TWO_PI
            );


        this.reincorporando =
            false;
    }


    // =====================================================
    // DETECCIÓN
    // =====================================================

    contiene(
        x,
        y
    ) {

        let distancia =
            dist(
                x,
                y,
                this.pos.x,
                this.pos.y
            );


        return (
            distancia <
            this.tamano * 1.7
        );
    }


    // =====================================================
    // DIBUJAR
    // =====================================================

    dibujar() {

        push();


        translate(
            this.pos.x,
            this.pos.y
        );


        rotate(
            this.rotacion
        );


        // =========================================
        // SOLAMENTE STROKE
        // =========================================

        noFill();


        strokeWeight(
            2
        );


        // =========================================
        // TRIÁNGULO — VERDE
        // =========================================

        if (
            this.tipo ===
            "triangulo"
        ) {

            stroke(
                50,
                255,
                100
            );


            triangle(
                0,
                -this.tamano,

                -this.tamano,
                this.tamano,

                this.tamano,
                this.tamano
            );
        }


        // =========================================
        // CÍRCULO — CELESTE
        // =========================================

        else if (
            this.tipo ===
            "circulo"
        ) {

            stroke(
                70,
                200,
                255
            );


            ellipse(
                0,
                0,
                this.tamano * 2,
                this.tamano * 2
            );
        }


        // =========================================
        // CUADRADO — NARANJA
        // =========================================

        else if (
            this.tipo ===
            "cuadrado"
        ) {

            stroke(
                255,
                150,
                40
            );


            rectMode(
                CENTER
            );


            rect(
                0,
                0,
                this.tamano * 1.7,
                this.tamano * 1.7
            );
        }


        pop();
    }
}



// =====================================================
// P5.JS
// =====================================================

let sistema;


function setup() {

    createCanvas(
        windowWidth,
        windowHeight
    );


    sistema =
        new Colaboracion();
}


function draw() {

    sistema.actualizar();

    sistema.dibujar();
}



// =====================================================
// MOUSE
// =====================================================

function mousePressed() {

    sistema.mousePressed();

    return false;
}


function mouseDragged() {

    sistema.mouseDragged();

    return false;
}


function mouseReleased() {

    sistema.mouseReleased();

    return false;
}



// =====================================================
// TOUCH
// =====================================================

function touchStarted() {

    return sistema.touchStarted();
}


function touchMoved() {

    return sistema.touchMoved();
}


function touchEnded() {

    return sistema.touchEnded();
}



// =====================================================
// REDIMENSIONAR
// =====================================================

function windowResized() {

    resizeCanvas(
        windowWidth,
        windowHeight
    );
}