"use strict";
window.onload = function () {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    if (!canvas || !context) {
        return;
    }
    canvas.width = width;
    canvas.height = height;
    var activeTab = Tabs.BOTH;
    var tabs = document.querySelectorAll('button');
    tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () {
            tabs.forEach(function (tab) { return tab.classList.remove('active'); });
            tab.classList.add('active');
            activeTab = i;
            draw(context);
        });
    });
    var box = new AABB(width / 2, height / 2, 50, 50);
    var nineslice = new NineSlice("./src/16x16_window.png", 55, 135, 20, 135, function () { return draw(context); });
    var pattern = new Pattern(context, "./src/background_pattern.png");
    nineslice.setPattern(pattern);
    var panel = new Panel(canvas, nineslice, width / 4, height / 8, 0, width / 2, height / 2);
    document.body.addEventListener("mousemove", function (e) {
        draw(context);
    });
    function draw(context) {
        context.clearRect(0, 0, width, height);
        switch (activeTab) {
            case Tabs.NINESLICE:
                nineslice.draw(context, width / 4, height / 8);
                nineslice.drawDebug(context, width / 4, height / 8);
                break;
            case Tabs.DRAG_DROP:
                box.drawDebug(context);
                break;
            case Tabs.BOTH:
                panel.draw(context);
                panel.drawDebug(context);
                break;
        }
    }
    draw(context);
};
var Tabs;
(function (Tabs) {
    Tabs[Tabs["NINESLICE"] = 0] = "NINESLICE";
    Tabs[Tabs["DRAG_DROP"] = 1] = "DRAG_DROP";
    Tabs[Tabs["BOTH"] = 2] = "BOTH";
})(Tabs || (Tabs = {}));
//# sourceMappingURL=main.js.map