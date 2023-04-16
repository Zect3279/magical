import p5 from 'p5'
import { Player } from "textalive-app-api";

var endLoad = false

const sketch = (p: p5) => {
  let font: p5.Font

  p.preload = () => {
    font = p.loadFont("/ZenOldMincho-Medium.ttf")
  }

  // p.mousePressed = () => {
  //   if (player.video && !player.isPlaying) {
  //     player.requestMediaSeek(15000)
  //     player.requestPlay()
  //     console.log(player.timer.position)
  //   }
  // }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
    p.drawingContext.disable(p.drawingContext.DEPTH_TEST)
    p.textFont(font)
    p.textAlign(p.CENTER, p.CENTER)
    p.textSize(50)
  }

  p.draw = () => {
    if (endLoad && !player.isPlaying) {
      p.background(50)
      p.textSize(50)
      p.text(player.data.song.name, 0, -20)
      p.textSize(30)
      p.text(`by ${player.data.song.artist.name}`, 0, 40)
      p.textSize(20)
      p.text("画面をクリックして開始", 0, 120)
    } else if (player.isPlaying) {
      p.background(0)
      p.textSize(50)
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
    // ↓サビ飛ばし
    player.requestMediaSeek(15000)
    console.log(player.data.song)
    endLoad = true
    document.addEventListener('click', function(event) {
      player.requestPlay()
      console.log(player.timer.position)
      console.log(player.timer)
    });
  },
})
