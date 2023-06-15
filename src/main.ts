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
  text: string,
  startTime: number
  endTime: number
  ppos: number
  z: number
  xType: number
  color?: string
}

type LylicColor = {
  text: string,
  startTime: number,
  r: number,
  g: number,
  b: number
}

var endLoad = false
const SONG_URL = "https://piapro.jp/t/ucgN/20230110005414"
var chorus_data:any;
const NOTES_DURATION = 2000;
let notes: NotesObj[] = []
const noteSpeed = 1
const noteSize = 25
let lylicColors: LylicColor[] = []

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
    p.angleMode(p.DEGREES)
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

      p.push()
      p.translate(60, 200, 250)
      p.ellipse(0, 0, 30, 30)
      p.pop()

      p.push()
      p.translate(-60, 200, 250)
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
      // p.text(position, 0, 70)

      // // lylicClors
      // // startTime一致で色を変える
      // // 歌詞蓄積をし、一行いっぱいになる毎に次の行へ
      // // 参考：https://github.com/TextAliveJp/textalive-app-lyric-sheet
      // for (const phrase of player.video.phrases) {
      //   for (const word of phrase.children) {
      //     for (const char of word.children) {
      //       if (char.startTime <= position && position < char.endTime) {
      //         p.push()
      //         for (const l of lylicColors) {
      //           if (char.startTime == l.startTime) {
      //             p.fill(l.r, l.g, l.b)
      //           }
      //         }
      //         p.text(char.text, 0, -140)
      //         p.pop()
      //       }
      //     }
      //     // if (word.startTime <= position && position < word.endTime) {
      //     //   p.text(word.text, 0, -70)
      //     // }
      //   }
      //   // if (phrase.startTime <= position && position < phrase.endTime) {
      //   //   p.text(phrase.text, 0, -140)
      //   // }
      // }
      let phrases = []
      for (const phrase of player.video.phrases) {
        for (const word of phrase.children) {
          for (const char of word.children) {
            if (phrase.startTime <= char.startTime && char.endTime <= phrase.endTime && phrase.startTime <= position && position <= phrase.endTime) {
              for (const lylic of lylicColors) {
                if (phrase.startTime <= lylic.startTime && lylic.startTime <= phrase.endTime) {
                  // なんか処理
                }
              }
              const fragment: LylicColor = {
                text: char.text,
                startTime: phrase.startTime,
                r: 0,
                g: 0,
                b: 0
              }
              phrases.push(fragment)
            }
          }
        }
      }
      let lylicBase: string = ""
      for (const p of phrases) {
        lylicBase += `${p.text}`
      }
      p.text(lylicBase, 0, -140)


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

      // const position = player.timer.position
      p.push()

      const posX = (i: number) => p.map(i, 0, 7, -p.width / 6, p.width / 6)

      p.rotateX(60)
      p.translate(0, (p.height / 4)+100, 0)
      p.stroke(255)
      p.line(-p.width / 2, 0, p.width / 2, 0)

      for (let i = 0; i <= 8; i++) {
        p.line(posX(i - 0.5), -p.height * 2, posX(i - 0.5), p.height)
      }

      p.translate(0, position * noteSpeed, 0)
      // for (const beat of player.getBeats()) {
      //   p.randomSeed(beat.startTime)
      //   const posY = -beat.startTime * noteSpeed
      //   p.circle(posX(p.floor(p.random(8))), posY, noteSize)
      // }

      notes.forEach((n: NotesObj) => {
        p.randomSeed(n.ppos)
        const posY = -n.ppos * noteSpeed
        // console.log(posY)
        p.circle(posX(n.xType), posY, noteSize)
      })

      notes = notes.filter((object) => (position * noteSpeed)-(object.ppos * noteSpeed) <= 100);

      p.pop()

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
    // console.log(position * noteSpeed)
    notes.forEach((n) => {
      const posY = (position * noteSpeed)-(n.ppos * noteSpeed)
      // console.log(((position * noteSpeed)-(n.ppos * noteSpeed)))
      if (!(-50 <= posY && posY <= 50)) {
        return
      }
      console.log(n.text)
      //TODO Miss判定 Bad判定
      if ((-50 <= posY && posY < -30) || (30 < posY && posY <= 50)) {
        // Good判定
        console.log("good")
        n.color="green"
        lylicColors.push({
          "text": n.text,
          "startTime": n.startTime,
          "r": 0,
          "g": 256,
          "b": 0
        })
      } else if ((-30 <= posY && posY < 10) || (10 < posY && posY <= 30)) {
        // Great判定
        console.log("great")
        n.color="blue"
        lylicColors.push({
          "text": n.text,
          "startTime": n.startTime,
          "r": 0,
          "g": 0,
          "b": 256
        })
      } else if (-10 <= posY && posY <= 10) {
        // Perfect判定
        console.log("perfect")
        n.color="rainbow"
        lylicColors.push({
          "text": n.text,
          "startTime": n.startTime,
          "r": 256,
          "g": 0,
          "b": 0
        })
      }
    })
  }
}

new p5(sketch)

const player = new Player({
  app: { token: "xaE5okcYELClyrkD" },
  mediaElement: document.querySelector("#media") as HTMLMediaElement,
})

function getRandomLylicX(seed: number): number {
  const max = 7;
  const randomSeed = (seed * 4364 + 85628) % 294628;
  const randomNumber = Math.floor(randomSeed / 294628 * (max + 1));
  return randomNumber;
}

// クオンタイズ：
//   歌詞のタイミングをビートでクオンタイズ
//   upper: ビート
//   input: 歌詞
function quantizeValue(upperValues: number[], lowerValue: number): number {
  let quantizedValue = lowerValue;
  let j = 0;

  while (quantizedValue > upperValues[j]) {
    j++;
  }

  if (j > 0) {
    const diff1 = quantizedValue - upperValues[j - 1];
    const diff2 = upperValues[j] - quantizedValue;

    quantizedValue = diff1 < diff2 ? upperValues[j - 1] : upperValues[j];
  } else {
    quantizedValue = upperValues[j];
  }

  return quantizedValue;
}

function divideList(list: number[]) {
  let output = [];
  for (let i = 0; i < list.length; i++) {
    output.push(
      list[i],
      // 3 * list[i] / 4 + list[i+1] / 4,
      (list[i] + list[i+1]) / 2,
      // list[i] / 4 + 3 * list[i+1] / 4
      );
    output.push()
  }
  return output;
}

function createNotesFromLylic() {
  console.log(player.getBeats()[0].duration *2)

  const quaValues: number[] = []
  for (const b of player.getBeats()) {
    quaValues.push(b.startTime)
  }
  console.log(quaValues.slice(0,5))
  const upperValues = divideList(quaValues);
  console.log(upperValues.slice(0,20))

  for (const phrase of player.video.phrases) {
    for (const word of phrase.children) {
      if (word.duration >= player.getBeats()[0].duration *2) {
        for (const char of word.children) {
          const startTime = quantizeValue(upperValues, char.startTime)
          // const startTime = char.startTime
          notes.push({
            "id": Number(new Date().getTime().toString().slice(-7)),
            "text": char.text,
            "startTime": char.previous?.endTime,
            "endTime": char.startTime,
            "ppos": startTime,
            "z": -1000,
            "xType": getRandomLylicX(startTime),
          })
        }
      } else {
        const startTime = quantizeValue(upperValues, word.startTime)
        // const startTime = word.startTime
        notes.push({
          "id": Number(new Date().getTime().toString().slice(-7)),
          "text": word.text,
          "startTime": word.previous?.endTime,
          "endTime": word.startTime,
          "ppos": startTime,
          "z": -1000,
          "xType": getRandomLylicX(startTime),
        })
      }
    }
  }
}
function createNotesFromBeat() {
  // ビートに合わせたノート作成
  for (const b of player.getBeats()) {
    notes.push({
      "id": Number(new Date().getTime().toString().slice(-7)),
      "startTime": b.startTime,
      "endTime": b.endTime,
      "ppos": b.startTime,
      "z": -1000,
      "xType": getRandomLylicX(b.startTime),
    })
  }
}
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
    // player.requestMediaSeek(239540)
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
      if (player.isPlaying) {
        return
      }
      // createNotesFromBeat();
      // createNotesFromPhrase();
      // createNotesFromWord();
      createNotesFromLylic();

      player.requestPlay();
      // document.removeEventListener('click', clickHandler);
    }
    document.addEventListener('click', clickHandler);
  },
  onDispose() {
      console.log("end from dispose")
  },
  onStop() {
      console.log("end from stop")
  },
})
