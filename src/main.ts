import p5 from 'p5'
import { Player, Ease } from "textalive-app-api";

var endLoad = false
const SONG_URL = "https://piapro.jp/t/ucgN/20230110005414"
var chorus_data:any;

const sketch = (p: p5) => {
  let font: p5.Font
  type CirclePose = {
    x?: number
    y?: number
    life?: number
  }
  let objects: Array<CirclePose> = []

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
    if (endLoad && !player.isPlaying) {
      p.background(50)
      p.textSize(50)
      p.fill(255)
      p.text(player.data.song.name, 0, -20)
      p.textSize(30)
      p.text(`by ${player.data.song.artist.name}`, 0, 40)
      p.textSize(20)
      p.text("画面をクリックして開始", 0, 120)
    } else if (player.isPlaying && chorus_data) {
      p.background(0)
      p.textSize(50)
      p.fill(255)
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

      // ノーツ: ビートに合わせて
      const beat = player.findBeat(position)
      if (beat) {
        const progress = beat.progress(position)
        // console.log(progress)
        const z = p.map(progress, 0, 1, -1000, 250)
        const y = p.map(progress, 0, 1, 0, 200)
        p.push()
        p.translate(0, y, z)
        p.ellipse(0, 0, 30, 30)
        p.pop()
      }
    }

    // クリック場所に円
    objects.forEach((object) => {
      let alpha = p.map(object.life, 0, 500, 0, 255);
      p.fill(255, alpha);
      p.noStroke();
      p.circle(object.x, object.y, 20);
      object.life -= p.deltaTime;
    });

    objects = objects.filter((object) => object.life > 0);
  }

  p.mousePressed = () => {
    if (!(player.isPlaying && chorus_data)) {
      return
    }
    console.log("click")
    objects.push({ x: p.mouseX - p.width / 2, y: p.mouseY - p.height / 2, life: 500 })
    // console.log(objects)
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
    console.log(url)
    fetch(url)
      .then(response => response.json())
      .then(data => chorus_data = data)
    // console.log(chorus_data)
    function clickHandler(event: MouseEvent) {
      player.requestPlay();
      console.log(player.timer.position);
      console.log(player.timer);
      document.removeEventListener('click', clickHandler);
    }
    document.addEventListener('click', clickHandler);
  },
})
