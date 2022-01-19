"use strict";
var NineSlice = /** @class */ (function () {
    function NineSlice(image, top, bottom, left, right) {
        this.image = image;
        this.top = this.clamp(top, 0, bottom);
        this.bottom = this.clamp(bottom, this.top, this.image.height);
        this.left = this.clamp(left, 0, right);
        this.right = this.clamp(right, this.left, this.image.width);
        this.width = image.width;
        this.height = image.height;
    }
    Object.defineProperty(NineSlice.prototype, "bottomHeight", {
        get: function () {
            return this.image.height - this.bottom;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NineSlice.prototype, "rightWidth", {
        get: function () {
            return this.image.width - this.right;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NineSlice.prototype, "centerWidth", {
        get: function () {
            return this.image.width - (this.left + (this.image.width - this.right));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NineSlice.prototype, "centerHeight", {
        get: function () {
            return this.image.height - (this.top + (this.image.height - this.bottom));
        },
        enumerable: false,
        configurable: true
    });
    NineSlice.prototype.clamp = function (num, min, max) {
        return Math.min(Math.max(num, min), max);
    };
    NineSlice.prototype.resize = function (width, height) {
        this.width = Math.max(width, this.centerWidth);
        this.height = Math.max(height, this.centerHeight);
    };
    NineSlice.prototype.draw = function (context, x, y) {
        var centerX = x + this.left;
        var centerY = y + this.top;
        var rightX = x + this.left + this.width;
        var bottomY = y + this.top + this.height;
        if (this.left > 0) {
            if (this.top > 0) {
                // TOP LEFT
                context.drawImage(this.image, 0, 0, this.left, this.top, x, y, this.left, this.top);
            }
            if (this.centerHeight > 0) {
                // CENTER LEFT
                context.drawImage(this.image, 0, this.top, this.left, this.centerHeight, x, centerY, this.left, this.height);
            }
            if (this.bottom > 0) {
                // BOTTOM LEFT
                context.drawImage(this.image, 0, this.bottom, this.left, this.bottomHeight, x, bottomY, this.left, this.bottomHeight);
            }
        }
        if (this.centerWidth > 0) {
            if (this.top > 0) {
                // TOP CENTER
                context.drawImage(this.image, this.left, 0, this.centerWidth, this.top, centerX, y, this.width, this.top);
            }
            if (this.centerHeight > 0) {
                // CENTER
                context.drawImage(this.image, this.left, this.top, this.centerWidth, this.centerHeight, centerX, centerY, this.width, this.height);
            }
            if (this.bottom > 0) {
                // BOTTOM CENTER
                context.drawImage(this.image, this.left, this.bottom, this.centerWidth, this.bottomHeight, centerX, bottomY, this.width, this.bottomHeight);
            }
        }
        if (this.right > 0) {
            if (this.top > 0) {
                // TOP RIGHT
                context.drawImage(this.image, this.right, 0, this.rightWidth, this.top, rightX, y, this.rightWidth, this.top);
            }
            if (this.centerHeight > 0) {
                // CENTER RIGHT
                context.drawImage(this.image, this.right, this.top, this.rightWidth, this.centerHeight, rightX, centerY, this.rightWidth, this.height);
            }
            if (this.bottomHeight > 0) {
                // BOTTOM RIGHT
                context.drawImage(this.image, this.right, this.bottom, this.rightWidth, this.bottomHeight, rightX, bottomY, this.rightWidth, this.bottomHeight);
            }
        }
    };
    NineSlice.prototype.drawDebug = function (context, x, y) {
        context.save();
        var SELECTOR_SIZE = 16;
        var HALF_SELECTOR_SIZE = SELECTOR_SIZE / 2;
        context.strokeStyle = "red";
        // TOP
        context.beginPath();
        context.strokeRect(x + (this.left + this.rightWidth + this.width) / 2 - HALF_SELECTOR_SIZE, y - HALF_SELECTOR_SIZE, SELECTOR_SIZE, SELECTOR_SIZE);
        context.stroke();
        // BOTTOM
        context.beginPath();
        context.strokeRect(x + (this.left + this.rightWidth + this.width) / 2 - HALF_SELECTOR_SIZE, y + this.height + this.top + this.bottomHeight - HALF_SELECTOR_SIZE, SELECTOR_SIZE, SELECTOR_SIZE);
        context.stroke();
        // LEFT
        context.beginPath();
        context.strokeRect(x - HALF_SELECTOR_SIZE, y + (this.top + this.bottomHeight + this.height) / 2 - HALF_SELECTOR_SIZE, SELECTOR_SIZE, SELECTOR_SIZE);
        context.stroke();
        // RIGHT
        context.beginPath();
        context.strokeRect(x + this.width + this.left + this.rightWidth - HALF_SELECTOR_SIZE, y + (this.top + this.bottomHeight + this.height) / 2 - HALF_SELECTOR_SIZE, SELECTOR_SIZE, SELECTOR_SIZE);
        context.stroke();
        context.restore();
    };
    return NineSlice;
}());
//# sourceMappingURL=nineslice.js.map