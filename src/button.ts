class Button {
    private texture: HTMLImageElement
    public loading: boolean

    public x: number
    public y: number
    public w: number = 0
    public h: number = 0

    public onClick?: () => void

    public get bounds() {
        return new AABB(
            this.x,
            this.y,
            this.w,
            this.h
        )
    }

    constructor(filepath: string, x: number, y: number, onClick?: () => void) {
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

        document.body.addEventListener('mousedown', (e) => {
            const { x, y } = Canvas.Instance.getMousePos(e)

            if (this.bounds.check(x, y)) {
                onClick && onClick()
            }
        })
    }

    public draw(context: CanvasRenderingContext2D) {
        if (this.loading) {
            return
        }

        context.drawImage(this.texture, this.x, this.y)
    }
}