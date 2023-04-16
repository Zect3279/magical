import p5 from 'p5'
import { Player } from "textalive-app-api";

const sketch = (p: p5) => {
  let font: p5.Font

  p.preload = () => {
    font = p.loadFont("/ZenOldMincho-Medium.ttf")
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
    p.drawingContext.disable(p.drawingContext.DEPTH_TEST)
    p.textFont(font)
    p.textAlign(p.CENTER, p.CENTER)
    p.textSize(50)
  }

  p.draw = () => {
    if (player.isPlaying) {
      p.background(0)
      const position = player.timer.position
      p.text(position, 0, 70)
      for (const phrase of player.video.phrases) {
        for (const word of phrase.children) {
          for (const char of word.children) {
            if (char.startTime <= position && position < char.endTime) {
              p.text(char.text, 0, 0)
            }
          }
          if (word.startTime <= position && position < word.endTime) {
            p.text(word.text, 0, -70)
          }
        }
      }
    }
  }
}

new p5(sketch)

const player = new Player({
  app: { token: import.meta.env.TEXTALIVE_TOKEN },
  mediaElement: document.querySelector("#media") as HTMLMediaElement,
})

player.addListener({
  onAppReady: (app) => {
    if (!app.managed) {
      player.createFromSongUrl("https://piapro.jp/t/ucgN/20230110005414", {
        video: {
          lyricId: 56092,
          lyricDiffId: 9607,
        }
      })
    }
  },
  onTimerReady() {
    player.requestPlay()
    console.log(player.data.song)
  },
})
