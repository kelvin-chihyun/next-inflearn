# Todo List

Next.js, React Query, Supabase를 활용한 Todo List WebApp입니다.
![결과물](./public/result.gif)

## 주요 기능

### 🎯 핵심 기능

- **실시간 검색**: 입력과 동시에 할 일 목록 필터링
- **CRUD 작업**:
  - 새로운 할 일 생성
  - 할 일 목록 조회
  - 할 일 상태 및 내용 수정
  - 할 일 삭제
- **완료 시간 추적**: 할 일 완료 시 자동으로 완료 시간 기록

### 🛠 기술 구현

#### 아키텍처

- **모노레포 구조**:
  - 공유 UI 컴포넌트 (`@next-inflearn/ui`)
  - 공유 Supabase 클라이언트 (`@next-inflearn/supabase`)
  - Todo 애플리케이션 (`apps/todo`)

#### 프론트엔드

- **React Query 통합**:
  - 효율적인 데이터 페칭과 캐싱
  - 낙관적 업데이트로 향상된 UX
  - 자동 백그라운드 리페칭
- **Material Tailwind**:
  - 커스터마이즈된 컴포넌트
  - 반응형 디자인
  - 일관된 스타일링

#### 백엔드

- **Supabase 통합**:
  - 실시간 데이터베이스
  - 타입 안전한 데이터베이스 작업
  - 보안 API 엔드포인트
- **서버 액션**:
  - Next.js 서버 컴포넌트
  - 타입 안전한 API 호출
  - 효율적인 데이터 처리

## 기술 스택

- **프레임워크**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS + Material Tailwind
- **상태 관리**: React Query
- **데이터베이스**: Supabase
- **패키지 매니저**: pnpm
- **모노레포 도구**: Turborepo
