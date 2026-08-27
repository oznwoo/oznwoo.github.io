import type { ProjectAccent } from "@/lib/color"
import { hexToRgba, mixWithWhite } from "@/lib/color"
import type { Vec2 } from "@/lib/vec2"

export function GradientBackground({
  progress,
  page,
  warping,
  rotation,
  accentSlots,
  activeSlot,
  accentOn,
  flashNonce,
  flashColor,
  burstOffset,
  pull,
  pulseActive,
  detailMode,
  detailSectionWarp,
  enteringDetail,
  // 두 슬롯에 색을 번갈아 담아, 호버 대상이 바로 다른 프로젝트로 바뀌어도
  // (A 색 슬롯이 빠지는 동안 B 색 슬롯이 들어오며) 실제로 색이 섞여 보이는
  // 크로스페이드가 일어나게 한다 — 하나의 배경에 색만 스냅되는 것을 방지.
  // 미호버 → 호버로 처음 진입할 때마다 1씩 증가 — 값이 바뀔 때마다 웜프 버스트를
  // remount시켜 페이지 전환과 같은 버스트 애니메이션을 프로젝트 색으로 재생한다.
  // 버스트가 매번 다른 지점에서 퍼지도록 살짝 흔드는 무작위 오프셋(vw/vh).
  // 호버 중인 카드의 사분면 방향으로 blob을 밀어 위치 자체도 반응하게 한다.
  // 호버 대상이 바뀔 때마다 짧게 튕기며 "살아있는" 느낌을 주는 펄스.
  // 상세 페이지에서는 이 색이 잠깐의 호버가 아니라 계속 떠 있는 배경이라,
  // 리스트 호버와 같은 강도면 텍스트 가독성을 해친다 — blob 강도를 낮추고
  // 대신 전체 wash를 살짝 올려 "너무 하얗지도, 너무 진하지도 않게" 만든다.
  // 상세 페이지에 진입/퇴장하는 가로 슬라이드는 웜프 버스트 없이 조용히
  // 넘어가지만, 상세 내부에서 섹션을 넘기는 세로 슬라이드는 메인 페이지
  // 전환과 동일한 버스트를 재생해야 한다 — 이 플래그가 그 경우만 구분한다.
  // 리스트에서 상세로 가로 슬라이드가 진행되는 동안(detailMode가 늦게 켜지기
  // 전까지) true. 이 동안은 리스트 호버 강도의 blob이 카드와 상관없이 화면에
  // 그대로 떠 있으면 어색하므로 blob 자체를 꺼서 자연스럽게 페이드아웃시키고,
  // 슬라이드가 끝나 detailMode가 켜지면 그 자리에서 프로젝트 색으로 다시
  // 페이드인한다.
}: {
  progress: number
  page: number
  warping: boolean
  rotation: number
  accentSlots: [ProjectAccent, ProjectAccent]
  activeSlot: 0 | 1
  accentOn: boolean
  flashNonce: number
  flashColor: string
  burstOffset: Vec2
  pull: Vec2
  pulseActive: boolean
  detailMode: boolean
  detailSectionWarp: boolean
  enteringDetail: boolean
}) {
  const p = progress
  // 상세 페이지는 blob 아래 깔리는 "바탕"이 메인 페이지와 같은 라벤더 톤이면
  // blob과 무관하게 화면 전체가 뿌옇게(washed-out) 보인다. blob 그라디언트
  // 자체(아래 gradient-blob-a/b/c, renderAccentSlots)는 건드리지 않고, 그
  // 아래 깔리는 고정 바탕색만 거의 흰색에 가깝게 낮춘다.
  const baseBackground = detailMode ? "#F5F6FA" : "#EEF1F9"

  const pulseTransition = pulseActive
    ? "scale 0.16s cubic-bezier(0.34,1.56,0.64,1), translate 0.5s cubic-bezier(0.22,1,0.36,1)"
    : "scale 0.45s cubic-bezier(0.22,1,0.36,1), translate 0.5s cubic-bezier(0.22,1,0.36,1)"
  const pulseScale = pulseActive ? 1.1 : 1

  // 슬롯별 crossfade 오버레이 두 장을 렌더링하는 헬퍼. alpha/targetOpacity/전환
  // 속도는 blob마다 달라 인자로 받는다.
  function renderAccentSlots(
    blobIndex: 0 | 1 | 2,
    alpha: number,
    targetOpacity: number,
    inMs: number,
    outMs: number,
  ) {
    return [0, 1].map((slot) => {
      const isVisible = accentOn && activeSlot === slot && !enteringDetail
      // 상세 페이지는 메인 페이지의 파랑 앰비언트 base를 꺼둔 상태라(위 background:
      // detailMode ? "transparent" 참고) 이 색이 화면에 남는 유일한 색이다.
      // 흰색을 과하게 섞으면 파스텔로 washed-out돼 위에 얹히는 저채도 텍스트와
      // 명도 대비가 부족해지므로, 그라디언트 자체의 커버리지(effectiveAlpha)는
      // 그대로 두고 색 톤만 조금 더 짙게 유지한다.
      const color = detailMode
        ? mixWithWhite(accentSlots[slot].blobs[blobIndex], 0.42)
        : accentSlots[slot].blobs[blobIndex]
      // 배경 밝기(위 흰색 혼합 비율)는 그대로 두고, 그라디언트 자체의 존재감만
      // alpha(커버리지)를 살짝 올려서 더 뚜렷하게 만든다 — 메인 페이지 호버 강도에는
      // 영향을 주지 않도록 detailMode일 때만 적용한다.
      const effectiveAlpha = detailMode ? Math.min(1, alpha * 1.35) : alpha
      return (
        <div
          key={slot}
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(ellipse at center, ${hexToRgba(
              color,
              effectiveAlpha,
            )} 0%, transparent ${blobIndex === 2 ? 65 : 70}%)`,
            opacity: isVisible ? targetOpacity : 0,
            // background(색 자체)도 함께 트랜지션시켜, 상세 페이지 진입 슬라이드가
            // 끝난 뒤 detailMode가 늦게 켜질 때 색이 툭 바뀌지 않고 서서히 옅어지듯
            // 바뀌게 한다.
            transition: isVisible
              ? `opacity ${inMs}ms ease-out, background 0.6s ease`
              : `opacity ${outMs}ms ease-in, background 0.6s ease`,
          }}
        />
      )
    })
  }

  // 페이지 슬라이드(0.75s)와 정확히 같은 속도로 튕기듯 크게 움직였다가,
  // 워프가 끝나면 훨씬 느린 이징으로 가라앉는다.
  const warpEase = "cubic-bezier(0.34,1.56,0.64,1)"
  const settleEase = "cubic-bezier(0.22,1,0.36,1)"
  const SLIDE_S = "0.75s"

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ background: baseBackground }}
    >
      {/* 프로젝트 호버 시 캔버스 바탕색 자체도 브랜드 컬러 쪽으로 은은하게 물든다.
          blob과 별개로 회전 wrapper 바깥에 둬서 화면 전체가 고르게 톤이 바뀐다.
          여기도 두 슬롯을 겹쳐 크로스페이드시켜 호버 대상이 바로 바뀌어도
          이전 색에서 다음 색으로 자연스럽게 섞이며 넘어가게 한다 */}
      {[0, 1].map((slot) => {
        const isVisible = accentOn && activeSlot === slot && !enteringDetail
        return (
          <div
            key={slot}
            className="absolute inset-0"
            style={{
              backgroundColor: accentSlots[slot].primary,
              // 상세 페이지는 이 바탕색 wash가 blob과 무관하게 화면 전체를
              // 계속 물들이고 있어(리스트 호버보다 더 진했음) 뿌옇게 보이는
              // 주 원인이었다 — blob 강도는 그대로 두고 이 wash만 낮춘다.
              opacity: isVisible ? (detailMode ? 0.045 : 0.09) : 0,
              transition: isVisible
                ? "opacity 0.3s ease-out"
                : "opacity 0.7s ease-in",
            }}
          />
        )
      })}
      {/* 전환마다 화면 중앙을 기준으로 조금씩 더 돌아간다(아래로 이동=시계, 위로 이동=반시계)
          — 되돌아오지 않고 누적된 각도에 머무른 채 강조색만 자연스럽게 옅어진다.
          프로젝트 호버가 처음 시작될 때도 같은 회전을 쓰되, 이번엔 방향 없이
          무작위 각도로 돌아 페이지 전환과는 다른 우발적인 움직임을 준다 */}
      <div
        className="absolute inset-0"
        style={{
          rotate: `${rotation}deg`,
          transition: `rotate ${SLIDE_S} ${warpEase}`,
        }}
      >
        <div
          key={`page-${page}`}
          className="gradient-warp-burst absolute rounded-full"
          style={{
            width: "42vw",
            height: "42vw",
            top: "50%",
            left: "50%",
            marginTop: "-21vw",
            marginLeft: "-21vw",
            background:
              "radial-gradient(circle, rgba(79,110,247,0.32) 0%, rgba(79,110,247,0) 70%)",
          }}
        />
        {/* 미호버 → 호버로 처음 진입하는 순간에만 재생되는 버스트 — 페이지 전환의
            웜프 버스트를 그대로 재사용하되 프로젝트 색으로 물들이고, 매번 중심
            위치를 살짝 무작위로 흔들어 퍼지는 느낌을 다양하게 준다 */}
        {flashNonce > 0 && (
          <div
            key={`hover-${flashNonce}`}
            className="gradient-warp-burst absolute rounded-full"
            style={{
              width: "46vw",
              height: "46vw",
              top: "50%",
              left: "50%",
              marginTop: `calc(-23vw + ${burstOffset.y}vh)`,
              marginLeft: `calc(-23vw + ${burstOffset.x}vw)`,
              background: `radial-gradient(circle, ${hexToRgba(flashColor, 0.7)} 0%, ${hexToRgba(flashColor, 0)} 70%)`,
            }}
          />
        )}
        <div
          className="gradient-blob-a absolute"
          style={{
            // 상세 페이지도 크기/블러("형태")는 메인 페이지와 동일하게 유지한다 —
            // 예전엔 detailMode에서 면적을 줄였는데, 단색 accent(blobs 3개가
            // 같은 색인) 프로젝트는 반경이 줄면서 blob끼리 덜 겹쳐 프로젝트마다
            // 보이는 blob 개수가 들쭉날쭉해 보이는 문제가 있었다. 색(아래 accent
            // 믹스·알파)만 상세 페이지에서 다르게 하고 형태는 항상 통일한다.
            width: "70vw",
            height: "70vw",
            top: "-20%",
            left: "-15%",
            translate: `${p * -16}vw ${p * 26}vh`,
            // 상세 페이지는 이미 카드 콘텐츠가 많아 전환마다 blob이 크게
            // 튀면 정신없어 보인다 — 형태(크기)는 메인과 같이 두되, 전환
            // 순간의 확대 폭만 훨씬 약하게 낮춘다.
            scale: warping ? (detailMode ? 1.02 : 1.16) : 1,
            borderRadius: "50%",
            // 상세 페이지(detailMode)뿐 아니라 상세로 넘어가는 슬라이드 도중
            // (enteringDetail)에도 이 메인 파란/보라 앰비언트 base를 꺼서, 슬라이드
            // 내내 이 blob이 카드와 무관하게 떠 있지 않고 다른 blob들과 함께 자연스럽게
            // 페이드아웃되게 한다. "transparent" 키워드 대신 같은 그래디언트에서
            // alpha만 0으로 낮춰, 값이 바뀔 때 background가 매끄럽게 트랜지션되게
            // 한다("transparent" ↔ 그래디언트는 매끄럽게 보간되지 않는다).
            background: `radial-gradient(ellipse at center, rgba(199,210,254,${
              detailMode || enteringDetail ? 0 : 0.8
            }) 0%, transparent 70%)`,
            filter: warping
              ? detailMode
                ? "blur(43px)"
                : "blur(58px)"
              : "blur(40px)",
            transition:
              (warping
                ? `translate ${SLIDE_S} ${warpEase}, scale 0.5s ${warpEase}, filter 0.35s ease-out`
                : `translate 0.5s ${settleEase}, scale 0.6s ${settleEase}, filter 0.6s ease-out`) +
              ", background 0.6s ease",
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              // detailSectionWarp가 아니라 detailMode로 색을 고른다 — detailSectionWarp는
              // warping과 같은 타이밍(750ms)에 꺼지는데, opacity는 그 뒤로도 0.55s에 걸쳐
              // 서서히 페이드아웃된다. detailSectionWarp로 갈랐다면 opacity가 아직 다 안
              // 꺼진 상태에서 배경색만 먼저 파란색으로 툭 바뀌어 보이는 문제가 생긴다.
              // detailMode는 상세 페이지에 머무는 동안 계속 true이므로 페이드아웃 내내
              // 프로젝트 색을 유지한다.
              // 전환 플래시도 흰색을 섞어 채도를 낮춘다(기존 persistent
              // glow에 쓰는 mixWithWhite와 같은 비율) — 순색 그대로면 전환마다
              // 너무 쨍하게 튄다.
              background: detailMode
                ? `radial-gradient(circle at 28% 32%, ${hexToRgba(mixWithWhite(accentSlots[activeSlot].blobs[0], 0.55), 0.9)} 0%, ${hexToRgba(mixWithWhite(accentSlots[activeSlot].blobs[0], 0.55), 0.25)} 42%, transparent 70%)`
                : "radial-gradient(circle at 28% 32%, rgba(79,110,247,0.9) 0%, rgba(79,110,247,0.25) 42%, transparent 70%)",
              opacity:
                warping && (!detailMode || detailSectionWarp)
                  ? detailMode
                    ? 0.14
                    : 0.65
                  : 0,
              transition: warping
                ? "opacity 0.16s ease-out"
                : "opacity 0.55s ease-in",
            }}
          />
          {/* 프로젝트 카드 호버 시 브랜드 컬러로 완전히 갈아치움 — base blob과 동일한
              falloff로 덮어써서 밑에 깔린 파란/보라가 비쳐 보이지 않게 한다.
              pull/pulse 래퍼로 감싸서 호버할 때마다 위치가 밀리고 튕기며
              들어오게 한다 */}
          <div
            className="absolute inset-0"
            style={{
              translate: `${pull.x * 5}vw ${pull.y * 5}vh`,
              scale: pulseScale,
              transition: pulseTransition,
            }}
          >
            {renderAccentSlots(0, 0.6, 0.75, 300, 600)}
          </div>
        </div>
        <div
          className="gradient-blob-b absolute"
          style={{
            width: "60vw",
            height: "60vw",
            bottom: "-10%",
            right: "-10%",
            translate: `${p * 13}vw ${p * -19}vh`,
            scale: warping ? (detailMode ? 1.016 : 1.11) : 1,
            borderRadius: "50%",
            background: `radial-gradient(ellipse at center, rgba(165,180,252,${
              detailMode || enteringDetail ? 0 : 0.7
            }) 0%, transparent 70%)`,
            filter: warping
              ? detailMode
                ? "blur(49px)"
                : "blur(64px)"
              : "blur(46px)",
            transition:
              (warping
                ? `translate ${SLIDE_S} ${warpEase}, scale 0.55s ${warpEase}, filter 0.35s ease-out`
                : `translate 0.65s ${settleEase}, scale 0.65s ${settleEase}, filter 0.65s ease-out`) +
              ", background 0.6s ease",
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: detailMode
                ? `radial-gradient(circle at 72% 30%, ${hexToRgba(mixWithWhite(accentSlots[activeSlot].blobs[1], 0.55), 0.85)} 0%, ${hexToRgba(mixWithWhite(accentSlots[activeSlot].blobs[1], 0.55), 0.22)} 42%, transparent 70%)`
                : "radial-gradient(circle at 72% 30%, rgba(67,93,235,0.85) 0%, rgba(67,93,235,0.22) 42%, transparent 70%)",
              opacity:
                warping && (!detailMode || detailSectionWarp)
                  ? detailMode
                    ? 0.12
                    : 0.6
                  : 0,
              transition: warping
                ? "opacity 0.2s ease-out"
                : "opacity 0.6s ease-in",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              translate: `${pull.x * -4}vw ${pull.y * -4}vh`,
              scale: pulseScale,
              transition: pulseTransition,
            }}
          >
            {renderAccentSlots(1, 0.5, 0.65, 340, 650)}
          </div>
        </div>
        <div
          className="gradient-blob-c absolute"
          style={{
            width: "55vw",
            height: "55vw",
            top: "30%",
            left: "28%",
            translate: `${p * -9}vw ${p * 13}vh`,
            scale: warping ? (detailMode ? 1.02 : 1.19) : 1,
            borderRadius: "50%",
            background: `radial-gradient(ellipse at center, rgba(224,231,255,${
              detailMode || enteringDetail ? 0 : 0.62
            }) 0%, transparent 65%)`,
            filter: warping
              ? detailMode
                ? "blur(57px)"
                : "blur(70px)"
              : "blur(54px)",
            transition:
              (warping
                ? `translate ${SLIDE_S} ${warpEase}, scale 0.6s ${warpEase}, filter 0.35s ease-out`
                : `translate 0.8s ${settleEase}, scale 0.7s ${settleEase}, filter 0.7s ease-out`) +
              ", background 0.6s ease",
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: detailMode
                ? `radial-gradient(ellipse at center, ${hexToRgba(mixWithWhite(accentSlots[activeSlot].blobs[2], 0.55), 0.6)} 0%, transparent 65%)`
                : "radial-gradient(ellipse at center, rgba(124,95,212,0.6) 0%, transparent 65%)",
              opacity:
                warping && (!detailMode || detailSectionWarp)
                  ? detailMode
                    ? 0.1
                    : 0.55
                  : 0,
              transition: warping
                ? "opacity 0.24s ease-out"
                : "opacity 0.65s ease-in",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              translate: `${pull.x * 3}vw ${pull.y * 6}vh`,
              scale: pulseScale,
              transition: pulseTransition,
            }}
          >
            {renderAccentSlots(2, 0.42, 0.55, 400, 700)}
          </div>
        </div>
      </div>
    </div>
  )
}
