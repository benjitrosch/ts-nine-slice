"use strict";
var SELECTOR_SIZE = 64;
var HALF_SELECTOR_SIZE = SELECTOR_SIZE / 2;
var ResizeState;
(function (ResizeState) {
    ResizeState[ResizeState["NONE"] = 0] = "NONE";
    ResizeState[ResizeState["HORIZONTAL"] = 1] = "HORIZONTAL";
    ResizeState[ResizeState["VERTICAL"] = 2] = "VERTICAL";
    ResizeState[ResizeState["DIAGONAL"] = 3] = "DIAGONAL";
    ResizeState[ResizeState["REPOSITION"] = 4] = "REPOSITION";
})(ResizeState || (ResizeState = {}));
var Panel = /** @class */ (function () {
    function Panel(canvas, texture, x, y, z, w, h) {
        var _this = this;
        this.selected = false;
        this.resize = ResizeState.NONE;
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        this.h = h;
        this.texture = texture;
        this.texture.resize(w, h);
        var mouseX = 0;
        var mouseY = 0;
        var mousedown = false;
        document.body.addEventListener("mousedown", function (e) {
            var _a = _this.getMousePos(canvas, e), x = _a.x, y = _a.y;
            mouseX = x;
            mouseY = y;
            mousedown = true;
            if (_this.topLeftResizer.check(x, y) ||
                _this.topResizer.check(x, y) ||
                _this.topRightResizer.check(x, y) ||
                _this.leftResizer.check(x, y) ||
                _this.bottomLeftResizer.check(x, y)) {
                _this.addResizeState(ResizeState.REPOSITION);
            }
            if (_this.topResizer.check(x, y) ||
                _this.bottomResizer.check(x, y)) {
                _this.addResizeState(ResizeState.VERTICAL);
                canvas.style.cursor = "ns-resize";
                return;
            }
            if (_this.leftResizer.check(x, y) ||
                _this.rightResizer.check(x, y)) {
                _this.addResizeState(ResizeState.HORIZONTAL);
                canvas.style.cursor = "ew-resize";
                return;
            }
            if (_this.topLeftResizer.check(x, y) ||
                _this.bottomRightResizer.check(x, y)) {
                _this.addResizeState(ResizeState.DIAGONAL);
                canvas.style.cursor = "nwse-resize";
                return;
            }
            if (_this.topRightResizer.check(x, y) ||
                _this.bottomLeftResizer.check(x, y)) {
                _this.addResizeState(ResizeState.DIAGONAL);
                canvas.style.cursor = "nesw-resize";
                return;
            }
            _this.selected = _this.bounds.check(x, y);
        });
        document.body.addEventListener("mousemove", function (e) {
            var _a = _this.getMousePos(canvas, e), x = _a.x, y = _a.y;
            if (mousedown) {
                var deltaX = mouseX - x;
                var deltaY = mouseY - y;
                mouseX = x;
                mouseY = y;
                if (_this.resize != ResizeState.NONE) {
                    var reposition = _this.resize == (_this.resize | ResizeState.REPOSITION);
                    if (_this.resize == (_this.resize | ResizeState.HORIZONTAL)) {
                        if (reposition) {
                            _this.w += deltaX;
                            _this.x -= deltaX;
                        }
                        else {
                            _this.w -= deltaX;
                        }
                    }
                    if (_this.resize == (_this.resize | ResizeState.VERTICAL)) {
                        if (reposition) {
                            _this.h += deltaY;
                            _this.y -= deltaY;
                        }
                        else {
                            _this.h -= deltaY;
                        }
                    }
                    _this.constrain();
                    texture.resize(_this.w, _this.h);
                    return;
                }
                if (_this.selected) {
                    _this.x -= deltaX;
                    _this.y -= deltaY;
                    _this.constrain();
                }
            }
        });
        document.body.addEventListener("mouseup", function () {
            mousedown = false;
            _this.selected = false;
            _this.resize = ResizeState.NONE;
            canvas.style.cursor = "auto";
        });
    }
    Object.defineProperty(Panel.prototype, "bounds", {
        get: function () {
            return new AABB(this.x, this.y, this.w, this.h);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "topResizer", {
        get: function () {
            return new AABB(this.x + HALF_SELECTOR_SIZE, this.y, this.w - SELECTOR_SIZE, HALF_SELECTOR_SIZE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "bottomResizer", {
        get: function () {
            return new AABB(this.x + HALF_SELECTOR_SIZE, this.y + this.h - HALF_SELECTOR_SIZE, this.w - SELECTOR_SIZE, HALF_SELECTOR_SIZE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "leftResizer", {
        get: function () {
            return new AABB(this.x, this.y + HALF_SELECTOR_SIZE, HALF_SELECTOR_SIZE, this.h - SELECTOR_SIZE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "rightResizer", {
        get: function () {
            return new AABB(this.x + this.w - HALF_SELECTOR_SIZE, this.y + HALF_SELECTOR_SIZE, HALF_SELECTOR_SIZE, this.h - SELECTOR_SIZE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "topLeftResizer", {
        get: function () {
            return new AABB(this.x, this.y, HALF_SELECTOR_SIZE, HALF_SELECTOR_SIZE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "topRightResizer", {
        get: function () {
            return new AABB(this.x + this.w - HALF_SELECTOR_SIZE, this.y, HALF_SELECTOR_SIZE, HALF_SELECTOR_SIZE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "bottomLeftResizer", {
        get: function () {
            return new AABB(this.x, this.y + this.h - HALF_SELECTOR_SIZE, HALF_SELECTOR_SIZE, HALF_SELECTOR_SIZE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "bottomRightResizer", {
        get: function () {
            return new AABB(this.x + this.w - HALF_SELECTOR_SIZE, this.y + this.h - HALF_SELECTOR_SIZE, HALF_SELECTOR_SIZE, HALF_SELECTOR_SIZE);
        },
        enumerable: false,
        configurable: true
    });
    Panel.prototype.getMousePos = function (canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };
    Panel.prototype.clamp = function (num, min, max) {
        return Math.min(Math.max(num, min), max);
    };
    Panel.prototype.constrain = function () {
        this.x = this.clamp(this.x, 0, window.innerWidth - this.w);
        this.y = this.clamp(this.y, 0, window.innerHeight - this.h);
        this.w = Math.max(this.w, this.texture.centerWidthUnscaled);
        this.h = Math.max(this.h, this.texture.centerHeightUnscaled);
    };
    Panel.prototype.addResizeState = function (state) {
        this.resize |= state;
    };
    Panel.prototype.draw = function (context) {
        this.texture.draw(context, this.x, this.y);
    };
    Panel.prototype.drawDebug = function (context) {
        this.texture.drawDebug(context, this.x, this.y);
        this.bounds.drawDebug(context);
        this.topResizer.drawDebug(context);
        this.bottomResizer.drawDebug(context);
        this.leftResizer.drawDebug(context);
        this.rightResizer.drawDebug(context);
        this.topLeftResizer.drawDebug(context);
        this.topRightResizer.drawDebug(context);
        this.bottomLeftResizer.drawDebug(context);
        this.bottomRightResizer.drawDebug(context);
    };
    return Panel;
}());
//# sourceMappingURL=panel.js.map