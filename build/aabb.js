"use strict";
var AABB = /** @class */ (function () {
    function AABB(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    Object.defineProperty(AABB.prototype, "top", {
        get: function () {
            return this.y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AABB.prototype, "bottom", {
        get: function () {
            return this.y + this.h;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AABB.prototype, "left", {
        get: function () {
            return this.x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AABB.prototype, "right", {
        get: function () {
            return this.x + this.w;
        },
        enumerable: false,
        configurable: true
    });
    AABB.prototype.check = function (x, y) {
        return this.left <= x &&
            this.right >= x &&
            this.top <= y &&
            this.bottom >= y;
    };
    AABB.prototype.drawDebug = function (context) {
        context.save();
        context.strokeStyle = "red";
        context.beginPath();
        context.strokeRect(this.x, this.y, this.w, this.h);
        context.stroke();
        context.restore();
    };
    return AABB;
}());
//# sourceMappingURL=aabb.js.map