import p5 from 'p5'
import { Player } from "textalive-app-api";

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(400, 400)
  }

  p.draw = () => {
    p.background(0)
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

