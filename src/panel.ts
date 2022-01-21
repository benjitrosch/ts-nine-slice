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

    public id: number = -1 

    public x: number
    public y: number
    public z: number
    private w: number
    private h: number

    private resize = ResizeState.NONE

    public get selected() {
        return PanelManager.activePanel === this.id
    }

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

    constructor(canvas: HTMLCanvasElement, texture: NineSlice, x: number, y: number, w: number, h: number) {
        this.x = x
        this.y = y
        this.z = 0
        this.w = w
        this.h = h

        this.texture = texture

        let mouseX = 0
        let mouseY = 0

        document.body.addEventListener("mousedown", (e) => {
            const { x, y } = this.getMousePos(canvas, e)
    
            mouseX = x
            mouseY = y

            if (this.bounds.check(x, y)) {
                PanelManager.setactive(this)
            }

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
            }

            if (this.leftResizer.check(x, y) ||
                this.rightResizer.check(x, y)) {
                this.addResizeState(ResizeState.HORIZONTAL)
                canvas.style.cursor = "ew-resize"
            }

            if (this.topLeftResizer.check(x, y) ||
                this.bottomRightResizer.check(x, y)) {
                this.addResizeState(ResizeState.DIAGONAL)
                canvas.style.cursor = "nwse-resize"
            }

            if (this.topRightResizer.check(x, y) ||
                this.bottomLeftResizer.check(x, y)) {
                this.addResizeState(ResizeState.DIAGONAL)
                canvas.style.cursor = "nesw-resize"
            }
        })

        document.body.addEventListener("mousemove", (e) => {
            const { x, y } = this.getMousePos(canvas, e)

            if (this.selected) {
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
                    return
                } else {
                    this.x -= deltaX
                    this.y -= deltaY
                    this.constrain()
                }
            }
        })

        document.body.addEventListener("mouseup", () => {
            this.resize = ResizeState.NONE
            PanelManager.activePanel = -1

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
        this.texture.draw(context, this.x, this.y, this.w, this.h)
    }

	public drawDebug(context: CanvasRenderingContext2D) {
        this.texture.drawDebug(context, this.x, this.y, this.w, this.h)
        this.bounds.drawDebug(context)

        this.topResizer.drawDebug(context)
        this.bottomResizer.drawDebug(context)
        this.leftResizer.drawDebug(context)
        this.rightResizer.drawDebug(context)

        this.topLeftResizer.drawDebug(context)
        this.topRightResizer.drawDebug(context)
        this.bottomLeftResizer.drawDebug(context)
        this.bottomRightResizer.drawDebug(context)

        context.save()
        context.font = "16px Open Sans"
        context.fillText(`id: ${this.id} z: ${this.z} active z: ${PanelManager.activePanel}`, this.x, this.y)
        context.restore()
    }
}

class PanelManager {
    private static panels: Panel[] = []
    
    public static activePanel: number = -1
    public static numPanels: number = 0

    static add(panel: Panel) {
        if (panel.id < 0) panel.id = this.numPanels
        panel.z = this.panels.length

        this.numPanels++
        this.panels.push(panel)

        return panel.z
    }

    static reorder() {
        for (let i = 0; i < this.panels.length; i++) {
            this.panels[i].z = i
        }
    }

    static tofront(index: number) {
        const panel = this.panels[index]
        this.panels.splice(index, 1)

        this.reorder()
        return this.add(panel)
    }

    static setactive(panel: Panel) {
        if (this.activePanel >= 0 &&
            panel.z < this.panels[this.activePanel].z) {
            return false
        }

        this.tofront(panel.z)
        this.activePanel = panel.id
        return true
    }

    static draw(context: CanvasRenderingContext2D) {
        [...this.panels].sort((a, b) => a.z - b.z).forEach((panel) => {
            panel.draw(context)
            // panel.drawDebug(context)
        })
    }
}