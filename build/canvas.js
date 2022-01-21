"use strict";
var Canvas = /** @class */ (function () {
    function Canvas(element) {
        var _this = this;
        this.canvas = element;
        this.mousePos = { x: 0, y: 0 };
        this.canvas.onmousemove = function (e) { return _this.getMousePos(e); };
        this.canvas.oncontextmenu = function (e) { return e.preventDefault(); };
        this.fixdpi();
    }
    Object.defineProperty(Canvas, "Instance", {
        get: function () {
            var canvas = document.getElementById("canvas");
            return this.instance || (this.instance = new this(canvas));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "context", {
        get: function () {
            return this.canvas.getContext('2d');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "dpi", {
        get: function () {
            return window.devicePixelRatio;
        },
        enumerable: false,
        configurable: true
    });
    Canvas.prototype.getMousePos = function (e) {
        var rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };
    Canvas.prototype.fixdpi = function () {
        var w = +getComputedStyle(this.canvas).getPropertyValue("width").slice(0, -2);
        var h = +getComputedStyle(this.canvas).getPropertyValue("height").slice(0, -2);
        this.canvas.setAttribute('width', (w * this.dpi).toString());
        this.canvas.setAttribute('height', (h * this.dpi).toString());
    };
    return Canvas;
}());
//# sourceMappingURL=canvas.js.map