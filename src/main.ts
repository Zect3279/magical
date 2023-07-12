import p5 from 'p5'
import { Player, Ease } from "textalive-app-api";

import observe from "./util/utils"

type CirclePose = {
  x: number
  y: number
  life: number
}
type NotesObj = {
  id: number
  text: string
  startTime: number
  endTime: number
  NstartTime: number
  NendTime: number
  ppos: number
  z: number
  xType: number
  color?: string
  type: string
}
type Particle = {
  x: number
  y: number
  life: number
  div: 0 | 1
}

var endLoad = false
const SONG_URL = "https://piapro.jp/t/ucgN/20230110005414"
var chorus_data:any;
let notes: NotesObj[] = []
const noteSpeed = 2
const noteSize = 25
let particles: Particle[] = []
let index = 0;

const sketch = (p: p5) => {
  let font: p5.Font
  let objects: CirclePose[] = []

  function writeNotes(x: number, y: number, width: number) {
    p.push()
    const posX = (i: number) => p.map(i, 0, 8, -width*0.9/2, width*0.9/2)


    const S = posX(5) - posX(4)
    // console.log(S)
    p.noStroke()
    // p.stroke(0)
    p.translate(x, y)

    // p.scale(2)
    p.fill(255)
    p.translate(0, 0, 0.1)
    p.circle(0, 0, S*0.9);
    p.noStroke()
    p.fill(150)
    p.translate(0, 0, 0.2)
    p.circle(0, 0, S*0.75);
    p.fill(50)
    p.translate(0, 0, 0.3)
    p.circle(0, 0, S*0.5);
    p.stroke(0)
    p.fill(255)
    p.translate(0, 0, 0.4)
    p.rect(0, 0, S*1.2, S*0.2, 20);
    p.noStroke()

    p.translate(0, 0, 0.5)
    p.push()
    p.fill(50)
    p.beginShape();
      p.vertex(-S*0.025, S*0.025);
      p.vertex(0, S*0.0875);
      p.vertex(S*0.025, S*0.025);
      p.vertex(S*0.0875, 0);
      p.vertex(S*0.025, -S*0.02);
      p.vertex(0, -S*0.0875);
      p.vertex(-S*0.025, -S*0.02);
      p.vertex(-S*0.0875, 0);
    p.endShape();
    p.pop()
    p.pop()
  }

  function writeBackground() {
    p.push()
    p.translate(0,0)
    // p.translate(-p.width/2,-p.height/2)
    p.translate(p.width/3, -p.height/4)

    if (index%2 == 0) {
      p.rotate(45)
    }
    if (p.frameCount%60 <= 30) {
      let a = p.map(Ease.quintOut(p.map(p.frameCount%30, 0, 30, 0, 1)), 0, 1, 0, p.width*0.25)
      let b = p.map(Ease.quintOut(p.map(p.frameCount%30, 0, 30, 0, 1)), 0, 1, 0, p.width*0.25*0.8)
      let c = p.map(Ease.quintOut(p.map(p.frameCount%30, 0, 30, 0, 1)), 0, 1, 0, p.width*0.25*0.45)
      let d = p.map(Ease.quintOut(p.map(p.frameCount%30, 0, 30, 0, 1)), 0, 1, 0, p.width*0.25*0.3)
      let e = p.map(Ease.quintOut(p.map(p.frameCount%30, 0, 30, 0, 1)), 0, 1, 0, p.width*0.25*0.2)
      let f = p.map(Ease.quintOut(p.map(p.frameCount%30, 0, 30, 0, 1)), 0, 1, 0, p.width*0.25*0.1)
      let g = p.map(Ease.quintInOut(p.map((p.frameCount)%30, 0, 30, 0, 1)), 0, 1, 0, p.width*0.25)
      p.fill(255);
      p.rect(0, 0, a, a)
      p.fill(0);
      p.rect(0, 0, b, b)
      p.fill(180);
      p.rect(0, 0, c, c)
      p.fill(255);
      p.rect(0, 0, d, d)
      p.fill(100);
      p.rect(0, 0, e, e)
      p.fill(0);
      p.rect(0, 0, f, f)
      p.fill(0)
      p.rect(0, 0, g, g)
    }
    p.pop()
    p.push()
    p.translate(0,0)
    // p.translate(-p.width/2,-p.height/2)
    p.translate(-p.width/3, -p.height/4)

    if (index%2 == 1) {
      p.rotate(45)
    }
    if (p.frameCount%60 <= 30) {
      let a = p.map(Ease.quintOut(p.map(p.frameCount%30, 0, 30, 0, 1)), 0, 1, 0, p.width*0.25)
      let b = p.map(Ease.quintOut(p.map(p.frameCount%30, 0, 30, 0, 1)), 0, 1, 0, p.width*0.25*0.8)
      let c = p.map(Ease.quintOut(p.map(p.frameCount%30, 0, 30, 0, 1)), 0, 1, 0, p.width*0.25*0.45)
      let d = p.map(Ease.quintOut(p.map(p.frameCount%30, 0, 30, 0, 1)), 0, 1, 0, p.width*0.25*0.3)
      let e = p.map(Ease.quintOut(p.map(p.frameCount%30, 0, 30, 0, 1)), 0, 1, 0, p.width*0.25*0.2)
      let f = p.map(Ease.quintOut(p.map(p.frameCount%30, 0, 30, 0, 1)), 0, 1, 0, p.width*0.25*0.1)
      let g = p.map(Ease.quintInOut(p.map((p.frameCount)%30, 0, 30, 0, 1)), 0, 1, 0, p.width*0.25)
      p.fill(255);
      p.rect(0, 0, a, a)
      p.fill(0);
      p.rect(0, 0, b, b)
      p.fill(180);
      p.rect(0, 0, c, c)
      p.fill(255);
      p.rect(0, 0, d, d)
      p.fill(100);
      p.rect(0, 0, e, e)
      p.fill(0);
      p.rect(0, 0, f, f)
      p.fill(0)
      p.rect(0, 0, g, g)
    }
    p.pop()
    if (p.frameCount%60 == 0) {
      index++
    }

    p.push()
    p.noStroke()

    // p.translate(p.width/2, p.height/2)
    let n = 20
    particles.forEach(o => {
      p.push()
      p.translate(o.x, o.y)
      p.scale(0.5)
      if (o.div == 0) {
        let co = p.color(255)
        co.setAlpha(100)
        p.fill(co)
        let w = p.map(Ease.quintIn(p.map(o.life%30, 0, 30, 0, 1)), 0, 1, 1, 5)
        let h = p.map(Ease.quadOut(p.map(o.life%30, 0, 30, 0, 1)), 0, 1, 1, 10)
        p.rotate(45)
        p.rect(0, 0, n/w, n*h)
        p.rotate(90)
        p.rect(0, 0, n/w, n*h)
      } else if (o.div == 1) {
        let one = p.map(Ease.quintOut(p.map(o.life%30, 0, 30, 0, 1)), 0, 1, 0, 100)
        let two = p.map(Ease.bounceOut(p.map(o.life%30, 0, 30, 0, 1)), 0, 1, 0, 99)

        let co = p.color(255)
        co.setAlpha(100)
        p.fill(co);
        p.rect(0, 0, one, one)

        co = p.color(0)
        // co.setAlpha(100)
        p.fill(co);
        p.rect(0, 0, two, two)
      }
      p.pop()
      o.life++
    });
    particles.forEach(o => {
      if (o.life >= 60) {
        let x = Math.random() * ( p.width ) - p.width/2;
        let y = Math.random() * ( p.height ) - p.height/2;
        o.x = x
        o.y = y
        o.life = 0
      }
    })
    p.pop()
  }

  p.preload = () => {
    font = p.loadFont("/ZenOldMincho-Medium.ttf")
  }

  p.setup = () => {
    console.log(p.windowWidth)
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
    // p.drawingContext.disable(p.drawingContext.DEPTH_TEST)
    p.textFont(font)
    p.textAlign(p.CENTER, p.CENTER)
    p.textSize(50)
    p.angleMode(p.DEGREES)
    p.rectMode(p.CENTER)
    p.frameRate(60)
    // p.noStroke()

    for (let i = 0; i < 30; i++) {
      let x = Math.random() * ( p.width ) - p.width/2;
      let y = Math.random() * ( p.height ) - p.height/2;
      let life = Math.random() * 60
      let div: 0 | 1
      if (i%4 === 0) {
        div = 1
        console.log(i)
      }
      else { div = 0 }
      particles.push({x, y, life, div})
    }

  }

  p.draw = () => {
    // let pg = p.createGraphics(p.width, p.height)
    // pg.textFont(font)
    // pg.textAlign(p.CENTER, p.CENTER)
    // pg.textSize(50)
    // pg.angleMode(p.DEGREES)
    // pg.rectMode(p.CENTER)
    // pg.frameRate(60)
    // // pg.noStroke()
    const centerY = p.height * 0.6 / 2
    // p.translate(p.width/2, p.height/2)
    if (endLoad && !player.isPlaying) {
      p.background(50)
      p.textSize(50)

      writeBackground()

      p.fill(255)
      p.text(player.data.song.name, 0, -20)
      p.textSize(30)
      p.text(`by ${player.data.song.artist.name}`, 0, 40)
      p.textSize(20)
      p.text("画面をクリックして開始", 0, 120)

      p.push()

      p.translate(0, centerY)
      p.rotateX(60)
      // p.translate(0,0)

      const posX = (i: number) => p.map(i, 0, 8, -p.width*0.9/2, p.width*0.9/2)

      for (let i = 0; i <= 8; i++) {
        p.line(posX(i), -p.height*2, posX(i), p.height/2)
      }

      p.line(-p.width/2, -20, p.width/2, -20)
      // p.line(-p.width/2, 0, p.width/2, 0)
      p.line(-p.width/2, 20, p.width/2, 20)

      p.circle(posX(1), -20 - noteSize/2, noteSize)
      p.circle(posX(2), -20, noteSize)
      p.circle(posX(3), -20 + noteSize/2, noteSize)
      // p.circle(posX(4), 0, noteSize)
      writeNotes(posX(4), 0, p.width)
      p.circle(posX(5), 20 - noteSize/2, noteSize)
      p.circle(posX(6), 20, noteSize)
      p.circle(posX(7), 20 + noteSize/2, noteSize)

      const S = posX(5) - posX(4)
      p.fill(255)
      p.textSize(S*0.5)
      p.text('S', posX(0.5), font.textBounds('S', 0, 0).h)
      p.text('D', posX(1.5), font.textBounds('D', 0, 0).h)
      p.text('F', posX(2.5), font.textBounds('F', 0, 0).h)
      p.text('G', posX(3.5), font.textBounds('G', 0, 0).h)
      p.text('H', posX(4.5), font.textBounds('H', 0, 0).h)
      p.text('J', posX(5.5), font.textBounds('J', 0, 0).h)
      p.text('K', posX(6.5), font.textBounds('K', 0, 0).h)
      p.text('L', posX(7.5), font.textBounds('L', 0, 0).h)

      // p.push();
      // p.noLoop();
      // p.textSize(50)
      // p.fill(100,100);
      // p.stroke(100);
      // p.strokeWeight(3);
      // p.strokeJoin(p.BEVEL);
      // p.drawingContext.setLineDash([1,5]);
      // p.strokeCap(p.PROJECT);
      // p.textStyle(p.BOLDITALIC);
      // p.text("S", 0, 0);
      // p.pop();
      //
      p.pop()
      // p.image(pg, 0, 0)

    } else if (player.isPlaying && chorus_data) {
      p.background(0)
      p.textSize(50)

      writeBackground()

      p.fill(255)
      const position = player.timer.position
      let phrases = []
      let phrasesPrevious = []
      let phraseStart = 0
      let phraseEnd = 0
      let phraseStartPrevious = 0
      let phraseEndPrevious = 0
      for (const phrase of player.video.phrases) {
        if (phrase.startTime <= position && position <= phrase.endTime) {
          phraseStart = phrase.startTime
          phraseEnd = phrase.endTime
          phraseStartPrevious = phrase.previous.startTime
          phraseEndPrevious = phrase.previous.endTime
        }
      }
      for (const n of notes) {
        if (phraseStart <= n.startTime && n.endTime <= phraseEnd) {
          phrases.push({"text": n.text, "color": n.color})
        }
        if (phraseStartPrevious <= n.startTime && n.endTime <= phraseEndPrevious) {
          phrasesPrevious.push({"text": n.text, "color": n.color})
        }
      }

      // 今の歌詞
      p.textSize(50)
      let lylicBase: string = ""
      const alphabetPattern = /^[A-Za-z]+$/
      for (const [i, p] of phrases.entries()) {
        if (alphabetPattern.test(p.text) && alphabetPattern.test(phrases[i+1]?.text)) {
          lylicBase += `${p.text} `
          p.text += ' '
        } else {
          lylicBase += `${p.text}`
        }
      }
      p.text(lylicBase, 0, -140)
      //   色を変える
      let textWidth = 0
      for (let i = 0; i < lylicBase.length; i++) {
        textWidth += p.textWidth(lylicBase[i])
      }
      p.push()
      p.textAlign(p.LEFT)
      let currentPos = -textWidth/2
      for (const phrase of phrases) {
        p.push()
        if (phrase.color !== undefined) {
          p.fill(phrase.color)
        }
        p.text(phrase.text, currentPos, 120)
        p.pop()
        currentPos += p.textWidth(phrase.text)
      }
      p.pop()

      // 前の歌詞
      p.textSize(30)
      let lylicBasePrevious: string = ""
      for (const [i, p] of phrasesPrevious.entries()) {
        if (alphabetPattern.test(p.text) && alphabetPattern.test(phrasesPrevious[i+1]?.text)) {
          lylicBasePrevious += `${p.text} `
          p.text += ' '
        } else {
          lylicBasePrevious += `${p.text}`
        }
      }
      // p.text(lylicBasePrevious, 0, 100)
      //   色を変える
      let textWidthPrevious = 0
      for (let i = 0; i < lylicBasePrevious.length; i++) {
        textWidthPrevious += p.textWidth(lylicBasePrevious[i])
      }
      p.push()
      p.textAlign(p.LEFT)
      let currentPosPrevious = -textWidthPrevious/2
      for (const phrase of phrasesPrevious) {
        p.push()
        if (phrase.color !== undefined) {
          p.fill(phrase.color)
        }
        p.text(phrase.text, currentPosPrevious, 70)
        p.pop()
        currentPosPrevious += p.textWidth(phrase.text)
      }
      p.pop()

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

      p.push()
      p.stroke(255)

      p.translate(0, centerY)
      p.rotateX(60)
      // p.translate(0,0)

      const posX = (i: number) => p.map(i, 0, 8, -p.width*0.9/2, p.width*0.9/2)

      for (let i = 0; i <= 8; i++) {
        p.line(posX(i), -p.height*2, posX(i), p.height/2)
      }

      p.line(-p.width/2, -20, p.width/2, -20)
      // p.line(-p.width/2, 0, p.width/2, 0)
      p.line(-p.width/2, 20, p.width/2, 20)

      const S = posX(5) - posX(4)
      p.fill(255)
      p.textSize(S*0.5)
      p.text('S', posX(0.5), font.textBounds('S', 0, 0).h)
      p.text('D', posX(1.5), font.textBounds('D', 0, 0).h)
      p.text('F', posX(2.5), font.textBounds('F', 0, 0).h)
      p.text('G', posX(3.5), font.textBounds('G', 0, 0).h)
      p.text('H', posX(4.5), font.textBounds('H', 0, 0).h)
      p.text('J', posX(5.5), font.textBounds('J', 0, 0).h)
      p.text('K', posX(6.5), font.textBounds('K', 0, 0).h)
      p.text('L', posX(7.5), font.textBounds('L', 0, 0).h)

      notes.forEach((n: NotesObj) => {
        if (n.NstartTime <= position && position <= n.NendTime) {
          if (n.ppos-10 <= position && position <= n.ppos+10) { console.log(n.text) }
          const posY
          = p.map(position, n.NstartTime, n.NendTime, -p.height*2, p.height*2)
          // p.circle(posX(n.xType+0.5), posY, noteSize)
          writeNotes(posX(n.xType+0.5), posY, p.width)
        }
      })

      //
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
    // p.image(pg, 0, 0)
  }

  p.keyPressed = () => {
    if (p.key == " ") {
      player.requestStop()
    }
    var keyIndex = 0
    switch (p.key) {
      case "s":
        keyIndex = 0
        break;
      case "d":
        keyIndex = 1
        break;
      case "f":
        keyIndex = 2
        break;
      case "g":
        keyIndex = 3
        break;
      case "h":
        keyIndex = 4
        break;
      case "j":
        keyIndex = 5
        break;
      case "k":
        keyIndex = 6
        break;
      case "l":
        keyIndex = 7
        break;
      default:
        break;
    }
    const position = player.timer.position
    notes.forEach((n) => {
      if (n.xType !== keyIndex) { return }
      const posY = p.map(position, n.NstartTime, n.NendTime, -p.height*2, p.height*2)
      if (!((-20 - noteSize/2) <= posY && posY <= (20 + noteSize/2))) {
        return
      }
      console.log(n.text)
      //TODO Miss判定 Bad判定
      if (((-20 - noteSize/2) <= posY && posY < -20) || (20 < posY && posY <= (20 + noteSize/2))) {
        // Good判定
        console.log("good")
        n.color="rgb(0, 256, 0)" // green
      } else if ((-20 <= posY && posY < (-20 + noteSize/2)) || ((20 - noteSize/2) < posY && posY <= 20)) {
        // Great判定
        console.log("great")
        n.color="rgb(0, 0, 256)" // blue
      } else if ((-20 + noteSize/2) <= posY && posY <= (20 - noteSize/2)) {
        // Perfect判定
        console.log("perfect")
        n.color="rgb(256, 0, 0)" // red
      }
    })
  }

  p.mousePressed = () => {
    if (!(player.isPlaying && chorus_data)) {
      return
    }
    const x = p.mouseX - p.width / 2
    const y = p.mouseY - p.height / 2
    const position = player.timer.position

    objects.push({ x: x, y: y, life: 500 })

    notes.forEach((n) => {
      const posY = p.map(position, n.NstartTime, n.NendTime, -p.height*2, p.height*2)
      if (!(-50 <= posY && posY <= 50)) {
        return
      }
      console.log(n.text)
      //TODO Miss判定 Bad判定
      if (((-20 - noteSize/2) <= posY && posY < -20) || (20 < posY && posY <= (20 + noteSize/2))) {
        // Good判定
        console.log("good")
        n.color="rgb(0, 256, 0)" // green
      } else if ((-20 <= posY && posY < (-20 + noteSize/2)) || ((20 - noteSize/2) < posY && posY <= 20)) {
        // Great判定
        console.log("great")
        n.color="rgb(0, 0, 256)" // blue
      } else if ((-20 + noteSize/2) <= posY && posY <= (20 - noteSize/2)) {
        // Perfect判定
        console.log("perfect")
        n.color="rgb(256, 0, 0)" // red
      }
    })
    // p.circle(posX(1), -20 - noteSize/2, noteSize)
    // p.circle(posX(2), -20, noteSize)
    // p.circle(posX(3), -20 + noteSize/2, noteSize)
    // p.circle(posX(4), 0, noteSize)
    // p.circle(posX(5), 20 - noteSize/2, noteSize)
    // p.circle(posX(6), 20, noteSize)
    // p.circle(posX(7), 20 + noteSize/2, noteSize)
    // prevent default
    return false;
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
function quantizeValue(value: number, array: number[]): number {
  // console.log(value)
  // console.log(array.length)
  // const value = 100; // 調べたい値
  // const array = [1, 123, 13, 84, 255, 3, 136, 96, 117, 62]; // 調べたい配列
  const diff: number[] = [];
  let index = 0;

  array.forEach((val: number, i) => {
    diff[i] = Math.abs(value - val);
    index = diff[index] < diff[i] ? index : i;
  });
  return array[index]
}

function divideList(list: number[]): number[] {
  let output: number[] = [];
  list.forEach((b, i) => {
    if (i == (list.length-1)) { output.push(b) }
    else {
      output.push(b)
      output.push((list[i] + list[i+1])/2)
    }
  })
  return output;
}

// クオンタイズがダメっぽい
function createNotesFromLylic() {
  console.log(player.getBeats()[0].duration *2)

  const beats: number[] = []
  player.getBeats().forEach((b) => { beats.push(b.startTime) })
  console.log(beats.slice(0,5))
  console.log(beats.length)
  const halfBeats = divideList(beats)
  console.log(halfBeats.slice(0,5))
  console.log(halfBeats.length)

  for (const phrase of player.video.phrases) {
    for (const word of phrase.children) {
      if (word.duration >= player.getBeats()[0].duration *2) {
        for (const char of word.children) {
          // const startTime: number = quantizeValue(char.startTime, beats)
          const startTime: number = quantizeValue(char.startTime, halfBeats)
          console.log(startTime)
          // const startTime = char.startTime
          notes.push({
            "id": Number(new Date().getTime().toString().slice(-7)),
            "text": char.text,
            "startTime": char.startTime,
            "endTime": char.endTime,
            "NstartTime": startTime - 1000*noteSpeed,
            "NendTime": startTime + 1000*noteSpeed,
            "ppos": startTime,
            "z": -1000,
            "xType": getRandomLylicX(startTime),
            "type": "char"
          })
        }
      } else {
        // const startTime = quantizeValue(word.startTime, beats)
        const startTime = quantizeValue(word.startTime, halfBeats)
        // const startTime = word.startTime
        notes.push({
          "id": Number(new Date().getTime().toString().slice(-7)),
          "text": word.text,
          "startTime": word.startTime,
          "endTime": word.endTime,
          "NstartTime": startTime - 1000*noteSpeed,
          "NendTime": startTime + 1000*noteSpeed,
          "ppos": startTime,
          "z": -1000,
          "xType": getRandomLylicX(startTime),
          "type": "word"
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
          // lyricDiffId: 10701
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
