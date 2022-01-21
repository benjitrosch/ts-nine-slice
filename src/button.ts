class Button {
    private texture: HTMLImageElement
    public loading: boolean

    public x: number
    public y: number
    public w: number = 0
    public h: number = 0

    private onClick?: () => void

    private get bounds() {
        return new AABB(
            this.x,
            this.y,
            this.w,
            this.h
        )
    }

    constructor(canvas: HTMLCanvasElement, filepath: string, x: number, y: number, onClick?: () => void) {
        this.loading = true

		const image = new Image()
		image.src = filepath
		image.onload = () => {
			this.loading = false

            this.w = image.width
            this.h = image.height
		}
		this.texture = image

        this.x = x
        this.y = y

        this.onClick = onClick

        document.body.addEventListener('mousemove', (e) => {
            const { x, y } = this.getMousePos(canvas, e)
            canvas.style.cursor = "auto"

            if (this.bounds.check(x, y)) {
                canvas.style.cursor = "pointer"
            }
        })

        document.body.addEventListener('mousedown', (e) => {
            const { x, y } = this.getMousePos(canvas, e)

            if (this.bounds.check(x, y)) {
                onClick && onClick()
            }
        })
    }

    private getMousePos(canvas: HTMLCanvasElement, e: MouseEvent) {
        const rect = canvas.getBoundingClientRect()

        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        }
    }

    public draw(context: CanvasRenderingContext2D) {
        if (this.loading) {
            return
        }

        context.drawImage(this.texture, this.x, this.y)
    }
}