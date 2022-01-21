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
    var height = window.innerHeight - 48;
    var canvas = Canvas.Instance.canvas;
    var context = Canvas.Instance.context;
    canvas.width = width;
    canvas.height = height;
    PanelManager.init(Canvas.Instance.canvas);
    for (var i = 0; i < 5; i++) {
        PanelManager.new();
    }
    DogManager.randomize(5, 8);
    draw(context, function () { return context.clearRect(0, 0, width, height); });
};
function draw(context, clear) {
    clear();
    switch (activeTab) {
        case Tabs.HALL_OF_DOGS:
            Canvas.Instance.canvas.style.background = 'url("./src/vintage-wallpaper-5.jpg")';
            DogManager.draw(context);
            break;
        case Tabs.FAKE_WINDOWS:
            PanelManager.draw(context);
            break;
    }
    requestAnimationFrame(function () { return draw(context, clear); });
}
//# sourceMappingURL=main.js.map