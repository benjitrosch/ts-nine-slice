"use strict";
var Pattern = /** @class */ (function () {
    function Pattern(context, filepath, x, y, rotation) {
        var _this = this;
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (rotation === void 0) { rotation = 0; }
        this.loading = true;
        this.texture = null;
        var image = new Image();
        image.src = filepath;
        image.onload = function () {
            var texture = context.createPattern(image, 'repeat');
            if (texture != null) {
                _this.texture = texture;
                _this.loading = false;
            }
        };
        this.x = x;
        this.y = y;
        this.rotation = rotation;
    }
    Pattern.prototype.scroll = function (x, y) {
        if (x === void 0) { x = 1; }
        if (y === void 0) { y = 1; }
        this.x += x;
        this.y += y;
    };
    Pattern.prototype.rotate = function (deg) {
        if (deg === void 0) { deg = 1; }
        this.rotation += deg;
    };
    return Pattern;
}());
//# sourceMappingURL=pattern.js.map