import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const shotsDir = path.resolve('docs/.vuepress/public/shots')
const files = fs
  .readdirSync(shotsDir)
  .filter((f) => /^SHOT-\d+.+\.png$/i.test(f))
  .sort()

const MAX_W = 1280
const QUALITY = 72

let before = 0
let after = 0

for (const file of files) {
  const src = path.join(shotsDir, file)
  const dest = path.join(shotsDir, file.replace(/\.png$/i, '.webp'))
  const input = fs.statSync(src).size
  before += input

  await sharp(src)
    .resize({ width: MAX_W, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 5 })
    .toFile(dest)

  const output = fs.statSync(dest).size
  after += output
  console.log(
    `${file}  ${(input / 1024).toFixed(0)}KB → ${path.basename(dest)}  ${(output / 1024).toFixed(0)}KB`,
  )
}

console.log(
  `\nTOTAL  ${(before / 1024 / 1024).toFixed(2)}MB → ${(after / 1024 / 1024).toFixed(2)}MB  (${((1 - after / before) * 100).toFixed(0)}% smaller)`,
)
