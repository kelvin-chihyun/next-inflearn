# Instagram

Next.js, React Query, Supabase, Jotai를 활용한 Instagram 클론 WebApp입니다.

## 주요 기능

### 🎯 핵심 기능

- **사용자 인증**: 이메일/비밀번호 기반 회원가입 및 로그인
- **실시간 채팅**: 사용자 간 1:1 메시지 교환
- **온라인 상태 표시**: Presence API를 활용한 실시간 온라인 상태 확인
- **사용자 프로필**: 사용자 정보 조회 및 관리
- **반응형 UI**: 모바일 및 데스크톱 환경 모두 지원

### 🛠 기술 구현

**아키텍처**

- **모노레포 구조**:
  - 공유 UI 컴포넌트 (@next-inflearn/ui)
  - 공유 Supabase 클라이언트 (@next-inflearn/supabase)
  - Instagram 애플리케이션 (apps/instagram)

**프론트엔드**
- **상태 관리**:
  - Jotai: 경량화된 전역 상태 관리
  - 선택된 사용자, 검색어, 사용자 정보, 온라인 상태 관리
- **React Query 통합**:
  - 사용자 목록, 메시지 데이터 캐싱 및 실시간 업데이트
  - 낙관적 업데이트를 통한 UX 개선

**백엔드**
- **Supabase 통합**:
  - Auth: 사용자 인증 및 권한 관리
  - Realtime: 실시간 메시지 및 온라인 상태 업데이트
  - Database: 메시지 및 사용자 데이터 저장
- **서버 액션**:
  - 사용자 조회 및 메시지 전송 기능 구현
  - 관리자 권한을 활용한 사용자 데이터 접근

**데이터베이스 설계**

- **message 테이블**: 사용자 간 메시지 저장
  - sender: 메시지 발신자 ID
  - receiver: 메시지 수신자 ID
  - message: 메시지 내용
  - created_at: 메시지 생성 시간

## 기술 스택

- **프레임워크**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS + ShadCN UI
- **상태 관리**: Jotai + React Query
- **데이터베이스**: Supabase
- **인증**: Supabase Auth
- **실시간 기능**: Supabase Realtime
- **패키지 매니저**: pnpm
- **모노레포 도구**: Turborepo

## 환경 설정

- **포트**: 3003
- **환경 변수**:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
  - NEXT_SUPABASE_SERVICE_ROLE
  - NEXT_SUPABASE_DB_PASSWORD
  - NEXT_PUBLIC_STORAGE_BUCKET
