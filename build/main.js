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
    var context = Canvas.Instance.getContext2D();
    canvas.width = width;
    canvas.height = height;
    PanelManager.init(Canvas.Instance.canvas);
    PanelManager.new(context);
    PanelManager.new(context);
    PanelManager.new(context);
    PanelManager.new(context);
    PanelManager.new(context);
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