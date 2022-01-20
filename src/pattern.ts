class Pattern implements IScalabeContent {
    public texture: CanvasPattern | null

    public loading: boolean

    public x: number
    public y: number

    public rotation: number

    constructor(context: CanvasRenderingContext2D, filepath: string, x = 0, y = 0, rotation = 0) {
        this.loading = true
        this.texture = null

        const image = new Image()
        image.src = filepath
        image.onload = () => {
            const texture = context.createPattern(image, 'repeat')
            if (texture != null) {
                this.texture = texture
                this.loading = false
            }
        }

        this.x = x
        this.y = y

        this.rotation = rotation
    }

    public scroll(x = 1, y = 1)
    {
        this.x += x
        this.y += y
    }

    public rotate(deg = 1)
    {
        this.rotation += deg
    }

    public draw(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
        if (this.texture != null) {
            context.save()

            this.scroll(0.25, 0.25)
            this.texture.setTransform(new DOMMatrix(
                [this.rotation, 1, 1, 0, this.x, this.y]
                ))

            context.fillStyle = this.texture
            context.fillRect(x, y, w, h)

            context.restore()
        }
    }
}