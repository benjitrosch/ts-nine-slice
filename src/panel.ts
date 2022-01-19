const SELECTOR_SIZE = 8
const HALF_SELECTOR_SIZE = SELECTOR_SIZE / 2

class Panel {
    private texture: NineSlice

    private x: number
    private y: number
    private z: number
    private w: number
    private h: number

    public get bounds() {
        return new AABB(
            this.x,
            this.y,
            this.w,
            this.h)
    }

    private get topResizer() {
        return new AABB(
			this.x + this.w / 2 - HALF_SELECTOR_SIZE,
			this.y - HALF_SELECTOR_SIZE,
			SELECTOR_SIZE,
			SELECTOR_SIZE)
    }

    private get bottomResizer() {
        return new AABB(
			this.x + this.w / 2 - HALF_SELECTOR_SIZE,
			this.y + this.h - HALF_SELECTOR_SIZE,
			SELECTOR_SIZE,
			SELECTOR_SIZE)
    }

    private get leftResizer() {
        return new AABB(
			this.x - HALF_SELECTOR_SIZE,
			this.y + this.h / 2 - HALF_SELECTOR_SIZE,
			SELECTOR_SIZE,
			SELECTOR_SIZE)
    }

    private get rightResizer() {
        return new AABB(
			this.x + this.w - HALF_SELECTOR_SIZE,
			this.y + this.h / 2 - HALF_SELECTOR_SIZE,
			SELECTOR_SIZE,
			SELECTOR_SIZE)
    }

    constructor(texture: NineSlice, x: number, y: number, z: number, w: number, h: number) {
        this.x = x
        this.y = y
        this.z = z
        this.w = w
        this.h = h

        this.texture = texture
        this.texture.resize(w, h)
    }

    public draw(context: CanvasRenderingContext2D) {
        this.texture.draw(context, this.x, this.y)
        this.bounds.draw(context)
    }

	public drawDebug(context: CanvasRenderingContext2D) {
        this.topResizer.draw(context)
        this.bottomResizer.draw(context)
        this.leftResizer.draw(context)
        this.rightResizer.draw(context)
    }
}