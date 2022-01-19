"use strict";
window.onload = function () {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    if (!canvas || !context)
        return;
    canvas.width = width;
    canvas.height = height;
    var mouseX = 0;
    var mouseY = 0;
    var mousedown = false;
    var selection = null;
    var hover = false;
    var box = new AABB(width / 2, height / 2, 50, 50);
    var nineslice = null;
    var image = new Image();
    image.src = "16x16_window.png";
    image.onload = function () {
        nineslice = new NineSlice(image, 50, image.height - 20, 15, image.width - 20);
        draw(context);
    };
    document.body.addEventListener("mousedown", function (e) {
        var _a = getMousePos(canvas, e), x = _a.x, y = _a.y;
        mouseX = x;
        mouseY = y;
        mousedown = true;
        if (box.check(mouseX, mouseY)) {
            selection = box;
        }
    });
    document.body.addEventListener("mousemove", function (e) {
        var _a = getMousePos(canvas, e), x = _a.x, y = _a.y;
        if (box.check(x, y)) {
            hover = true;
            draw(context);
        }
        else {
            hover = false;
            draw(context);
        }
        if (mousedown) {
            var deltaX = mouseX - x;
            var deltaY = mouseY - y;
            mouseX = x;
            mouseY = y;
            if (selection != null) {
                selection.x -= deltaX;
                selection.y -= deltaY;
                draw(context);
            }
        }
    });
    document.body.addEventListener("mouseup", function (e) {
        mousedown = false;
        selection = null;
    });
    function getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    function draw(context) {
        context.clearRect(0, 0, width, height);
        if (nineslice != null) {
            var x = width / 4;
            var y = height / 8;
            nineslice.resize(mouseX - x, mouseY - y);
            nineslice.draw(context, x, y);
            nineslice.drawDebug(context, x, y);
        }
        box.draw(context, hover);
    }
    draw(context);
};
//# sourceMappingURL=main.js.map