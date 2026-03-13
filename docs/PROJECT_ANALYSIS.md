# PServer V02 - 프로젝트 종합 분석 보고서

> 분석일: 2026-03-01
> 대상: PROJECT-PServer-V02 (Portfolio/Project Server)
> 분석 범위: 프로젝트 구조, 백엔드, 프론트엔드, 보안, 코드 품질, 아키텍처

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택](#2-기술-스택)
3. [프로젝트 구조](#3-프로젝트-구조)
4. [백엔드 분석](#4-백엔드-분석)
5. [프론트엔드 분석](#5-프론트엔드-분석)
6. [데이터베이스 설계](#6-데이터베이스-설계)
7. [보안 분석](#7-보안-분석)
8. [코드 품질 분석](#8-코드-품질-분석)
9. [잘된 점 (Strengths)](#9-잘된-점-strengths)
10. [미흡한 점 (Weaknesses)](#10-미흡한-점-weaknesses)
11. [개선 권장사항](#11-개선-권장사항)
12. [파일 통계](#12-파일-통계)

---

## 1. 프로젝트 개요

### 1.1 프로젝트 설명

PServer V02는 **프로젝트 관리 및 포트폴리오 서버** 애플리케이션이다. 팀 단위의 프로젝트 관리, 게시글 작성, 일정 예약, 알림 시스템을 제공하는 풀스택 웹 애플리케이션으로, MERN 스택(MongoDB, Express, React, Node.js)에 GraphQL을 결합한 구조를 가진다.

### 1.2 주요 기능

| 기능 | 설명 |
|------|------|
| **사용자 인증** | 로그인/로그아웃, 세션 기반 인증 |
| **프로젝트 관리** | 프로젝트 생성, 상태 관리, 멤버 초대, 진행률 추적 |
| **게시글 시스템** | Markdown 기반 게시글 작성/수정/조회, 프로젝트별 분류 |
| **일정 관리** | 캘린더 기반 예약 시스템, 시간대 선택 |
| **알림 시스템** | 프로젝트 활동 시 자동 알림 생성 및 전달 |
| **검색** | 게시글 제목 기반 검색, 페이지네이션 지원 |
| **크레딧 시스템** | 사용자 포인트/크레딧 관리 |

### 1.3 개발 환경 구성

```
Root npm start → concurrently 실행
├── Backend (port 3000) → nodemon ./server.js
└── Frontend (port 3001) → react-scripts start
```

---

## 2. 기술 스택

### 2.1 프론트엔드

| 기술 | 버전 | 용도 |
|------|------|------|
| React | 18.2.0 | UI 프레임워크 |
| Apollo Client | 3.7.16 | GraphQL 클라이언트 |
| MobX | 6.9.0 | 상태 관리 |
| mobx-react-lite | 3.4.3 | React-MobX 바인딩 |
| React Router DOM | 6.11.1 | 클라이언트 라우팅 |
| @uiw/react-md-editor | 3.23.0 | Markdown 에디터 |
| crypto-js | 4.1.1 | 클라이언트 측 암호화 |
| react-transition-group | 4.4.5 | 애니메이션 전환 효과 |
| react-scripts | 5.0.1 | CRA 빌드 도구 |

### 2.2 백엔드

| 기술 | 버전 | 용도 |
|------|------|------|
| Express | 4.18.2 | HTTP 서버 프레임워크 |
| Apollo Server Express | 3.12.0 | GraphQL 서버 |
| GraphQL | 14.7.0 | API 쿼리 언어 |
| Mongoose | 7.3.1 | MongoDB ODM |
| MongoDB | 5.6.0 | 데이터베이스 드라이버 |
| express-session | 1.17.3 | 세션 관리 |
| memorystore | 1.6.7 | 세션 메모리 저장소 |
| cors | 2.8.5 | CORS 처리 |
| crypto-js | 4.1.1 | 암호화 유틸리티 |
| nodemon | 2.0.22 | 개발 서버 자동 재시작 |

### 2.3 프로젝트 관리

| 기술 | 용도 |
|------|------|
| concurrently | 프론트/백 동시 실행 |
| npm | 패키지 매니저 |
| Git | 버전 관리 |
| ES Modules | 모듈 시스템 (`"type": "module"`) |

---

## 3. 프로젝트 구조

### 3.1 디렉토리 트리

```
PROJECT-PServer-V02/
├── package.json                          # 루트 모노레포 설정
├── .gitignore                            # Git 무시 파일 목록
│
├── back/                                 # 백엔드 (Express + GraphQL + MongoDB)
│   ├── server.js                         # Express 서버 진입점
│   ├── package.json                      # 백엔드 의존성
│   ├── config/
│   │   └── database.js                   # MongoDB 연결 설정
│   └── modules/
│       └── graphql/
│           ├── graphqlSchema.js          # GraphQL 타입 정의
│           ├── resolvers.js              # GraphQL 리졸버
│           ├── Auth/models/
│           │   └── auth.model.js         # 사용자 인증 모델
│           ├── Post/models/
│           │   └── post.model.js         # 게시글 모델
│           ├── Project/models/
│           │   └── project.model.js      # 프로젝트 모델
│           ├── Notice/models/
│           │   └── notice.model.js       # 알림 모델
│           ├── Log/models/
│           │   └── log.model.js          # 로그 모델
│           └── Schedule/
│               └── schedule.model.js     # 일정 모델
│
└── front/                                # 프론트엔드 (React SPA)
    ├── package.json                      # 프론트엔드 의존성
    ├── public/
    │   ├── index.html                    # HTML 진입점
    │   ├── manifest.json                 # PWA 매니페스트
    │   └── thumbnail/                    # 프로젝트 썸네일 이미지 (22개)
    └── src/
        ├── index.js                      # React 진입점 (Apollo Provider)
        ├── App.js                        # 메인 App 컴포넌트
        ├── routes/
        │   └── index.js                  # React Router 설정
        ├── store/                        # MobX 상태 관리
        │   ├── index.js                  # 스토어 통합 export
        │   ├── userInfoStore.js          # 사용자 인증 상태
        │   ├── screenStore.js            # 화면 전환 상태
        │   ├── postStore.js              # 게시글 캐시 상태
        │   ├── SearchStore.js            # 검색/페이지네이션 상태
        │   ├── timeStore.js              # 시간 선택 상태
        │   ├── noticeStore.js            # 알림 카운트 상태
        │   └── creditStore.js            # 크레딧 상태
        ├── components/                   # 재사용 가능한 UI 컴포넌트 (15개)
        │   ├── Navigation/               # 네비게이션 바
        │   ├── ViewArea/                 # 메인 컨텐츠 영역
        │   ├── ViewAreaScreenManager/    # 화면 라우팅/스위칭
        │   ├── Displayer/                # 카드형 디스플레이 컴포넌트
        │   ├── SearchBar/                # 검색 입력
        │   ├── UserInfo/                 # 사용자 정보 표시
        │   ├── Clock/                    # 실시간 시계
        │   ├── Calander/                 # 월간 캘린더
        │   ├── TimeBar/                  # 시간대 선택
        │   ├── Reservation/              # 예약 폼
        │   ├── Notice/                   # 알림 표시
        │   ├── NoticeMessenger/          # 메시지 시스템
        │   ├── ProjectOutline/           # 프로젝트 개요/일정 탭
        │   └── TransitionObj/            # CSS 전환 효과 래퍼
        ├── screens/                      # 페이지 단위 컴포넌트 (11개)
        │   ├── LoginScreen/              # 로그인 페이지
        │   ├── SearchScreen/             # 검색/게시글 목록
        │   ├── PostWriteScreen/          # 게시글 작성
        │   ├── PostModifyScreen/         # 게시글 수정
        │   ├── PostReadScreen/           # 게시글 읽기
        │   ├── WorksScreen/              # 완료된 프로젝트 목록
        │   ├── InProgressScreen/         # 진행 중 프로젝트 목록
        │   ├── ReservationScreen/        # 예약 시스템
        │   ├── AddProjectScreen/         # 프로젝트 추가 폼
        │   ├── MyPageScreen/             # 마이페이지
        │   └── ProjectDescriptScreen/    # 프로젝트 상세 설명
        ├── config/
        │   └── createApolloclient.js     # Apollo 클라이언트 설정 (비활성)
        ├── styles/
        │   └── colorTheme.css            # 글로벌 색상 테마
        └── assets/                       # 정적 자산 (이미지, HTML)
```

### 3.2 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                      │
│  ┌─────────────────────────────────────────────────┐    │
│  │              React 18 SPA                        │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │    │
│  │  │  Screens  │  │Components│  │  MobX Stores │  │    │
│  │  │  (Pages)  │  │  (UI)    │  │  (State)     │  │    │
│  │  └─────┬─────┘  └────┬─────┘  └──────┬───────┘  │    │
│  │        │              │               │          │    │
│  │        └──────────────┴───────────────┘          │    │
│  │                       │                          │    │
│  │              ┌────────┴────────┐                 │    │
│  │              │  Apollo Client  │                 │    │
│  │              └────────┬────────┘                 │    │
│  └───────────────────────┼──────────────────────────┘    │
│                          │ GraphQL + REST                 │
└──────────────────────────┼───────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────┐
│                   Server (Node.js)                        │
│  ┌───────────────────────┼──────────────────────────┐    │
│  │              Express.js Server                    │    │
│  │  ┌────────────────────┴──────────────────────┐   │    │
│  │  │           Apollo Server (GraphQL)          │   │    │
│  │  │  ┌──────────┐  ┌────────────────────────┐ │   │    │
│  │  │  │  Schema   │  │     Resolvers          │ │   │    │
│  │  │  │  (Types)  │  │  (Queries/Mutations)   │ │   │    │
│  │  │  └──────────┘  └────────────┬───────────┘ │   │    │
│  │  └─────────────────────────────┼─────────────┘   │    │
│  │                                │                  │    │
│  │  ┌──────────────┐   ┌─────────┴──────────┐      │    │
│  │  │ express-     │   │  Mongoose Models    │      │    │
│  │  │ session      │   │  (Auth, Post,       │      │    │
│  │  │ (MemoryStore)│   │   Project, Notice,  │      │    │
│  │  └──────────────┘   │   Schedule, Log)    │      │    │
│  │                      └─────────┬──────────┘      │    │
│  └────────────────────────────────┼──────────────────┘    │
│                                   │                       │
└───────────────────────────────────┼───────────────────────┘
                                    │
                           ┌────────┴────────┐
                           │    MongoDB       │
                           │  (Cloud/Local)   │
                           └─────────────────┘
```

---

## 4. 백엔드 분석

### 4.1 서버 구성 (`back/server.js`)

**Express 서버 미들웨어 스택:**
```
1. express.static()       → React 빌드 파일 서빙
2. express.json()         → JSON 바디 파싱
3. express.urlencoded()   → URL 인코딩 파싱
4. express-session        → 세션 관리 (MemoryStore, 24시간 만료)
5. CORS                   → localhost:3001 허용
6. Apollo Server          → GraphQL 미들웨어 (/graphql)
```

**REST 엔드포인트:**

| Method | Path | 설명 |
|--------|------|------|
| GET | `/` | 정적 HTML 서빙 |
| POST | `/setLoginInfo` | 세션에 로그인 정보 저장 |
| GET | `/getLoginInfo` | 세션에서 로그인 정보 조회 |
| GET | `/logout` | 세션 파괴 (로그아웃) |

### 4.2 GraphQL API 설계

#### Queries (조회)

| Query | 파라미터 | 반환 | 설명 |
|-------|---------|------|------|
| `getAllUsers` | - | `[Auth]` | 전체 사용자 조회 |
| `getUser` | `userID: String` | `Auth` | 단일 사용자 조회 |
| `getUsers` | `userID: [String]` | `[Auth]` | 복수 사용자 조회 |
| `getUserInfo` | `userID!, userPW!` | `Auth` | 로그인 인증 |
| `getAllPosts` | - | `[Post]` | 전체 게시글 (날짜 내림차순) |
| `getPostsbyTitlePaginated` | `postTitle!, offset!, limit!` | `[Post]` | 페이지네이션 검색 |
| `getPostsbyTitle` | `postTitle!` | `[Post]` | 제목 검색 (정규식) |
| `getPostbyID` | `postID!` | `Post` | ID로 게시글 조회 |
| `getAllProjects` | - | `[Project]` | 전체 프로젝트 (시작일 내림차순) |
| `getProjectsbyStatus` | `status: String` | `[Project]` | 상태별 프로젝트 필터 |
| `getProjectbyTitle` | `title: String` | `Project` | 제목으로 프로젝트 조회 |
| `getProjectbyID` | `projectID!` | `Project` | ID로 프로젝트 조회 |
| `getUserNotice` | `userID: String` | `[Notice]` | 사용자 알림 조회 |
| `getSchedulebyProjectAndMember` | `project, member` | `[Schedule]` | 프로젝트/멤버별 일정 |

#### Mutations (변경)

| Mutation | 설명 | 부수 효과 |
|----------|------|----------|
| `createUser` | 새 사용자 생성 | Auth 문서 생성 |
| `createPost` | 게시글 작성 | 프로젝트 멤버에게 자동 알림 생성 |
| `createProject` | 프로젝트 생성 | 멤버 Auth에 프로젝트 추가 + 초대 알림 |
| `createNotice` | 알림 생성 | Notice 문서 생성 |
| `deleteNotice` | 알림 삭제 | Notice 문서 삭제 |
| `createSchedule` | 일정 생성 | 멤버에게 자동 알림 생성 |
| `modifyPostbyID` | 게시글 수정 | Post 문서 업데이트 |

### 4.3 리졸버 주요 로직

**게시글 작성 시 자동 알림 플로우:**
```
createPost 호출
  → Post 문서 생성
  → 프로젝트 제목으로 Project 조회
  → Project.member 배열 순회
  → 각 멤버에게 Notice 생성
  → 생성된 Post 반환
```

**프로젝트 생성 시 멤버 연동 플로우:**
```
createProject 호출
  → Project 문서 생성
  → member 배열 순회
  → 각 멤버의 Auth.project에 $push로 프로젝트 추가
  → 각 멤버에게 초대 Notice 생성
  → 생성된 Project 반환
```

### 4.4 인증 흐름

```
[Client]                              [Server]
   │                                      │
   ├─ getUserInfo(id, pw) ────────────────►│ GraphQL Query
   │                                      ├─ Auth.findOne({userID, userPW})
   │                                      ├─ Log 생성 (로그인 시도)
   │◄─────────────────── Auth 객체 반환 ──┤
   │                                      │
   ├─ POST /setLoginInfo ─────────────────►│ REST Endpoint
   │  {id, name, privilege}               ├─ req.session.user = {...}
   │◄─────────────── session cookie ──────┤
   │                                      │
   ├─ GET /getLoginInfo ──────────────────►│ REST Endpoint
   │  (cookie: session)                   ├─ return req.session.user
   │◄──────────────── user info ──────────┤
   │                                      │
   ├─ GET /logout ────────────────────────►│ REST Endpoint
   │                                      ├─ req.session.destroy()
   │◄──────────────── 200 OK ─────────────┤
```

---

## 5. 프론트엔드 분석

### 5.1 컴포넌트 계층 구조

```
App
├── Navigation
│   ├── Logo
│   ├── Menu Links (Home, Works, In-progress, Reservation, Post)
│   ├── SearchBar
│   └── UserInfo
│       ├── Login/Logout 상태 표시
│       └── Notice (알림 아이콘 + 카운트)
│           └── NoticeMessenger (알림 목록 패널)
│
└── ViewArea
    └── ViewAreaScreenManager
        ├── SearchScreen
        │   └── DisplayerContainer → Displayer (카드 목록)
        ├── WorksScreen
        │   └── DisplayerContainer → Displayer
        ├── InProgressScreen
        │   └── DisplayerContainer → Displayer
        ├── PostWriteScreen
        │   ├── SelectProject (프로젝트 선택 드롭다운)
        │   └── MDEditor (Markdown 에디터)
        ├── PostModifyScreen
        │   ├── SelectProject
        │   └── MDEditor
        ├── PostReadScreen
        │   └── MDEditor.Markdown (읽기 전용)
        ├── ReservationScreen
        │   ├── Calander (월간 캘린더)
        │   ├── TimeBar (시간대 선택)
        │   ├── ProjectOutline (프로젝트 정보/일정)
        │   └── Reservation (예약 폼)
        ├── AddProjectScreen
        │   └── 프로젝트 생성 폼
        ├── LoginScreen
        │   └── 로그인 폼
        ├── MyPageScreen
        │   └── 사용자 프로필
        └── ProjectDescriptScreen
            └── 프로젝트 상세 정보
```

### 5.2 MobX 상태 관리 구조

| 스토어 | 주요 속성 | 주요 액션 | 용도 |
|--------|----------|----------|------|
| `userInfoStore` | `loginState`, `curUser` (id, name, privilege) | `setStateLogin()`, `setStateLogout()`, `setUserID()` | 전역 인증 상태 |
| `screenStore` | `currentScreen`, `prevScreens[]` | `GetNewScreen()`, `GetPrevScreen()` | 화면 전환 히스토리 |
| `postStore` | `loadedPosts[]` | `PushPostStack()`, `ClearPostStack()` | 게시글 캐싱 |
| `searchStore` | `curKeyword`, `offset`, `limit` | `SetKeyword()`, `ExtendLimit()` | 검색/페이지네이션 |
| `timeStore` | `selectedTime`, `selectedStartTime`, `selectedEndTime`, `dayMarker` | 시간 선택 setter들 | 예약 캘린더 |
| `noticeStore` | `noticeNumber` | - | 알림 카운트 |
| `creditStore` | `credits` | `increaseCredit()`, `decreaseCredit()` | 크레딧 관리 |

### 5.3 라우팅 구성

**React Router v6 라우트:**

| Path | Component | 설명 |
|------|-----------|------|
| `/` | `App` | 홈 (기본 화면) |
| `/login` | `LoginScreen` | 로그인 페이지 |
| `/post` | `PostWriteScreen` | 게시글 작성 |
| `/postModify` | `PostModifyScreen` | 게시글 수정 (state로 postID 전달) |
| `/addProject` | `AddProjectScreen` | 프로젝트 추가 |

**참고:** React Router 외에 커스텀 `screenStore`를 통한 별도의 화면 전환 시스템이 존재한다. `ViewAreaScreenManager`가 `screenStore.currentScreen` 값에 따라 렌더링할 스크린을 switch 문으로 결정한다.

### 5.4 스타일링 전략

- **CSS 파일 구조:** 각 컴포넌트 디렉토리에 `index.css` 파일 병치 (co-location)
- **글로벌 테마 변수:**
  ```css
  :root {
    --main: #135;        /* 메인 색상 (진한 남색) */
    --sub: #333;         /* 보조 색상 (진한 회색) */
    --bright: #eee;      /* 밝은 배경 */
    --dark: #000;        /* 어두운 배경 */
    --text: #fff;        /* 텍스트 색상 (흰색) */
    --warning: #fa1a1a;  /* 경고 색상 (빨강) */
    --highlight: #7db2f6;/* 강조 색상 (밝은 파랑) */
  }
  ```
- **네이밍 컨벤션:** BEM 유사 패턴 (예: `.Displayer`, `.DisplayerImg`, `.DisplayerContainer`)
- **레이아웃:** Flexbox 주로 사용
- **반응형:** Media query 사용 (`@media (max-width: 800px)`)
- **애니메이션:** `react-transition-group` + CSS transition 클래스

### 5.5 데이터 페칭 패턴

**Apollo Client 훅 사용:**

| 훅 | 사용 위치 | 용도 |
|----|----------|------|
| `useQuery` | SearchScreen, WorksScreen, ProjectOutline | 페이지 로드 시 자동 쿼리 |
| `useLazyQuery` | SearchBar, LoginScreen | 사용자 액션에 의한 조건부 쿼리 |
| `useMutation` | PostWriteScreen, AddProjectScreen | 데이터 생성/수정 |

**Fetch Policy:** 대부분 `'network-only'`를 사용하여 캐시를 우회

**REST 호출:** 인증 관련 엔드포인트에 `window.fetch()` 사용
```javascript
window.fetch(Info.getloginStateURI, { credentials: 'include' })
window.fetch(Info.setloginStateURI, { method: "POST", credentials: 'include' })
```

---

## 6. 데이터베이스 설계

### 6.1 Mongoose 스키마

#### Auth (사용자)
```javascript
{
  userID: String,         // 사용자 아이디
  userPW: String,         // 비밀번호 (⚠️ 평문 저장)
  userName: String,       // 사용자 이름
  credit: Number,         // 크레딧/포인트
  privilege: String,      // 권한 등급
  project: [String]       // 참여 프로젝트 제목 배열
}
```

#### Post (게시글)
```javascript
{
  postTitle: String,      // 제목
  postContent: String,    // 내용 (Markdown)
  postDate: String,       // 작성일 (⚠️ String 타입)
  postWriter: String,     // 작성자
  project: String,        // 소속 프로젝트
  category: String,       // 카테고리
  tag: String             // 태그
}
```

#### Project (프로젝트)
```javascript
{
  title: String,          // 프로젝트 제목
  designer: String,       // 기획자
  status: String,         // 상태 (완료/진행중 등)
  funding: Number,        // 펀딩 금액
  started: String,        // 시작일 (⚠️ String 타입)
  completed: String,      // 완료일
  progress: Number,       // 진행률 (0-100)
  privilege: String,      // 접근 권한
  link: String,           // 외부 링크
  member: [String],       // 멤버 아이디 배열
  tech: [String],         // 기술 스택
  thumbnail: String,      // 썸네일 경로
  description: String,    // 설명
  reference: String,      // 참고 자료
  location: String        // 위치
}
```

#### Notice (알림)
```javascript
{
  project: String,        // 관련 프로젝트
  title: String,          // 알림 제목
  from: String,           // 발신자
  to: String,             // 수신자
  content: String,        // 내용
  time: String            // 시간 (⚠️ String 타입)
}
```

#### Schedule (일정)
```javascript
{
  project: String,        // 관련 프로젝트
  createdTime: String,    // 생성 시간
  startTime: String,      // 시작 시간
  endTime: String,        // 종료 시간
  proposer: String,       // 제안자
  content: String,        // 내용
  member: [String]        // 참여 멤버
}
```

#### Log (로그)
```javascript
{
  logTime: String,        // 로그 시간
  log: String             // 로그 내용
}
```

### 6.2 엔티티 관계도

```
Auth (사용자)
  │
  ├──< project: [String] >──── Project (프로젝트)
  │                                │
  │                                ├──< member: [String] >── Auth
  │                                │
  │                                ├── Post (게시글)
  │                                │     └── project → Project.title
  │                                │
  │                                ├── Notice (알림)
  │                                │     ├── from → Auth.userID
  │                                │     └── to → Auth.userID
  │                                │
  │                                └── Schedule (일정)
  │                                      └── member: [String] → Auth.userID
  │
  └── Log (로그)
        └── 로그인 시도/성공 기록
```

> **주의:** 모든 관계가 문자열 기반 참조(String reference)이며, MongoDB ObjectId 참조(ref)를 사용하지 않는다.

---

## 7. 보안 분석

### 7.1 보안 등급 평가

| 항목 | 등급 | 상세 |
|------|------|------|
| 비밀번호 저장 | **심각** | 서버 측 해싱 없음 (클라이언트 SHA512만 사용) |
| 인증/인가 | **높음** | GraphQL 리졸버에 인가 검증 없음 |
| 입력 검증 | **높음** | 서버 측 입력 유효성 검사 없음 |
| 세션 관리 | **중간** | MemoryStore 사용 (프로덕션 부적합) |
| CORS 설정 | **낮음** | localhost만 허용 (개발 환경) |
| 민감 정보 관리 | **양호** | ServiceInformation.js가 .gitignore에 포함 |

### 7.2 상세 보안 이슈

#### 7.2.1 비밀번호 평문 저장 (심각)

**현재 상태:**
- 클라이언트에서 SHA512로 해싱 후 서버로 전송
- 서버에서는 해싱된 값을 **그대로** 데이터베이스에 저장
- 서버 측 bcrypt/scrypt 등의 추가 해싱 없음

**위험:**
- 데이터베이스 유출 시 모든 비밀번호 노출
- SHA512는 빠른 해시 함수이므로 브루트포스에 취약
- 솔트(salt) 없이 해싱하여 레인보우 테이블 공격에 취약

**권장:**
```javascript
// bcrypt를 사용한 서버 측 해싱
import bcrypt from 'bcrypt';
const hashedPW = await bcrypt.hash(clientHashedPW, 12);
```

#### 7.2.2 GraphQL 리졸버 인가 미비 (높음)

**현재 상태:**
- 모든 Query/Mutation이 인증 확인 없이 실행 가능
- `getAllUsers` 쿼리로 모든 사용자 정보 조회 가능
- 세션 정보를 GraphQL 컨텍스트에서 확인하지 않음

**권장:**
```javascript
// 리졸버에 인증 가드 추가
getAllUsers: async (_, __, context) => {
  if (!context.user || context.user.privilege !== 'admin') {
    throw new AuthenticationError('Unauthorized');
  }
  return await Auth.find({});
}
```

#### 7.2.3 입력 검증 부재 (높음)

**현재 상태:**
- GraphQL 리졸버에서 입력 유효성 검사 없음
- 정규식 기반 검색에서 사용자 입력을 직접 사용 (ReDoS 위험)
- XSS 방지를 위한 입력 살균(sanitization) 없음

#### 7.2.4 세션 메모리 저장 (중간)

**현재 상태:**
- `memorystore`를 사용하여 세션을 메모리에 저장
- 서버 재시작 시 모든 세션 소멸
- 수평 확장(multi-instance) 불가

---

## 8. 코드 품질 분석

### 8.1 코드 품질 지표

| 항목 | 평가 | 설명 |
|------|------|------|
| 타입 안정성 | **미흡** | TypeScript 미사용, PropTypes 미사용 |
| 에러 핸들링 | **미흡** | try-catch 부재, 기본 console.log만 사용 |
| 코드 중복 | **미흡** | GraphQL 쿼리 문자열 다수 컴포넌트에 중복 정의 |
| 네이밍 일관성 | **보통** | 대부분 일관적이나 일부 오타 존재 (Calander → Calendar) |
| 디렉토리 구조 | **양호** | 명확한 관심사 분리 (screens/components/store) |
| 모듈화 | **양호** | 엔티티별 모듈 분리 (Auth, Post, Project 등) |
| 문서화 | **미흡** | JSDoc, 인라인 주석 거의 없음 |
| 테스트 코드 | **미흡** | 기본 CRA 테스트 파일만 존재, 실질적 테스트 없음 |

### 8.2 코드 스멜 (Code Smells)

#### 8.2.1 날짜/시간을 String으로 관리
```javascript
// 현재: 모든 날짜/시간이 String 타입
postDate: String        // "2024-01-15"
startTime: String       // "09:00 2024-01-15"
createdTime: String     // "14:30 2024-01-15"

// 문제: .substr(6,10)과 같은 문자열 조작으로 날짜 추출
endTime: args.endTime.substr(6, 10)
```
Date 객체 또는 MongoDB의 ISODate를 사용해야 정렬, 필터링, 시간대 처리가 올바르게 작동한다.

#### 8.2.2 문자열 기반 관계 참조
```javascript
// 현재: 프로젝트-사용자 관계를 String으로 관리
project: [String]  // Auth 모델의 프로젝트 참조
member: [String]   // Project 모델의 멤버 참조

// 문제: 참조 무결성 보장 불가, JOIN 연산 비효율
```
MongoDB의 ObjectId 참조(`ref`)를 사용하면 `populate()`로 효율적인 관계 조회가 가능하다.

#### 8.2.3 GraphQL 쿼리 중복 정의
```javascript
// SearchBar에서 정의
const GET_POSTS_PAGINATED = gql`...`

// SearchScreen에서도 동일한 쿼리 정의
const GET_POSTS_PAGINATED = gql`...`
```
중앙 쿼리 파일로 통합하여 유지보수성을 높여야 한다.

#### 8.2.4 매직 스트링/매직 넘버
```javascript
// 하드코딩된 화면 이름
screenStoreObj.GetNewScreen("InProgressScreen")
screenStoreObj.GetNewScreen("WorksScreen")

// 하드코딩된 시간 범위
for (let i = 9; i < 24; i++) { ... }  // TimeBar의 시간 범위

// 하드코딩된 문자열 조작
args.startTime.substr(6, 10)  // 날짜 추출
```

#### 8.2.5 ViewAreaScreenManager의 거대 switch 문
```javascript
// 모든 화면을 하나의 switch 문으로 관리
switch(screenStoreObj.currentScreen) {
  case "SearchScreen": return <SearchScreen />;
  case "WorksScreen": return <WorksScreen />;
  case "InProgressScreen": return <InProgressScreen />;
  // ... 모든 화면
}
```
React Router에 이미 라우팅 시스템이 있으므로 이중 라우팅이 불필요하다.

### 8.3 의존성 이슈

| 패키지 | 이슈 |
|--------|------|
| `apollo-boost` (backend) | 더 이상 사용하지 않는 deprecated 패키지 |
| `react-apollo` (backend) | 프론트엔드 패키지가 백엔드에 설치됨 |
| `mongodb` (frontend) | 프론트엔드에 MongoDB 드라이버가 불필요하게 설치됨 |
| `crypto` (backend) | Node.js 내장 모듈이므로 별도 설치 불필요 |
| `graphql: ^14.7.0` (backend) | 구 버전, 프론트엔드와 메이저 버전 불일치 (^16.7.1) |

---

## 9. 잘된 점 (Strengths)

### 9.1 아키텍처 설계

- **명확한 프론트/백엔드 분리:** 모노레포 구조로 프론트엔드와 백엔드를 깔끔하게 분리하면서도 하나의 저장소에서 관리
- **GraphQL 채택:** REST 대비 유연한 데이터 요청이 가능하며, 스키마 기반 API 설계로 프론트/백 간 계약이 명확
- **모듈화된 백엔드 구조:** 엔티티별(Auth, Post, Project, Notice, Schedule, Log) 디렉토리 분리가 잘 되어 있어 확장에 용이

### 9.2 프론트엔드

- **컴포넌트 관심사 분리:** `screens/`(페이지)와 `components/`(재사용 UI)의 분리가 명확
- **재사용 가능한 Displayer 컴포넌트:** 카드형 디스플레이 컴포넌트가 다양한 액션 모드(`Link`, `ExternalLink`, `UseFunction`, `GetProjectName`)를 지원하여 범용적
- **CSS 병치(Co-location):** 각 컴포넌트와 CSS 파일이 같은 디렉토리에 위치하여 유지보수 용이
- **글로벌 CSS 변수:** `:root` CSS 변수를 활용한 테마 시스템으로 일관된 디자인 유지
- **MobX 상태 관리:** 기능별로 스토어가 분리되어 있어 상태 관리 구조가 체계적

### 9.3 기능 구현

- **자동 알림 시스템:** 게시글 작성, 프로젝트 생성, 일정 등록 시 관련 멤버에게 자동 알림 생성 — 비즈니스 로직이 잘 구현됨
- **페이지네이션 검색:** offset/limit 기반 페이지네이션이 구현되어 대량 데이터 처리 가능
- **Markdown 에디터 통합:** 리치 텍스트 편집을 위한 Markdown 에디터가 잘 통합됨
- **캘린더/시간 예약 시스템:** 캘린더와 시간대 선택을 조합한 예약 기능이 직관적
- **로그인 시도 로깅:** 보안 감사를 위한 로그인 시도 기록 기능

### 9.4 개발 환경

- **concurrently 통합:** 루트 `npm start`로 프론트/백 동시 실행 가능
- **nodemon 사용:** 백엔드 코드 변경 시 자동 재시작
- **ES Modules 사용:** 최신 JavaScript 모듈 시스템 채택
- **민감 정보 보호:** `ServiceInformation.js`를 `.gitignore`에 포함하여 Git에 노출 방지

### 9.5 UI/UX 관련

- **반응형 디자인:** Media query를 활용한 모바일 대응
- **화면 전환 애니메이션:** `react-transition-group`을 활용한 부드러운 화면 전환
- **실시간 시계:** Clock 컴포넌트를 통한 현재 시간 표시
- **알림 카운트 배지:** 네비게이션에 읽지 않은 알림 수 표시

---

## 10. 미흡한 점 (Weaknesses)

### 10.1 보안 (Critical)

| # | 이슈 | 심각도 | 설명 |
|---|------|--------|------|
| 1 | **비밀번호 평문 저장** | 심각 | 서버 측 해싱(bcrypt) 없이 클라이언트 SHA512 해시만 저장 |
| 2 | **인가 검증 부재** | 심각 | 모든 GraphQL 쿼리/뮤테이션에 권한 검사 없음 |
| 3 | **입력 유효성 검사 없음** | 높음 | 서버에서 입력 데이터 검증/살균(sanitization) 없음 |
| 4 | **정규식 인젝션** | 높음 | 사용자 입력을 직접 정규식에 사용 (ReDoS 위험) |
| 5 | **getAllUsers 무방비** | 높음 | 인증 없이 전체 사용자 정보(비밀번호 포함) 조회 가능 |

### 10.2 코드 품질

| # | 이슈 | 설명 |
|---|------|------|
| 1 | **TypeScript 미사용** | 런타임 타입 오류 위험, IDE 자동완성 제한 |
| 2 | **에러 핸들링 부재** | 리졸버에 try-catch 없음, 사용자 친화적 에러 메시지 없음 |
| 3 | **테스트 코드 없음** | 단위 테스트, 통합 테스트, E2E 테스트 모두 부재 |
| 4 | **커스텀 훅 미사용** | 중복 로직을 커스텀 훅으로 추출하지 않음 |
| 5 | **GraphQL 쿼리 중복** | 동일한 쿼리가 여러 컴포넌트에 복사/붙여넣기 |
| 6 | **console.log 남용** | 프로덕션 코드에 디버깅용 console.log 다수 존재 |
| 7 | **주석/문서 부재** | JSDoc, 인라인 주석, API 문서 거의 없음 |

### 10.3 아키텍처

| # | 이슈 | 설명 |
|---|------|------|
| 1 | **이중 라우팅 시스템** | React Router + screenStore 동시 사용으로 혼란 유발 |
| 2 | **문자열 기반 DB 관계** | ObjectId 참조 대신 String으로 엔티티 연결, 무결성 보장 불가 |
| 3 | **날짜를 String으로 저장** | Date 타입 미사용으로 정렬/비교/시간대 처리 어려움 |
| 4 | **MemoryStore 세션** | 서버 재시작 시 세션 소멸, 수평 확장 불가 |
| 5 | **잘못된 의존성 설치** | 백엔드에 프론트엔드 패키지, 프론트엔드에 DB 드라이버 |
| 6 | **환경 변수 관리** | `.env` 파일과 `dotenv` 대신 커스텀 JS 파일 사용 |

### 10.4 성능

| # | 이슈 | 설명 |
|---|------|------|
| 1 | **캐시 미활용** | Apollo Client의 `network-only` 정책으로 매번 네트워크 요청 |
| 2 | **React.memo 미사용** | 불필요한 리렌더링 방지 메모이제이션 없음 |
| 3 | **N+1 쿼리 문제** | 프로젝트 생성 시 멤버별 개별 DB 쿼리 실행 |
| 4 | **인라인 함수 정의** | 이벤트 핸들러를 렌더링마다 새로 생성 |
| 5 | **코드 스플리팅 없음** | 모든 화면이 초기 번들에 포함 |

### 10.5 유지보수성

| # | 이슈 | 설명 |
|---|------|------|
| 1 | **매직 스트링 남용** | 화면 이름, 상태 값 등이 하드코딩 |
| 2 | **ESLint/Prettier 미설정** | 코드 스타일 자동 검사/포맷팅 도구 없음 |
| 3 | **환경별 설정 분리 없음** | 개발/스테이징/프로덕션 환경 분리 미비 |
| 4 | **CI/CD 파이프라인 없음** | 자동 빌드/테스트/배포 프로세스 부재 |
| 5 | **README 미작성** | 프로젝트 고유 README 없이 CRA 기본 README만 존재 |
| 6 | **오타** | `Calander` → `Calendar`, `createApolloclient` → `createApolloClient` |

---

## 11. 개선 권장사항

### 11.1 즉시 해결 (Priority: Critical)

#### 1. 비밀번호 해싱 추가
```bash
npm install bcrypt
```
```javascript
// back/modules/graphql/resolvers.js
import bcrypt from 'bcrypt';

// 회원가입 시
createUser: async (_, args) => {
  const hashedPW = await bcrypt.hash(args.userPW, 12);
  return await Auth.create({ ...args, userPW: hashedPW });
}

// 로그인 시
getUserInfo: async (_, args) => {
  const user = await Auth.findOne({ userID: args.userID });
  if (!user) return null;
  const valid = await bcrypt.compare(args.userPW, user.userPW);
  return valid ? user : null;
}
```

#### 2. GraphQL 인가 미들웨어 추가
```javascript
// context에 세션 정보 전달
const server = new ApolloServer({
  typeDefs, resolvers,
  context: ({ req }) => ({ user: req.session?.user })
});

// 리졸버에서 인증 확인
getAllUsers: async (_, __, { user }) => {
  if (!user) throw new AuthenticationError('Login required');
  return await Auth.find({}).select('-userPW');
}
```

#### 3. 입력 유효성 검사 추가
```bash
npm install validator
```
```javascript
import validator from 'validator';

createPost: async (_, args) => {
  if (!validator.isLength(args.postTitle, { min: 1, max: 200 })) {
    throw new UserInputError('Title must be 1-200 characters');
  }
  const sanitizedContent = validator.escape(args.postContent);
  // ...
}
```

### 11.2 단기 개선 (Priority: High)

#### 4. TypeScript 도입
- 런타임 에러 사전 방지
- IDE 자동완성 및 리팩토링 지원 향상
- 팀 개발 시 코드 이해도 향상

#### 5. 에러 핸들링 체계화
```javascript
// 리졸버에 try-catch 래퍼 추가
const wrapResolver = (resolver) => async (...args) => {
  try {
    return await resolver(...args);
  } catch (error) {
    console.error(`Resolver error: ${error.message}`);
    throw new ApolloError('Internal server error', 'INTERNAL_ERROR');
  }
};
```

#### 6. GraphQL 쿼리 중앙화
```
front/src/graphql/
├── queries/
│   ├── auth.queries.js
│   ├── post.queries.js
│   └── project.queries.js
└── mutations/
    ├── auth.mutations.js
    ├── post.mutations.js
    └── project.mutations.js
```

#### 7. 테스트 코드 작성
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```
- 백엔드: 리졸버 단위 테스트
- 프론트엔드: 컴포넌트 렌더링 테스트
- 통합: API 엔드포인트 테스트

### 11.3 중기 개선 (Priority: Medium)

#### 8. 이중 라우팅 통합
- `screenStore`를 제거하고 React Router로 완전 통합
- `ViewAreaScreenManager`를 React Router의 `<Outlet>`으로 대체

#### 9. 날짜 타입 정규화
```javascript
// String → Date 타입 변경
postDate: { type: Date, default: Date.now }
startTime: { type: Date, required: true }
```

#### 10. 환경 변수 표준화
```bash
npm install dotenv
```
```
# .env
DATABASE_URI=mongodb+srv://...
SESSION_SECRET=your-secret-key
PORT=3000
```

#### 11. 의존성 정리
- 백엔드에서 `apollo-boost`, `react-apollo` 제거
- 프론트엔드에서 `mongodb` 제거
- 백엔드에서 `crypto` 제거 (내장 모듈)
- GraphQL 버전 통일

#### 12. 커스텀 훅 추출
```javascript
// useAuth 훅
function useAuth() {
  const { loginState, curUser } = userInfoStoreObj;
  const login = async (id, pw) => { ... };
  const logout = async () => { ... };
  return { isLoggedIn: loginState, user: curUser, login, logout };
}
```

### 11.4 장기 개선 (Priority: Low)

- **CI/CD 파이프라인 구축** (GitHub Actions)
- **Docker 컨테이너화**
- **코드 스플리팅** (React.lazy + Suspense)
- **Redis 세션 저장소** (프로덕션 환경)
- **API 문서화** (GraphQL Playground 활용)
- **모니터링/로깅** (Winston, Morgan 등)
- **성능 최적화** (React.memo, useMemo, useCallback)

---

## 12. 파일 통계

### 12.1 파일 유형별 현황

| 유형 | 개수 | 비율 |
|------|------|------|
| JavaScript (.js) | 52 | 36.9% |
| CSS (.css) | 26 | 18.4% |
| PNG (.png) | 41 | 29.1% |
| JSON (.json) | 7 | 5.0% |
| SVG (.svg) | 3 | 2.1% |
| JPEG (.jpeg/.jpg) | 5 | 3.5% |
| HTML (.html) | 2 | 1.4% |
| 기타 (.md, .txt, .ico, .gitignore) | 5 | 3.5% |
| **합계** | **141** | **100%** |

### 12.2 코드 규모

| 영역 | JS 파일 수 | 주요 구성 |
|------|-----------|----------|
| 백엔드 | 9 | server.js, database.js, schema, resolvers, 6 models |
| 프론트엔드 스크린 | 11 | 11개 페이지 컴포넌트 |
| 프론트엔드 컴포넌트 | 15 | 15개 UI 컴포넌트 |
| 스토어 | 8 | 7개 MobX 스토어 + index |
| 설정/유틸 | 9 | 라우터, Apollo 설정, 진입점 등 |
| **합계** | **52** | |

### 12.3 종합 평가

| 항목 | 점수 (10점 만점) |
|------|:---:|
| 아키텍처 설계 | 7 |
| 코드 구조/조직 | 7 |
| 기능 구현 완성도 | 7 |
| 보안 | 3 |
| 에러 핸들링 | 2 |
| 테스트 커버리지 | 1 |
| 코드 품질 | 5 |
| 유지보수성 | 4 |
| 성능 최적화 | 4 |
| 문서화 | 2 |
| **종합** | **4.2** |

---

## 결론

PServer V02는 **MERN + GraphQL 기반의 잘 구조화된 풀스택 프로젝트**이다. 프론트/백엔드 분리, 엔티티별 모듈화, MobX 상태 관리, 자동 알림 시스템 등 아키텍처적으로 좋은 판단이 많다.

그러나 **보안, 에러 핸들링, 테스트**가 가장 큰 약점이다. 특히 비밀번호 평문 저장과 GraphQL 인가 부재는 프로덕션 배포 전 반드시 해결해야 할 심각한 보안 이슈이다.

프로토타입/학습 프로젝트로서는 충분히 좋은 구조와 기능을 갖추고 있으며, 위에 제시한 개선 사항을 단계적으로 적용하면 프로덕션 수준의 애플리케이션으로 발전시킬 수 있다.

---

> *이 문서는 프로젝트 코드 전체를 정적 분석하여 작성되었습니다.*
