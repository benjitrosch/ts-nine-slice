"use strict";
var Canvas = /** @class */ (function () {
    function Canvas(element) {
        var _this = this;
        this.canvas = element;
        this.mousePos = { x: 0, y: 0 };
        this.canvas.onmousemove = function (e) { return _this.getMousePos(e); };
        this.canvas.oncontextmenu = function (e) { return e.preventDefault(); };
    }
    Object.defineProperty(Canvas, "Instance", {
        get: function () {
            var canvas = document.getElementById("canvas");
            return this.instance || (this.instance = new this(canvas));
        },
        enumerable: false,
        configurable: true
    });
    Canvas.prototype.getContext2D = function () {
        return this.canvas.getContext('2d');
    };
    Canvas.prototype.getMousePos = function (e) {
        var rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };
    return Canvas;
}());
//# sourceMappingURL=canvas.js.map