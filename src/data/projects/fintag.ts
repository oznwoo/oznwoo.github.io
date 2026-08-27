import fintagLogo from "@/imports/fintag-logo.png"
import fintagAboutHero from "@/imports/fintag/fintag-about-hero.webp"
import fintagAboutRole from "@/imports/fintag/fintag-about-role.webp"
import fintagDemoVideo from "@/imports/fintag/fintag-demo.mp4"
import fintagDemoPoster from "@/imports/fintag/fintag-demo-poster.webp"
import fintagProblemPreprocessing from "@/imports/fintag/fintag-problem-preprocessing.webp"
import fintagProblemAccuracy from "@/imports/fintag/fintag-problem-accuracy.webp"
import fintagProblemExplain from "@/imports/fintag/fintag-problem-explain.webp"
import fintagSolutionPipeline from "@/imports/fintag/fintag-solution-pipeline.webp"
import fintagSolutionAccuracyStep1 from "@/imports/fintag/fintag-solution-accuracy-step1.webp"
import fintagSolutionAccuracyStep2 from "@/imports/fintag/fintag-solution-accuracy-step2.webp"
import fintagSolutionAccuracyStep3 from "@/imports/fintag/fintag-solution-accuracy-step3.webp"
import fintagSolutionExplainShap from "@/imports/fintag/fintag-solution-explain-shap.webp"
import fintagSolutionExplainAnomaly from "@/imports/fintag/fintag-solution-explain-anomaly.webp"
import fintagOutcomeChart from "@/imports/fintag/fintag-outcome-chart.webp"
import fintagOutcomePreprocessing from "@/imports/fintag/fintag-outcome-preprocessing.webp"
import fintagOutcomeAccuracy from "@/imports/fintag/fintag-outcome-accuracy.webp"
import fintagOutcomeExplain from "@/imports/fintag/fintag-outcome-explain.webp"
import fintagStackArchitecture from "@/imports/fintag/fintag-stack-architecture.webp"
import type { ProjectDetail } from "./types"

export const fintagDetail: ProjectDetail = {
  period: "2026.04 – 2026.06",
  role: "백엔드 개발 | ML 엔지니어링 (인턴십)",
  heroEffect: "bars",
  overviewHeadline:
    "재무 전문가가 부재한 중소기업을 위한 AI 자금 관리 에이전트",
  overviewBody:
    "재무 전문지식이 없는 중소기업은 **유휴자금**을 방치해 매년 손실을 보면서도 알아채지 못합니다. Fintag는 유휴자금을 바탕으로 **현금흐름**을 예측해 **맞춤 금융 상품**을 제안합니다.",
  roleHeadline: "현금흐름 예측 모델 고도화",
  roleBody:
    "기존 예측 모델은 오차가 크고, 예측 근거도 알 수 없었습니다. 저는 이 문제를 해결할 **백엔드 개발과 예측 모델 고도화**를 맡았습니다.",
  logoSrc: fintagLogo,
  aboutImage: fintagAboutHero,
  roleImage: fintagAboutRole,
  demoHeadline: "실제 동작하는 서비스로 확인하는 3분 시연",
  demoBody:
    "현금흐름 예측 생성부터 이상거래 탐지, 예측 근거 설명까지 실제 화면으로 이어지는 흐름을 담았습니다.",
  demoVideo: fintagDemoVideo,
  demoPoster: fintagDemoPoster,
  problem: [
    {
      title: "데이터 전처리 부재",
      body: "은행·카드·보험 등에서 각각 집계한 거래가 동일 지출을 중복 반영해 학습 데이터를 왜곡시켰고, 내부 계좌 간 이동이 실제 지출로 잘못 분류되어 현금흐름이 과대 집계됐습니다.",
      shortBody: [
        "은행·카드·보험 거래가 **중복 집계**됨",
        "**내부 계좌 이동**이 지출로 잘못 분류됨",
        "현금흐름이 **과대 집계**됨",
      ],
      icon: "duplicate",
      tags: ["내부이체", "중복집계"],
      image: fintagProblemPreprocessing,
    },
    {
      title: "예측 정확도 부족",
      body: "Prophet 단독 모델은 추세·계절성 같은 큰 흐름은 잘 포착했지만 급여일·카드결제일 같은 단기 반복 패턴은 노이즈로 처리해 놓쳤습니다. 기업 유형에 따라 MAPE가 최대 수백 %에 달할 만큼 오차율이 크고 미세 조정도 불가능했습니다.",
      shortBody: [
        "시계열 예측 모델(Prophet)은 큰 흐름만 포착",
        "**급여일·카드결제일 단기 패턴**은 노이즈로 놓침",
        "예측 **오차율 최대 수백 %**",
      ],
      icon: "target",
      tags: ["미세조정불가", "높은오차율"],
      image: fintagProblemAccuracy,
    },
    {
      title: "예측 설명 부재",
      body: "예측값만 제공되고 왜 그런 결과가 나왔는지 근거가 없어 담당자가 신뢰하기 어려웠고, 이상거래가 필터링 없이 예측에 그대로 반영되어 결과 신뢰도를 떨어뜨렸습니다.",
      shortBody: [
        "예측 **근거 없이 결과값만** 제공",
        "**이상거래**가 필터링 없이 반영",
        "결과 신뢰도 저하",
      ],
      icon: "alert",
      tags: ["신뢰불가", "이상거래반영"],
      image: fintagProblemExplain,
    },
  ],
  solution: [
    {
      title: "은행 거래 기반 전처리 파이프라인",
      body: "카드·보험 등 별도 집계 대신 은행 계좌 입출금 단일 기준으로 데이터를 수집하고 Tag로 지출 성격을 분류했습니다. 내부 계좌 간 이동은 Tag로 자동 식별해 학습 데이터에서 제외하고, 순수 현금흐름만 예측에 반영되도록 정제했습니다.",
      comparison: {
        before: [
          {
            title: "은행·카드·보험 동일 지출 중복 집계",
            detail: [
              "각각 따로 집계된 거래가 **겹침**",
              "학습 데이터가 왜곡되고 **오차가 커짐**",
            ],
          },
          {
            title: "내부 계좌 간 이동이 지출로 잘못 분류",
            detail: [
              "내부이체가 **실제 지출로 잡힘**",
              "현금흐름이 **과대 집계**됨",
            ],
          },
        ],
        after: [
          {
            title: "중복 없는 단일 계좌 기반 수집",
            detail: [
              "계좌 입출금 **단일 기준**으로 전환",
              "**Tag**로 지출 성격 분류",
            ],
          },
          {
            title: "내부이체 자동 식별 후 제외",
            detail: [
              "계좌 간 이동을 Tag로 식별해 **자동 제외**",
              "**순수 현금흐름**만 예측에 반영",
            ],
          },
        ],
      },
      icon: "filter",
      image: fintagSolutionPipeline,
    },
    {
      title: "Prophet + LightGBM 잔차 보정 + 고정지출 등록",
      body: "Prophet으로 추세·계절성을 1차 예측한 뒤 LightGBM으로 Prophet이 설명하지 못한 잔차를 추가 학습시켜 오차를 줄였습니다. 급여일·카드결제일 같은 반복 패턴을 모델에 직접 등록해 예측 안정성과 정밀도를 더 끌어올렸습니다.",
      comparison: {
        before: [
          {
            title: "단독 모델의 한계",
            detail: [
              "기존의 단독 모델 구조는 설명하지 못하던 **사각 지대**가 존재",
              "평균 오차(MAPE) **9.6%(30일)~23.5%(365일)**",
            ],
          },
          {
            title: "트렌드만 학습, 세밀한 패턴 반영 불가",
            detail: [
              "고정지출·반복 패턴을 **노이즈로 처리**",
              "예측 정밀도에 **구조적 한계**",
            ],
          },
        ],
        after: [
          {
            title: "잔차 보정 모델 추가",
            detail: [
              "복합 모델 구조로 확장하여 **잔차(오차)를 보정**",
              "평균 오차 **7.4%(30일)~22.8%(365일)**로 개선",
            ],
          },
          {
            title: "고정지출 패턴 명시 등록",
            detail: [
              "급여일·카드결제일 패턴을 모델에 **직접 등록**",
              "트렌드 외 **세밀한 패턴**까지 반영",
            ],
          },
        ],
      },
      icon: "layers",
      images: [
        fintagSolutionAccuracyStep1,
        fintagSolutionAccuracyStep2,
        fintagSolutionAccuracyStep3,
      ],
    },
    {
      title: "SHAP·LLM 기반 예측 설명 및 이상거래 탐지",
      body: "LightGBM 예측 기여도를 SHAP으로 분석하고, AWS Bedrock(Claude 3)으로 예측 근거와 이상거래 의심 사유를 자연어로 생성했습니다. 규칙 기반 탐지와 IsolationForest·PyOD ECOD를 결합해 이상거래를 식별하고, 담당자가 근거를 확인한 뒤 선택적으로 제거할 수 있게 했습니다.",
      comparison: {
        before: [
          {
            title: "예측값만 있고 근거 설명이 없음",
            detail: [
              "숫자만 제공되고 **설명이 없음**",
              "담당자가 결과를 **신뢰하기 어려움**",
            ],
          },
          {
            title: "이상거래가 예측에 그대로 반영",
            detail: [
              "비정상 거래가 **걸러지지 않음**",
              "예측값 **신뢰도가 떨어짐**",
            ],
          },
        ],
        after: [
          {
            title: "예측 근거를 항목별로 시각화",
            detail: [
              "영향을 준 항목을 **순위별로 시각화**",
              "담당자가 **근거를 확인**하고 판단",
            ],
          },
          {
            title: "이상거래를 식별해 선택적으로 제거",
            detail: [
              "규칙과 ML 기반으로 **비정상 거래 색출**",
              "사용자가 **직접 제거** 가능",
            ],
          },
        ],
      },
      icon: "sparkle",
      images: [fintagSolutionExplainShap, fintagSolutionExplainAnomaly],
      // 두 이미지 모두 이미 자체 흐름 화살표가 그려진 독립된 다이어그램
      // (예측 설명 vs 이상거래 탐지)이라, 우리 쪽에서 그 사이에 인과
      // 관계를 암시하는 화살표를 추가로 그리지 않는다
      imagesShowArrows: false,
    },
  ],
  outcome: [
    { stat: "76%", label: "평균 예측 오차율(MAPE) 감소", icon: "trend-down" },
    {
      stat: "3단계",
      label: "Prophet·LightGBM·고정지출 파이프라인",
      icon: "layers",
    },
    {
      stat: "SHAP+LLM",
      label: "예측 근거 자연어 설명 기능",
      icon: "sparkle",
    },
  ],
  outcomeImage: fintagOutcomeChart,
  outcomeGallery: [
    {
      title: "데이터 전처리 부재 → 해결",
      body: "",
      shortBody: [
        "은행 거래만 선별해 **단일 기준**으로 정제",
        "중복 집계·내부 계좌 이동 **자동 필터링** 완료",
        "정제된 시계열 데이터로 변환 완료",
      ],
      tags: ["단일계좌기준", "Tag분류"],
      image: fintagOutcomePreprocessing,
    },
    {
      title: "예측 정확도 부족 → 해결",
      body: "",
      shortBody: [
        "급여일·카드결제일 등 **고정지출 패턴 등록** 완료",
        "잔차 보정으로 **안정적인 예측** 추세 확보",
        "평균 예측 오차율(MAPE) **76% 감소**",
      ],
      tags: ["잔차보정", "고정지출등록"],
      image: fintagOutcomeAccuracy,
    },
    {
      title: "예측 설명 부재 → 해결",
      body: "",
      shortBody: [
        "예측 근거를 **자연어로 설명**",
        "매출·지출 변동 요인을 **순위별로 제시**",
        "담당자가 근거를 확인한 뒤 신뢰 가능",
      ],
      tags: ["SHAP", "Bedrock"],
      image: fintagOutcomeExplain,
    },
  ],
  tech: [
    { category: "Backend", items: ["Python", "FastAPI", "PostgreSQL"] },
    {
      category: "ML",
      items: ["Prophet", "LightGBM", "SHAP", "Isolation Forest", "PyOD ECOD"],
    },
    {
      category: "AI",
      items: ["AWS Bedrock (Claude 3)", "Prompt Engineering"],
    },
    { category: "Infra", items: ["AWS EC2", "AWS Lambda", "Amazon RDS"] },
  ],
  stackDiagram: fintagStackArchitecture,
}
