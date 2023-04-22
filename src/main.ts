import p5 from 'p5'
import { Player } from "textalive-app-api";

var endLoad = false
const SONG_URL = "https://piapro.jp/t/ucgN/20230110005414"
var chorus_data:any;

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
    } else if (player.isPlaying && chorus_data) {
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
      for (const s of chorus_data["repeatSegments"]) {
        for (const r of s["repeats"]) {
          if (r["start"] <= position && position < (r["start"] + r["duration"])) {
            if (s["isChorus"]) {
              p.text("サビ", 0, -160)
            } else {
              p.text(`${s["index"]}-${r["index"]}`, 0, -160)
            }
          }
        }
      }
    }
  }
}

new p5(sketch)

const player = new Player({
  app: { token: "xaE5okcYELClyrkD" },
  mediaElement: document.querySelector("#media") as HTMLMediaElement,
})

player.addListener({
  onAppReady: (app) => {
    if (!app.managed) {
      player.createFromSongUrl(SONG_URL, {
        video: {
          // 音楽地図訂正履歴: https://songle.jp/songs/2427948/history
          beatId: 4267297,
          chordId: 2405019,
          repetitiveSegmentId: 2405019,
          // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FucgN%2F20230110005414
          lyricId: 56092,
          lyricDiffId: 9636
        },
      })
    }
  },
  onTimerReady() {
    // ↓サビ飛ばし
    player.requestMediaSeek(35000)
    console.log(player.data.song)
    endLoad = true
    // https://widget.songle.jp/api/v1/song/chorus.json?url=https://piapro.jp/t/ucgN/20230110005414
    const url = "https://widget.songle.jp/api/v1/song/chorus.json?url=" + SONG_URL
    fetch(url)
      .then(response => response.json())
      .then(data => chorus_data = data)
    // console.log(chorus_data)
    document.addEventListener('click', function(event) {
      player.requestPlay()
      console.log(player.timer.position)
      console.log(player.timer)
    });
  },
})
