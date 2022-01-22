"use strict";
var Tabs;
(function (Tabs) {
    Tabs["FAKE_WINDOWS"] = "windows";
    Tabs["HALL_OF_DOGS"] = "dogs";
    Tabs["DIALOGUE_BOX"] = "dialogue";
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
    switch (activeTab) {
        default:
        case Tabs.FAKE_WINDOWS:
            PanelManager.init(Canvas.Instance.canvas);
            for (var i = 0; i < 5; i++) {
                PanelManager.new();
            }
            break;
        case Tabs.HALL_OF_DOGS:
            DogManager.randomize(5, 8);
            break;
        case Tabs.DIALOGUE_BOX:
            Typewriter.start('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tincidunt libero sit amet nibh ornare laoreet. Ut fringilla, urna quis lacinia aliquam, nibh ipsum sodales magna, sit amet feugiat mauris quam eget diam. Mauris congue feugiat ligula, at congue lectus viverra accumsan. Donec et libero ex. Aenean ultricies eget orci sit amet fringilla. Sed aliquam blandit justo vitae vulputate. Proin tincidunt mauris sit amet tortor consectetur, nec hendrerit diam malesuada. Morbi nibh leo, faucibus et diam a, rhoncus tristique lorem. Maecenas semper rutrum ipsum, ut vulputate tortor bibendum non. Pellentesque dui diam, efficitur quis posuere at, rutrum vel tortor. Mauris ac dolor eu libero faucibus rutrum. Aenean consequat et erat et egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aenean cursus vehicula erat, quis vestibulum ligula placerat nec. Donec at dolor blandit, luctus magna quis, efficitur purus.');
            break;
    }
    draw(context, function () { return context.clearRect(0, 0, width, height); });
};
function draw(context, clear) {
    clear();
    switch (activeTab) {
        default:
        case Tabs.FAKE_WINDOWS:
            PanelManager.draw(context);
            break;
        case Tabs.HALL_OF_DOGS:
            Canvas.Instance.canvas.style.background = 'url("./src/assets/vintage-wallpaper-5.jpg")';
            DogManager.draw(context);
            break;
        case Tabs.DIALOGUE_BOX:
            Canvas.Instance.canvas.style.background = 'black';
            Typewriter.draw(context);
            break;
    }
    requestAnimationFrame(function () { return draw(context, clear); });
}
//# sourceMappingURL=main.js.map