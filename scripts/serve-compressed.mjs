/**
 * Minimal static file server for dist/ with gzip/brotli content-encoding —
 * mirrors what a production host (Vercel) serves, so local Lighthouse runs
 * are representative of deployed performance.
 *
 * Run: node scripts/serve-compressed.mjs [port]
 */
import { createServer } from 'node:http'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { brotliCompress, gzip, constants as zc } from 'node:zlib'
import { promisify } from 'node:util'

const gzipAsync = promisify(gzip)
const brAsync = promisify(brotliCompress)
const port = Number(process.argv[2] || 4174)
const root = join(process.cwd(), 'dist')

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
}

const cache = new Map()

async function encode(path, buf) {
  const key = `${path}:${buf.length}`
  if (cache.has(key)) return cache.get(key)
  const accept = ''
  const [gz, br] = await Promise.all([
    gzipAsync(buf, { level: 9 }),
    brAsync(buf, { params: { [zc.BROTLI_PARAM_QUALITY]: 5 } }),
  ])
  const out = { gz, br, accept }
  cache.set(key, out)
  return out
}

createServer(async (req, res) => {
  try {
    const url = decodeURIComponent((req.url || '/').split('?')[0])
    let file = normalize(join(root, url))
    if (!file.startsWith(root)) {
      res.writeHead(403).end()
      return
    }
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html')
    if (!existsSync(file)) file = join(root, 'index.html')

    const buf = await import('node:fs').then((fs) => fs.readFileSync(file))
    const type = types[extname(file)] || 'application/octet-stream'
    const headers = { 'Content-Type': type, 'Cache-Control': 'no-cache' }

    const a = String(req.headers['accept-encoding'] || '')
    if (a.includes('br')) {
      const { br } = await encode(file, buf)
      headers['Content-Encoding'] = 'br'
      headers['Content-Length'] = br.length
      res.writeHead(200, headers)
      res.end(br)
      return
    }
    if (a.includes('gzip')) {
      const { gz } = await encode(file, buf)
      headers['Content-Encoding'] = 'gzip'
      headers['Content-Length'] = gz.length
      res.writeHead(200, headers)
      res.end(gz)
      return
    }
    headers['Content-Length'] = buf.length
    res.writeHead(200, headers)
    res.end(buf)
  } catch (err) {
    res.writeHead(500).end(String(err))
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`compressed dist server → http://localhost:${port}`)
})
