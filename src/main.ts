import p5 from 'p5'
import { Player, Ease } from "textalive-app-api";

import observe from "./util/utils"

type CirclePose = {
  x: number
  y: number
  life: number
}
type NotesObj = {
  id: number,
  startTime: number
  endTime: number
  z: number
  xType: number
}

var endLoad = false
const SONG_URL = "https://piapro.jp/t/ucgN/20230110005414"
var chorus_data:any;
const NOTES_DURATION = 500;
let notes: Array<NotesObj> = []

const sketch = (p: p5) => {
  let font: p5.Font
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

      p.push()
      p.translate(0, 200, 250)
      p.ellipse(0, 0, 30, 30)
      p.pop()
      p.stroke(255);
      p.strokeWeight(1);
      p.line(-p.windowWidth/2, 200, 250, p.windowWidth/2, 200, 250);
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
        if (phrase.startTime <= position && position < phrase.endTime) {
          p.text(phrase.text, 0, -140)
        }
      }
      for (const s of chorus_data["repeatSegments"]) {
        for (const r of s["repeats"]) {
          if (r["start"] <= position && position < (r["start"] + r["duration"])) {
            if (s["isChorus"]) {
              p.text("サビ", 0, -230)
            } else {
              p.text(`${s["index"]}-${r["index"]}`, 0, -230)
            }
          }
        }
      }

      // ノーツ: ビートに合わせて
      // zが-1000->250=1250
      // NOTES_DURATIONが500ms
      // 1250/500 <-フレーム毎のz軸変化
      const Z_INCREMENT = 1250/NOTES_DURATION
      notes.forEach((n) => {
        if (n.endTime-NOTES_DURATION <= position) {
          p.push()
          p.translate(0, 200, observe(`Notes Z-${n.id}`, n.z))
          p.ellipse(0, 0, 30, 30)
          p.pop()
          n.z += p.deltaTime*Z_INCREMENT
        }
      })
      p.stroke(255);
      p.strokeWeight(1);
      p.line(-p.windowWidth/2, 200, 250, p.windowWidth/2, 200, 250);

      notes = notes.filter((object) => object.z < p.windowHeight);

      for (const b of player.getBeats()) {
        if (b.startTime <= position && position < b.endTime) {
          p.text(b.index, 0, -320)
        }
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
    // console.log("click")
    const x = p.mouseX - p.width / 2
    const y = p.mouseY - p.height / 2
    const position = player.timer.position

    // クリック場所に目印を付ける
    objects.push({ x: x, y: y, life: 500 })

    // ノーツ当たり判定処理
    //   被クリック座標でX軸のtypeを特定
    //   ノーツzが判定軸の前後15から評価開始
    // クリックで消滅させる
    // lifeで削除されるとmiss判定
    // const line_x = 0
    notes.forEach((n) => {
      if (!(n.endTime-NOTES_DURATION <= position && 235 <= n.z && n.z <= 265)) {
        return
      }
      if ((235 <= n.z && n.z < 240) || (260 < n.z && n.z <= 265)) {
        // Good判定
        console.log("good")
      } else if ((240 <= n.z && n.z < 245) || (255 < n.z && n.z <= 260)) {
        // Great判定
        console.log("great")
      } else if (245 <= n.z && n.z <= 255) {
        // Perfect判定
        console.log("perfect")
      }
    })
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

    // ビートに合わせたノート作成
    for (const b of player.getBeats()) {
      notes.push({
        "id": Number(new Date().getTime().toString().slice(-7)),
        "startTime": b.startTime,
        "endTime": b.endTime,
        "z": -1000,
        "xType": 0,
      })
    }
  },
})
