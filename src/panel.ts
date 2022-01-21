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
    public w: number
    public h: number

    public resizestate = ResizeState.NONE

    private closebutton: Button

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

    public get topResizer() {
        return new AABB(
			this.x + HALF_SELECTOR_SIZE,
			this.y,
			this.w - SELECTOR_SIZE,
			HALF_SELECTOR_SIZE
        )
    }

    public get bottomResizer() {
        return new AABB(
			this.x + HALF_SELECTOR_SIZE,
			this.y + this.h - HALF_SELECTOR_SIZE,
			this.w - SELECTOR_SIZE,
			HALF_SELECTOR_SIZE
        )
    }

    public get leftResizer() {
        return new AABB(
			this.x,
			this.y + HALF_SELECTOR_SIZE,
			HALF_SELECTOR_SIZE,
			this.h - SELECTOR_SIZE
        )
    }

    public get rightResizer() {
        return new AABB(
			this.x + this.w - HALF_SELECTOR_SIZE,
			this.y + HALF_SELECTOR_SIZE,
			HALF_SELECTOR_SIZE,
			this.h - SELECTOR_SIZE
        )
    }

    public get topLeftResizer() {
        return new AABB(
            this.x,
            this.y,
            HALF_SELECTOR_SIZE,
            HALF_SELECTOR_SIZE
        )
    }

    public get topRightResizer() {
        return new AABB(
            this.x + this.w - HALF_SELECTOR_SIZE,
            this.y,
            HALF_SELECTOR_SIZE,
            HALF_SELECTOR_SIZE
        )
    }

    public get bottomLeftResizer() {
        return new AABB(
            this.x,
            this.y + this.h - HALF_SELECTOR_SIZE,
            HALF_SELECTOR_SIZE,
            HALF_SELECTOR_SIZE
        )
    }

    public get bottomRightResizer() {
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

        this.closebutton = new Button(
            canvas,
            "./src/button.png",
            this.x + this.w - 50,
            this.y + 10,
            () => {
                // removeEventListener('mousedown', handleMouseDown)
                // removeEventListener('mousemove', handleMouseMove)
                // removeEventListener('mouseup', handleMouseUp)

                PanelManager.remove(this.id)
            }
        )
    }

    public resize(w: number, h: number) {
        this.w = w
        this.h = h

        this.closebutton.x = this.x + this.w - 50
        this.closebutton.y = this.y + 10
    }

    public reposition(x: number, y: number) {
        this.x = x
        this.y = y

        this.closebutton.x = this.x + this.w - 50
        this.closebutton.y = this.y + 10
    }

    private clamp(num: number, min: number, max: number) {
		return Math.min(Math.max(num, min), max)
	}

    public constrain()
    {
        this.x = this.clamp(this.x, 0, window.innerWidth - this.w)
        this.y = this.clamp(this.y, 0, window.innerHeight - this.h)
        this.w = Math.max(this.w, this.texture.centerWidthUnscaled)
        this.h = Math.max(this.h, this.texture.centerHeightUnscaled)
    }

    public addResizeState(state: ResizeState) {
        this.resizestate |= state
    }

    public draw(context: CanvasRenderingContext2D) {
        this.texture.draw(context, this.x, this.y, this.w, this.h)
        this.closebutton.draw(context)
        
        context.save()
        context.font = "24px Open Sans"

        const offsetX = 16
        const offsetY = 32

        let text = `id: ${this.id} / z order: ${this.z} / active: ${PanelManager.activePanel}`
        const numLetters = text.length
        let textWidth = context.measureText(text).width
        
        while(textWidth >= this.w - this.texture.rightWidth - this.closebutton.w - offsetX) {
            text = text.substring(0, text.length - 1)
            textWidth = context.measureText(text + '...').width

            if (text.length <= 0) {
                break
            }
        }

        if (text.length < numLetters) {
            text += '...'
        }

        context.fillText(text, this.x + offsetX, this.y + offsetY)
        context.restore()
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
    }
}

class PanelManager {
    private static panels: Panel[] = []
    
    public static activePanel: number = -1
    public static numPanels: number = 0

    static init(canvas: HTMLCanvasElement) {
        let mouseX = 0
        let mouseY = 0

        const handleMouseDown = (e: MouseEvent) => {
            const { x, y } = this.getMousePos(canvas, e)
    
            mouseX = x
            mouseY = y

            for (let i = this.panels.length - 1; i >= 0; i--) {
                const panel = this.panels[i]

                if (panel.bounds.check(x, y)) {
                    PanelManager.setactive(panel)
        
                    if (panel.topLeftResizer.check(x, y) ||
                        panel.topResizer.check(x, y) ||
                        panel.topRightResizer.check(x, y) ||
                        panel.leftResizer.check(x, y) ||
                        panel.bottomLeftResizer.check(x, y)) {
                        panel.addResizeState(ResizeState.REPOSITION)
                    }
            
                    if (panel.topResizer.check(x, y) ||
                        panel.bottomResizer.check(x, y)) {
                        panel.addResizeState(ResizeState.VERTICAL)
                        canvas.style.cursor = "ns-resize"
                    }
        
                    if (panel.leftResizer.check(x, y) ||
                        panel.rightResizer.check(x, y)) {
                        panel.addResizeState(ResizeState.HORIZONTAL)
                        canvas.style.cursor = "ew-resize"
                    }
        
                    if (panel.topLeftResizer.check(x, y) ||
                        panel.bottomRightResizer.check(x, y)) {
                        panel.addResizeState(ResizeState.DIAGONAL)
                        canvas.style.cursor = "nwse-resize"
                    }
        
                    if (panel.topRightResizer.check(x, y) ||
                        panel.bottomLeftResizer.check(x, y)) {
                        panel.addResizeState(ResizeState.DIAGONAL)
                        canvas.style.cursor = "nesw-resize"
                    }

                    break
                }
            }
        }

        const handleMouseMove = (e: MouseEvent) => {
            const { x, y } = this.getMousePos(canvas, e)
            const panel = this.panels[this.panels.length - 1]
            
            if (panel.selected) {
                const deltaX = mouseX - x
                const deltaY = mouseY - y
                
                mouseX = x
                mouseY = y

                if (panel.resizestate != ResizeState.NONE) {   
                    const reposition = panel.resizestate == (panel.resizestate | ResizeState.REPOSITION)

                    if (panel.resizestate == (panel.resizestate | ResizeState.HORIZONTAL)) {
                        if (reposition) {
                            panel.resize(panel.w + deltaX, panel.h)
                            panel.reposition(panel.x - deltaX, panel.y)
                        } else {
                            panel.resize(panel.w - deltaX, panel.h)
                        }
                    }

                    if (panel.resizestate == (panel.resizestate | ResizeState.VERTICAL)) {
                        if (reposition) {
                            panel.resize(panel.w, panel.h + deltaY)
                            panel.reposition(panel.x, panel.y - deltaY)
                        } else {
                            panel.resize(panel.w, panel.h - deltaY)
                        }
                    }

                    panel.constrain()
                    return
                } else {
                    panel.reposition(panel.x - deltaX, panel.y - deltaY)
                    panel.constrain()
                }
            }
        }

        const handleMouseUp = () => {
            this.panels[this.panels.length - 1].resizestate = ResizeState.NONE

            this.activePanel = -1
            canvas.style.cursor = "auto"
        }

        document.body.addEventListener("mousedown", handleMouseDown)
        document.body.addEventListener("mousemove", handleMouseMove)
        document.body.addEventListener("mouseup", handleMouseUp)
    }

    static add(panel: Panel) {
        if (panel.id < 0) panel.id = this.numPanels
        panel.z = this.panels.length

        this.numPanels++
        this.panels.push(panel)

        return panel.z
    }

    static remove(id: number) {
        const index = this.panels.findIndex((panel) => panel.id === id)
        this.panels.splice(index, 1)

        this.numPanels--
        this.reorder()
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

    private static getMousePos(canvas: HTMLCanvasElement, e: MouseEvent) {
        const rect = canvas.getBoundingClientRect()

        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        }
    }

    static draw(context: CanvasRenderingContext2D) {
        [...this.panels].sort((a, b) => a.z - b.z).forEach((panel) => {
            panel.draw(context)
            // panel.drawDebug(context)
        })
    }
}