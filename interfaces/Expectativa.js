class Expectativa {

    constructor() {

        this.centro = createVector(width / 2, height / 2);

        this.radioApagado = 40;
        this.radioEncendido = 115;
        this.amplitudMaximaPalpito = 5;

        this.radioActual = this.radioApagado;

        // Piso fijo de distancia: se calcula una sola vez en base al tamano
        // maximo que la esfera puede llegar a tener, no al tamano actual.
        this.margenSeguridad = 70;

        this.distanciaMinima =
            this.radioEncendido +
            this.amplitudMaximaPalpito +
            this.margenSeguridad;

        this.fuegoBase = 0.12;
        this.fuego = this.fuegoBase;

        this.colorNucleo = color(255, 225, 150);

        // Paleta de colores para la esfera. Cada click elige uno distinto
        // al que esta puesto en ese momento.
        this.paletaColores = [
            color(255, 120, 40),
            color(80, 180, 255),
            color(170, 100, 255),
            color(90, 220, 150),
            color(255, 90, 120),
            color(255, 210, 90)
        ];

        this.colorActualCirculo = this.paletaColores[0];

        this.colorObjetivoExpansion = null;
        this.origenExpansion = null;

        this.radioExpansionActual = 0;
        this.radioExpansionNecesario = 0;

        this.expandiendoColor = false;

        this.personas = [];

        let cantidad = 50;

        let radioPantalla = min(width, height);

        for (let i = 0; i < cantidad; i++) {

            let angulo = map(i, 0, cantidad, 0, TWO_PI) + random(-0.1, 0.1);

            let lejos = radioPantalla * random(0.3, 0.55);
            let cerca = lejos * random(0.45, 0.65);

            let posInicial = createVector(
                this.centro.x + cos(angulo) * lejos,
                this.centro.y + sin(angulo) * lejos
            );

            this.personas.push({

                pos: posInicial,
                vel: createVector(0, 0),
                acc: createVector(0, 0),

                masa: random(0.8, 1.5),
                friccion: random(0.92, 0.96),

                anguloActual: angulo,
                anguloTarget: angulo,

                distanciaLejos: lejos,
                distanciaCerca: cerca,
                distanciaActual: lejos,

                r: random(5, 12),

                // Orbita propia, siempre activa: cada una gira a su ritmo,
                // sin relacion con el mouse
                velocidadOrbitaBase: random(-0.0006, 0.0006),

                // Seguimiento organico del mouse: cada persona reacciona
                // con su propio retraso, y se ubica con un desfasaje propio
                // para no apilarse todas en el mismo punto
                offsetSeguimiento: random(-0.7, 0.7),
                velocidadSeguimiento: random(0.006, 0.022),

                // Al gatillarse un cambio, se agrupan rapido alrededor del
                // punto de origen, cada una a una distancia propia
                offsetDistanciaCluster: random(0, 35),

                faseRespira: random(TWO_PI),

                demoraFuego: random(0.7, 1.25),

                // Temblor propio: algunas tiemblan mas que otras, y se
                // nota mas mientras todos observan un cambio en curso
                temblorIntensidad: random(0.3, 1.7),
                semillaTemblor: random(1000),

                titileo: 1,
                titileoDeseado: 1,

                proximoTitileo: millis() + random(0, 1000)

            });

        }

    }

    // Aplica una fuerza a una persona respetando su masa (F = M * A)
    aplicarFuerzaPersona(p, fuerza) {

        let f = fuerza.copy();

        f.div(p.masa);

        p.acc.add(f);

    }

    // Elige un color de la paleta distinto al que esta puesto ahora
    elegirColorSiguiente() {

        let opciones = this.paletaColores.filter(
            c => c.toString() !== this.colorActualCirculo.toString()
        );

        return random(opciones);

    }

    // Arranca una expansion desde un punto, calculando cuanto tiene que
    // crecer para cubrir realmente toda la esfera desde ese origen
    iniciarExpansion(x, y) {

        this.origenExpansion = createVector(x, y);

        this.colorObjetivoExpansion = this.elegirColorSiguiente();

        this.radioExpansionActual = 0;

        let distanciaAlCentro = dist(x, y, this.centro.x, this.centro.y);

        this.radioExpansionNecesario = distanciaAlCentro + this.radioActual + 20;

        this.expandiendoColor = true;

    }

    actualizar() {

        let sobreEsfera =
            dist(mouseX, mouseY, this.centro.x, this.centro.y) < this.radioActual + 20;

        if (sobreEsfera) {

            this.fuego = lerp(this.fuego, 1, 0.02);

        } else {

            this.fuego = lerp(this.fuego, this.fuegoBase, 0.015);

        }

        this.radioActual = lerp(
            this.radioApagado,
            this.radioEncendido,
            this.fuego
        );

        // Palpitacion sutil, apenas un indicio, cerca del maximo
        let umbralPalpito = 0.8;

        if (this.fuego > umbralPalpito) {

            let intensidad = map(this.fuego, umbralPalpito, 1, 0, 1);

            this.palpito = sin(millis() * 0.006) * this.amplitudMaximaPalpito * intensidad;

        } else {

            this.palpito = 0;

        }

        this.radioActual += this.palpito;

        // Avance de la expansion en curso. Deliberadamente lento, para que
        // se pueda observar como va cubriendo la esfera
        if (this.expandiendoColor) {

            let velocidad = max(2, this.radioExpansionNecesario * 0.008);

            this.radioExpansionActual += velocidad;

            if (this.radioExpansionActual >= this.radioExpansionNecesario) {

                // El color se mantiene: queda fijo, no depende del fuego
                this.colorActualCirculo = this.colorObjetivoExpansion;

                this.expandiendoColor = false;

                this.origenExpansion = null;

            }

        }

        // Mientras dura el cambio, las bolitas se apuran para juntarse
        // alrededor del punto donde empezo. Fuera de eso, siguen con
        // atencion organica hacia donde esta el mouse.
        let anguloMouse = atan2(mouseY - this.centro.y, mouseX - this.centro.x);

        let anguloOrigen = this.origenExpansion
            ? atan2(
                this.origenExpansion.y - this.centro.y,
                this.origenExpansion.x - this.centro.x
            )
            : anguloMouse;

        for (let i = 0; i < this.personas.length; i++) {

            let p = this.personas[i];

            let nivelFuegoPropio = constrain(this.fuego * p.demoraFuego, 0, 1);

            let distanciaTarget;

            if (this.expandiendoColor) {

                // Se acercan lo mas posible al punto del cambio
                distanciaTarget =
                    this.distanciaMinima + p.r + p.offsetDistanciaCluster;

            } else {

                distanciaTarget = lerp(p.distanciaLejos, p.distanciaCerca, nivelFuegoPropio);

                distanciaTarget = max(distanciaTarget, this.distanciaMinima + p.r);

            }

            let anguloObjetivo = this.expandiendoColor
                ? anguloOrigen + p.offsetSeguimiento * 0.6
                : anguloMouse + p.offsetSeguimiento;

            // Velocidad de reaccion propia, mucho mas rapida cuando hay
            // que juntarse alrededor del cambio en curso
            let velocidadReaccion = this.expandiendoColor
                ? p.velocidadSeguimiento * 5
                : p.velocidadSeguimiento;

            p.anguloTarget = lerp(p.anguloTarget, anguloObjetivo, velocidadReaccion);

            // Un poco de deriva propia todo el tiempo, para que nunca
            // queden del todo quietas ni se vean forzadas al mouse
            p.anguloTarget += p.velocidadOrbitaBase;

            p.anguloActual = lerp(p.anguloActual, p.anguloTarget, 0.06);
            p.distanciaActual = lerp(p.distanciaActual, distanciaTarget, 0.02);

            let posIdeal = createVector(
                this.centro.x + cos(p.anguloActual) * p.distanciaActual,
                this.centro.y + sin(p.anguloActual) * p.distanciaActual
            );

            // Fuerza que la acerca a su posicion ideal en la orbita,
            // mas intensa mientras dura el cambio para que se note la
            // urgencia de acercarse rapido a mirar
            let fuerzaAtraccion = p5.Vector.sub(posIdeal, p.pos);

            let dAlIdeal = fuerzaAtraccion.mag();

            fuerzaAtraccion.normalize();

            let topeIntensidad = this.expandiendoColor ? 0.4 : 0.15;

            let intensidadAtraccion = map(
                constrain(dAlIdeal, 0, 100),
                0,
                100,
                0,
                topeIntensidad
            );

            fuerzaAtraccion.mult(intensidadAtraccion);

            this.aplicarFuerzaPersona(p, fuerzaAtraccion);

            // Repulsion suave entre personas, ademas de la correccion dura
            // que se aplica despues de integrar la fisica
            for (let j = 0; j < this.personas.length; j++) {

                if (i === j) continue;

                let otro = this.personas[j];

                let dirRepulsion = p5.Vector.sub(p.pos, otro.pos);

                let distRepulsion = dirRepulsion.mag();

                let distMinimaSuperpone = p.r + otro.r + 6;

                if (distRepulsion < distMinimaSuperpone && distRepulsion > 0.0001) {

                    dirRepulsion.normalize();

                    let intensidadRepulsion = constrain(
                        0.8 / (distRepulsion * distRepulsion),
                        0,
                        0.8
                    );

                    dirRepulsion.mult(intensidadRepulsion);

                    this.aplicarFuerzaPersona(p, dirRepulsion);

                }

            }

            p.vel.add(p.acc);
            p.vel.mult(p.friccion);
            p.pos.add(p.vel);
            p.acc.mult(0);

            if (millis() > p.proximoTitileo) {

                p.titileoDeseado = random(0.55, 1.15);

                p.proximoTitileo = millis() + random(250, 900);

            }

            p.titileo = lerp(p.titileo, p.titileoDeseado, 0.08);

            p.nivelVisual = nivelFuegoPropio;

        }

        // Correccion dura: nadie puede quedar mas cerca del centro que el
        // minimo permitido, pase lo que pase con las fuerzas. Esto evita
        // que alguna bolita llegue a tocar la esfera o pase por debajo.
        for (let p of this.personas) {

            let dir = p5.Vector.sub(p.pos, this.centro);

            let d = dir.mag();

            let minPermitido = this.distanciaMinima + p.r;

            if (d < minPermitido) {

                dir.setMag(minPermitido);

                p.pos = p5.Vector.add(this.centro, dir);

                let radial = dir.copy().normalize();

                let velRadial = p5.Vector.dot(p.vel, radial);

                if (velRadial < 0) {

                    p.vel.sub(p5.Vector.mult(radial, velRadial));

                }

            }

        }

        // Correccion dura entre personas: si dos quedaron mas cerca que la
        // suma de sus radios, se separan directamente para que no lleguen
        // a tocarse ni superponerse.
        for (let i = 0; i < this.personas.length; i++) {

            for (let j = i + 1; j < this.personas.length; j++) {

                let a = this.personas[i];
                let b = this.personas[j];

                let dir = p5.Vector.sub(b.pos, a.pos);

                let d = dir.mag();

                let minDist = a.r + b.r + 6;

                if (d < 0.0001) {

                    dir = createVector(random(-1, 1), random(-1, 1));

                    d = dir.mag();

                }

                if (d < minDist) {

                    dir.normalize();

                    let superposicion = minDist - d;

                    let correccion = p5.Vector.mult(dir, superposicion / 2);

                    a.pos.sub(correccion);
                    b.pos.add(correccion);

                }

            }

        }

    }

    dibujar() {

        background(15);

        let colorResplandor = this.expandiendoColor
            ? lerpColor(
                this.colorActualCirculo,
                this.colorObjetivoExpansion,
                this.radioExpansionActual / this.radioExpansionNecesario
            )
            : this.colorActualCirculo;

        // Resplandor exterior
        noStroke();

        let capasResplandor = 5;

        for (let i = capasResplandor; i > 0; i--) {

            let radioCapa = this.radioActual + i * (28 * this.fuego);

            let alphaCapa = (this.fuego * 25) / (i * i);

            fill(
                red(colorResplandor),
                green(colorResplandor),
                blue(colorResplandor),
                alphaCapa
            );

            circle(this.centro.x, this.centro.y, radioCapa * 2);

        }

        // Personas
        for (let p of this.personas) {

            let colorPersona = lerpColor(
                color(40, 40, 50),
                color(255, 210, 140),
                p.nivelVisual
            );

            // Temblor organico individual: mas notorio para algunas que
            // para otras, y se acentua mientras hay un cambio en curso
            let factorExcitacion = this.expandiendoColor ? 1 : 0.3;

            let temblorX =
                (noise(p.semillaTemblor, millis() * 0.0018) - 0.5) *
                6 *
                p.temblorIntensidad *
                factorExcitacion;

            let temblorY =
                (noise(p.semillaTemblor + 50, millis() * 0.0018) - 0.5) *
                6 *
                p.temblorIntensidad *
                factorExcitacion;

            let visualX = p.pos.x + temblorX;

            let visualY =
                p.pos.y +
                sin(millis() * 0.0012 + p.faseRespira) * 1.8 +
                temblorY;

            noStroke();

            fill(colorPersona);

            circle(visualX, visualY, p.r * 2);

            if (p.nivelVisual > 0.15) {

                fill(
                    red(colorPersona),
                    green(colorPersona),
                    blue(colorPersona),
                    50 * p.nivelVisual * p.titileo
                );

                circle(visualX, visualY, p.r * 2 + 16 * p.nivelVisual * p.titileo);

            }

        }

        // Esfera central: color fijo, no se mezcla con el fuego
        noStroke();

        fill(this.colorActualCirculo);

        circle(this.centro.x, this.centro.y, this.radioActual * 2);

        // Expansion en curso, recortada exactamente dentro de la esfera
        if (this.expandiendoColor && this.origenExpansion) {

            drawingContext.save();

            drawingContext.beginPath();

            drawingContext.arc(
                this.centro.x,
                this.centro.y,
                this.radioActual,
                0,
                TWO_PI
            );

            drawingContext.clip();

            fill(this.colorObjetivoExpansion);

            noStroke();

            circle(
                this.origenExpansion.x,
                this.origenExpansion.y,
                this.radioExpansionActual * 2
            );

            drawingContext.restore();

        }

        // Nucleo brillante cuando esta bien encendida
        if (this.fuego > 0.3) {

            noStroke();

            fill(
                red(this.colorNucleo),
                green(this.colorNucleo),
                blue(this.colorNucleo),
                (this.fuego - 0.3) * 190
            );

            circle(this.centro.x, this.centro.y, this.radioActual * 0.88);

        }

    }

    mousePressed() {

        // Mientras se esta cambiando el color, ningun click tiene efecto
        if (this.expandiendoColor) return;

        let sobreEsfera =
            dist(mouseX, mouseY, this.centro.x, this.centro.y) < this.radioActual + 20;

        if (sobreEsfera) {

            this.iniciarExpansion(mouseX, mouseY);

        }

    }

}