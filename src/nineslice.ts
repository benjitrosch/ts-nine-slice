class NineSlice {
	private image: HTMLImageElement
	private loading: boolean

	private width: number
	private height: number

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

	private get centerWidthUnscaled() {
		return this.image.width - (this.left + (this.image.width - this.right))
	}

	private get centerWidthScaled() {
		return this.width - this.left - this.rightWidth
	}

	private get centerHeightUnscaled() {
		return this.image.height - (this.top + (this.image.height - this.bottom))
	}

	private get centerHeightScaled() {
		return this.height - this.top - this.bottomHeight
	}

	constructor(filepath: string, top: number, bottom: number, left: number, right: number, onload?: () => void) {
		this.loading = true

		const image = new Image()
		image.src = filepath
		image.onload = () => {
			this.loading = false
			onload && onload()
		}
		this.image = image

		this.top = this.clamp(top, 0, bottom)
		this.bottom = this.clamp(bottom, this.top, this.image.height)
		this.left = this.clamp(left, 0, right)
		this.right = this.clamp(right, this.left, this.image.width)

		this.width = image.width
		this.height = image.height
	}

	private clamp(num: number, min: number, max: number) {
		return Math.min(Math.max(num, min), max)
	}

	public resize(width: number, height: number) {
		this.width = Math.max(width, this.centerWidthUnscaled)
		this.height = Math.max(height, this.centerHeightUnscaled)
	}

	public draw(context: CanvasRenderingContext2D, x: number, y: number, pattern?: Pattern | null) {
		if (this.loading) {
			return
		}
		
		const centerX = x + this.left
		const centerY = y + this.top
		const rightX = x + this.width - this.rightWidth
		const bottomY = y + this.height - this.bottomHeight

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
					x, centerY, this.left, this.centerHeightScaled)
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
					centerX, y, this.centerWidthScaled, this.top)
			}

			if (this.centerHeightUnscaled > 0) {
				// CENTER
				if (pattern != null && pattern.texture) {
					context.save()

					pattern.scroll(0.25, 0.25)
					pattern.texture.setTransform(new DOMMatrix(
						[pattern.rotation, 1, 1, 0, pattern.x, pattern.y]
						))

					context.fillStyle = pattern.texture
					context.fillRect(
						centerX,
						centerY,
						this.centerWidthScaled,
						this.centerHeightScaled)

					context.restore()
				} else {
					context.drawImage(this.image,
						this.left, this.top, this.centerWidthUnscaled, this.centerHeightUnscaled,
						centerX, centerY, this.centerWidthScaled, this.centerHeightScaled)
				}
			}

			if (this.bottom > 0) {
				// BOTTOM CENTER
				context.drawImage(this.image,
					this.left, this.bottom, this.centerWidthUnscaled, this.bottomHeight,
					centerX, bottomY, this.centerWidthScaled, this.bottomHeight)
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
					rightX, centerY, this.rightWidth, this.centerHeightScaled)
			}

			if (this.bottomHeight > 0) {
				// BOTTOM RIGHT
				context.drawImage(this.image,
					this.right, this.bottom, this.rightWidth, this.bottomHeight,
					rightX, bottomY, this.rightWidth, this.bottomHeight)
			}
		}
	}
}