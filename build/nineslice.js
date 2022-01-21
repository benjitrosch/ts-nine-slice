"use strict";
var NineSlice = /** @class */ (function () {
    function NineSlice(filepath, top, bottom, left, right, content, onload) {
        var _this = this;
        if (content === void 0) { content = null; }
        this.loading = true;
        var image = new Image();
        image.src = filepath;
        image.onload = function () {
            _this.loading = false;
            onload && onload();
        };
        this.image = image;
        this.content = content;
        this.top = this.clamp(top, 0, bottom);
        this.bottom = this.clamp(bottom, this.top, this.image.height);
        this.left = this.clamp(left, 0, right);
        this.right = this.clamp(right, this.left, this.image.width);
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
    Object.defineProperty(NineSlice.prototype, "centerWidthUnscaled", {
        get: function () {
            return this.image.width - (this.left + (this.image.width - this.right));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NineSlice.prototype, "centerHeightUnscaled", {
        get: function () {
            return this.image.height - (this.top + (this.image.height - this.bottom));
        },
        enumerable: false,
        configurable: true
    });
    NineSlice.prototype.clamp = function (num, min, max) {
        return Math.min(Math.max(num, min), max);
    };
    NineSlice.prototype.getfitsize = function (w, h) {
        return { w: w + this.left + this.rightWidth, h: h + this.top + this.bottomHeight };
    };
    NineSlice.prototype.draw = function (context, x, y, w, h) {
        if (this.loading) {
            return;
        }
        var centerWidthScaled = w - this.left - this.rightWidth;
        var centerHeightScaled = h - this.top - this.bottomHeight;
        var centerX = x + this.left;
        var centerY = y + this.top;
        var rightX = x + w - this.rightWidth;
        var bottomY = y + h - this.bottomHeight;
        if (this.left > 0) {
            if (this.top > 0) {
                // TOP LEFT
                context.drawImage(this.image, 0, 0, this.left, this.top, x, y, this.left, this.top);
            }
            if (this.centerHeightUnscaled > 0) {
                // CENTER LEFT
                context.drawImage(this.image, 0, this.top, this.left, this.centerHeightUnscaled, x, centerY, this.left, centerHeightScaled);
            }
            if (this.bottom > 0) {
                // BOTTOM LEFT
                context.drawImage(this.image, 0, this.bottom, this.left, this.bottomHeight, x, bottomY, this.left, this.bottomHeight);
            }
        }
        if (this.centerWidthUnscaled > 0) {
            if (this.top > 0) {
                // TOP CENTER
                context.drawImage(this.image, this.left, 0, this.centerWidthUnscaled, this.top, centerX, y, centerWidthScaled, this.top);
            }
            if (this.centerHeightUnscaled > 0) {
                // CENTER
                if (this.content != null) {
                    this.content.draw(context, centerX, centerY, centerWidthScaled, centerHeightScaled);
                }
                else {
                    context.drawImage(this.image, this.left, this.top, this.centerWidthUnscaled, this.centerHeightUnscaled, centerX, centerY, centerWidthScaled, centerHeightScaled);
                }
            }
            if (this.bottom > 0) {
                // BOTTOM CENTER
                context.drawImage(this.image, this.left, this.bottom, this.centerWidthUnscaled, this.bottomHeight, centerX, bottomY, centerWidthScaled, this.bottomHeight);
            }
        }
        if (this.right > 0) {
            if (this.top > 0) {
                // TOP RIGHT
                context.drawImage(this.image, this.right, 0, this.rightWidth, this.top, rightX, y, this.rightWidth, this.top);
            }
            if (this.centerHeightUnscaled > 0) {
                // CENTER RIGHT
                context.drawImage(this.image, this.right, this.top, this.rightWidth, this.centerHeightUnscaled, rightX, centerY, this.rightWidth, centerHeightScaled);
            }
            if (this.bottomHeight > 0) {
                // BOTTOM RIGHT
                context.drawImage(this.image, this.right, this.bottom, this.rightWidth, this.bottomHeight, rightX, bottomY, this.rightWidth, this.bottomHeight);
            }
        }
    };
    NineSlice.prototype.drawDebug = function (context, x, y, w, h) {
        context.save();
        context.strokeStyle = "#00ff00";
        context.setLineDash([5]);
        this.drawLine(context, {
            x: x + this.left,
            y: y,
        }, {
            x: x + this.left,
            y: y + h,
        });
        this.drawLine(context, {
            x: x + w - this.rightWidth,
            y: y,
        }, {
            x: x + w - this.rightWidth,
            y: y + h,
        });
        this.drawLine(context, {
            x: x,
            y: y + this.top,
        }, {
            x: x + w,
            y: y + this.top,
        });
        this.drawLine(context, {
            x: x,
            y: y + h - this.bottomHeight,
        }, {
            x: x + w,
            y: y + h - this.bottomHeight,
        });
        context.restore();
    };
    NineSlice.prototype.drawLine = function (context, p0, p1) {
        context.beginPath();
        context.moveTo(p0.x, p0.y);
        context.lineTo(p1.x, p1.y);
        context.stroke();
    };
    return NineSlice;
}());
//# sourceMappingURL=nineslice.js.map