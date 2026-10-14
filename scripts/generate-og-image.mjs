/**
 * Generates public/og-image.png (1200x630) — a dark network motif matching
 * the site identity, using only Node's zlib (no image dependencies).
 *
 * Run: node scripts/generate-og-image.mjs
 */
import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const out = resolve(__dirname, '../public/og-image.png')

const W = 1200
const H = 630
const buf = Buffer.alloc(W * H * 3)

/* ------------------------------- helpers ------------------------------- */
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t)
const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)))

function setPx(x, y, rgb, alpha = 1) {
  if (x < 0 || y < 0 || x >= W || y >= H) return
  const i = (y * W + x) * 3
  buf[i] = clamp(buf[i] * (1 - alpha) + rgb[0] * alpha)
  buf[i + 1] = clamp(buf[i + 1] * (1 - alpha) + rgb[1] * alpha)
  buf[i + 2] = clamp(buf[i + 2] * (1 - alpha) + rgb[2] * alpha)
}

function glow(cx, cy, radius, color, strength = 1) {
  const r2 = radius * radius
  for (let y = Math.max(0, cy - radius); y < Math.min(H, cy + radius); y++) {
    for (let x = Math.max(0, cx - radius); x < Math.min(W, cx + radius); x++) {
      const d2 = (x - cx) ** 2 + (y - cy) ** 2
      if (d2 > r2) continue
      const falloff = (1 - Math.sqrt(d2) / radius) ** 2 * strength
      setPx(x, y, color, falloff)
    }
  }
}

function dot(cx, cy, r, color, alpha = 1) {
  const r2 = r * r
  for (let y = cy - r; y <= cy + r; y++) {
    for (let x = cx - r; x <= cx + r; x++) {
      const d2 = (x - cx) ** 2 + (y - cy) ** 2
      if (d2 > r2) continue
      setPx(x, y, color, alpha * (1 - Math.sqrt(d2) / (r + 0.001)) ** 0.6)
    }
  }
}

function line(x0, y0, x1, y1, color, alpha = 0.5) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) + 1
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    setPx(Math.round(x0 + (x1 - x0) * t), Math.round(y0 + (y1 - y0) * t), color, alpha)
  }
}

/* -------------------------------- scene -------------------------------- */
const bgTop = [7, 9, 14]
const bgBottom = [10, 13, 21]

for (let y = 0; y < H; y++) {
  const t = y / H
  const c = mix(bgTop, bgBottom, t)
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 3
    buf[i] = clamp(c[0])
    buf[i + 1] = clamp(c[1])
    buf[i + 2] = clamp(c[2])
  }
}

// accent glows
glow(930, 180, 420, [30, 70, 170], 0.5)
glow(240, 520, 380, [20, 120, 130], 0.35)

// deterministic pseudo-random nodes
let seed = 42
const rand = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296
  return seed / 4294967296
}

const nodes = Array.from({ length: 46 }, () => ({
  x: 640 + rand() * 520,
  y: 60 + rand() * 510,
  r: 2 + rand() * 3,
}))

const BLUE = [79, 140, 255]
const CYAN = [56, 225, 225]

for (let i = 0; i < nodes.length; i++) {
  for (let j = i + 1; j < nodes.length; j++) {
    const a = nodes[i]
    const b = nodes[j]
    const d = Math.hypot(a.x - b.x, a.y - b.y)
    if (d < 130) line(a.x, a.y, b.x, b.y, BLUE, 0.16 * (1 - d / 130))
  }
}

nodes.forEach((n, i) => {
  glow(n.x, n.y, 26, CYAN, 0.25)
  dot(n.x, n.y, n.r, i % 5 === 0 ? CYAN : BLUE, 0.95)
})

/* -------------------------------- PNG ---------------------------------- */
function crc32(chunk) {
  let c = ~0
  for (const byte of chunk) {
    c ^= byte
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1
  }
  return ~c >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeBuf = Buffer.from(type, 'latin1')
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0)
  return Buffer.concat([len, typeBuf, data, crc])
}

const raw = Buffer.alloc(H * (W * 3 + 1))
for (let y = 0; y < H; y++) {
  raw[y * (W * 3 + 1)] = 0 // filter: none
  buf.copy(raw, y * (W * 3 + 1) + 1, y * W * 3, (y + 1) * W * 3)
}

const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(W, 0)
ihdr.writeUInt32BE(H, 4)
ihdr[8] = 8 // bit depth
ihdr[9] = 2 // colour type: truecolour
ihdr[10] = 0
ihdr[11] = 0
ihdr[12] = 0

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
])

mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, png)
console.log(`wrote ${out} (${png.length} bytes)`)
