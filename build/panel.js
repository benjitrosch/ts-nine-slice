"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
    function Panel(canvas, texture, x, y, w, h) {
        var _this = this;
        this.id = -1;
        this.resize = ResizeState.NONE;
        this.x = x;
        this.y = y;
        this.z = 0;
        this.w = w;
        this.h = h;
        this.texture = texture;
        var mouseX = 0;
        var mouseY = 0;
        document.body.addEventListener("mousedown", function (e) {
            var _a = _this.getMousePos(canvas, e), x = _a.x, y = _a.y;
            mouseX = x;
            mouseY = y;
            if (_this.bounds.check(x, y)) {
                PanelManager.setactive(_this);
            }
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
            }
            if (_this.leftResizer.check(x, y) ||
                _this.rightResizer.check(x, y)) {
                _this.addResizeState(ResizeState.HORIZONTAL);
                canvas.style.cursor = "ew-resize";
            }
            if (_this.topLeftResizer.check(x, y) ||
                _this.bottomRightResizer.check(x, y)) {
                _this.addResizeState(ResizeState.DIAGONAL);
                canvas.style.cursor = "nwse-resize";
            }
            if (_this.topRightResizer.check(x, y) ||
                _this.bottomLeftResizer.check(x, y)) {
                _this.addResizeState(ResizeState.DIAGONAL);
                canvas.style.cursor = "nesw-resize";
            }
        });
        document.body.addEventListener("mousemove", function (e) {
            var _a = _this.getMousePos(canvas, e), x = _a.x, y = _a.y;
            if (_this.selected) {
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
                    return;
                }
                else {
                    _this.x -= deltaX;
                    _this.y -= deltaY;
                    _this.constrain();
                }
            }
        });
        document.body.addEventListener("mouseup", function () {
            _this.resize = ResizeState.NONE;
            PanelManager.activePanel = -1;
            canvas.style.cursor = "auto";
        });
    }
    Object.defineProperty(Panel.prototype, "selected", {
        get: function () {
            return PanelManager.activePanel === this.id;
        },
        enumerable: false,
        configurable: true
    });
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
        this.texture.draw(context, this.x, this.y, this.w, this.h);
    };
    Panel.prototype.drawDebug = function (context) {
        this.texture.drawDebug(context, this.x, this.y, this.w, this.h);
        this.bounds.drawDebug(context);
        this.topResizer.drawDebug(context);
        this.bottomResizer.drawDebug(context);
        this.leftResizer.drawDebug(context);
        this.rightResizer.drawDebug(context);
        this.topLeftResizer.drawDebug(context);
        this.topRightResizer.drawDebug(context);
        this.bottomLeftResizer.drawDebug(context);
        this.bottomRightResizer.drawDebug(context);
        context.save();
        context.font = "16px Open Sans";
        context.fillText("id: " + this.id + " z: " + this.z + " active z: " + PanelManager.activePanel, this.x, this.y);
        context.restore();
    };
    return Panel;
}());
var PanelManager = /** @class */ (function () {
    function PanelManager() {
    }
    PanelManager.add = function (panel) {
        if (panel.id < 0)
            panel.id = this.numPanels;
        panel.z = this.panels.length;
        this.numPanels++;
        this.panels.push(panel);
        return panel.z;
    };
    PanelManager.reorder = function () {
        for (var i = 0; i < this.panels.length; i++) {
            this.panels[i].z = i;
        }
    };
    PanelManager.tofront = function (index) {
        var panel = this.panels[index];
        this.panels.splice(index, 1);
        this.reorder();
        return this.add(panel);
    };
    PanelManager.setactive = function (panel) {
        if (this.activePanel >= 0 &&
            panel.z < this.panels[this.activePanel].z) {
            return false;
        }
        this.tofront(panel.z);
        this.activePanel = panel.id;
        return true;
    };
    PanelManager.draw = function (context) {
        __spreadArray([], this.panels, true).sort(function (a, b) { return a.z - b.z; }).forEach(function (panel) {
            panel.draw(context);
            panel.drawDebug(context);
        });
    };
    PanelManager.panels = [];
    PanelManager.activePanel = -1;
    PanelManager.numPanels = 0;
    return PanelManager;
}());
//# sourceMappingURL=panel.js.map