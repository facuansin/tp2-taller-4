class Ansiedad {

    constructor() {

        // Marco de encierro: el espacio delimitado donde ocurre todo
        this.marco = {

            x: width * 0.07,
            y: height * 0.07,

            w: width * 0.86,
            h: height * 0.86

        };

        let margenEsquina = min(width, height) * 0.14;

        // Las 4 bolitas, ancladas cerca de cada esquina del marco
        this.esquinas = [];

        let posicionesBase = [

            createVector(this.marco.x + margenEsquina, this.marco.y + margenEsquina),
            createVector(this.marco.x + this.marco.w - margenEsquina, this.marco.y + margenEsquina),
            createVector(this.marco.x + margenEsquina, this.marco.y + this.marco.h - margenEsquina),
            createVector(this.marco.x + this.marco.w - margenEsquina, this.marco.y + this.marco.h - margenEsquina)

        ];

        for (let base of posicionesBase) {

            this.esquinas.push({

                posBase: base,
                pos: base.copy(),

                r: 24,

                nivelAnsiedad: 0,

                semillaDeriva: random(1000),
                semillaTemblor: random(1000),

                faseHalo: random(1000)

            });

        }

        // La esfera que representa el futuro: se puede arrastrar, y
        // cuanto mas se la toca mas rapido late
        this.futuro = {

            pos: createVector(
                this.marco.x + this.marco.w * 0.5,
                this.marco.y + this.marco.h * 0.5
            ),

            r: 48,

            arrastrando: false,
            offsetArrastre: createVector(0, 0),

            ritmoBase: 1100,
            ritmoMinimo: 220,
            ritmoActual: 1100,

            proximoLatido: millis(),
            latido: 0

        };

        // Distancia minima (siempre igual) y distancia lejana, que depende
        // del tamano del marco y se recalcula si el marco cambia
        this.distanciaCerca = this.futuro.r + 24 + 30;

        this.actualizarDistanciaLejos();

        // Paleta compartida de estados: de calma a mucha ansiedad
        this.colorCalma = color(120, 210, 230);
        this.colorMedio = color(255, 160, 60);
        this.colorAlto = color(235, 60, 55);

        this.colorFuturo = color(225, 225, 235);

    }

    // Se recalcula cada vez que el marco cambia de tamano
    actualizarDistanciaLejos() {

        let diagonalMarco = dist(
            this.marco.x, this.marco.y,
            this.marco.x + this.marco.w, this.marco.y + this.marco.h
        );

        this.distanciaLejos = diagonalMarco * 0.5;

    }

    actualizar() {

        // Recalculado cada frame por si el canvas cambio de tamano; asi el
        // marco nunca queda desalineado con el tamano real del canvas
        this.marco.x = width * 0.07;
        this.marco.y = height * 0.07;
        this.marco.w = width * 0.86;
        this.marco.h = height * 0.86;

        this.actualizarDistanciaLejos();

        // El ritmo se relaja solo, muy de a poco, si no se lo vuelve a tocar
        this.futuro.ritmoActual = lerp(this.futuro.ritmoActual, this.futuro.ritmoBase, 0.0006);

        if (millis() > this.futuro.proximoLatido) {

            this.futuro.latido = 1;

            this.futuro.proximoLatido = millis() + this.futuro.ritmoActual;

        }

        this.futuro.latido *= 0.88;

        for (let e of this.esquinas) {

            // Una deriva lenta y propia, para que nunca esten del todo
            // quietas, incluso relajadas
            let derivaX = (noise(e.semillaDeriva, millis() * 0.00012) - 0.5) * 26;
            let derivaY = (noise(e.semillaDeriva + 80, millis() * 0.00012) - 0.5) * 26;

            let posDeseada = createVector(
                e.posBase.x + derivaX,
                e.posBase.y + derivaY
            );

            e.pos.lerp(posDeseada, 0.02);

            let distanciaAlFuturo = dist(e.pos.x, e.pos.y, this.futuro.pos.x, this.futuro.pos.y);

            let nivel = map(
                distanciaAlFuturo,
                this.distanciaCerca,
                this.distanciaLejos,
                1,
                0
            );

            e.nivelAnsiedad = constrain(nivel, 0, 1);

        }

    }

    dibujar() {

        background(15);

        // Marco de encierro
        noFill();

        stroke(255, 35);

        strokeWeight(2);

        rect(this.marco.x, this.marco.y, this.marco.w, this.marco.h);

        // Tratamiento lineal: cada bolita se conecta con el futuro segun
        // cuanta ansiedad le genera tenerlo cerca
        for (let e of this.esquinas) {

            let colorLinea = this.colorEstado(e.nivelAnsiedad);

            stroke(
                red(colorLinea),
                green(colorLinea),
                blue(colorLinea),
                20 + e.nivelAnsiedad * 110
            );

            strokeWeight(1 + e.nivelAnsiedad * 1.5);

            line(this.futuro.pos.x, this.futuro.pos.y, e.pos.x, e.pos.y);

        }

        // Resplandor alrededor del futuro
        noStroke();

        let capasResplandor = 4;

        for (let i = capasResplandor; i > 0; i--) {

            let radioCapa = this.futuro.r + i * 16 + this.futuro.latido * 10;

            let alphaCapa = 22 / i;

            fill(
                red(this.colorFuturo),
                green(this.colorFuturo),
                blue(this.colorFuturo),
                alphaCapa
            );

            circle(this.futuro.pos.x, this.futuro.pos.y, radioCapa * 2);

        }

        // El futuro
        noStroke();

        fill(this.colorFuturo);

        let radioFuturo = this.futuro.r + this.futuro.latido * 14;

        circle(this.futuro.pos.x, this.futuro.pos.y, radioFuturo * 2);

        // Las 4 bolitas
        for (let e of this.esquinas) {

            let colorActual = this.colorEstado(e.nivelAnsiedad);

            // Temblor: nulo cuando esta relajada, fuerte cuando esta
            // muy ansiosa
            let intensidadTemblor = e.nivelAnsiedad * 7;

            let temblorX = (noise(e.semillaTemblor, millis() * 0.02) - 0.5) * 2 * intensidadTemblor;
            let temblorY = (noise(e.semillaTemblor + 40, millis() * 0.02) - 0.5) * 2 * intensidadTemblor;

            let visualX = e.pos.x + temblorX;
            let visualY = e.pos.y + temblorY;

            let radioVisual = e.r + e.nivelAnsiedad * 5;

            // Halo, mas presente cuanto mas ansiosa esta
            fill(
                red(colorActual),
                green(colorActual),
                blue(colorActual),
                40 * e.nivelAnsiedad
            );

            circle(visualX, visualY, radioVisual * 2 + 18 * e.nivelAnsiedad);

            noStroke();

            fill(colorActual);

            circle(visualX, visualY, radioVisual * 2);

        }

    }

    // Interpola color segun el nivel de ansiedad: celeste, naranja, rojo
    colorEstado(nivel) {

        if (nivel < 0.5) {

            return lerpColor(this.colorCalma, this.colorMedio, nivel * 2);

        }

        return lerpColor(this.colorMedio, this.colorAlto, (nivel - 0.5) * 2);

    }

    mousePressed() {

        let sobreFuturo = dist(mouseX, mouseY, this.futuro.pos.x, this.futuro.pos.y) < this.futuro.r + 12;

        if (sobreFuturo) {

            this.futuro.arrastrando = true;

            this.futuro.offsetArrastre.set(
                this.futuro.pos.x - mouseX,
                this.futuro.pos.y - mouseY
            );

            // Cada vez que se lo toca, late mas rapido
            this.futuro.ritmoActual = max(
                this.futuro.ritmoMinimo,
                this.futuro.ritmoActual * 0.78
            );

        }

    }

    mouseDragged() {

        if (!this.futuro.arrastrando) return;

        let x = mouseX + this.futuro.offsetArrastre.x;
        let y = mouseY + this.futuro.offsetArrastre.y;

        x = constrain(x, this.marco.x + this.futuro.r, this.marco.x + this.marco.w - this.futuro.r);
        y = constrain(y, this.marco.y + this.futuro.r, this.marco.y + this.marco.h - this.futuro.r);

        this.futuro.pos.set(x, y);

    }

    mouseReleased() {

        this.futuro.arrastrando = false;

    }

}