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

    let mouseX = 0
    let mouseY = 0
    let mousedown = false
    let selection: AABB | null = null

    const box = new AABB(width / 2, height / 2, 50, 50)

    const nineslice = new NineSlice("16x16_window_alt.png", 55, 135, 20, 135, () => draw(context))
    const pattern = new Pattern(context, "background_pattern.png")
    const panel = new Panel(canvas, nineslice, width / 4, height / 8, 0, width / 2, height / 2)

    document.body.addEventListener("mousedown", (e) => {
        const { x, y } = getMousePos(canvas, e)

        mouseX = x
        mouseY = y
        mousedown   = true

        if (box.check(mouseX, mouseY)) {
            selection = box
        }
    })

    document.body.addEventListener("mousemove", (e) => {
        const { x, y } = getMousePos(canvas, e)

        draw(context)

        if (mousedown)
        {
            const deltaX = mouseX - x
            const deltaY = mouseY - y

            mouseX = x
            mouseY = y

            if (selection != null) {
                selection.x -= deltaX
                selection.y -= deltaY

                draw(context)
            }
        }
    })

    document.body.addEventListener("mouseup", (e) => {
        mousedown   = false
        selection   = null
    })

    function getMousePos(canvas: HTMLCanvasElement, e: MouseEvent) {
        const rect = canvas.getBoundingClientRect()

        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
    }

    function draw(context: CanvasRenderingContext2D) {
        context.clearRect(0, 0, width, height)

        // if (nineslice != null) {
        //     const x = width / 4
        //     const y = height / 8

        //     nineslice.resize(mouseX - x, mouseY - y)
        //     nineslice.draw(context, x, y, pattern)
        // }

        panel.draw(context)
        panel.drawDebug(context)

        // box.draw(context, hover)
    }

    draw(context)
}