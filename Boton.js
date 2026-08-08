class Boton {

    constructor(x, y, w, h, texto) {

        this.x = x;
        this.y = y;

        this.w = w;
        this.h = h;

        this.texto = texto;

    }

    hover() {

        return (
            mouseX > this.x - this.w / 2 &&
            mouseX < this.x + this.w / 2 &&
            mouseY > this.y - this.h / 2 &&
            mouseY < this.y + this.h / 2
        );

    }

    dibujar() {

        let hover = this.hover();

        rectMode(CENTER);

        stroke(255);
        strokeWeight(max(1, this.h * 0.05));

        fill(hover ? 80 : 30);

        rect(
            this.x,
            this.y,
            this.w,
            this.h,
            this.h * 0.25
        );

        noStroke();
        fill(255);

        textAlign(CENTER, CENTER);

        // El texto escala con el tamaño del botón
        textSize(this.h * 0.45);

        text(this.texto, this.x, this.y);

    }

    click() {

        return this.hover();

    }

}