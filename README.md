# 인프런 워밍업 클럽 스터디 3기 - 풀스택 (Next.js + Supabase)

이 프로젝트는 [인프런 워밍업 클럽 스터디 3기 - 풀스택 (Next.js + Supabase)](https://www.inflearn.com/course/offline/warmup-club-3-fs) 스터디 저장소 입니다.

This is a monorepo project containing multiple independent services built with Turborepo. Each service runs independently while sharing common UI components and configurations.

## 🏗 프로젝트 구조

```bash
├── apps/
│   ├── todo/        # Todo 애플리케이션 (포트: 3000)
│   ├── netflix/     # Netflix 클론 (포트: 3001)
│   ├── dropbox/     # Dropbox 클론 (포트: 3002)
│   └── instagram/   # Instagram 클론 (포트: 3003)
├── packages/
│   ├── ui/          # 공유 UI 컴포넌트
│   └── supabase/     # Supabase 관련
├── package.json
└── turbo.json
```

## 🚀 주요 기능

- **독립적인 서비스**: 각 애플리케이션은 독자적인 포트에서 실행되며 독립적으로 개발/배포 가능
- **공유 UI 컴포넌트**: 모든 애플리케이션에서 공통 UI 컴포넌트 사용
- **기술 유연성**: 일관성을 유지하면서 각 서비스별로 다른 기술 스택 사용 가능
- **효율적인 개발**: Turborepo의 캐싱과 병렬 실행 기능 활용
- **확장 가능한 아키텍처**: 각 서비스를 독립적으로 확장 가능

## 🛠 기술 스택

- **프레임워크**: Next.js
- **클라이언트 상태관리**: Jotai
- **서버 상태관리**: Tanstack-query v5
- **UI 라이브러리**: shadcn/ui
- **스타일링**: Tailwind CSS
- **패키지 매니저**: pnpm
- **빌드 시스템**: Turborepo

## 📦 설치 방법

1. 의존성 설치:

```bash
pnpm install
```

2. 환경 변수 설정:

```bash
# 각 서비스의 환경 변수 파일 복사
cp apps/todo/.env.example apps/todo/.env
cp apps/netflix/.env.example apps/netflix/.env
cp apps/dropbox/.env.example apps/dropbox/.env
cp apps/instagram/.env.example apps/instagram/.env
```

## 🚀 서비스 실행 방법

### Supabase **설정**

1. Supabase 프로젝트 생성

   - [Supabase 대시보드](https://app.supabase.io)에서 새 프로젝트 생성
   - 프로젝트 URL과 anon key 복사

2. 환경 변수 설정:

```bash
# packages/supabase/.env 파일 생성
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_SUPABASE_SERVICE_ROLE=your-service-role
NEXT_SUPABASE_DB_PASSWORD=your-password
```

3. 데이터베이스 스키마:

   - Todo 서비스: `todo` 테이블
   - Netflix 클론: `TBD`
   - Dropbox 클론: `TBD`
   - Instagram 클론: `TBD`

4. 타입 생성:

```bash
pnpm supabase gen types typescript --project-id your-project-id > packages/supabase/src/types.ts
```

### 개발 모드

모든 서비스 실행:

```bash
pnpm dev
```

특정 서비스만 실행:

```bash
# Todo 애플리케이션
pnpm --filter todo dev  # http://localhost:3000

# Netflix 클론
pnpm --filter netflix dev  # http://localhost:3001

# Dropbox 클론
pnpm --filter dropbox dev  # http://localhost:3002

# Instagram 클론
pnpm --filter instagram dev  # http://localhost:3003
```

### 프로덕션 빌드

모든 서비스 빌드:

```bash
pnpm build
```

특정 서비스 빌드:

```bash
pnpm --filter [서비스-이름] build
```

## 🔧 새로운 컴포넌트 추가

shadcn/ui 컴포넌트 추가:

```bash
# 공유 UI 패키지에 추가
pnpm dlx shadcn@latest add [컴포넌트-이름] -c packages/ui
```

## 📚 공유 컴포넌트 사용법

서비스에서 공유 컴포넌트 가져오기:

```tsx
import { Button } from "@workspace/ui/components/button";
```

## 🌐 서비스 URL

- Todo 애플리케이션: http://localhost:3000
- Netflix 클론: http://localhost:3001
- Dropbox 클론: http://localhost:3002
- Instagram 클론: http://localhost:3003

## 📝 개발 가이드라인

1. **컴포넌트 개발**

   - 공유 컴포넌트는 `packages/ui`에 위치
   - 서비스별 컴포넌트는 각 앱 디렉토리에 위치

2. **스타일링**

   - Tailwind CSS를 사용하여 일관된 스타일링
   - UI 패키지에 정의된 디자인 시스템 준수

3. **상태 관리**

   - 각 서비스는 독립적인 상태 관리 솔루션 사용 가능
   - 선택한 솔루션은 서비스의 README에 문서화

## 🔄 CI/CD

Turborepo의 파이프라인 설정을 통한 효율적인 빌드:

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false
    }
  }
}
```
