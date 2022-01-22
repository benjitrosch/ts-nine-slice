"use strict";
var DELAY = 50;
var LINE_HEIGHT = 48;
var Typewriter = /** @class */ (function () {
    function Typewriter() {
    }
    Typewriter.start = function (dialogue) {
        this.text = '';
        this.fulltext = dialogue;
        this.currentletter = 0;
        this.dialoguebox = new NineSlice('./src/assets/dialogue_box.png', 15, 65, 15, 65);
        this.type(Canvas.Instance.context);
    };
    Typewriter.type = function (context) {
        var _this = this;
        this.text += this.fulltext.charAt(this.currentletter);
        this.currentletter++;
        setTimeout(function () { return _this.type(context); }, DELAY);
    };
    Typewriter.split = function (context, text, line) {
        if (line === void 0) { line = 1; }
        for (var i = 0; i <= text.length; i++) {
            var substr = text.substring(0, i);
            if (context.measureText(substr).width > window.innerWidth - 32) {
                return this.split(context, text.substring(i - 1), ++line);
            }
        }
        return line;
    };
    Typewriter.newline = function (context, text, line) {
        if (line === void 0) { line = 0; }
        for (var i = 0; i <= text.length; i++) {
            var substr = text.substring(0, i);
            if (context.measureText(substr).width > window.innerWidth - 32) {
                context.fillText(text.substring(0, i - 1), 16, 32 + line * LINE_HEIGHT);
                this.newline(context, text.substring(i), ++line);
                return;
            }
        }
        context.fillText(text, 16, 32 + line * LINE_HEIGHT);
    };
    Typewriter.draw = function (context) {
        context.save();
        context.font = '24px Open Sans';
        context.fillStyle = 'white';
        var lines = this.split(context, this.text);
        this.dialoguebox.draw(context, 0, 0, window.innerWidth, LINE_HEIGHT * lines);
        this.newline(context, this.text);
        context.restore();
    };
    return Typewriter;
}());
//# sourceMappingURL=typewriter.js.map