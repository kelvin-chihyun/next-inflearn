# Netflix

Next.js, React Query, Supabase, Jotai를 활용한 Netflix 클론 WebApp입니다.

## 주요 기능

### 🎯 핵심 기능

- 영화 검색 및 탐색: 다양한 영화 검색 및 브라우징
- 무한 스크롤: 효율적인 영화 목록 로딩
- 사용자 인증: 이메일 기반 회원가입 및 로그인
- 즐겨찾기 기능: 로그인 사용자를 위한 영화 즐겨찾기 추가/제거

### 🛠 기술 구현

**아키텍처**

- **모노레포 구조**:
  - 공유 UI 컴포넌트 (@next-inflearn/ui)
  - 공유 Supabase 클라이언트 (@next-inflearn/supabase)
  - Netflix 애플리케이션 (apps/netflix)
    **프론트엔드**
- **상태 관리**:
  - Jotai: 경량화된 전역 상태 관리
  - 검색어, 로그인 모달, 사용자 정보 상태 관리
- **React Query 통합**:
  - 무한 스크롤을 위한 useInfiniteQuery 활용
  - 효율적인 데이터 페칭 및 캐싱
  - 서버 상태와 클라이언트 상태 분리
    **백엔드**
- **Supabase 통합**:
  - 사용자 인증 (이메일/비밀번호)(profile table)
  - 영화 데이터 관리
  - 즐겨찾기 기능 구현(favorite table)
- **서버 액션**:
  - 영화 검색 및 필터링
  - 즐겨찾기 추가/제거
  - 사용자 프로필 관리
    **데이터베이스 설계**
- **영화 테이블**: 영화 정보 저장
- **프로필 테이블**: 사용자 닉네임 및 이메일 정보
- **즐겨찾기 테이블**: 사용자-영화 간 다대다 관계 관리
- **트리거**: 회원가입 시 자동 프로필 생성

## 기술 스택

- **프레임워크**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS + ShadCn UI
- **상태 관리**: Jotai + React Query
- **데이터베이스**: Supabase
- **인증**: Supabase Auth
- **패키지 매니저**: pnpm
- **모노레포 도구**: Turborepo

## ETC

### DB Schema( movie / favorite / profile 테이블)

```sql
create table movie (
  id int8 generated by default as identity primary key,
  image_url text,
  title varchar,
  overview varchar,
  vote_average float8,
  popularity float8,
  release_date varchar,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

```sql
-- favorites 테이블 생성
create table favorites (
-- 자동 증가하는 고유 ID (primary key)
id bigint generated by default as identity primary key,

-- 사용자 ID (auth.users 테이블의 외래키)
user_id uuid references auth.users(id) on delete cascade,

-- 영화 ID (movie 테이블의 외래키)
movie_id bigint references movie(id) on delete cascade,

-- 생성 시간 (UTC 기준, 자동 설정)
created_at timestamp with time zone default timezone('utc'::text, now()) not null,

-- 사용자-영화 조합의 유일성 보장
unique(user_id, movie_id)
);

-- 성능 최적화를 위한 인덱스 생성
create index favorites_user_id_idx on favorites(user_id);
create index favorites_movie_id_idx on favorites(movie_id);
```

```sql
-- profiles 테이블 생성 (users 테이블은 Supabase Auth가 자동으로 관리)
create table public.profiles (
id uuid references auth.users on delete cascade not null primary key,
email text not null,
nickname text not null,
created_at timestamp with time zone default timezone('utc'::text, now()) not null,
updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 프로필 생성을 위한 함수
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
insert into public.profiles (id, email, nickname)
values (new.id, new.email, new.raw_user_meta_data->>'nickname');
return new;
end;

$$
;

-- 트리거 생성
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
$$
```
