import { Game } from './game.js'

var c = document.getElementById("c");
export var ctx = c.getContext("2d");
// ctx.transform(1, 0, 0, -1, 0, c.height)
ctx.lineWidth = 0.2;
ctx.strokeStyle = "#ffffff"
// ctx.globalCompositeOperation = 'multiply'

var game = new Game(ctx)

function loop(timestamp) {
    var dt = timestamp - lastRender;

    game.update(dt);
    game.draw();

    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}

var lastRender = 0;
window.requestAnimationFrame(loop);
