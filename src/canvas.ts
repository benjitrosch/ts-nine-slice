class Canvas {
    private static instance: Canvas
    public static get Instance() {
        const canvas: HTMLCanvasElement | null = document.getElementById("canvas") as HTMLCanvasElement
        return this.instance || (this.instance = new this(canvas))
    }

    public canvas: HTMLCanvasElement
    public mousePos: { x: number, y: number }

    constructor(element: HTMLCanvasElement) {
        this.canvas = element
        this.mousePos = { x: 0, y: 0 }

        this.canvas.onmousemove = (e) => this.getMousePos(e)
        this.canvas.oncontextmenu = (e) => e.preventDefault()
    }

    getContext2D() {
        return this.canvas.getContext('2d')!
    }
    
    getMousePos(e: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect()

        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        }
    }
    
}