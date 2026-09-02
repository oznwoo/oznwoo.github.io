import { useState } from "react"
import { Page } from "@/components/layout/Page"
import { useIsMobile } from "@/hooks/useIsMobile"
import { Reveal } from "@/components/ui/Reveal"
import { useSlideReveal } from "@/hooks/useSlideReveal"

export function PageContact({ isActive = true }: { isActive?: boolean }) {
  const isMobile = useIsMobile()
  const [status, setStatus] = useState<"idle" | "sent">("idle")
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  // 페이지 전환이 끝나면 왼쪽(소개·연락처) → 오른쪽(폼)이 차례로 나타난다.
  // 섹션 라벨과 헤드라인은 고정.
  const leftRevealed = useSlideReveal(isActive)
  const formRevealed = useSlideReveal(isActive, 880)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sent")
  }

  const inputCls =
    "w-full rounded-xl px-3 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm text-[#0C0F1A] placeholder-[#0C0F1A]/20 focus:outline-none transition-all duration-200"
  const inputStyle = {
    fontFamily: "var(--font-body)",
    background: "rgba(255,255,255,0.45)",
    border: "1px solid rgba(12,15,26,0.08)",
  }
  const focusStyle = "focus:bg-white/70 focus:border-[#4F6EF7]/30"

  return (
    <Page>
      <div className="grid md:grid-cols-2 gap-6 items-start md:gap-14">
        <div>
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-xs text-[#0C0F1A]/45 tracking-[0.04em] uppercase"
          >
            Contact
          </span>
          <h2
            style={{ fontFamily: "var(--font-display)", lineHeight: 1.3 }}
            className="text-[clamp(1.5rem,6vw,3rem)] font-light text-[#0C0F1A] mt-2"
          >
            <span>함께</span>
            <br />
            <span className="font-semibold">만들어봐요.</span>
          </h2>
          <Reveal show={leftRevealed}>
          <p
            style={{ fontFamily: "var(--font-body)" }}
            className="hidden mt-5 text-[#0C0F1A]/60 font-normal text-sm leading-loose max-w-xs sm:block"
          >
            풀타임 포지션, 프리랜스, 사이드 프로젝트 등 다양한 기회에 열려
            있습니다.
          </p>
          <div className="mt-3 space-y-1.5 sm:mt-8 sm:space-y-3">
            {[
              { label: "Email", value: "luvmoire@gmail.com" },
              { label: "GitHub", value: "github.com/oznwoo" },
              { label: "Phone", value: "010-5115-7895" },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-5 items-center">
                <span
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="text-[10px] text-[#0C0F1A]/45 uppercase tracking-[0.04em] w-14 shrink-0"
                >
                  {label}
                </span>
                <span
                  style={{ fontFamily: "var(--font-body)" }}
                  className="text-xs text-[#0C0F1A]/65 font-normal sm:text-sm"
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
          </Reveal>
        </div>

        <Reveal show={formRevealed}>
          {status === "sent" ? (
            <div
              className="rounded-2xl p-6 text-center sm:p-10"
              style={{
                background: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(79,110,247,0.15)",
              }}
            >
              <div
                style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                className="text-lg text-[#0C0F1A]"
              >
                메시지가 전송됐습니다.
              </div>
              <p
                style={{ fontFamily: "var(--font-body)" }}
                className="mt-3 text-sm text-[#0C0F1A]/60 font-normal"
              >
                빠른 시일 내에 답장 드리겠습니다.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
              {[
                {
                  id: "name",
                  label: "이름",
                  type: "text",
                  placeholder: "홍길동",
                },
                {
                  id: "email",
                  label: "Email",
                  type: "email",
                  placeholder: "you@example.com",
                },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id}>
                  <label
                    htmlFor={id}
                    style={{ fontFamily: "var(--font-mono)" }}
                    className="block text-[10px] text-[#0C0F1A]/45 uppercase tracking-[0.04em] mb-1.5"
                  >
                    {label}
                  </label>
                  <input
                    id={id}
                    type={type}
                    required
                    placeholder={placeholder}
                    value={form[(id as keyof typeof form)]}
                    onChange={(e) => setForm({ ...form, [id]: e.target.value })}
                    className={`${inputCls} ${focusStyle}`}
                    style={inputStyle}
                  />
                </div>
              ))}
              <div>
                <label
                  htmlFor="message"
                  style={{ fontFamily: "var(--font-mono)" }}
                  className="block text-[10px] text-[#0C0F1A]/45 uppercase tracking-[0.04em] mb-1.5"
                >
                  메시지
                </label>
                <textarea
                  id="message"
                  required
                  rows={isMobile ? 2 : 4}
                  placeholder="어떤 프로젝트인가요?"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className={`${inputCls} ${focusStyle} resize-none`}
                  style={inputStyle}
                />
              </div>
              <button
                type="submit"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  background: "#0C0F1A",
                }}
                className="w-full rounded-xl py-2.5 text-xs sm:py-3.5 sm:text-sm text-white transition-all duration-300 active:scale-[0.98]"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#4F6EF7")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#0C0F1A")
                }
              >
                보내기
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </Page>
  )
}
