"use strict";
var Button = /** @class */ (function () {
    function Button(canvas, filepath, x, y, onClick) {
        var _this = this;
        this.w = 0;
        this.h = 0;
        this.loading = true;
        var image = new Image();
        image.src = filepath;
        image.onload = function () {
            _this.loading = false;
            _this.w = image.width;
            _this.h = image.height;
        };
        this.texture = image;
        this.x = x;
        this.y = y;
        this.onClick = onClick;
        document.body.addEventListener('mousemove', function (e) {
            var _a = _this.getMousePos(canvas, e), x = _a.x, y = _a.y;
            canvas.style.cursor = "auto";
            if (_this.bounds.check(x, y)) {
                canvas.style.cursor = "pointer";
            }
        });
        document.body.addEventListener('mousedown', function (e) {
            var _a = _this.getMousePos(canvas, e), x = _a.x, y = _a.y;
            if (_this.bounds.check(x, y)) {
                onClick && onClick();
            }
        });
    }
    Object.defineProperty(Button.prototype, "bounds", {
        get: function () {
            return new AABB(this.x, this.y, this.w, this.h);
        },
        enumerable: false,
        configurable: true
    });
    Button.prototype.getMousePos = function (canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };
    Button.prototype.draw = function (context) {
        if (this.loading) {
            return;
        }
        context.drawImage(this.texture, this.x, this.y);
    };
    return Button;
}());
//# sourceMappingURL=button.js.map