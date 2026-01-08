export interface Message {
  id: string
  author: string
  avatar?: string
  content: string
  image?: string
  images?: string[] // Support for multiple images
  timestamp: string
  isBot?: boolean
}

export interface QuestionPreset {
  id: string
  question: string
  answer: string
  image?: string
  images?: string[] // Support for multiple images
}

export interface ChannelData {
  id: string
  name: string
  history: Message[]
  presets?: QuestionPreset[]
  isContactForm?: boolean
}

export const channelData: Record<string, ChannelData> = {
  "team-intro": {
    id: "team-intro",
    name: "팀 소개",
    history: [
      {
        id: "1",
        author: "팀장",
        content: "안녕하세요! Beyond Imagination 팀에 오신 것을 환영합니다.",
        timestamp: "오후 2:30",
      },
      {
        id: "2",
        author: "개발자 A",
        content: "우리 팀은 상상을 현실로 만드는 개발자 모임입니다.",
        timestamp: "오후 2:32",
      },
      {
        id: "3",
        author: "개발자 B",
        content: "궁금하신 점은 아래 질문 중에서 선택해주세요!",
        timestamp: "오후 2:33",
      },
    ],
    presets: [
      {
        id: "p1",
        question: "Beyond Imagination 팀은 무엇인가요?",
        answer:
          "Beyond Imagination은 상상을 뛰어넘는 혁신적인 프로젝트를 만드는 개발자 모임입니다. 우리는 기술의 한계를 넘어서 새로운 가능성을 탐구하며, 함께 성장하고 배우는 것을 목표로 합니다.",
      },
      {
        id: "p2",
        question: "팀의 목표는 무엇인가요?",
        answer:
          "우리 팀의 목표는 혁신적인 기술로 사회에 긍정적인 영향을 미치는 것입니다. 각 팀원의 성장을 지원하고, 실질적인 프로젝트를 통해 실력을 향상시키며, 개발 커뮤니티에 기여하는 것을 목표로 합니다.",
      },
      {
        id: "p3",
        question: "팀원은 어떻게 모집하나요?",
        answer:
          "팀원은 정기적으로 모집하고 있습니다. 기술 스택보다는 배우고자 하는 열정과 협업 능력을 중요시합니다. 관심 있으시다면 문의하기 채널을 통해 연락주세요!",
      },
    ],
  },
  beyondworm: {
    id: "beyondworm",
    name: "BeyondWorm 소개",
    history: [
      {
        id: "1",
        author: "개발자 A",
        content: "BeyondWorm 프로젝트를 소개합니다!",
        timestamp: "오전 10:15",
      },
      {
        id: "2",
        author: "개발자 B",
        content: "이 프로젝트는 정말 흥미로운 도전이었어요.",
        timestamp: "오전 10:17",
      },
    ],
    presets: [
      {
        id: "p1",
        question: "BeyondWorm은 어떤 프로젝트인가요?",
        answer:
          "BeyondWorm은 AI 기반 코드 분석 및 최적화 도구입니다. 개발자들이 작성한 코드를 분석하여 성능 개선 방안을 제안하고, 버그를 사전에 감지하는 지능형 개발 도구입니다. 아래는 대시보드 화면입니다.",
        image: "/ai-code-analysis-dashboard.jpg",
      },
      {
        id: "p2",
        question: "주요 기능은 무엇인가요?",
        answer:
          "실시간 코드 분석, 성능 최적화 제안, 보안 취약점 탐지, 코드 리뷰 자동화, 그리고 팀 협업 기능을 제공합니다. 또한 다양한 프로그래밍 언어를 지원하며, VS Code, IntelliJ 등 주요 IDE와 통합됩니다. 아래는 주요 기능 화면들입니다.",
        images: ["/ai-code-analysis-dashboard.jpg", "/logistics-delivery-tracking-map.jpg"],
      },
      {
        id: "p3",
        question: "언제 출시되나요?",
        answer:
          "현재 베타 테스트 단계에 있으며, 2024년 하반기에 정식 출시를 목표로 하고 있습니다. 베타 테스터를 모집 중이니 관심 있으시면 문의해주세요!",
      },
    ],
  },
  "express-cargo": {
    id: "express-cargo",
    name: "Express Cargo 소개",
    history: [
      {
        id: "1",
        author: "팀장",
        content: "Express Cargo는 우리 팀의 첫 번째 프로젝트입니다.",
        timestamp: "오전 11:20",
      },
      {
        id: "2",
        author: "개발자 A",
        content: "물류 산업의 디지털 혁신을 목표로 하고 있어요!",
        timestamp: "오전 11:22",
      },
    ],
    presets: [
      {
        id: "p1",
        question: "Express Cargo는 무엇인가요?",
        answer:
          "Express Cargo는 물류 배송 최적화 플랫폼입니다. AI 기반 경로 최적화와 실시간 배송 추적을 통해 물류 업계의 효율성을 극대화하는 서비스입니다. 아래는 실시간 배송 추적 화면입니다.",
        image: "/logistics-delivery-tracking-map.jpg",
      },
      {
        id: "p2",
        question: "어떤 문제를 해결하나요?",
        answer:
          "배송 경로 비효율, 실시간 추적 부재, 고객 커뮤니케이션 문제 등 전통적인 물류 산업의 페인포인트를 해결합니다. 배송 시간을 평균 30% 단축하고 비용을 20% 절감할 수 있습니다.",
      },
      {
        id: "p3",
        question: "사용하는 기술 스택은?",
        answer:
          "Next.js, React, Node.js, PostgreSQL을 기반으로 하며, AI 모델은 TensorFlow와 PyTorch를 사용합니다. 실시간 데이터 처리를 위해 Redis와 WebSocket을 활용하고 있습니다. 아래는 기술 스택 구성도와 아키텍처입니다.",
        images: ["/ai-code-analysis-dashboard.jpg", "/logistics-delivery-tracking-map.jpg"],
      },
    ],
  },
  contact: {
    id: "contact",
    name: "문의하기",
    history: [
      {
        id: "1",
        author: "Bot",
        content:
          "안녕하세요! 문의사항이 있으시면 아래에 메시지를 남겨주세요. 이메일 주소를 함께 입력해주시면 빠르게 답변 드리겠습니다.",
        timestamp: "오후 1:00",
        isBot: true,
      },
    ],
    isContactForm: true,
  },
}
