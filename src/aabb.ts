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

    public check(x: number, y: number)
    {
        return this.left <= x &&
            this.right >= x &&
            this.top <= y &&
            this.bottom >= y
    }

    public draw(context: CanvasRenderingContext2D)
    {
        context.save()

        context.strokeStyle = "red"

        context.beginPath()
        context.strokeRect(this.x, this.y, this.w, this.h)
        context.stroke()

        context.restore()
    }
}