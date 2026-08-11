export type Project = {
  index: string;
  role: string;
  title: string;
  description: string;
  metric?: string;
  tags: string[];
};

export const projects: Project[] = [
  {
    index: "01",
    role: "BACKEND · ML · INTERNSHIP",
    title: "Fintag",
    description:
      "중소기업 대상 AI 자금 관리 에이전트. 유휴 자금을 자동으로 예측하고 수익화 전략을 제안합니다. (주)Mideal 인턴십에서 프론트/백엔드를 오가며 개발.",
    metric: "예측 오차 MAPE 62.5% → 13.9% 개선",
    tags: [
      "Prophet + LightGBM",
      "SHAP",
      "Bedrock Nova Lite",
      "IsolationForest / PyOD",
      "Async Queue + Prisma",
    ],
  },
  {
    index: "02",
    role: "FULLSTACK · CAPSTONE → B2B",
    title: "CoChat",
    description:
      "여러 메신저(Slack, Discord, Gmail)의 알림을 모아 몰입 근무 시간을 지켜주는 서비스. 졸업작품에서 시작해 해커톤에서 B2B 버전으로 피벗, KIPS 학술 심포지엄 발표까지 이어졌습니다.",
    tags: ["RAG", "SSE Streaming", "Slack/Discord/Gmail API", "Multi-channel Aggregation"],
  },
  {
    index: "03",
    role: "100% SOLO BUILD",
    title: "Gopssl",
    description:
      "미용실 운영을 위한 모바일 관리 앱. 가족의 실제 미용실 운영 불편함에서 시작해 기획부터 배포까지 혼자 만들었습니다.",
    tags: ["React Native", "FastAPI", "Oracle Cloud / systemd"],
  },
];
