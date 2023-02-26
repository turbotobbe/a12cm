const golden_ratio = (1 + Math.sqrt(5)) / 2
const color_red = 'rgba(255,0,0,.2)'
const color_blue = 'rgba(0,0,255,.2)'
const color_white = 'rgba(255,255,255,.2)'
const color_black = 'rgba(0,0,0,.2)'

let gut = 50;
let ts: Triangle[] = []

const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
const context = canvas.getContext('2d')!;

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

console.log([canvas.width, canvas.height])
// canvas.addEventListener('mousemove', (event: MouseEvent) => {
//   console.log([event.offsetX, event.offsetY, event.clientX, event.clientY])
// });


type Point = {
  x: number,
  y: number
}

const eq = (a: Point, b: Point): boolean => a.x == b.x && a.y == b.y
const add = (a: Point, b: Point): Point => ({ x: a.x + b.x, y: a.y + b.y })
const sub = (a: Point, b: Point): Point => ({ x: a.x - b.x, y: a.y - b.y })
const div = (a: Point, s: number): Point => ({ x: a.x / s, y: a.y / s })
const cog = (a: Point, b: Point, c: Point, d: Point): Point => ({
  x: (a.x + b.x + c.x + d.x) / 4,
  y: (a.y + b.y + c.y + d.y) / 4
})
const dist2 = (a: Point | undefined, b: Point | undefined): number => (a == undefined || b == undefined) ? 0 : (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)

type Romb = {
  a: Point,
  b: Point,
  c: Point,
  d: Point
  center: Point,
  radius: number,
  color: {
    stroke: string,
    fill: string
  }
}
// const dot = (a: Point, b: Point): number => a.x * b.x + a.y * b.y;

type Triangle = {
  id: number[],
  a: Point,
  b: Point,
  c: Point,
  acute: boolean
  // acute - angle less than 90 deg
  // obtuse - angle greater than 90 deg
}

let center: Point | undefined = undefined
let offset: Point | undefined = undefined

const paired = (t1: Triangle, t2: Triangle): Boolean => eq(t1.b, t2.b) && eq(t1.c, t2.c)

function build(a: Point, b: Point, c: Point, id: number[]): Triangle {

  let ab = dist2(a, b)
  let ac = dist2(a, c)
  let bc = dist2(b, c)

  //  let center = cog(a, b, c)
  let acute = bc < ab && bc < ac

  return {
    id: id,
    a: a,
    b: b,
    c: c,
    acute: acute
  }
}

function points_outside(ps: Point[]) {

  if (ps.filter(p => p.x < gut).length == ps.length) {
    return true
  }
  if (ps.filter(p => p.y < gut).length == ps.length) {
    return true
  }
  if (ps.filter(p => p.x > canvas.width - gut).length == ps.length) {
    return true
  }
  if (ps.filter(p => p.y > canvas.height - gut).length == ps.length) {
    return true
  }
  return false
}

function add_triangle(a: Point, b: Point, c: Point, id: number[]) {
  if (!points_outside([a, b, c])) {
    ts.push(build(a, b, c, id))
  }
}

function point_in_triangle(p: Point, t: Triangle) {
  function sign(a: Point, b: Point, c: Point) {
    return (a.x - c.x) * (b.y - c.y) - (b.x - c.x) * (a.y - c.y);
  }
  let vals = [sign(p, t.a, t.b), sign(p, t.b, t.c), sign(p, t.c, t.a)]
  let neg = vals[0] < 0 || vals[1] < 0 || vals[2] < 0;
  let pos = vals[0] > 0 || vals[1] > 0 || vals[2] > 0;
  return !(neg && pos)
}

function redraw() {
  context.fillStyle = color_black
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.clearRect(gut, gut, canvas.width - gut - gut, canvas.height - gut - gut)

  // let cd = dist2(center ? center : offset, offset)

  for (let i = 0; i < rombs.length; i++) {
    let romb = rombs[i];
    context.fillStyle = romb.color.fill
    context.strokeStyle = romb.color.stroke
    // if (center) {
    //   let rd = dist2(center, romb.center) * (.9 + Math.random() * .2)
    //   if (rd < cd) {
    //     context.fillStyle = color_black
    //     context.strokeStyle = color_white
    //   }
    // }
    context.beginPath();
    context.moveTo(romb.a.x, romb.a.y)
    context.lineTo(romb.b.x, romb.b.y)
    context.lineTo(romb.c.x, romb.c.y)
    context.lineTo(romb.d.x, romb.d.y)
    context.lineTo(romb.a.x, romb.a.y)
    context.fill()
    context.stroke()
  }

  // let cd = dist2(center ? center : offset, offset)

  // ts.forEach(triangle => {
  //   context.fillStyle = triangle.color.base
  //   context.strokeStyle = color_black
  //   if (center) {
  //     let td = dist2(center, triangle.center) * (.9 + Math.random() * .2)
  //     if (td < cd) {
  //       context.fillStyle = color_white
  //       context.strokeStyle = color_white
  //     }
  //   }
  //   context.beginPath();
  //   context.moveTo(triangle.b.x, triangle.b.y)
  //   context.lineTo(triangle.a.x, triangle.a.y)
  //   context.lineTo(triangle.c.x, triangle.c.y)
  //   context.fill()
  //   context.stroke()
  // })

  context.fillStyle = "#000000"
  context.fillRect(0, 0, canvas.width, gut)
  context.fillRect(0, 0, gut, canvas.height)
  context.fillRect(canvas.width, canvas.height, -canvas.width, -gut)
  context.fillRect(canvas.width, canvas.height, -gut, -canvas.height)
}

// let's go!
context.strokeStyle = 'black'

// set up red wheel
let w2 = canvas.width / 2
let h2 = canvas.height / 2


// let t = gut*2
// let r = (Math.min(w2 * 2, h2 * 2) - gut*3)

let t = -2000
let r = canvas.width * 2.2//(Math.min(w2, h2) - gut - gut)*4

context.strokeStyle = 'black'
// context.beginPath();

let bx = Math.cos((3 * 2 * Math.PI / 10)) * r
let by = Math.sin((3 * 2 * Math.PI / 10)) * r

let cx = Math.cos((2 * 2 * Math.PI / 10)) * r
let cy = Math.sin((2 * 2 * Math.PI / 10)) * r

ts.push(build({ x: w2, y: t }, { x: w2 + bx, y: t + by }, { x: w2 + cx, y: t + cy }, []))


// let px = 0
// let py = 0
// for (let i = 0; i < 11; i++) {
//   let x = Math.cos((i * 2 * Math.PI / 10) + (2 * Math.PI / 4)) * r
//   let y = Math.sin((i * 2 * Math.PI / 10) + (2 * Math.PI / 4)) * r
//   if (i > 0) {
//     if (i % 2 == 0) {
//       reds.push(build(w2, h2, w2 + x, h2 + y, w2 + px, h2 + py))
//     } else {
//       reds.push(build(w2, h2, w2 + px, h2 + py, w2 + x, h2 + y))
//     }
//     //   context.moveTo(w2+ x, h2 +y)
//     // } else {
//     //   context.lineTo(w2+ x, h2 +y)
//   }
//   px = x
//   py = y
// }
// context.stroke()

// canvas.addEventListener('click', (event: MouseEvent) => {
//   if (!center) {
//     center = { x: event.offsetX, y: event.offsetY }
//     offset = center
//   } else {
//     center = undefined
//     offset = undefined
//   }
// });

// canvas.addEventListener('mousedown', (event: MouseEvent) => {
//   center = { x: event.offsetX, y: event.offsetY }
//   offset = { x: event.offsetX, y: event.offsetY }
// });

// canvas.addEventListener('mouseup', (event: MouseEvent) => {
//   center = undefined
//   offset = undefined
//   ts.forEach(t=>t.color.live = t.color.base)
// });

canvas.addEventListener('mousemove', (event: MouseEvent) => {
  let center = { x: event.offsetX, y: event.offsetY }

  let outer2_dist = dist2(center, { x: center.x + 250, y: center.y }) // 250 -> 62500
  let outer1_dist = dist2(center, { x: center.x + 175, y: center.y }) // 200 -> 40000
  let circle_dist = dist2(center, { x: center.x + 150, y: center.y }) // 150 -> 22500
  let inner1_dist = dist2(center, { x: center.x + 125, y: center.y }) // 100 -> 10000
  let inner2_dist = dist2(center, { x: center.x + 50, y: center.y })  //  50 ->  2500
  console.log([outer2_dist,outer1_dist,circle_dist,inner1_dist,inner2_dist])

  for (let i=0; i<rombs.length; i++){
    let romb = rombs[i];
    let dist = dist2(center, romb.center)
    // console.log(dist-d)
    if (dist<inner1_dist) {
      romb.color.fill=color_white
    } else if (dist>outer1_dist){
      romb.color.fill=color_black
    } else {
      romb.color.fill=color_red
    }

    if (dist<inner2_dist) {
      romb.color.stroke = color_white
    } else if (dist>outer2_dist) {
      romb.color.stroke = color_white
    } else {
      romb.color.stroke = color_black
    }
  }
  // for (let i = 0; i < ts.length; i++) {
  //   let dist = dist2(center ? center : { x: w2, y: h2 }, ts[i].center)
  //   if (dist < circle) {
  //     ts[i].color.live = color_white
  //   }
  // }
});

for (let j = 0; j < 10; j++) {
  let num_ts = ts.length;
  for (let i = num_ts - 1; i >= 0; i--) {
    let t = ts[i];
    if (t.acute) {
      // split red

      // P = A + (B - A) / goldenRatio
      let p: Point = add(t.a, div(sub(t.b, t.a), golden_ratio))

      add_triangle(t.c, p, t.b, [...t.id, 1])
      add_triangle(p, t.c, t.a, [...t.id, 2])
    } else {
      // split blue

      // Q = B + (A - B) / goldenRatio
      let q: Point = add(t.b, div(sub(t.a, t.b), golden_ratio))

      // R = B + (C - B) / goldenRatio
      let r: Point = add(t.b, div(sub(t.c, t.b), golden_ratio))

      add_triangle(r, t.c, t.a, [...t.id, 1])
      add_triangle(q, r, t.b, [...t.id, 2])
      add_triangle(r, q, t.a, [...t.id, 3])
    }
  }
  ts.splice(0, num_ts)
}
console.log(ts.length)

let rombs: Romb[] = []
let handled: Triangle[] = []
for (let i = 0; i < ts.length; i++) {
  if (!handled.includes(ts[i])) {
    let pair = ts.filter(t => eq(t.b, ts[i].b) && eq(t.c, ts[i].c))
    pair.forEach(t => handled.push(t))
    if (pair.length == 2) {
      rombs.push({
        a: pair[0].b,
        b: pair[0].a,
        c: pair[0].c,
        d: pair[1].a,
        center: cog(pair[0].a, pair[0].b, pair[0].c, pair[1].a),
        radius: Math.sqrt(dist2(pair[0].b, pair[0].c)),
        color: {
          fill: color_white,
          stroke: color_black
        }
      })
    } else {
      rombs.push({
        a: pair[0].b,
        b: pair[0].a,
        c: pair[0].c,
        d: pair[0].b,
        center: cog(pair[0].a, pair[0].b, pair[0].c, pair[0].b),
        radius: Math.sqrt(dist2(pair[0].b, pair[0].c)),
        color: {
          fill: color_white,
          stroke: color_black
        }
      })
    }
  }
}
console.log(rombs.length)

let delay = 10
let count = 10
let prev = 0
function loop(millis: number) {
  requestAnimationFrame(loop)

  // if (offset) {
  //   count = count<0 ? delay : count-1
  //   if (count==delay) {
  //     offset = add(offset, { x: 20, y: 0 })
  //   }
  // }
  redraw()
  prev = millis
}
requestAnimationFrame(loop)