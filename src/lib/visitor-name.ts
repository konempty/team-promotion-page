const adjectives = [
  "귀여운",
  "빠른",
  "용감한",
  "똑똑한",
  "친절한",
  "활발한",
  "멋진",
  "재미있는",
  "신비로운",
  "행복한",
  "즐거운",
  "씩씩한",
  "영리한",
  "당당한",
  "사랑스러운",
  "호기심 많은",
  "따뜻한",
  "밝은",
  "자유로운",
  "신나는",
]

const animals = [
  "다람쥐",
  "곰",
  "토끼",
  "여우",
  "고양이",
  "강아지",
  "펭귄",
  "코알라",
  "판다",
  "사자",
  "호랑이",
  "돌고래",
  "부엉이",
  "독수리",
  "고슴도치",
  "수달",
  "너구리",
  "기린",
  "코끼리",
  "햄스터",
]

export function generateVisitorName(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const animal = animals[Math.floor(Math.random() * animals.length)]
  return `${adjective} ${animal} (방문자)`
}
