class NineSlice {
	private image: HTMLImageElement
	public content: IScalabeContent | null
	private loading: boolean

	private top: number
	private bottom: number
	private left: number
	private right: number

	private get bottomHeight() {
		return this.image.height - this.bottom
	}

	private get rightWidth() {
		return this.image.width - this.right
	}

	public get centerWidthUnscaled() {
		return this.image.width - (this.left + (this.image.width - this.right))
	}

	public get centerHeightUnscaled() {
		return this.image.height - (this.top + (this.image.height - this.bottom))
	}

	constructor(filepath: string, top: number, bottom: number, left: number, right: number, content: IScalabeContent | null = null, onload?: () => void) {
		this.loading = true

		const image = new Image()
		image.src = filepath
		image.onload = () => {
			this.loading = false
			onload && onload()
		}
		this.image = image

		this.content = content

		this.top = this.clamp(top, 0, bottom)
		this.bottom = this.clamp(bottom, this.top, this.image.height)
		this.left = this.clamp(left, 0, right)
		this.right = this.clamp(right, this.left, this.image.width)
	}

	private clamp(num: number, min: number, max: number) {
		return Math.min(Math.max(num, min), max)
	}

	public getfitsize(w: number, h: number) {
		return { w: w + this.left + this.rightWidth, h: h + this.top + this.bottomHeight }
	}

	public draw(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
		if (this.loading) {
			return
		}

		const width = Math.max(w, this.centerWidthUnscaled)
		const height = Math.max(h, this.centerHeightUnscaled)

		const centerWidthScaled = width - this.left - this.rightWidth
		const centerHeightScaled = height - this.top - this.bottomHeight
		
		const centerX = x + this.left
		const centerY = y + this.top
		const rightX = x + width - this.rightWidth
		const bottomY = y + height - this.bottomHeight

		if (this.left > 0) {
			if (this.top > 0) {
				// TOP LEFT
				context.drawImage(this.image,
					0, 0, this.left, this.top,
					x, y, this.left, this.top)
			}

			if (this.centerHeightUnscaled > 0) {
				// CENTER LEFT
				context.drawImage(this.image,
					0, this.top, this.left, this.centerHeightUnscaled,
					x, centerY, this.left, centerHeightScaled)
			}

			if (this.bottom > 0) {
				// BOTTOM LEFT
				context.drawImage(this.image,
					0, this.bottom, this.left, this.bottomHeight,
					x, bottomY, this.left, this.bottomHeight)
			}
		}

		if (this.centerWidthUnscaled > 0) {
			if (this.top > 0) {
				// TOP CENTER
				context.drawImage(this.image,
					this.left, 0, this.centerWidthUnscaled, this.top,
					centerX, y, centerWidthScaled, this.top)
			}

			if (this.centerHeightUnscaled > 0) {
				// CENTER
				if (this.content != null) {
					this.content.draw(
						context,
						centerX,
						centerY,
						centerWidthScaled,
						centerHeightScaled)
				} else {
					context.drawImage(this.image,
						this.left, this.top, this.centerWidthUnscaled, this.centerHeightUnscaled,
						centerX, centerY, centerWidthScaled, centerHeightScaled)
				}
			}

			if (this.bottom > 0) {
				// BOTTOM CENTER
				context.drawImage(this.image,
					this.left, this.bottom, this.centerWidthUnscaled, this.bottomHeight,
					centerX, bottomY, centerWidthScaled, this.bottomHeight)
			}
		}

		if (this.right > 0) {
			if (this.top > 0) {
				// TOP RIGHT
				context.drawImage(this.image,
					this.right, 0, this.rightWidth, this.top,
					rightX, y, this.rightWidth, this.top)
			}

			if (this.centerHeightUnscaled > 0) {
				// CENTER RIGHT
				context.drawImage(this.image,
					this.right, this.top, this.rightWidth, this.centerHeightUnscaled,
					rightX, centerY, this.rightWidth, centerHeightScaled)
			}

			if (this.bottomHeight > 0) {
				// BOTTOM RIGHT
				context.drawImage(this.image,
					this.right, this.bottom, this.rightWidth, this.bottomHeight,
					rightX, bottomY, this.rightWidth, this.bottomHeight)
			}
		}
	}

	public drawDebug(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
		context.save()

		context.strokeStyle = "#00ff00"
		context.setLineDash([5])

		const width = Math.max(w, this.centerWidthUnscaled)
		const height = Math.max(h, this.centerHeightUnscaled)

		this.drawLine(context,
			{
				x: x + this.left,
				y: y,
			},
			{
				x: x + this.left,
				y: y + height,
			}
		)

		this.drawLine(context,
			{
				x: x + width - this.rightWidth,
				y: y,
			},
			{
				x: x + width - this.rightWidth,
				y: y + height,
			}
		)

		this.drawLine(context,
			{
				x: x,
				y: y + this.top,
			},
			{
				x: x + width,
				y: y + this.top,
			}
		)

		this.drawLine(context,
			{
				x: x,
				y: y + height - this.bottomHeight,
			},
			{
				x: x + width,
				y: y + height - this.bottomHeight,
			}
		)

		context.restore()
	}

	private drawLine(context: CanvasRenderingContext2D, p0: { x: number, y: number }, p1: { x: number, y: number }) {
		context.beginPath()
		context.moveTo(p0.x, p0.y)
		context.lineTo(p1.x, p1.y)
		context.stroke()
	}
}

interface IScalabeContent {
	draw: (
		context: CanvasRenderingContext2D,
		x: number,
		y: number,
		w: number,
		h: number
	) => void
}