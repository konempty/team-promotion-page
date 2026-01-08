/**
 * 에셋 경로에 base URL을 추가합니다.
 * 개발 환경에서는 '/', 프로덕션(GitHub Pages)에서는 '/team-promotion-page/'가 됩니다.
 */
export function getAssetUrl(path: string): string {
  if (!path) return path

  // 이미 절대 URL이면 그대로 반환
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const base = import.meta.env.BASE_URL

  // path가 /로 시작하면 base와 결합
  if (path.startsWith('/')) {
    return `${base}${path.slice(1)}`
  }

  return `${base}${path}`
}

/**
 * 이미지 경로를 썸네일 경로로 변환합니다.
 * /avatars/foo.png -> /thumbnails/avatars/foo.webp
 * /chatImages/bar.jpg -> /thumbnails/chatImages/bar.webp
 */
export function getThumbnailPath(path: string): string {
  if (!path) return path

  // 외부 URL이면 그대로 반환
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  // avatars 또는 chatImages 경로만 썸네일 변환
  if (!path.includes('/avatars/') && !path.includes('/chatImages/')) {
    return path
  }

  // 확장자를 .webp로 변경하고 thumbnails 경로 추가
  const withoutExt = path.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')
  return path.startsWith('/')
      ? `/thumbnails${withoutExt}.webp`
      : `thumbnails/${withoutExt}.webp`
}

/**
 * 썸네일 URL을 반환합니다 (base URL 포함).
 */
export function getThumbnailUrl(path: string): string {
  return getAssetUrl(getThumbnailPath(path))
}
