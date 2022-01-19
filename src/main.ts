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

    let activeTab: Tabs = Tabs.BOTH
    const tabs = document.querySelectorAll('button')
    tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => {
            tabs.forEach((tab) => tab.classList.remove('active'))

            tab.classList.add('active')
            activeTab = i

            draw(context)
        })
    })

    const box = new AABB(width / 2, height / 2, 50, 50)

    const nineslice = new NineSlice("./src/16x16_window.png", 55, 135, 20, 135, () => draw(context))
    const pattern = new Pattern(context, "./src/background_pattern.png")
    nineslice.setPattern(pattern)
    
    const panel = new Panel(canvas, nineslice, width / 4, height / 8, 0, width / 2, height / 2)

    document.body.addEventListener("mousemove", (e) => {
        draw(context)
    })

    function draw(context: CanvasRenderingContext2D) {
        context.clearRect(0, 0, width, height)

        switch (activeTab) {
            case Tabs.NINESLICE:
                nineslice.draw(context, width / 4, height / 8)
                nineslice.drawDebug(context, width / 4, height / 8)
                break;

            case Tabs.DRAG_DROP:
                box.drawDebug(context)
                break;

            case Tabs.BOTH:
                panel.draw(context)
                panel.drawDebug(context)
                break;
        }
    }

    draw(context)
}

enum Tabs {
    NINESLICE = 0,
    DRAG_DROP = 1,
    BOTH = 2,
}