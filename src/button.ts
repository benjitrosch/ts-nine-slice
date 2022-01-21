class button {
    private x: number
    private y: number
    private w: number
    private h: number

    private get bounds() {
        return new AABB(
            this.x,
            this.y,
            this.w,
            this.y
        )
    }

    constructor(x: number, y: number, w: number, h: number) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }
}