const SELECTOR_SIZE = 64
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
			this.x + HALF_SELECTOR_SIZE,
			this.y,
			this.w - SELECTOR_SIZE,
			HALF_SELECTOR_SIZE
        )
    }

    private get bottomResizer() {
        return new AABB(
			this.x + HALF_SELECTOR_SIZE,
			this.y + this.h - HALF_SELECTOR_SIZE,
			this.w - SELECTOR_SIZE,
			HALF_SELECTOR_SIZE
        )
    }

    private get leftResizer() {
        return new AABB(
			this.x,
			this.y + HALF_SELECTOR_SIZE,
			HALF_SELECTOR_SIZE,
			this.h - SELECTOR_SIZE
        )
    }

    private get rightResizer() {
        return new AABB(
			this.x + this.w - HALF_SELECTOR_SIZE,
			this.y + HALF_SELECTOR_SIZE,
			HALF_SELECTOR_SIZE,
			this.h - SELECTOR_SIZE
        )
    }

    private get topLeftResizer() {
        return new AABB(
            this.x,
            this.y,
            HALF_SELECTOR_SIZE,
            HALF_SELECTOR_SIZE
        )
    }

    private get topRightResizer() {
        return new AABB(
            this.x + this.w - HALF_SELECTOR_SIZE,
            this.y,
            HALF_SELECTOR_SIZE,
            HALF_SELECTOR_SIZE
        )
    }

    private get bottomLeftResizer() {
        return new AABB(
            this.x,
            this.y + this.h - HALF_SELECTOR_SIZE,
            HALF_SELECTOR_SIZE,
            HALF_SELECTOR_SIZE
        )
    }

    private get bottomRightResizer() {
        return new AABB(
            this.x + this.w - HALF_SELECTOR_SIZE,
            this.y + this.h - HALF_SELECTOR_SIZE,
            HALF_SELECTOR_SIZE,
            HALF_SELECTOR_SIZE
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
                canvas.style.cursor = "ns-resize"
                return
            }

            if (this.leftResizer.check(x, y) ||
                this.rightResizer.check(x, y)) {
                this.addResizeState(ResizeState.HORIZONTAL)
                canvas.style.cursor = "ew-resize"
                return
            }

            if (this.topLeftResizer.check(x, y) ||
                this.bottomRightResizer.check(x, y)) {
                this.addResizeState(ResizeState.DIAGONAL)
                canvas.style.cursor = "nwse-resize"
                return
            }

            if (this.topRightResizer.check(x, y) ||
                this.bottomLeftResizer.check(x, y)) {
                this.addResizeState(ResizeState.DIAGONAL)
                canvas.style.cursor = "nesw-resize"
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

                    this.constrain()
                    texture.resize(this.w, this.h)
                    return
                }

                if (this.selected) {
                    this.x -= deltaX
                    this.y -= deltaY
                    this.constrain()
                }
            }
        })

        document.body.addEventListener("mouseup", () => {
            mousedown = false
            this.selected = false
            this.resize = ResizeState.NONE

            canvas.style.cursor = "auto"
        })
    }

    private getMousePos(canvas: HTMLCanvasElement, e: MouseEvent) {
        const rect = canvas.getBoundingClientRect()

        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        }
    }

    private clamp(num: number, min: number, max: number) {
		return Math.min(Math.max(num, min), max)
	}

    private constrain()
    {
        this.x = this.clamp(this.x, 0, window.innerWidth - this.w)
        this.y = this.clamp(this.y, 0, window.innerHeight - this.h)
        this.w = Math.max(this.w, this.texture.centerWidthUnscaled)
        this.h = Math.max(this.h, this.texture.centerHeightUnscaled)
    }

    private addResizeState(state: ResizeState) {
        this.resize |= state
    }

    public draw(context: CanvasRenderingContext2D) {
        this.texture.draw(context, this.x, this.y)
    }

	public drawDebug(context: CanvasRenderingContext2D) {
        this.texture.drawDebug(context, this.x, this.y)
        this.bounds.drawDebug(context)

        this.topResizer.drawDebug(context)
        this.bottomResizer.drawDebug(context)
        this.leftResizer.drawDebug(context)
        this.rightResizer.drawDebug(context)

        this.topLeftResizer.drawDebug(context)
        this.topRightResizer.drawDebug(context)
        this.bottomLeftResizer.drawDebug(context)
        this.bottomRightResizer.drawDebug(context)
    }
}