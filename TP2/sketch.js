let gestor;

function setup(){

    createCanvas(windowWidth,windowHeight);

    gestor = new GestorEscenas();

}

function draw(){

    background(15);

    gestor.actualizar();
    gestor.dibujar();

}

function mousePressed(){

    gestor.mousePressed();

}
function mouseDragged() {

    gestor.mouseDragged();

}

function mouseReleased() {

    gestor.mouseReleased();

}
function keyPressed(){

    gestor.keyPressed();

}

function windowResized(){

    resizeCanvas(windowWidth,windowHeight);

}