# oznwoo.github.io

오진우 개발자 포트폴리오. React + Vite + Tailwind CSS로 만든 정적 사이트입니다. (Figma Make로 제작)

## 로컬 실행

```bash
pnpm install
pnpm dev
```

[http://localhost:8443](http://localhost:8443) 에서 확인할 수 있습니다.

## 빌드

```bash
pnpm build
```

빌드 결과는 `dist/` 디렉터리에 정적 파일로 생성됩니다.

## 배포

`main` 브랜치에 push하면 `.github/workflows/deploy.yml` 워크플로우가 자동으로 빌드 후 GitHub Pages에 배포합니다.

최초 1회, 저장소 Settings → Pages → Build and deployment → Source를 **GitHub Actions**로 설정해야 합니다. 이 저장소는 `<username>.github.io` 형태의 사용자 페이지이므로 별도의 base path 설정 없이 루트 경로(`/`)로 배포됩니다.

## 프로젝트 구조

- `src/App.tsx` — 페이지 전체 구성 (Intro, About, Projects, Skills, Experience, Contact)
- `src/imports/` — 프로필 사진, 로고, 이력서 등 정적 에셋
- `.figma/make/site.json` — 페이지 제목, 설명, robots, 접근성 설정
