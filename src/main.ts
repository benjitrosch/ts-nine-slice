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
    const context = Canvas.Instance.getContext2D()

    canvas.width = width
    canvas.height = height
    
    PanelManager.init(Canvas.Instance.canvas)

    PanelManager.new(context)
    PanelManager.new(context)
    PanelManager.new(context)
    PanelManager.new(context)
    PanelManager.new(context)

    DogManager.randomize(3, 5)

    draw(context, () => context.clearRect(0, 0, width, height))
}

function draw(context: CanvasRenderingContext2D, clear: () => void) {
    clear()

    switch (activeTab) {
        case Tabs.HALL_OF_DOGS:
            DogManager.draw(context)
            break;

        case Tabs.FAKE_WINDOWS:
            PanelManager.draw(context)
            break;
    }

    requestAnimationFrame(() => draw(context, clear))
}