enum Tabs {
    FAKE_WINDOWS = 'windows',
    HALL_OF_DOGS = 'dogs',
    DIALOGUE_BOX = 'dialogue'
}

const url = new URL((window.location.href).toLowerCase())
const activeTab: Tabs = url.searchParams.get("tab") as Tabs

window.onload = function() {
    const width = window.innerWidth
    const height = window.innerHeight - 48

    const canvas = Canvas.Instance.canvas
    const context = Canvas.Instance.context

    canvas.width = width
    canvas.height = height

    switch (activeTab) {
        default:
        case Tabs.FAKE_WINDOWS:
            PanelManager.init(Canvas.Instance.canvas)

            for (let i = 0; i < 5; i++) {
                PanelManager.new()
            }
            break

        case Tabs.HALL_OF_DOGS:
            DogManager.randomize(5, 8)
            break

        case Tabs.DIALOGUE_BOX:
            Typewriter.start('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tincidunt libero sit amet nibh ornare laoreet. Ut fringilla, urna quis lacinia aliquam, nibh ipsum sodales magna, sit amet feugiat mauris quam eget diam. Mauris congue feugiat ligula, at congue lectus viverra accumsan. Donec et libero ex. Aenean ultricies eget orci sit amet fringilla. Sed aliquam blandit justo vitae vulputate. Proin tincidunt mauris sit amet tortor consectetur, nec hendrerit diam malesuada. Morbi nibh leo, faucibus et diam a, rhoncus tristique lorem. Maecenas semper rutrum ipsum, ut vulputate tortor bibendum non. Pellentesque dui diam, efficitur quis posuere at, rutrum vel tortor. Mauris ac dolor eu libero faucibus rutrum. Aenean consequat et erat et egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aenean cursus vehicula erat, quis vestibulum ligula placerat nec. Donec at dolor blandit, luctus magna quis, efficitur purus.')
            break
    }

    draw(context, () => context.clearRect(0, 0, width, height))
}

function draw(context: CanvasRenderingContext2D, clear: () => void) {
    clear()

    switch (activeTab) {
        default:
        case Tabs.FAKE_WINDOWS:
            PanelManager.draw(context)
            break

        case Tabs.HALL_OF_DOGS:
            Canvas.Instance.canvas.style.background = 'url("./src/vintage-wallpaper-5.jpg")'
            DogManager.draw(context)
            break

        case Tabs.DIALOGUE_BOX:
            Canvas.Instance.canvas.style.background = 'black'
            Typewriter.draw(context)
            break
    }

    requestAnimationFrame(() => draw(context, clear))
}