"use strict";
var Tabs;
(function (Tabs) {
    Tabs[Tabs["NINESLICE"] = 0] = "NINESLICE";
    Tabs[Tabs["DRAG_DROP"] = 1] = "DRAG_DROP";
    Tabs[Tabs["BOTH"] = 2] = "BOTH";
})(Tabs || (Tabs = {}));
var activeTab = Tabs.BOTH;
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
    var tabs = document.querySelectorAll('button');
    tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () {
            tabs.forEach(function (tab) { return tab.classList.remove('active'); });
            tab.classList.add('active');
            activeTab = i;
        });
    });
    var pattern = new Pattern(context, "./src/background_pattern.png");
    var nineslice = new NineSlice("./src/16x16_window.png", 55, 135, 20, 135, pattern);
    PanelManager.add(new Panel(canvas, nineslice, 50, 150, width / 2, height / 2));
    PanelManager.add(new Panel(canvas, nineslice, width / 4, height / 8, width / 2, height / 2));
    PanelManager.add(new Panel(canvas, nineslice, width / 2, height / 4, width / 2, height / 2));
    draw(context, function () { return context.clearRect(0, 0, width, height); });
};
function draw(context, clear) {
    clear();
    switch (activeTab) {
        // case Tabs.NINESLICE:
        //     nineslice.draw(context, width / 4, height / 8)
        //     nineslice.drawDebug(context, width / 4, height / 8)
        //     break;
        // case Tabs.DRAG_DROP:
        //     box.drawDebug(context)
        //     break;
        case Tabs.BOTH:
            PanelManager.draw(context);
            break;
    }
    requestAnimationFrame(function () { return draw(context, clear); });
}
//# sourceMappingURL=main.js.map