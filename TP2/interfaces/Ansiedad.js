class Ansiedad {

  constructor() {

    this.pensamientos = [];

    for (let i = 0; i < 60; i++) {
      this.pensamientos.push(new Pensamiento());
    }

    this.latido = 0;
    this.proximoLatido = millis();

    this.tiempoInicio = millis();

    this.etapa = 0;

    this.intervalos = [900, 700, 450, 220];

    this.colores = [
      color(255),
      color(255,220,220),
      color(255,140,140),
      color(255,50,50)
    ];

  }

  actualizar(){

    let tiempo = millis() - this.tiempoInicio;

    this.etapa = constrain(floor(tiempo/4000),0,3);

    if(millis() > this.proximoLatido){

      this.latido = 1;
      this.proximoLatido = millis() + this.intervalos[this.etapa];

    }

    this.latido *= 0.88;

    for(let p of this.pensamientos){

      p.actualizar(this.etapa);
      p.chequearPantalla();

    }

    for(let i=0;i<this.pensamientos.length;i++){

      for(let j=i+1;j<this.pensamientos.length;j++){

        this.pensamientos[i].colisionar(this.pensamientos[j]);

      }

    }

  }

  dibujar(){

    noStroke();
    fill(15,20);
    rect(0,0,width,height);

    for(let p of this.pensamientos){

      p.dibujar();

    }

    push();

    translate(width/2,height/2);

    noStroke();

    fill(this.colores[this.etapa]);

    let r = 90 + this.latido*35;

    circle(0,0,r*2);

    noFill();

    stroke(this.colores[this.etapa]);

    strokeWeight(3);

    circle(0,0,r*2);

    pop();

  }

  mousePressed(){

    if(dist(mouseX,mouseY,width/2,height/2)<90){

      this.tiempoInicio = millis();
      this.etapa = 0;

    }

  }

}
class Pensamiento {

  constructor(){

    this.r = 20;

    this.pos = createVector(
      random(this.r,width-this.r),
      random(this.r,height-this.r)
    );

    this.posAnterior = this.pos.copy();

    this.target = this.pos.copy();

   this.colorBase = color(
  random(80,255),
  random(80,255),
  random(80,255)
);

this.colorActual = this.colorBase;

    this.radioMovimiento = 140;

    this.velocidades = [
      0.015,
      0.03,
      0.05,
      0.08
    ];

    this.delays = [
      1200,
      700,
      300,
      0
    ];

    this.proximoCambio = millis() + random(0,2000);
this.estela = [];
this.largoEstela = 15;
  }

  elegirNuevoDestino(){

    let angulo = random(TWO_PI);
    let distancia = random(40,this.radioMovimiento);

    let x = constrain(
      this.pos.x + cos(angulo)*distancia,
      this.r,
      width-this.r
    );

    let y = constrain(
      this.pos.y + sin(angulo)*distancia,
      this.r,
      height-this.r
    );

    this.target.set(x,y);

  }

  actualizar(etapa){

    let porcentaje = etapa / 3.0;

this.colorActual = lerpColor(
  this.colorBase,
  color(255,50,50),
  porcentaje
);
    if(millis() > this.proximoCambio){

      this.elegirNuevoDestino();

      let delay = this.delays[etapa] * random(0.5,1.5);

      this.proximoCambio = millis() + delay;

    }

    this.posAnterior.set(this.pos);
     this.estela.push(this.pos.copy());

if(this.estela.length > this.largoEstela){
  this.estela.shift();
}
    this.pos.lerp(this.target,this.velocidades[etapa]);

  }

  dibujar(){

  noFill();

  // Estela
  for(let i = 0; i < this.estela.length; i++){

    let p = this.estela[i];

    let alpha = map(i, 0, this.estela.length - 1, 10, 180);

    stroke(
      red(this.colorActual),
      green(this.colorActual),
      blue(this.colorActual),
      alpha
    );

    strokeWeight(2);

    circle(p.x, p.y, this.r * 2);

  }

  // Círculo actual
  stroke(
    red(this.colorActual),
    green(this.colorActual),
    blue(this.colorActual)
  );

  strokeWeight(2);

  circle(this.pos.x, this.pos.y, this.r * 2);

}

  colisionar(otro){

    let dx = otro.pos.x - this.pos.x;
    let dy = otro.pos.y - this.pos.y;

    let distancia = sqrt(dx*dx + dy*dy);

    let minima = this.r + otro.r;

    if(distancia < minima){

      if(distancia === 0){

        dx = random(-1,1);
        dy = random(-1,1);
        distancia = sqrt(dx*dx + dy*dy);

      }

      let solapamiento = minima - distancia;

      dx /= distancia;
      dy /= distancia;

      this.pos.x -= dx * solapamiento * 0.5;
      this.pos.y -= dy * solapamiento * 0.5;

      otro.pos.x += dx * solapamiento * 0.5;
      otro.pos.y += dy * solapamiento * 0.5;

    }

  }

  chequearPantalla(){

    let margen = this.r * 2;

    if(
      this.pos.x < -margen ||
      this.pos.x > width + margen ||
      this.pos.y < -margen ||
      this.pos.y > height + margen
    ){

      this.pos.set(
        random(this.r,width-this.r),
        random(this.r,height-this.r)
      );

      this.posAnterior.set(this.pos);

      this.target = this.pos.copy();

      this.elegirNuevoDestino();

      this.proximoCambio = millis() + random(0,1000);

    }

  }

}