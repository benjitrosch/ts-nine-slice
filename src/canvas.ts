class Canvas {
    private static instance: Canvas
    public static get Instance() {
        const canvas: HTMLCanvasElement | null = document.getElementById("canvas") as HTMLCanvasElement
        return this.instance || (this.instance = new this(canvas))
    }

    public canvas: HTMLCanvasElement
    public mousePos: { x: number, y: number }

    public get context() {
        return this.canvas.getContext('2d')!
    }

    private get dpi() {
        return window.devicePixelRatio;
    }

    constructor(element: HTMLCanvasElement) {
        this.canvas = element
        this.mousePos = { x: 0, y: 0 }

        this.canvas.onmousemove = (e) => this.getMousePos(e)
        this.canvas.oncontextmenu = (e) => e.preventDefault()

        this.fixdpi()
    }

    public getMousePos(e: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect()

        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        }
    }
 
    public fixdpi() {
        const w = +getComputedStyle(this.canvas).getPropertyValue("width").slice(0, -2)
        const h = +getComputedStyle(this.canvas).getPropertyValue("height").slice(0, -2)

        this.canvas.setAttribute('width', (w * this.dpi).toString());
        this.canvas.setAttribute('height', (h * this.dpi).toString());
    }
}