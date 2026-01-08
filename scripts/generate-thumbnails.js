import sharp from 'sharp'
import { readdir, mkdir, rm } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const THUMBNAIL_WIDTH = 600  // 썸네일 최대 너비
const THUMBNAIL_QUALITY = 80 // JPEG/WebP 품질
const SOURCE_DIRS = ['public/avatars', 'public/chatImages']
const THUMBNAIL_DIR = 'public/thumbnails'

async function getImageFiles(dir) {
  const files = []

  async function scan(currentDir) {
    if (!existsSync(currentDir)) return

    const entries = await readdir(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)

      if (entry.isDirectory()) {
        await scan(fullPath)
      } else if (/\.(jpg|jpeg|png|webp|gif)$/i.test(entry.name)) {
        files.push(fullPath)
      }
    }
  }

  await scan(dir)
  return files
}

async function generateThumbnail(sourcePath) {
  // public/avatars/foo.png -> public/thumbnails/avatars/foo.webp
  const relativePath = sourcePath.replace(/^public\//, '')
  const parsedPath = path.parse(relativePath)
  const thumbnailPath = path.join(
    THUMBNAIL_DIR,
    parsedPath.dir,
    `${parsedPath.name}.webp`
  )

  // 썸네일 디렉토리 생성
  const thumbnailDir = path.dirname(thumbnailPath)
  if (!existsSync(thumbnailDir)) {
    await mkdir(thumbnailDir, { recursive: true })
  }

  try {
    // failOn: 'none'으로 손상된 이미지도 처리 시도
    await sharp(sourcePath, { failOn: 'none' })
      .resize(THUMBNAIL_WIDTH, null, {
        withoutEnlargement: true, // 원본보다 크게 만들지 않음
        fit: 'inside'
      })
      .webp({ quality: THUMBNAIL_QUALITY })
      .toFile(thumbnailPath)

    console.log(`✓ ${sourcePath} -> ${thumbnailPath}`)
    return { success: true, source: sourcePath, thumbnail: thumbnailPath }
  } catch (error) {
    console.error(`✗ ${sourcePath}: ${error.message}`)
    return { success: false, source: sourcePath, error: error.message }
  }
}

async function main() {
  console.log('썸네일 생성 시작...\n')

  // 기존 썸네일 디렉토리 삭제 후 재생성
  if (existsSync(THUMBNAIL_DIR)) {
    console.log('🗑️  기존 썸네일 삭제 중...')
    await rm(THUMBNAIL_DIR, { recursive: true })
  }
  await mkdir(THUMBNAIL_DIR, { recursive: true })

  let totalFiles = 0
  let successCount = 0
  let failCount = 0

  for (const sourceDir of SOURCE_DIRS) {
    console.log(`\n📁 ${sourceDir} 처리 중...`)

    const imageFiles = await getImageFiles(sourceDir)
    totalFiles += imageFiles.length

    for (const file of imageFiles) {
      const result = await generateThumbnail(file)
      if (result.success) {
        successCount++
      } else {
        failCount++
      }
    }
  }

  console.log(`\n완료! 총 ${totalFiles}개 파일 중 ${successCount}개 성공, ${failCount}개 실패`)
}

main().catch(console.error)
