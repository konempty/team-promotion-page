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
