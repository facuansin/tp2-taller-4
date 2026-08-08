class GestorEscenas {

    constructor() {

        this.escena = "menu";

        this.interfaces = {

            Memoria: new Memoria(),
            Herencia: new Herencia(),
            Caducidad: new Caducidad(),

            Identidad: new Identidad(),
            Empatia: new Empatia(),
            Colaboracion: new Colaboracion(),

            Incertidumbre: new Incertidumbre(),
            Ansiedad: new Ansiedad(),
            Expectativa: new Expectativa()

        };

        this.crearBotones();

    }

    crearBotones() {

        this.botones = [];

        let nombres = [

            "Memoria",
            "Herencia",
            "Caducidad",

            "Identidad",
            "Empatia",
            "Colaboracion",

            "Incertidumbre",
            "Ansiedad",
            "Expectativa"

        ];

        let anchoBoton = width * 0.22;
        let altoBoton = height * 0.055;

        let separacion = height * 0.07;

        // Centra verticalmente el conjunto de botones
        let total = nombres.length * separacion;
        let inicioY = (height - total) / 2;

        for (let i = 0; i < nombres.length; i++) {

            this.botones.push(

                new Boton(

                    width / 2,
                    inicioY + i * separacion,
                    anchoBoton,
                    altoBoton,
                    nombres[i]

                )

            );

        }

    }

    actualizar() {

        if (this.escena != "menu") {

            this.interfaces[this.escena].actualizar();

        }

    }

    dibujar() {

        if (this.escena == "menu") {

            fill(255);
            noStroke();

            textAlign(CENTER, CENTER);
            textSize(width * 0.03);

            text(
                "TP2 - Sistema de Interfaces",
                width / 2,
                height * 0.08
            );

            for (let b of this.botones) {

                b.dibujar();

            }

        } else {

            this.interfaces[this.escena].dibujar();

        }

    }

    mousePressed() {

        if (this.escena == "menu") {

            for (let b of this.botones) {

                if (b.click()) {

                    this.escena = b.texto;

                }

            }

        } else {

            this.interfaces[this.escena].mousePressed();

        }

    }
mouseReleased() {

    if (this.escena != "menu") {

        if (this.interfaces[this.escena].mouseReleased) {

            this.interfaces[this.escena].mouseReleased();

        }

    }

}

mouseDragged() {

    if (this.escena != "menu") {

        if (this.interfaces[this.escena].mouseDragged) {

            this.interfaces[this.escena].mouseDragged();

        }

    }

}
    keyPressed() {

        if (key === "Escape") {

            this.escena = "menu";

        }

    }

}