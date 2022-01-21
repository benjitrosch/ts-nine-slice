enum Tabs {
    HALL_OF_DOGS = "dogs",
    FAKE_WINDOWS = "windows",
}

const url = new URL((window.location.href).toLowerCase())
const activeTab: Tabs = url.searchParams.get("tab") as Tabs

window.onload = function() {
    const width = window.innerWidth
    const height = window.innerHeight - 48

    const canvas = Canvas.Instance.canvas
    const context = Canvas.Instance.context

    canvas.width = width
    canvas.height = height
    
    PanelManager.init(Canvas.Instance.canvas)

    for (let i = 0; i < 5; i++) {
        PanelManager.new()
    }

    DogManager.randomize(5, 8)

    draw(context, () => context.clearRect(0, 0, width, height))
}

function draw(context: CanvasRenderingContext2D, clear: () => void) {
    clear()

    switch (activeTab) {
        case Tabs.HALL_OF_DOGS:
            Canvas.Instance.canvas.style.background = 'url("./src/vintage-wallpaper-5.jpg")'
            DogManager.draw(context)
            break;

        case Tabs.FAKE_WINDOWS:
            PanelManager.draw(context)
            break;
    }

    requestAnimationFrame(() => draw(context, clear))
}