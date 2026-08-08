class Herencia {

    constructor() {

        this.circulos = [];

        for (let i = 0; i < 12; i++) {

            this.circulos.push(
                this.crearCirculo(
                    random(60, width - 60),
                    random(60, height - 60)
                )
            );

        }

    }

    crearCirculo(x, y, colorHeredado = null) {

        return {

            x: x,
            y: y,

            rFinal: random(25, 40),
            rActual: 5,

            dx: random(-3, 3),
            dy: random(-3, 3),

            colorBase: colorHeredado ||
                color(
                    random(80,255),
                    random(80,255),
                    random(80,255)
                ),

            gris: 0,

            muriendo: false,

            estela: []

        };

    }

    actualizar() {

        for (let i = this.circulos.length - 1; i >= 0; i--) {

            let c = this.circulos[i];

            // Crecer al nacer
            if (c.rActual < c.rFinal) {

                c.rActual += 0.4;

            }

            // Envejecer
            if (c.muriendo) {

                c.gris = min(c.gris + 0.01, 1);

                c.dx *= 0.992;
                c.dy *= 0.992;

            }

            // Guardar estela
            c.estela.push(createVector(c.x, c.y));

            if (c.estela.length > 25) {

                c.estela.shift();

            }

            c.x += c.dx;
            c.y += c.dy;

            if (c.x < c.rActual || c.x > width - c.rActual) {

                c.dx *= -1;

            }

            if (c.y < c.rActual || c.y > height - c.rActual) {

                c.dy *= -1;

            }

            // Morir y generar hijo
            if (c.muriendo && abs(c.dx) + abs(c.dy) < 0.15) {

                let nuevoColor = color(

                    constrain(red(c.colorBase) + random(-15,15),0,255),

                    constrain(green(c.colorBase) + random(-15,15),0,255),

                    constrain(blue(c.colorBase) + random(-15,15),0,255)

                );

                let hijo = this.crearCirculo(c.x, c.y, nuevoColor);

                this.circulos.splice(i,1);

                this.circulos.push(hijo);

            }

        }

    }

    dibujar() {

        background(20);

        strokeWeight(3);
        noFill();

        for (let c of this.circulos) {

            let borde = lerpColor(
                c.colorBase,
                color(170),
                c.gris
            );

            // ESTELA

            for (let i = 1; i < c.estela.length; i++) {

                let a = map(i,1,c.estela.length,5,120);

                stroke(
                    red(borde),
                    green(borde),
                    blue(borde),
                    a
                );

                line(

                    c.estela[i-1].x,
                    c.estela[i-1].y,

                    c.estela[i].x,
                    c.estela[i].y

                );

            }

            // CÍRCULO

            stroke(borde);
            fill(20);

            circle(
                c.x,
                c.y,
                c.rActual * 2
            );

        }

    }

    mousePressed() {

        for (let c of this.circulos) {

            if (!c.muriendo &&
                dist(mouseX, mouseY, c.x, c.y) < c.rActual) {

                c.muriendo = true;

                break;

            }

        }

    }

}