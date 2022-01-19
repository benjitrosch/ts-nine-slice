const SELECTOR_SIZE = 32
const HALF_SELECTOR_SIZE = SELECTOR_SIZE / 2

enum ResizeState {
    NONE        = 0,
    HORIZONTAL  = 1 << 0,
    VERTICAL    = 1 << 1,
    DIAGONAL    = ~(~0 << 2),
    REPOSITION  = 1 << 2
}

class Panel {
    private texture: NineSlice

    public x: number
    public y: number
    public z: number
    public w: number
    public h: number

    private selected = false
    private resize = ResizeState.NONE

    public get bounds() {
        return new AABB(
            this.x,
            this.y,
            this.w,
            this.h
        )
    }

    private get topResizer() {
        return new AABB(
			this.x + this.w / 2 - HALF_SELECTOR_SIZE,
			this.y - HALF_SELECTOR_SIZE,
			SELECTOR_SIZE,
			SELECTOR_SIZE
        )
    }

    private get bottomResizer() {
        return new AABB(
			this.x + this.w / 2 - HALF_SELECTOR_SIZE,
			this.y + this.h - HALF_SELECTOR_SIZE,
			SELECTOR_SIZE,
			SELECTOR_SIZE
        )
    }

    private get leftResizer() {
        return new AABB(
			this.x - HALF_SELECTOR_SIZE,
			this.y + this.h / 2 - HALF_SELECTOR_SIZE,
			SELECTOR_SIZE,
			SELECTOR_SIZE
        )
    }

    private get rightResizer() {
        return new AABB(
			this.x + this.w - HALF_SELECTOR_SIZE,
			this.y + this.h / 2 - HALF_SELECTOR_SIZE,
			SELECTOR_SIZE,
			SELECTOR_SIZE
        )
    }

    private get topLeftResizer() {
        return new AABB(
            this.x - HALF_SELECTOR_SIZE,
            this.y - HALF_SELECTOR_SIZE,
            SELECTOR_SIZE,
            SELECTOR_SIZE
        )
    }

    private get topRightResizer() {
        return new AABB(
            this.x + this.w - HALF_SELECTOR_SIZE,
            this.y - HALF_SELECTOR_SIZE,
            SELECTOR_SIZE,
            SELECTOR_SIZE
        )
    }

    private get bottomLeftResizer() {
        return new AABB(
            this.x - HALF_SELECTOR_SIZE,
            this.y + this.h - HALF_SELECTOR_SIZE,
            SELECTOR_SIZE,
            SELECTOR_SIZE
        )
    }

    private get bottomRightResizer() {
        return new AABB(
            this.x + this.w - HALF_SELECTOR_SIZE,
            this.y + this.h - HALF_SELECTOR_SIZE,
            SELECTOR_SIZE,
            SELECTOR_SIZE
        )
    }

    constructor(canvas: HTMLCanvasElement, texture: NineSlice, x: number, y: number, z: number, w: number, h: number) {
        this.x = x
        this.y = y
        this.z = z
        this.w = w
        this.h = h

        this.texture = texture
        this.texture.resize(w, h)

        let mouseX = 0
        let mouseY = 0
        let mousedown = false

        document.body.addEventListener("mousedown", (e) => {
            const { x, y } = this.getMousePos(canvas, e)
    
            mouseX = x
            mouseY = y
            mousedown = true

            if (this.topLeftResizer.check(x, y) ||
                this.topResizer.check(x, y) ||
                this.topRightResizer.check(x, y) ||
                this.leftResizer.check(x, y) ||
                this.bottomLeftResizer.check(x, y)) {
                this.addResizeState(ResizeState.REPOSITION)
            }
    
            if (this.topResizer.check(x, y) ||
                this.bottomResizer.check(x, y)) {
                this.addResizeState(ResizeState.VERTICAL)
                return
            }

            if (this.leftResizer.check(x, y) ||
                this.rightResizer.check(x, y)) {
                this.addResizeState(ResizeState.HORIZONTAL)
                return
            }

            if (this.topLeftResizer.check(x, y) ||
                this.topRightResizer.check(x, y) ||
                this.bottomLeftResizer.check(x, y) ||
                this.bottomRightResizer.check(x, y)) {
                this.addResizeState(ResizeState.DIAGONAL)
                return
            }

            this.selected = this.bounds.check(x, y)
        })

        document.body.addEventListener("mousemove", (e) => {
            const { x, y } = this.getMousePos(canvas, e)

            if (mousedown) {
                const deltaX = mouseX - x
                const deltaY = mouseY - y
                
                mouseX = x
                mouseY = y

                if (this.resize != ResizeState.NONE) {   
                    const reposition = this.resize == (this.resize | ResizeState.REPOSITION)

                    if (this.resize == (this.resize | ResizeState.HORIZONTAL)) {
                        if (reposition) {
                            this.w += deltaX
                            this.x -= deltaX
                        } else {
                            this.w -= deltaX
                        }
                    }

                    if (this.resize == (this.resize | ResizeState.VERTICAL)) {
                        if (reposition) {
                            this.h += deltaY
                            this.y -= deltaY
                        } else {
                            this.h -= deltaY
                        }
                    }

                    texture.resize(this.w, this.h)
                    return
                }

                if (this.selected) {
                    this.x -= deltaX
                    this.y -= deltaY
                }
            }
        })

        document.body.addEventListener("mouseup", () => {
            mousedown = false
            this.selected = false
            this.resize = ResizeState.NONE
        })
    }

    private getMousePos(canvas: HTMLCanvasElement, e: MouseEvent) {
        const rect = canvas.getBoundingClientRect()

        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        }
    }

    private addResizeState(state: ResizeState) {
        this.resize |= state
    }

    public draw(context: CanvasRenderingContext2D) {
        this.texture.draw(context, this.x, this.y)
    }

	public drawDebug(context: CanvasRenderingContext2D) {
        this.bounds.draw(context)

        this.topResizer.draw(context)
        this.bottomResizer.draw(context)
        this.leftResizer.draw(context)
        this.rightResizer.draw(context)

        this.topLeftResizer.draw(context)
        this.topRightResizer.draw(context)
        this.bottomLeftResizer.draw(context)
        this.bottomRightResizer.draw(context)
    }
}