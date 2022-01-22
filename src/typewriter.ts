const DELAY = 50
const LINE_HEIGHT = 48

class Typewriter {
    private static dialoguebox: NineSlice

    private static fulltext: string
    private static text: string

    private static currentletter: number

    static start(dialogue: string) {
        this.text = ''
        this.fulltext = dialogue
        this.currentletter = 0

        this.dialoguebox = new NineSlice('./src/dialogue_box.png', 15, 65, 15, 65)

        this.type(Canvas.Instance.context)
    }

    static type(context: CanvasRenderingContext2D)
    {
        this.text += this.fulltext.charAt(this.currentletter)
        this.currentletter++

        setTimeout(() => this.type(context), DELAY)
    }

    static split(context: CanvasRenderingContext2D, text: string, line = 1): number {
        for (let i = 0; i <= text.length; i++) {
            const substr = text.substring(0, i)

            if (context.measureText(substr).width > window.innerWidth - 32) {
                return this.split(context, text.substring(i - 1), ++line)
            }
        }

        return line
    }

    static newline(context: CanvasRenderingContext2D, text: string, line = 0) {
        for (let i = 0; i <= text.length; i++) {
            const substr = text.substring(0, i)

            if (context.measureText(substr).width > window.innerWidth - 32) {
                context.fillText(text.substring(0, i - 1), 16, 32 + line * LINE_HEIGHT)
                this.newline(context, text.substring(i), ++line)
                return
            }
        }

        context.fillText(text, 16, 32 + line * LINE_HEIGHT)
    }

    static draw(context: CanvasRenderingContext2D) {
        context.save()

        context.font = '24px Open Sans'
        context.fillStyle = 'white'

        let lines = this.split(context, this.text)
        this.dialoguebox.draw(context, 0, 0, window.innerWidth, LINE_HEIGHT * lines)

        this.newline(context, this.text)

        context.restore()
    }
}