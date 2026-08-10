class Incertidumbre {

    constructor() {
        this.centro = createVector(width / 2, height / 2);

        this.posOscura = createVector(width / 2, height / 2);
        this.posOscuraPrev = createVector(width / 2, height / 2);

        this.radioOscuro = 55;

        // Umbrales de reaccion
        this.radioEmpujePanico = 160;
        this.radioZonaInsegura = 260;

        this.colorOscuro = color(10, 10, 15);

        this.personas = [];

        let cantidad = 65;

        for (let i = 0; i < cantidad; i++) {
            let angulo = random(TWO_PI);
            let distInicial = random(220, 380);

            let posX = this.centro.x + cos(angulo) * distInicial;
            let posY = this.centro.y + sin(angulo) * distInicial;

            this.personas.push({
                pos: createVector(posX, posY),
                vel: createVector(0, 0),
                acc: createVector(0, 0),

                masa: random(0.8, 1.5),
                friccion: 0.9,

                r: random(4, 8),

                panico: 0,

                distanciaConfianza: random(200, 320),
                lentitudAcercamiento: random(0.02, 0.05),

                faseRespira: random(TWO_PI),
                semillaTemblor: random(1000),
                semillaVacilacion: random(1000)
            });
        }
    }

    aplicarFuerza(p, fuerza) {
        let f = fuerza.copy();
        f.div(p.masa);
        p.acc.add(f);
    }

    actualizar() {
        this.posOscuraPrev.set(this.posOscura);

        // La bola oscura sigue al mouse con inercia
        this.posOscura.x = lerp(this.posOscura.x, mouseX, 0.12);
        this.posOscura.y = lerp(this.posOscura.y, mouseY, 0.12);

        let velMouse = p5.Vector.dist(this.posOscura, this.posOscuraPrev);
        let seMueveRapido = velMouse > 1.2;

        let margenPantalla = 70; // NUEVO: Distancia antes del borde para empezar a frenar

        for (let i = 0; i < this.personas.length; i++) {
            let p = this.personas[i];

            let dirHaciaOscura = p5.Vector.sub(this.posOscura, p.pos);
            let distAOscura = dirHaciaOscura.mag();

            // --- Panico: prioridad absoluta, huir rapido ---
            if (
                (seMueveRapido && distAOscura < this.radioZonaInsegura) ||
                distAOscura < this.radioEmpujePanico
            ) {
                p.panico = 1.0;
            } else {
                p.panico = max(0, p.panico - 0.005);
            }

            if (p.panico > 0.08) {
                let fuerzaHuida = dirHaciaOscura.copy().mult(-1);
                fuerzaHuida.normalize();

                let intensidadHuida = map(distAOscura, 0, this.radioZonaInsegura, 3, 0.5, true);
                fuerzaHuida.mult(intensidadHuida * p.panico);

                this.aplicarFuerza(p, fuerzaHuida);
            } else {
                // --- Sin panico: acercamiento lento ---
                if (distAOscura > p.distanciaConfianza) {
                    let pasoCauto = dirHaciaOscura.copy().normalize();
                    pasoCauto.mult(p.lentitudAcercamiento);
                    this.aplicarFuerza(p, pasoCauto);
                }

                // Vacilacion lateral
                let lateral = createVector(-dirHaciaOscura.y, dirHaciaOscura.x);
                lateral.normalize();

                let ondaVacilacion =
                    (noise(p.semillaVacilacion, millis() * 0.0004) - 0.5) * 0.16;

                lateral.mult(ondaVacilacion);
                this.aplicarFuerza(p, lateral);
            }

            // --- NUEVO: Contención en los bordes de la pantalla ---
            // Si la bolita se acerca a las orillas del lienzo, siente "temor a lo desconocido" fuera de marco
            if (p.pos.x < margenPantalla) {
                let fBorde = createVector((margenPantalla - p.pos.x) * 0.05, 0);
                this.aplicarFuerza(p, fBorde);
            } else if (p.pos.x > width - margenPantalla) {
                let fBorde = createVector((width - margenPantalla - p.pos.x) * 0.05, 0);
                this.aplicarFuerza(p, fBorde);
            }

            if (p.pos.y < margenPantalla) {
                let fBorde = createVector(0, (margenPantalla - p.pos.y) * 0.05);
                this.aplicarFuerza(p, fBorde);
            } else if (p.pos.y > height - margenPantalla) {
                let fBorde = createVector(0, (height - margenPantalla - p.pos.y) * 0.05);
                this.aplicarFuerza(p, fBorde);
            }

            // --- Evitar apilamiento entre ellas ---
            for (let j = 0; j < this.personas.length; j++) {
                if (i === j) continue;
                let otro = this.personas[j];

                let dirRep = p5.Vector.sub(p.pos, otro.pos);
                let distRep = dirRep.mag();
                let distMin = p.r + otro.r + 12;

                if (distRep < distMin && distRep > 0) {
                    dirRep.normalize();
                    let fuerzaSeparacion = (distMin - distRep) * 0.05;
                    dirRep.mult(fuerzaSeparacion);
                    this.aplicarFuerza(p, dirRep);
                }
            }

            // Integracion física
            p.vel.add(p.acc);
            
            // NUEVO: Limitar velocidad maxima para evitar que salgan volando sin control
            p.vel.limit(p.panico > 0.2 ? 6 : 2);

            p.vel.mult(p.friccion);
            p.pos.add(p.vel);
            p.acc.mult(0);
        }
    }

    dibujar() {
        background(15);

        // Resplandor negativo
        noStroke();
        let capas = 5;
        for (let i = capas; i > 0; i--) {
            let radioCapa = this.radioOscuro + i * 22;
            let alphaCapa = 90 / (i * i);
            fill(2, 2, 5, alphaCapa);
            circle(this.posOscura.x, this.posOscura.y, radioCapa * 2);
        }

        // Borde tenue y helado
        stroke(140, 150, 170, 30);
        strokeWeight(1.5);
        fill(this.colorOscuro);
        circle(this.posOscura.x, this.posOscura.y, this.radioOscuro * 2);

        // Bolitas
        for (let p of this.personas) {
            let intensidadTemblor = p.panico * 3.5;

            let temblorX =
                (noise(p.semillaTemblor, millis() * 0.025) - 0.5) * 2 * intensidadTemblor;

            let temblorY =
                (noise(p.semillaTemblor + 40, millis() * 0.025) - 0.5) * 2 * intensidadTemblor;

            let respiro = sin(millis() * 0.002 + p.faseRespira) * 1.2;

            let drawX = p.pos.x + temblorX;
            let drawY = p.pos.y + respiro + temblorY;

            let colorBolita = lerpColor(
                color(100, 110, 125),
                color(230, 240, 255),
                p.panico
            );

            noStroke();
            fill(
                red(colorBolita),
                green(colorBolita),
                blue(colorBolita)
            );

            circle(drawX, drawY, p.r * 2);

            if (p.panico > 0.25) {
                fill(
                    red(colorBolita),
                    green(colorBolita),
                    blue(colorBolita),
                    45 * p.panico
                );

                circle(drawX, drawY, p.r * 2 + 12 * p.panico);
            }
        }
    }

    mousePressed() {
        let mousePos = createVector(mouseX, mouseY);

        for (let p of this.personas) {
            let dir = p5.Vector.sub(p.pos, mousePos);
            let d = dir.mag();

            if (d < 350) {
                p.panico = 1.0;
                dir.normalize();

                // NUEVO: Reduje ligeramente la fuerza máxima del impacto de 8 a 5.5 para mantenerlas contenidas
                let impacto = map(d, 0, 350, 5.5, 1);

                dir.mult(impacto);
                this.aplicarFuerza(p, dir);
            }
        }
    }
}