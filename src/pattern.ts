class Pattern {
    public texture: CanvasPattern

    public x: number
    public y: number

    public rotation: number

    constructor(texture: CanvasPattern, x = 0, y = 0, rotation = 0) {
        this.texture = texture

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