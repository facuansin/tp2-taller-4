class Caducidad {

    constructor() {

        this.centro = createVector(width / 2, height / 2);
        this.anterior = this.centro.copy();

        this.arrastrando = false;

        this.hijos = [];

        this.cooldownRotura = random(300, 2000);
        this.ultimaRotura = -this.cooldownRotura;

        let cantidad = 10;

        for (let i = 0; i < cantidad; i++) {

            let ang = map(i, 0, cantidad, 0, TWO_PI);

            let distCentro = random(50, 90);

            this.hijos.push({

                angulo: ang,
                distancia: distCentro,

                x: this.centro.x + cos(ang) * distCentro,
                y: this.centro.y + sin(ang) * distCentro,

                vx: 0,
                vy: 0,

                unido: true,

                alpha: 255,

                resistencia: random(25, 45),

                r: random(8, 15),

                color: color(
                    random(80, 255),
                    random(80, 255),
                    random(80, 255)
                ),

                estela: []

            });

        }

    }

    actualizar() {

        let fuerza = dist(
            this.centro.x,
            this.centro.y,
            this.anterior.x,
            this.anterior.y
        );

        this.anterior.set(this.centro);

        for (let h of this.hijos) {

            if (h.unido) {

                let destinoX = this.centro.x + cos(h.angulo) * h.distancia;
                let destinoY = this.centro.y + sin(h.angulo) * h.distancia;

                h.vx += (destinoX - h.x) * 0.08;
                h.vy += (destinoY - h.y) * 0.08;

                h.vx *= 0.82;
                h.vy *= 0.82;

                h.x += h.vx;
                h.y += h.vy;

                if (
                    fuerza > h.resistencia &&
                    millis() - this.ultimaRotura >= this.cooldownRotura
                ) {

                    h.unido = false;

                    this.ultimaRotura = millis();

                    // El próximo tiempo de espera será aleatorio
                    this.cooldownRotura = random(300, 2000);

                }

            } else {

                h.x += h.vx;
                h.y += h.vy;

                h.vx *= 0.99;
                h.vy *= 0.99;

                h.alpha = max(0, h.alpha - 2);

            }

            // Guardar estela
            h.estela.push(createVector(h.x, h.y));

            if (h.estela.length > 20) {

                h.estela.shift();

            }

        }

    }

    dibujar() {

        background(20);

        // ESTELAS
        strokeWeight(3);

        for (let h of this.hijos) {

            for (let i = 1; i < h.estela.length; i++) {

                let a = map(i, 1, h.estela.length, 5, h.alpha);

                stroke(
                    red(h.color),
                    green(h.color),
                    blue(h.color),
                    a
                );

                line(
                    h.estela[i - 1].x,
                    h.estela[i - 1].y,
                    h.estela[i].x,
                    h.estela[i].y
                );

            }

        }

        // LÍNEAS AL CENTRO
        strokeWeight(2);

        for (let h of this.hijos) {

            if (h.unido) {

                stroke(
                    red(h.color),
                    green(h.color),
                    blue(h.color),
                    70
                );

                line(
                    this.centro.x,
                    this.centro.y,
                    h.x,
                    h.y
                );

            }

        }

        // CÍRCULOS
        noStroke();

        for (let h of this.hijos) {

            fill(
                red(h.color),
                green(h.color),
                blue(h.color),
                h.alpha
            );

            circle(
                h.x,
                h.y,
                h.r * 2
            );

        }

        // CENTRO
        fill(255);
        circle(this.centro.x, this.centro.y, 45);

    }

    mousePressed() {

        if (dist(mouseX, mouseY, this.centro.x, this.centro.y) < 25) {

            this.arrastrando = true;

        }

    }

    mouseReleased() {

        this.arrastrando = false;

    }

    mouseDragged() {

        if (this.arrastrando) {

            this.centro.set(mouseX, mouseY);

        }

    }

}