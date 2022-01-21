"use strict";
var button = /** @class */ (function () {
    function button(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    Object.defineProperty(button.prototype, "bounds", {
        get: function () {
            return new AABB(this.x, this.y, this.w, this.y);
        },
        enumerable: false,
        configurable: true
    });
    return button;
}());
//# sourceMappingURL=button.js.map