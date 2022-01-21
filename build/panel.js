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
    function Panel(texture, id, x, y, z, w, h) {
        var _this = this;
        this.resizestate = ResizeState.NONE;
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        this.h = h;
        this.id = id;
        this.texture = texture;
        this.closebutton = new Button("./src/button.png", this.x + this.w - 50, this.y + 10, function () {
            // removeEventListener('mousedown', handleMouseDown)
            // removeEventListener('mousemove', handleMouseMove)
            // removeEventListener('mouseup', handleMouseUp)
            PanelManager.remove(_this.id);
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
    Panel.prototype.resize = function (w, h) {
        this.w = w;
        this.h = h;
        this.closebutton.x = this.x + this.w - 50;
        this.closebutton.y = this.y + 10;
    };
    Panel.prototype.reposition = function (x, y) {
        this.x = x;
        this.y = y;
        this.closebutton.x = this.x + this.w - 50;
        this.closebutton.y = this.y + 10;
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
        this.resizestate |= state;
    };
    Panel.prototype.draw = function (context) {
        this.texture.draw(context, this.x, this.y, this.w, this.h);
        this.closebutton.draw(context);
        context.save();
        context.font = "24px Open Sans";
        var offsetX = 16;
        var offsetY = 32;
        var text = "id: " + this.id + " / z order: " + this.z + " / active: " + PanelManager.activePanel;
        var numLetters = text.length;
        var textWidth = context.measureText(text).width;
        while (textWidth >= this.w - this.texture.rightWidth - this.closebutton.w - offsetX) {
            text = text.substring(0, text.length - 1);
            textWidth = context.measureText(text + '...').width;
            if (text.length <= 0) {
                break;
            }
        }
        if (text.length < numLetters) {
            text += '...';
        }
        context.fillText(text, this.x + offsetX, this.y + offsetY);
        context.restore();
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
    };
    return Panel;
}());
var PanelManager = /** @class */ (function () {
    function PanelManager() {
    }
    Object.defineProperty(PanelManager, "empty", {
        get: function () {
            return this.panels.length < 1;
        },
        enumerable: false,
        configurable: true
    });
    PanelManager.init = function (canvas) {
        var _this = this;
        this.newbutton = new Button('./src/new_panel_button.png', 0, window.innerHeight - 256, function () { return alert('hi'); });
        var mouseX = 0;
        var mouseY = 0;
        var handleMouseDown = function (e) {
            if (_this.empty) {
                return;
            }
            var _a = Canvas.Instance.getMousePos(e), x = _a.x, y = _a.y;
            mouseX = x;
            mouseY = y;
            for (var i = _this.panels.length - 1; i >= 0; i--) {
                var panel = _this.panels[i];
                if (panel.bounds.check(x, y)) {
                    PanelManager.setactive(panel);
                    if (panel.topLeftResizer.check(x, y) ||
                        panel.topResizer.check(x, y) ||
                        panel.topRightResizer.check(x, y) ||
                        panel.leftResizer.check(x, y) ||
                        panel.bottomLeftResizer.check(x, y)) {
                        panel.addResizeState(ResizeState.REPOSITION);
                    }
                    if (panel.topResizer.check(x, y) ||
                        panel.bottomResizer.check(x, y)) {
                        panel.addResizeState(ResizeState.VERTICAL);
                        canvas.style.cursor = "ns-resize";
                    }
                    if (panel.leftResizer.check(x, y) ||
                        panel.rightResizer.check(x, y)) {
                        panel.addResizeState(ResizeState.HORIZONTAL);
                        canvas.style.cursor = "ew-resize";
                    }
                    if (panel.topLeftResizer.check(x, y) ||
                        panel.bottomRightResizer.check(x, y)) {
                        panel.addResizeState(ResizeState.DIAGONAL);
                        canvas.style.cursor = "nwse-resize";
                    }
                    if (panel.topRightResizer.check(x, y) ||
                        panel.bottomLeftResizer.check(x, y)) {
                        panel.addResizeState(ResizeState.DIAGONAL);
                        canvas.style.cursor = "nesw-resize";
                    }
                    break;
                }
            }
        };
        var handleMouseMove = function (e) {
            if (_this.empty) {
                return;
            }
            var _a = Canvas.Instance.getMousePos(e), x = _a.x, y = _a.y;
            var panel = _this.panels[_this.panels.length - 1];
            var hover = false;
            var resize = null;
            var button = false;
            _this.panels.forEach(function (panel) {
                if (panel.closebutton.bounds.check(x, y)) {
                    button = true;
                }
                if (panel.bounds.check(x, y)) {
                    hover = true;
                }
                if (panel.topResizer.check(x, y) ||
                    panel.bottomResizer.check(x, y)) {
                    resize = "ns-resize";
                }
                if (panel.leftResizer.check(x, y) ||
                    panel.rightResizer.check(x, y)) {
                    resize = "ew-resize";
                }
                if (panel.topLeftResizer.check(x, y) ||
                    panel.bottomRightResizer.check(x, y)) {
                    resize = "nwse-resize";
                }
                if (panel.topRightResizer.check(x, y) ||
                    panel.bottomLeftResizer.check(x, y)) {
                    resize = "nesw-resize";
                }
            });
            if (_this.newbutton.bounds.check(x, y)) {
                button = true;
            }
            canvas.style.cursor = resize != null ? resize : hover ? 'grab' : 'auto';
            if (button) {
                canvas.style.cursor = 'pointer';
                return;
            }
            if (panel.selected) {
                var deltaX = mouseX - x;
                var deltaY = mouseY - y;
                mouseX = x;
                mouseY = y;
                if (panel.resizestate != ResizeState.NONE) {
                    var reposition = panel.resizestate == (panel.resizestate | ResizeState.REPOSITION);
                    if (panel.resizestate == (panel.resizestate | ResizeState.HORIZONTAL)) {
                        if (reposition) {
                            panel.resize(panel.w + deltaX, panel.h);
                            panel.reposition(panel.x - deltaX, panel.y);
                        }
                        else {
                            panel.resize(panel.w - deltaX, panel.h);
                        }
                    }
                    if (panel.resizestate == (panel.resizestate | ResizeState.VERTICAL)) {
                        if (reposition) {
                            panel.resize(panel.w, panel.h + deltaY);
                            panel.reposition(panel.x, panel.y - deltaY);
                        }
                        else {
                            panel.resize(panel.w, panel.h - deltaY);
                        }
                    }
                    panel.constrain();
                    return;
                }
                else {
                    panel.reposition(panel.x - deltaX, panel.y - deltaY);
                    panel.constrain();
                }
            }
        };
        var handleMouseUp = function () {
            if (_this.empty) {
                return;
            }
            _this.panels[_this.panels.length - 1].resizestate = ResizeState.NONE;
            _this.activePanel = -1;
            canvas.style.cursor = "auto";
        };
        document.body.addEventListener("mousedown", handleMouseDown);
        document.body.addEventListener("mousemove", handleMouseMove);
        document.body.addEventListener("mouseup", handleMouseUp);
    };
    PanelManager.new = function (context) {
        var _a = this.getrandompos(), x = _a.x, y = _a.y;
        var _b = this.getrandomsize(), w = _b.w, h = _b.h;
        var pattern = new Pattern(context, "./src/background_pattern.png");
        var nineslice = new NineSlice("./src/16x16_window.png", 55, 135, 20, 135, pattern);
        var panel = new Panel(nineslice, this.numPanels, x, y, this.panels.length, w, h);
        panel.constrain();
        this.numPanels++;
        this.panels.push(panel);
    };
    PanelManager.add = function (panel) {
        if (panel.id < 0)
            panel.id = this.numPanels;
        panel.z = this.panels.length;
        this.numPanels++;
        this.panels.push(panel);
        return panel.z;
    };
    PanelManager.remove = function (id) {
        var index = this.panels.findIndex(function (panel) { return panel.id === id; });
        this.panels.splice(index, 1);
        this.numPanels--;
        this.reorder();
    };
    PanelManager.reorder = function () {
        for (var i = 0; i < this.panels.length; i++) {
            this.panels[i].z = i;
        }
    };
    PanelManager.getrandompos = function () {
        var x = Math.floor(Math.random() * window.innerWidth / 1.5);
        var y = Math.floor(Math.random() * window.innerHeight / 4);
        return { x: x, y: y };
    };
    PanelManager.getrandomsize = function () {
        var w = Math.floor((Math.random() * window.innerWidth / 4) + window.innerWidth / 8);
        var h = Math.floor((Math.random() * window.innerHeight / 4) + window.innerHeight / 5);
        return { w: w, h: h };
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
        this.newbutton.draw(context);
        context.save();
        var text = 'New File';
        context.font = '24px Open Sans';
        context.strokeStyle = 'black';
        context.lineWidth = 4;
        context.fillStyle = 'white';
        context.strokeText(text, 80, window.innerHeight - 80);
        context.fillText(text, 80, window.innerHeight - 80);
        context.restore();
        __spreadArray([], this.panels, true).sort(function (a, b) { return a.z - b.z; }).forEach(function (panel) {
            panel.draw(context);
            // panel.drawDebug(context)
        });
    };
    PanelManager.panels = [];
    PanelManager.activePanel = -1;
    PanelManager.numPanels = 0;
    return PanelManager;
}());
//# sourceMappingURL=panel.js.map