"use strict";
var Tabs;
(function (Tabs) {
    Tabs["HALL_OF_DOGS"] = "dogs";
    Tabs["FAKE_WINDOWS"] = "windows";
})(Tabs || (Tabs = {}));
var url = new URL((window.location.href).toLowerCase());
var activeTab = url.searchParams.get("tab");
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
    var pattern = new Pattern(context, "./src/background_pattern.png");
    var nineslice = new NineSlice("./src/16x16_window.png", 55, 135, 20, 135, pattern);
    PanelManager.add(new Panel(canvas, nineslice, 50, 150, width / 2, height / 2));
    PanelManager.add(new Panel(canvas, nineslice, width / 4, height / 8, width / 2, height / 2));
    PanelManager.add(new Panel(canvas, nineslice, width / 2, height / 4, width / 2, height / 2));
    DogManager.randomize(3, 5);
    draw(context, function () { return context.clearRect(0, 0, width, height); });
};
function draw(context, clear) {
    clear();
    switch (activeTab) {
        case Tabs.HALL_OF_DOGS:
            DogManager.draw(context);
            break;
        case Tabs.FAKE_WINDOWS:
            PanelManager.draw(context);
            break;
    }
    requestAnimationFrame(function () { return draw(context, clear); });
}
//# sourceMappingURL=main.js.map