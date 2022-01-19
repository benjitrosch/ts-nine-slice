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

    const box = new AABB(width / 2, height / 2, 50, 50)

    const nineslice = new NineSlice("./src/16x16_window.png", 55, 135, 20, 135, () => draw(context))
    const pattern = new Pattern(context, "./src/background_pattern.png")
    const panel = new Panel(canvas, nineslice, width / 4, height / 8, 0, width / 2, height / 2)

    document.body.addEventListener("mousemove", (e) => {
        draw(context)
    })

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