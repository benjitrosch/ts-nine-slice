enum Tabs {
    HALL_OF_DOGS = "dogs",
    FAKE_WINDOWS = "windows",
}

const url = new URL((window.location.href).toLowerCase())
const activeTab: Tabs = url.searchParams.get("tab") as Tabs

window.onload = function() {
    const width = window.innerWidth
    const height = window.innerHeight

    const canvas: HTMLCanvasElement | null = document.getElementById("canvas") as HTMLCanvasElement
    const context: CanvasRenderingContext2D | null = canvas!.getContext("2d")

    if (!canvas || !context) {
        return
    }

    canvas.width = width
    canvas.height = height

    const pattern = new Pattern(context, "./src/background_pattern.png")
    const nineslice = new NineSlice("./src/16x16_window.png", 55, 135, 20, 135, pattern)

    PanelManager.init(canvas)

    PanelManager.add(new Panel(canvas, nineslice, 50, 150, width / 4, height / 2))
    PanelManager.add(new Panel(canvas, nineslice, width / 3, height / 16, width / 2.5, height / 2))
    PanelManager.add(new Panel(canvas, nineslice, width / 1.25, height / 2, width / 6, height / 3))

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