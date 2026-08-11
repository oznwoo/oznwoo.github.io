# oznwoo.github.io

오진우 개발자 포트폴리오. Next.js(App Router) + TypeScript + Tailwind CSS로 만든 정적 사이트입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

## 빌드

```bash
npm run build
```

`next.config.ts`에 `output: "export"`가 설정되어 있어, 빌드 결과가 `out/` 디렉터리에 정적 파일로 생성됩니다.

## 배포

`main` 브랜치에 push하면 `.github/workflows/deploy.yml` 워크플로우가 자동으로 빌드 후 GitHub Pages에 배포합니다.

최초 1회, 저장소 Settings → Pages → Build and deployment → Source를 **GitHub Actions**로 설정해야 합니다. 이 저장소는 `<username>.github.io` 형태의 사용자 페이지이므로 별도의 `basePath` 설정 없이 루트 경로(`/`)로 배포됩니다.

## 연락처 정보 교체

`src/lib/constants.ts`의 `CONTACT_EMAIL`, `SOCIAL_LINKS`는 placeholder입니다. 배포 전에 실제 값으로 교체해주세요.

## 프로젝트 데이터 수정

`src/data/projects.ts`에서 프로젝트 카드 내용(설명, 태그, 지표)을 관리합니다. CoChat, Gopssl 설명은 정리되는 대로 이 파일만 업데이트하면 됩니다.
