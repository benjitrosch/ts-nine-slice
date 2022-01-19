class AABB {
    public x: number
    public y: number
    public w: number
    public h: number

    get top()
    {
        return this.y
    }

    get bottom()
    {
        return this.y + this.h
    }

    get left()
    {
        return this.x
    }

    get right()
    {
        return this.x + this.w
    }

    constructor(x: number, y: number, w: number, h: number) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    check(x: number, y: number)
    {
        return this.left <= x &&
            this.right >= x &&
            this.top <= y &&
            this.bottom >= y
    }

    draw(context: CanvasRenderingContext2D  , hover = false)
    {
        context.save()

        context.strokeStyle = hover ? "green" : "red"

        context.beginPath()
        context.strokeRect(this.x, this.y, this.w, this.h)
        context.stroke()

        context.restore()
    }
}