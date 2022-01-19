window.onload = function() {
    const width = window.innerWidth
    const height = window.innerHeight

    const canvas: HTMLCanvasElement | null = document.getElementById("canvas") as HTMLCanvasElement
    const context: CanvasRenderingContext2D | null = canvas!.getContext("2d")

    if (!canvas || !context) return

    canvas.width = width
    canvas.height = height

    let mouseX = 0
    let mouseY = 0
    let mousedown = false
    let selection: AABB | null = null
    let hover = false

    const box = new AABB(width / 2, height / 2, 50, 50)

    let nineslice: NineSlice | null = null  

    const image = new Image()
    image.src = "16x16_window.png"
    image.onload = () => {
        nineslice = new NineSlice(image, 50, image.height - 20, 15, image.width - 20)
        draw(context)
    }

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

        if (box.check(x, y)) {
            hover = true
            draw(context)
        } else {
            hover = false
            draw(context)
        }

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

        if (nineslice != null) {
            const x = width / 4
            const y = height / 8

            nineslice.resize(mouseX - x, mouseY - y)
            nineslice.draw(context, x, y)
            nineslice.drawDebug(context, x, y)
        }

        box.draw(context, hover)
    }

    draw(context)
}