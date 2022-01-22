type DogAPIResponse = {
    message: string,
    status: string
}

class Dog implements IScalabeContent {
    public image: HTMLImageElement
    private loaded: boolean = false

    constructor(onload?: () => void) {
        this.image = new Image()
        this.image.onload = () => {
            this.loaded = true
            onload && onload()
        }

        this.fetchdog()
    }

    private async fetchdog() {
        try {
            const response = await fetch(`https://dog.ceo/api/breed/pomeranian/images/random`)
            const { message } = await response.json() as DogAPIResponse
            
            this.image.src = message
        } catch (e) {
            console.log(e)
        }
    }

    public draw(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
        if (!this.loaded) {
            return
        }

        context.drawImage(this.image, x, y, w, h)
    }
}

type DogPhoto = {
    photo: NineSlice
    x: number
    y: number
    w: number
    h: number
}

class DogManager {
    public static dogs: DogPhoto[] = []

    static add(x: number, y: number) {
        const dog = new Dog(() => {
            const photo = new NineSlice("./src/assets/frame.png", 64, 366, 63, 444, dog)

            this.dogs.push({
                photo,
                x,
                y,
                w: dog.image.width / 2,
                h: dog.image.height / 2
            })
        })
    } 

    static randomize(min: number, max: number) {
        const numDogs = Math.floor(Math.random() * (max - min + 1) + min)

        for (let i = 0; i < numDogs; i++) {
            const { x, y } = this.getrandompos()
            this.add(window.innerWidth * (i / numDogs), y)
        }
    }

    private static getrandompos() {
        const x = Math.floor(Math.random() * window.innerWidth)
        const y = Math.floor(Math.random() * window.innerHeight / 2)

        return { x, y }
    }

    private static clamp(num: number, min: number, max: number) {
		return Math.min(Math.max(num, min), max)
	}

    static draw(context: CanvasRenderingContext2D) {
        [...this.dogs].forEach((dog) => {
            const { w, h } = dog.photo.getfitsize(dog.w, dog.h)
            const x = this.clamp(dog.x, 0, window.innerWidth - w)
            const y = this.clamp(dog.y, 0, window.innerHeight - h)

            dog.photo.draw(context, x, y, w, h)
        })
    }
}