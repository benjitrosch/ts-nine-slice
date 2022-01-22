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

    public id: number

    public x: number
    public y: number
    public z: number
    public w: number
    public h: number

    public resizestate = ResizeState.NONE

    public closebutton: Button

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

    constructor(texture: NineSlice, id: number, x: number, y: number, z: number, w: number, h: number) {
        this.x = x
        this.y = y
        this.z = z
        this.w = w
        this.h = h

        this.id = id
        this.texture = texture

        this.closebutton = new Button(
            "./src/assets/button.png",
            this.x + this.w - 25,
            this.y + 6,
            () => {
                PanelManager.remove(this.id)
            }
        )
    }

    public resize(w: number, h: number) {
        this.w = w
        this.h = h

        this.closebutton.x = this.x + this.w - 25
        this.closebutton.y = this.y + 6
    }

    public reposition(x: number, y: number) {
        this.x = x
        this.y = y

        this.closebutton.x = this.x + this.w - 25
        this.closebutton.y = this.y + 6
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
        context.font = "16px Open Sans"

        const offsetX = 8
        const offsetY = 18

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

const MAX_PANELS = 16

class PanelManager {
    private static panels: Panel[] = []
    
    public static activePanel: number = -1
    public static numPanels: number = 0

    private static newbutton: Button

    private static get empty() {
        return this.panels.length < 1
    }

    static init(canvas: HTMLCanvasElement) {
        this.newbutton = new Button(
            './src/assets/new_panel_button.png', 
            32,
            window.innerHeight - 160,
            () => this.new())

        let mouseX = 0
        let mouseY = 0

        const handleMouseDown = (e: MouseEvent) => {
            if (this.empty) {
                return
            }

            const { x, y } = Canvas.Instance.getMousePos(e)
    
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
            const { x, y } = Canvas.Instance.getMousePos(e)

            if (this.newbutton.bounds.check(x, y)) {
                canvas.style.cursor = 'pointer'
            }
            
            if (this.empty) {
                return
            }

            const panel = this.panels[this.panels.length - 1]

            let hover = false
            let resize = null
            let button = false
            
            this.panels.forEach((panel) => {
                if (panel.closebutton.bounds.check(x, y)) {
                    button = true
                }

                if (panel.bounds.check(x, y)) {
                    hover = true
                }

                if (panel.topResizer.check(x, y) ||
                    panel.bottomResizer.check(x, y)) {
                    resize = "ns-resize"
                }
    
                if (panel.leftResizer.check(x, y) ||
                    panel.rightResizer.check(x, y)) {
                    resize = "ew-resize"
                }
    
                if (panel.topLeftResizer.check(x, y) ||
                    panel.bottomRightResizer.check(x, y)) {
                    resize = "nwse-resize"
                }
    
                if (panel.topRightResizer.check(x, y) ||
                    panel.bottomLeftResizer.check(x, y)) {
                    resize = "nesw-resize"
                }
            })

            if (this.newbutton.bounds.check(x, y)) {
                button = true
            }

            canvas.style.cursor = resize != null ? resize : hover ? 'grab' : 'auto'

            if (button) {
                canvas.style.cursor = 'pointer'
                return
            }
            
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
            if (!this.empty) {
                this.panels[this.panels.length - 1].resizestate = ResizeState.NONE
            }

            this.activePanel = -1
            canvas.style.cursor = "auto"
        }

        document.body.addEventListener("mousedown", handleMouseDown)
        document.body.addEventListener("mousemove", handleMouseMove)
        document.body.addEventListener("mouseup", handleMouseUp)
    }

    static new() {
        if (this.panels.length >= MAX_PANELS) {
            return
        }

        const { x, y } = this.getrandompos()
        const { w, h } = this.getrandomsize()

        const context = Canvas.Instance.context
        
        const pattern = new Pattern(context, "./src/assets/background_pattern.png")
        const nineslice = new NineSlice("./src/assets/16x16_window.png", 28, 68, 10, 68, pattern)
        
        const panel = new Panel(nineslice, this.numPanels, x, y, this.panels.length, w, h)
        panel.constrain()

        this.numPanels++
        this.panels.push(panel)
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

    private static getrandompos() {
        const x = Math.floor(Math.random() * window.innerWidth / 1.5);
        const y = Math.floor(Math.random() * window.innerHeight / 4);

        return { x, y }
    }

    private static getrandomsize() {
        const w = Math.floor((Math.random() * window.innerWidth / 4) + window.innerWidth / 8);
        const h = Math.floor((Math.random() * window.innerHeight / 4) + window.innerHeight / 5);

        return { w, h }
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
        this.newbutton.draw(context)
        context.save()
        const text = 'New File'

        context.font = '16px Open Sans'
        context.strokeStyle = 'black'
        context.lineWidth = 4
        context.fillStyle = 'white'

        const x = 48
        const y = window.innerHeight - 64

        context.strokeText(text, x,y)
        context.fillText(text, x, y)
        context.restore();

        [...this.panels].sort((a, b) => a.z - b.z).forEach((panel) => {
            panel.draw(context)
            // panel.drawDebug(context)
        })
    }
}