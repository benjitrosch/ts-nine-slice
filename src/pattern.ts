class Pattern {
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
}