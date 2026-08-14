import { useState, useEffect, useRef, useCallback } from 'react'
import profilePhoto from '@/imports/____________________.jpeg'
import logoImg from '@/imports/______________.png'

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = ['Intro', 'About', 'Projects', 'Skills', 'Experience', 'Contact']

const PROJECTS = [
  {
    id: '01',
    title: 'Fintag',
    subtitle: '중소기업 자금 관리 에이전트',
    description: '유휴 자금 감지 및 수익화 제안 SaaS. 복합 모델 구조로 고도화해 예측 오차율 67% 감소.',
    tags: ['Python', 'FastAPI', 'ML'],
    year: '2026',
    link: 'https://github.com/oznwoo',
  },
  {
    id: '02',
    title: 'CoChat for Business',
    subtitle: 'B2B 메신저 통합 플랫폼',
    description: '업무 알림을 AI가 긴급도 분류하는 SaaS. 6인 팀 리더, Slack·Discord 연동 구현.',
    tags: ['Fullstack', 'AI', 'SaaS'],
    year: '2026',
    link: 'https://github.com/oznwoo',
  },
  {
    id: '03',
    title: 'Gopssl',
    subtitle: '미용실 매출·고객 관리 앱',
    description: '기획·디자인·개발 전 과정 단독 진행. 2025년 8월부터 실사용자가 실제로 사용 중.',
    tags: ['Flutter', 'Mobile'],
    year: '2025',
    link: 'https://github.com/oznwoo',
  },
  {
    id: '04',
    title: 'CoChat',
    subtitle: '메신저 통합 플랫폼',
    description: '다양한 메신저 알림 필터링·요약 앱. KIPS 정보처리학회 학술대회 논문 발표.',
    tags: ['Mobile', 'AI', 'NLP'],
    year: '2024',
    link: 'https://github.com/oznwoo',
  },
]

const SKILLS = [
  { category: 'Languages', items: ['Python', 'TypeScript', 'JavaScript', 'Dart'] },
  { category: 'Frontend', items: ['React', 'Next.js', 'Flutter', 'Tailwind CSS'] },
  { category: 'Backend', items: ['FastAPI', 'Node.js', 'REST API', 'PostgreSQL'] },
  { category: 'AI / ML', items: ['LLM Integration', '예측 모델링', 'SHAP / LIME', 'RAG'] },
]

const EXP_COLS = [
  {
    title: '활동',
    items: [
      { name: '구름 DEEP DIVE 해커톤', sub: 'CoChat for Business 팀 리더', date: '2026.04' },
      { name: 'KIPS 종합학술대회', sub: 'CoChat 논문 발표', date: '2025.05' },
    ],
  },
  {
    title: '교육',
    items: [
      { name: '핀테크 인턴십 코스 4기', sub: '풀스택 과정 수료', date: '2025.12 – 2026.06' },
      { name: '한양대학교 ERICA', sub: '컴퓨터전공 졸업 · GPA 4.22 / 4.5', date: '2020 – 2026' },
    ],
  },
  {
    title: '자격증',
    items: [
      { name: '정보처리기사', sub: '한국산업인력공단', date: '2026.09' },
      { name: 'GTQ 1급', sub: '한국생산성본부', date: '2024.09' },
    ],
  },
]

// ─── Gradient Background ──────────────────────────────────────────────────────

function GradientBackground({ page, total }: { page: number; total: number }) {
  const p = total > 1 ? page / (total - 1) : 0

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ background: '#EEF1F9' }}
    >
      <div
        className="gradient-blob-a absolute"
        style={{
          width: '70vw', height: '70vw',
          top: '-20%', left: '-15%',
          translate: `${p * -10}vw ${p * 16}vh`,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(199,210,254,0.65) 0%, transparent 70%)',
          filter: 'blur(48px)',
          transition: 'translate 0.9s cubic-bezier(0.4,0,0.2,1)',
        }}
      />
      <div
        className="gradient-blob-b absolute"
        style={{
          width: '60vw', height: '60vw',
          bottom: '-10%', right: '-10%',
          translate: `${p * 8}vw ${p * -12}vh`,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(165,180,252,0.55) 0%, transparent 70%)',
          filter: 'blur(56px)',
          transition: 'translate 0.9s cubic-bezier(0.4,0,0.2,1)',
        }}
      />
      <div
        className="gradient-blob-c absolute"
        style={{
          width: '55vw', height: '55vw',
          top: '30%', left: '28%',
          translate: `${p * -5}vw ${p * 8}vh`,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(224,231,255,0.5) 0%, transparent 65%)',
          filter: 'blur(64px)',
          transition: 'translate 1.1s cubic-bezier(0.4,0,0.2,1)',
        }}
      />
    </div>
  )
}

// ─── Dot Nav ──────────────────────────────────────────────────────────────────

function DotNav({ current, total, onChange }: { current: number; total: number; onChange: (i: number) => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <nav
      aria-label="페이지 이동"
      className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-start"
      style={{ gap: '10px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 로고 — Intro 페이지 dot 역할 */}
      <button onClick={() => onChange(0)} className="flex items-center gap-2.5 shrink-0" aria-label="Intro" style={{ height: '20px' }}>
        <img
          src={logoImg}
          alt="홈"
          style={{
            width: '24px',
            height: '24px',
            objectFit: 'contain',
            opacity: current === 0 ? 0.75 : 0.22,
            transition: 'opacity 0.3s',
            flexShrink: 0,
            marginTop: '-2px',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            opacity: current === 0 ? 0.65 : hovered ? 0.3 : 0,
            color: '#0C0F1A',
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            transition: 'opacity 0.25s',
            fontWeight: current === 0 ? 500 : 400,
            whiteSpace: 'nowrap',
          }}
        >
          {SECTIONS[0]}
        </span>
      </button>

      {/* 나머지 섹션 dot */}
      {Array.from({ length: total - 1 }).map((_, idx) => {
        const i = idx + 1
        return (
          <button
            key={i}
            onClick={() => onChange(i)}
            aria-label={SECTIONS[i]}
            className="flex items-center gap-2.5 shrink-0"
            style={{ height: '20px' }}
          >
            <span className="flex items-center shrink-0" style={{ width: '24px', height: '20px' }}>
              <span
                className="block rounded-full transition-all duration-300"
                style={{
                  width: i === current ? '20px' : '6px',
                  height: '6px',
                  background: i === current ? '#4F6EF7' : 'rgba(12,15,26,0.22)',
                }}
              />
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                opacity: i === current ? 0.65 : hovered ? 0.3 : 0,
                color: '#0C0F1A',
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase' as const,
                transition: 'opacity 0.25s',
                fontWeight: i === current ? 500 : 400,
                whiteSpace: 'nowrap',
              }}
            >
              {SECTIONS[i]}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

// ─── Top Nav ──────────────────────────────────────────────────────────────────


// ─── Section wrapper ──────────────────────────────────────────────────────────

function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full flex items-center justify-center pr-6 md:pr-12 shrink-0"
      style={{ paddingLeft: 'calc(1.5rem + 140px)' }}
    >
      <div className="w-full max-w-5xl">{children}</div>
    </div>
  )
}

// ─── Pages ────────────────────────────────────────────────────────────────────

function PageIntro({ goTo }: { goTo: (i: number) => void }) {
  return (
    <Page>
      <div className="flex flex-col gap-8">
        <span style={{ fontFamily: 'var(--font-mono)' }} className="text-xs text-[#0C0F1A]/30 tracking-widest uppercase">
          Fullstack Developer
        </span>
        <h1
          style={{ fontFamily: 'var(--font-display)', lineHeight: 1.15 }}
          className="text-[clamp(3rem,8vw,6.5rem)] font-light tracking-tight text-[#0C0F1A]"
        >
          아이디어를
          <br />
          <span className="font-semibold">현실로 만듭니다.</span>
        </h1>
        <div className="border-t border-[#0C0F1A]/10 pt-7 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <p style={{ fontFamily: 'var(--font-body)' }} className="max-w-sm text-[#0C0F1A]/45 text-base leading-loose font-light">
            오진우 — 과정을 중시하되 결과로 증명합니다.
            <br />AI를 활용해 아이디어를 빠르게 현실화합니다.
          </p>
          <div className="flex items-center gap-8 shrink-0">
            {[
              { label: 'GitHub', href: 'https://github.com/oznwoo' },
              { label: 'Portfolio', href: 'https://oznwoo.github.io' },
              { label: 'Email', href: 'mailto:luvmoire@gmail.com' },
            ].map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer"
                style={{ fontFamily: 'var(--font-mono)' }}
                className="text-xs text-[#0C0F1A]/30 hover:text-[#0C0F1A] transition-colors uppercase tracking-wider"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#4F6EF7] animate-pulse" />
          <span style={{ fontFamily: 'var(--font-mono)' }} className="text-xs text-[#0C0F1A]/30">
            적극적으로 기회를 찾고 있습니다
          </span>
        </div>
        <button
          onClick={() => goTo(1)}
          style={{ fontFamily: 'var(--font-mono)' }}
          className="self-start text-xs text-[#0C0F1A]/30 hover:text-[#0C0F1A] transition-colors uppercase tracking-widest mt-2"
        >
          아래로 ↓
        </button>
      </div>
    </Page>
  )
}

function PageAbout() {
  return (
    <Page>
      <div className="grid md:grid-cols-[180px_1fr] gap-12 items-center">
        <div className="bg-[#D8DDE8] overflow-hidden" style={{ aspectRatio: '3/4' }}>
          <img src={profilePhoto} alt="오진우" className="w-full h-full object-cover object-top" />
        </div>
        <div>
          <span style={{ fontFamily: 'var(--font-mono)' }} className="text-xs text-[#0C0F1A]/25 tracking-widest uppercase">
            00 — About
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', lineHeight: 1.3 }}
            className="text-[clamp(1.6rem,3.5vw,2.8rem)] font-light text-[#0C0F1A] mt-3 mb-6"
          >
            다양한 관점,
            <br /><span className="font-semibold">실용적인 코드.</span>
          </h2>
          <div style={{ fontFamily: 'var(--font-body)' }} className="space-y-3 text-[#0C0F1A]/50 font-light text-sm leading-loose max-w-lg">
            <p>한양대 ERICA 컴퓨터전공 졸업 (GPA 4.22 / 4.5), 핀테크 인턴십 풀스택 과정 수료.</p>
            <p>문제를 발견하면 직접 만들어 해결합니다. 어머니 미용실 앱을 혼자 설계·개발해 실서비스로, 메신저 통합 문제를 논문으로 발표한 뒤 B2B SaaS로 발전시켰습니다.</p>
            <p>AI를 단순 도구가 아닌 제품의 핵심으로 녹여내는 것을 좋아합니다.</p>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-6 border-t border-[#0C0F1A]/8 pt-7">
            {[['4.22', 'GPA / 4.5'], ['4건', '주요 프로젝트'], ['1편', '학술 논문']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-semibold text-[#0C0F1A]">{n}</div>
                <div style={{ fontFamily: 'var(--font-mono)' }} className="text-xs text-[#0C0F1A]/30 uppercase tracking-wider mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  )
}

function PageProjects() {
  const [hovered, setHovered] = useState<string | null>(null)
  return (
    <Page>
      <div>
        <div className="flex items-end justify-between mb-8">
          <div>
            <span style={{ fontFamily: 'var(--font-mono)' }} className="text-xs text-[#0C0F1A]/25 tracking-widest uppercase">01 — Projects</span>
            <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-[clamp(1.4rem,3vw,2.2rem)] font-light text-[#0C0F1A] mt-1">주요 프로젝트</h2>
          </div>
          <a href="https://github.com/oznwoo" target="_blank" rel="noreferrer"
            style={{ fontFamily: 'var(--font-mono)' }}
            className="text-xs text-[#0C0F1A]/30 hover:text-[#0C0F1A] transition-colors uppercase tracking-wider"
          >GitHub →</a>
        </div>
        <div className="divide-y divide-[#0C0F1A]/8">
          {PROJECTS.map((p) => (
            <a key={p.id} href={p.link} target="_blank" rel="noreferrer"
              className="group flex items-center gap-4 py-4 no-underline"
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <span style={{ fontFamily: 'var(--font-mono)' }} className="text-xs text-[#0C0F1A]/18 w-7 shrink-0">{p.id}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: hovered === p.id ? 600 : 400 }}
                    className="text-lg text-[#0C0F1A] transition-all duration-200"
                  >{p.title}</h3>
                  <span style={{ fontFamily: 'var(--font-body)' }} className="text-xs text-[#0C0F1A]/35 font-light">{p.subtitle}</span>
                </div>
                <p style={{ fontFamily: 'var(--font-body)' }} className="text-xs text-[#0C0F1A]/40 font-light mt-0.5 leading-relaxed">{p.description}</p>
              </div>
              <div className="hidden md:flex flex-wrap gap-1.5 w-40 justify-end shrink-0">
                {p.tags.map((t) => (
                  <span key={t} style={{ fontFamily: 'var(--font-mono)' }} className="text-xs px-2 py-0.5 bg-[#0C0F1A]/5 text-[#0C0F1A]/40">{t}</span>
                ))}
              </div>
              <span style={{ fontFamily: 'var(--font-mono)' }} className="text-xs text-[#0C0F1A]/20 shrink-0 ml-1">{p.year}</span>
              <span className="text-[#0C0F1A]/15 group-hover:text-[#4F6EF7] transition-colors duration-200 shrink-0">→</span>
            </a>
          ))}
        </div>
      </div>
    </Page>
  )
}

function PageSkills() {
  return (
    <Page>
      <div>
        <span style={{ fontFamily: 'var(--font-mono)' }} className="text-xs text-[#0C0F1A]/25 tracking-widest uppercase">02 — Skills</span>
        <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-[clamp(1.4rem,3vw,2.2rem)] font-light text-[#0C0F1A] mt-1 mb-10">기술 스택</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {SKILLS.map((group) => (
            <div key={group.category}>
              <div style={{ fontFamily: 'var(--font-mono)' }} className="text-xs text-[#4F6EF7] uppercase tracking-widest mb-4">{group.category}</div>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li key={item} style={{ fontFamily: 'var(--font-body)' }} className="text-sm text-[#0C0F1A]/50 font-light">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 bg-[#0C0F1A] px-10 py-10">
          <p style={{ fontFamily: 'var(--font-display)', lineHeight: 1.5 }}
            className="text-[clamp(1.1rem,2vw,1.6rem)] font-light text-[#F0F3F9]"
          >
            "과정을 중시하되,{' '}
            <span className="font-semibold">결과로 증명합니다."</span>
          </p>
          <p style={{ fontFamily: 'var(--font-mono)' }} className="text-xs text-[#F0F3F9]/25 mt-4 uppercase tracking-wider">— 오진우</p>
        </div>
      </div>
    </Page>
  )
}

function PageExperience() {
  return (
    <Page>
      <div>
        <span style={{ fontFamily: 'var(--font-mono)' }} className="text-xs text-[#0C0F1A]/25 tracking-widest uppercase">03 — Experience</span>
        <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-[clamp(1.4rem,3vw,2.2rem)] font-light text-[#0C0F1A] mt-1 mb-10">경력 및 학력</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {EXP_COLS.map((col) => (
            <div key={col.title}>
              <div style={{ fontFamily: 'var(--font-mono)' }} className="text-xs text-[#4F6EF7] uppercase tracking-widest mb-7">{col.title}</div>
              <div className="space-y-7">
                {col.items.map((item) => (
                  <div key={item.name}>
                    <div style={{ fontFamily: 'var(--font-body)' }} className="text-sm font-medium text-[#0C0F1A]">{item.name}</div>
                    <div style={{ fontFamily: 'var(--font-body)' }} className="text-sm text-[#0C0F1A]/40 font-light mt-1 leading-relaxed">{item.sub}</div>
                    <div style={{ fontFamily: 'var(--font-mono)' }} className="text-xs text-[#0C0F1A]/22 mt-1.5">{item.date}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Page>
  )
}

function PageContact() {
  const [status, setStatus] = useState<'idle' | 'sent'>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sent')
  }

  return (
    <Page>
      <div className="grid md:grid-cols-2 gap-14 items-start">
        <div>
          <span style={{ fontFamily: 'var(--font-mono)' }} className="text-xs text-[#0C0F1A]/25 tracking-widest uppercase">04 — Contact</span>
          <h2 style={{ fontFamily: 'var(--font-display)', lineHeight: 1.3 }}
            className="text-[clamp(1.8rem,4vw,3rem)] font-light text-[#0C0F1A] mt-2"
          >
            함께<br /><span className="font-semibold">만들어봐요.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)' }} className="mt-5 text-[#0C0F1A]/40 font-light text-sm leading-loose max-w-xs">
            풀타임 포지션, 프리랜스, 사이드 프로젝트 등 다양한 기회에 열려 있습니다.
          </p>
          <div className="mt-8 space-y-3.5">
            {[
              { label: 'Email', value: 'luvmoire@gmail.com' },
              { label: 'GitHub', value: 'github.com/oznwoo' },
              { label: 'Phone', value: '010-5115-7895' },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-5 items-baseline">
                <span style={{ fontFamily: 'var(--font-mono)' }} className="text-xs text-[#0C0F1A]/25 uppercase tracking-widest w-14 shrink-0">{label}</span>
                <span style={{ fontFamily: 'var(--font-body)' }} className="text-sm text-[#0C0F1A]/55 font-light">{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          {status === 'sent' ? (
            <div className="border border-[#4F6EF7]/40 p-10 text-center">
              <div style={{ fontFamily: 'var(--font-display)' }} className="text-xl font-semibold text-[#0C0F1A]">메시지가 전송됐습니다.</div>
              <p style={{ fontFamily: 'var(--font-body)' }} className="mt-3 text-sm text-[#0C0F1A]/40 font-light">빠른 시일 내에 답장 드리겠습니다.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { id: 'name', label: '이름', type: 'text', placeholder: '홍길동' },
                { id: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id}>
                  <label htmlFor={id} style={{ fontFamily: 'var(--font-mono)' }} className="block text-xs text-[#0C0F1A]/30 uppercase tracking-widest mb-1.5">{label}</label>
                  <input id={id} type={type} required placeholder={placeholder}
                    value={form[id as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [id]: e.target.value })}
                    style={{ fontFamily: 'var(--font-body)' }}
                    className="w-full bg-transparent border border-[#0C0F1A]/10 px-4 py-2.5 text-sm text-[#0C0F1A] placeholder-[#0C0F1A]/20 focus:outline-none focus:border-[#4F6EF7]/50 transition-colors duration-200"
                  />
                </div>
              ))}
              <div>
                <label htmlFor="message" style={{ fontFamily: 'var(--font-mono)' }} className="block text-xs text-[#0C0F1A]/30 uppercase tracking-widest mb-1.5">메시지</label>
                <textarea id="message" required rows={4} placeholder="어떤 프로젝트인가요?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{ fontFamily: 'var(--font-body)' }}
                  className="w-full bg-transparent border border-[#0C0F1A]/10 px-4 py-2.5 text-sm text-[#0C0F1A] placeholder-[#0C0F1A]/20 focus:outline-none focus:border-[#4F6EF7]/50 transition-colors duration-200 resize-none"
                />
              </div>
              <button type="submit" style={{ fontFamily: 'var(--font-body)' }}
                className="w-full bg-[#0C0F1A] text-[#F0F3F9] py-3.5 text-sm font-medium hover:bg-[#4F6EF7] transition-colors duration-300"
              >보내기</button>
            </form>
          )}
        </div>
      </div>
    </Page>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

const TOTAL = SECTIONS.length

export default function App() {
  const [current, setCurrent] = useState(0)
  const animating = useRef(false)
  const touchStart = useRef<number | null>(null)

  const goTo = useCallback((idx: number) => {
    const next = Math.max(0, Math.min(TOTAL - 1, idx))
    if (next === current || animating.current) return
    animating.current = true
    setCurrent(next)
    setTimeout(() => { animating.current = false }, 800)
  }, [current])

  const prev = useCallback(() => goTo(current - 1), [current, goTo])
  const next = useCallback(() => goTo(current + 1), [current, goTo])

  // wheel
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (Math.abs(e.deltaY) < 20) return
      e.deltaY > 0 ? next() : prev()
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [next, prev])

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next()
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  // touch
  useEffect(() => {
    const onStart = (e: TouchEvent) => { touchStart.current = e.touches[0].clientY }
    const onEnd = (e: TouchEvent) => {
      if (touchStart.current === null) return
      const delta = touchStart.current - e.changedTouches[0].clientY
      if (Math.abs(delta) > 50) delta > 0 ? next() : prev()
      touchStart.current = null
    }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
    }
  }, [next, prev])

  const pages = [
    <PageIntro goTo={goTo} />,
    <PageAbout />,
    <PageProjects />,
    <PageSkills />,
    <PageExperience />,
    <PageContact />,
  ]

  return (
    <div className="fixed inset-0 overflow-hidden">
      <GradientBackground page={current} total={TOTAL} />


      <DotNav current={current} total={TOTAL} onChange={goTo} />

      {/* slide container */}
      <div
        className="flex flex-col h-full"
        style={{
          transform: `translateY(-${current * 100}vh)`,
          transition: 'transform 0.75s cubic-bezier(0.77,0,0.18,1)',
          height: `${TOTAL * 100}vh`,
          willChange: 'transform',
        }}
      >
        {pages.map((page, i) => (
          <div key={i} className="h-screen w-full shrink-0">
            {page}
          </div>
        ))}
      </div>

      {/* page counter */}
      <div
        style={{ fontFamily: 'var(--font-mono)' }}
        className="fixed bottom-6 left-6 md:left-12 text-xs text-[#0C0F1A]/25 select-none"
      >
        {String(current + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
      </div>
    </div>
  )
}
