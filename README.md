# Beyond Imagination - Team Promotion Page

Discord 스타일의 팀 소개 페이지입니다.

## 실행 방법

```bash
# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev

# 프로덕션 빌드
pnpm build

# 빌드 결과 미리보기
pnpm preview
```

---

## 콘텐츠 관리

채널과 멤버 데이터는 JSON 파일로 관리됩니다. 코드 수정 없이 JSON 파일만 편집하면 됩니다.

### 채널 관리

채널 데이터는 `public/channels/` 디렉토리에 위치합니다.

```
public/channels/
├── index.json         # 채널 목록 (표시 순서)
├── team-intro.json    # 팀 소개 채널
├── beyondworm.json    # BeyondWorm 소개
├── express-cargo.json # Express Cargo 소개
└── contact.json       # 문의하기 채널
```

#### 새 채널 추가하기

1. `public/channels/` 에 새 JSON 파일 생성 (예: `new-project.json`)

```json
{
  "id": "new-project",
  "name": "새 프로젝트 소개",
  "order": 4,
  "icon": "Hash",
  "leaderId": "김한빈",
  "leaderTitle": "프로젝트장",
  "history": [
    {
      "authorId": "김한빈",
      "content": "새 프로젝트를 소개합니다!"
    }
  ],
  "presets": [
    {
      "question": "이 프로젝트는 무엇인가요?",
      "answer": "프로젝트 설명입니다."
    }
  ]
}
```

2. `public/channels/index.json` 에 채널 ID 추가

```json
[
  "team-intro",
  "beyondworm",
  "express-cargo",
  "new-project",
  "contact"
]
```

#### 채널 삭제하기

1. `public/channels/index.json` 에서 채널 ID 제거
2. 해당 JSON 파일 삭제

#### 채널 JSON 구조

| 필드              | 타입               | 필수 | 설명                        |
|-----------------|------------------|----|---------------------------|
| `id`            | string           | O  | 채널 고유 ID (파일명과 동일)        |
| `name`          | string           | O  | 채널 표시 이름                  |
| `order`         | number           | X  | 정렬 순서 (낮을수록 위)            |
| `icon`          | string           | X  | 아이콘 타입 (기본: "Hash")       |
| `leaderId`      | string           | X  | 리더 멤버 ID (이름 옆에 타이틀 표시)   |
| `leaderTitle`   | string           | X  | 리더 타이틀 (예: "팀장", "프로젝트장") |
| `history`       | Message[]        | O  | 초기 채팅 메시지 목록              |
| `presets`       | QuestionPreset[] | X  | 질문 프리셋 목록                 |
| `isContactForm` | boolean          | X  | 문의 폼 활성화 여부               |

##### Message 구조

```json
{
  "authorId": "김한빈",
  "content": "메시지 내용",
  "image": "/image.jpg",
  "images": ["/img1.jpg"]
}
```

| 필드          | 타입       | 필수 | 설명                          |
|-------------|----------|----|-----------------------------|
| `authorId`  | string   | △  | 멤버 ID (멤버 이름과 동일)           |
| `author`    | string   | △  | 작성자 이름 (authorId가 없을 때 사용)  |
| `content`   | string   | O  | 메시지 내용 (`\n`으로 줄바꿈 가능)      |
| `timestamp` | string   | X  | 표시 시간 (생략 시 자동 생성)          |
| `avatar`    | string   | X  | 프로필 이미지 (authorId가 없을 때 사용) |
| `isBot`     | boolean  | X  | Bot 메시지 여부                  |
| `image`     | string   | X  | 단일 이미지 경로                   |
| `images`    | string[] | X  | 여러 이미지 경로                   |

> **타임스탬프 자동 생성**: `timestamp`를 생략하면 현재 시간 기준으로 메시지마다 약 1~2분 간격으로 자동 생성됩니다.

> **멤버 연결**: `authorId`에 멤버의 `id`(이름)를 입력하면 해당 멤버의 프로필 이미지가 자동으로 표시됩니다.
> Bot 메시지처럼 멤버가 아닌 경우 `authorId`를 생략하고 `author`만 사용하면 됩니다.

##### QuestionPreset 구조

```json
{
  "question": "질문 내용",
  "answer": "답변 내용\n줄바꿈도 가능합니다.",
  "image": "/image.jpg",
  "images": ["/img1.jpg"]
}
```

| 필드         | 타입       | 필수 | 설명                    |
|------------|----------|----|-----------------------|
| `question` | string   | O  | 질문 내용                 |
| `answer`   | string   | O  | 답변 내용 (`\n`으로 줄바꿈 가능) |
| `image`    | string   | X  | 단일 이미지 경로             |
| `images`   | string[] | X  | 여러 이미지 경로             |

---

### 멤버 관리

멤버 데이터는 `public/members.json` 파일에서 관리됩니다.

#### 멤버 추가하기

`public/members.json` 에 새 멤버 객체 추가:

```json
[
  {
    "id": "김한빈",
    "name": "김한빈",
    "role": "Team Leader, Kakao",
    "status": "online",
    "avatar": "/avatars/kim-hanbin.png",
    "bio": "팀장 소개글입니다."
  },
  {
    "id": "새멤버",
    "name": "새멤버",
    "role": "Developer",
    "status": "online",
    "avatar": "/avatars/new-member.png",
    "bio": "새로 합류한 개발자입니다."
  }
]
```

#### 멤버 삭제하기

`public/members.json` 에서 해당 멤버 객체 제거

#### 멤버 JSON 구조

| 필드       | 타입                    | 필수 | 설명                              |
|----------|-----------------------|----|---------------------------------|
| `id`     | string                | O  | 멤버 고유 ID (되도록 이름과 동일하게 설정)      |
| `name`   | string                | O  | 멤버 이름                           |
| `role`   | string                | O  | 역할/직책                           |
| `status` | "online" \| "offline" | O  | 상태 (online: 현재 팀원, offline: 탈퇴) |
| `bio`    | string                | O  | 소개글                             |
| `avatar` | string                | X  | 프로필 이미지 경로                      |

---

## 이미지 관리

이미지 파일은 `public/` 디렉토리에 위치시킵니다.

```
public/
├── beyond_imagination.png    # 팀 로고
├── avatars/                  # 멤버 아바타 (영문 파일명 권장)
│   ├── kim-hanbin.png
│   └── kang-minjun.png
└── chatImages/               # 채팅 이미지
    └── project/
        └── screenshot.jpg
```

> **주의**: 아바타 파일명은 한글 인코딩 문제를 피하기 위해 영문으로 작성하세요.

JSON에서 이미지 경로는 `/`로 시작합니다 (예: `/chatImages/project/screenshot.jpg`)
