enum Tabs {
    NINESLICE = 0,
    DRAG_DROP = 1,
    BOTH = 2,
}

let activeTab: Tabs = Tabs.BOTH

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

    const tabs = document.querySelectorAll('button')
    tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => {
            tabs.forEach((tab) => tab.classList.remove('active'))

            tab.classList.add('active')
            activeTab = i
        })
    })

    const pattern = new Pattern(context, "./src/background_pattern.png")
    const nineslice = new NineSlice("./src/16x16_window.png", 55, 135, 20, 135, pattern)

    PanelManager.add(new Panel(canvas, nineslice, 50, 150, width / 2, height / 2))
    PanelManager.add(new Panel(canvas, nineslice, width / 4, height / 8, width / 2, height / 2))
    PanelManager.add(new Panel(canvas, nineslice, width / 2, height / 4, width / 2, height / 2))

    draw(context, () => context.clearRect(0, 0, width, height))
}

function draw(context: CanvasRenderingContext2D, clear: () => void) {
    clear()

    switch (activeTab) {
        // case Tabs.NINESLICE:
        //     nineslice.draw(context, width / 4, height / 8)
        //     nineslice.drawDebug(context, width / 4, height / 8)
        //     break;

        // case Tabs.DRAG_DROP:
        //     box.drawDebug(context)
        //     break;

        case Tabs.BOTH:
            PanelManager.draw(context)
            break;
    }

    requestAnimationFrame(() => draw(context, clear))
}