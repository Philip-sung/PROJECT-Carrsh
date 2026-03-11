# PROJECT-PServer-V02 — 프로젝트 개괄 문서

> 이 문서는 프로젝트를 한동안 떠나 있다가 다시 돌아왔을 때 빠르게 맥락을 잡기 위한 문서입니다.

---

## 1. 프로젝트 요약

| 항목 | 내용 |
|------|------|
| **이름** | PServer V02 |
| **구조** | 모노레포 (root → `back/` + `front/`) |
| **스택** | MongoDB + Express + React 18 + Node.js + GraphQL (MERN+GraphQL) |
| **언어** | TypeScript (JavaScript에서 전체 마이그레이션 완료) |
| **백엔드** | Express 4 + Apollo Server Express 3 + Mongoose 7 |
| **프론트엔드** | React 18 (CRA) + Apollo Client 3 + MobX 6 + React Router v6 |
| **인증** | express-session + MemoryStore (세션 기반) |
| **패키지 관리** | npm (루트에서 `concurrently`로 동시 실행) |

---

## 2. 디렉토리 구조

```
PROJECT-PServer-V02/
├── package.json              # 루트: concurrently로 back+front 동시 실행
├── docs/                     # 프로젝트 문서
│   ├── PROJECT_ANALYSIS.md   # 코드 품질·보안 분석 결과
│   ├── TYPESCRIPT_MIGRATION.md # JS→TS 마이그레이션 상세 기록
│   └── PROJECT_OVERVIEW.md   # 이 문서
│
├── back/                     # 백엔드 (Express + Apollo + Mongoose)
│   ├── package.json          # type: "module" (ESM)
│   ├── tsconfig.json         # target: ES2020, module: Node16, strict
│   ├── server.ts             # 진입점: Express + Apollo 서버 시작
│   ├── ServiceInformation.js # [git-ignored] DB URI, 암호키 등 환경 설정
│   ├── ServiceInformation.d.ts # 위 파일의 타입 선언
│   ├── types/index.ts        # 공유 인터페이스 (모델, resolver args, etc.)
│   ├── config/
│   │   └── database.ts       # Mongoose 연결 설정
│   └── modules/graphql/
│       ├── graphqlSchema.ts  # GraphQL 스키마 (type Query, Mutation)
│       ├── resolvers.ts      # GraphQL 리졸버 (Query + Mutation 구현)
│       ├── Auth/models/auth.model.ts
│       ├── Post/models/post.model.ts
│       ├── Project/models/project.model.ts
│       ├── Notice/models/notice.model.ts
│       ├── Log/models/log.model.ts
│       └── Schedule/schedule.model.ts
│
└── front/                    # 프론트엔드 (React CRA)
    ├── package.json
    ├── tsconfig.json         # CRA 호환, jsx: react-jsx, strict
    ├── public/               # 정적 파일
    └── src/
        ├── index.tsx         # ReactDOM 진입점
        ├── App.tsx           # ApolloProvider + Router 래퍼
        ├── ServiceInformation.js  # [git-ignored] API URI 설정
        ├── ServiceInformation.d.ts
        ├── types/index.ts    # 공유 타입 정의
        ├── store/            # MobX 스토어 (7개)
        │   ├── userInfoStore.ts  # 로그인 사용자 정보
        │   ├── screenStore.ts    # 화면 네비게이션 상태
        │   ├── postStore.ts      # 게시글 목록
        │   ├── SearchStore.ts    # 검색 offset/limit
        │   ├── timeStore.ts      # 날짜/시간 선택
        │   ├── noticeStore.ts    # 알림 카운터
        │   ├── creditStore.ts    # 크레딧 상태
        │   └── index.ts         # barrel export
        ├── components/       # 재사용 컴포넌트 (14개)
        ├── screens/          # 페이지 컴포넌트 (11개)
        ├── routes/index.tsx  # React Router 라우팅 설정
        ├── config/           # Apollo Client 설정 (비활성)
        ├── dev/devtools.ts   # 개발자 도구
        └── assets/img/       # 이미지 에셋
```

---

## 3. 환경변수 및 사전 설정

### 3-1. 필수 사전 설치
- **Node.js** 18+ (ESM + top-level await 지원 필수)
- **npm** (yarn 아님)
- **MongoDB** (로컬 또는 Atlas 클라우드)

### 3-2. ServiceInformation.js (git-ignored 필수 파일)

이 프로젝트는 `.gitignore`에 `ServiceInformation.js`가 포함되어 있어서 클론 후 직접 생성해야 합니다.

#### 백엔드: `back/ServiceInformation.js`
```javascript
const Info = {
  databaseURI: "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>",
  encryptKey: "<your-session-secret-key>"
};

export default Info;
```

| 키 | 설명 |
|----|------|
| `databaseURI` | MongoDB 연결 문자열 (Atlas 또는 로컬 `mongodb://localhost:27017/pserver`) |
| `encryptKey` | express-session의 `secret` 값 (아무 랜덤 문자열) |

#### 프론트엔드: `front/src/ServiceInformation.js`
```javascript
const Info = {
  databaseURI: "http://localhost:3000/graphql",
  getloginStateURI: "http://localhost:3000/getLoginInfo",
  setloginStateURI: "http://localhost:3000/setLoginInfo",
  logoutURI: "http://localhost:3000/logout"
};

export default Info;
```

| 키 | 설명 |
|----|------|
| `databaseURI` | Apollo Client가 연결할 GraphQL 엔드포인트 |
| `getloginStateURI` | 세션에서 로그인 상태 조회 API |
| `setloginStateURI` | 세션에 로그인 정보 저장 API |
| `logoutURI` | 세션 파기(로그아웃) API |

> **중요**: 프론트엔드가 CRA devserver(포트 3001)에서 돌 때 백엔드(포트 3000)와 CORS 통신하는 구조입니다.

### 3-3. MongoDB 초기 데이터

별도 시드 스크립트가 없습니다. 서버 시작 후 Mongoose가 스키마에 따라 컬렉션을 자동 생성합니다. 최초 사용자 계정은 GraphQL Mutation(`createUser`)으로 직접 생성해야 합니다.

---

## 4. 실행 방법

### 전체 동시 실행 (권장)
```bash
# 루트에서
npm install              # concurrently 설치
cd back && npm install   # 백엔드 의존성
cd ../front && npm install # 프론트엔드 의존성
cd ..
npm start                # back + front 동시 시작
```

### 개별 실행
```bash
# 백엔드 (포트 3000)
cd back
npm run server           # tsx watch ./server.ts

# 프론트엔드 (포트 3001)
cd front
npm start                # react-scripts start
```

### 타입 체크
```bash
# 백엔드
cd back && npx tsc --noEmit

# 프론트엔드
cd front && npx tsc --noEmit
```

### 프로덕션 빌드
```bash
cd front && npm run build    # front/build/ 생성
# 백엔드는 front/build를 정적 파일로 서빙
```

---

## 5. 포트 및 네트워크

| 서비스 | 포트 | 비고 |
|--------|------|------|
| Express + Apollo Server | 3000 | GraphQL: `http://localhost:3000/graphql` |
| CRA Dev Server | 3001 | 개발 전용 (HMR) |
| CORS | 허용됨 | origin: `http://localhost:3001` |

---

## 6. 주요 기능 흐름

### 인증
1. 프론트: SHA512 해시(crypto-js) → POST `/setLoginInfo` → 세션 저장
2. 페이지 로드 시 GET `/getLoginInfo`로 세션 확인
3. 로그아웃: GET `/logout` → 세션 파기

### 게시판 (Post)
- GraphQL Query: `getPostsbyTitlePaginated`, `getPostbyID`
- GraphQL Mutation: `createPost`, `deletePostbyID`
- 게시글 수정은 `modifyPostbyID` (Query 타입으로 정의됨 — 설계 이슈)

### 프로젝트 관리 (Project)
- GraphQL: `getAllProjects`, `getProjectsbyStatus`, `createProject`
- 상태: inProgress / completed

### 예약 (Schedule)
- 캘린더 UI로 날짜·시간 선택 → GraphQL Mutation `createSchedule`

### 알림 (Notice)
- 프로젝트별 공지 생성 및 조회

---

## 7. 상태 관리 아키텍처

MobX 6 클래스 기반 스토어를 싱글톤 패턴으로 사용합니다.

```
userInfoStoreObj  — 현재 로그인 사용자 (id, name, credit, privilege, loginState)
screenStoreObj    — 화면 네비게이션 (curScreen, screenParams)
postStoreObj      — 게시글 목록 (loadedPosts[])
searchStoreObj    — 검색 상태 (keyword, offset, limit)
timeStoreObj      — 예약 시간 선택 (selectedTime, start/endTime)
noticeStoreObj    — 알림 개수
creditStoreObj    — 크레딧 정보
```

모든 스토어는 `makeObservable`로 observable/action을 명시적으로 등록합니다.

---

## 8. TypeScript 마이그레이션 요약

JS → TS 전체 마이그레이션이 완료되었습니다. 상세 내용은 [TYPESCRIPT_MIGRATION.md](./TYPESCRIPT_MIGRATION.md) 참조.

### 핵심 변경
| 변경 사항 | 내용 |
|-----------|------|
| 파일 확장자 | `.js` → `.ts`/`.tsx` (약 52개 파일) |
| 백엔드 실행기 | `nodemon` → `tsx watch` |
| 타입 시스템 | `strict: true` 적용 |
| 모델 타이핑 | Mongoose `Schema<IDocument>` 제네릭 적용 |
| 컴포넌트 타이핑 | Props 인터페이스 정의 + React.ReactElement 반환 타입 |
| 스토어 타이핑 | 모든 프로퍼티/메서드에 명시적 타입 선언 |
| 환경설정 | `ServiceInformation.d.ts` 타입 선언 파일 생성 |
| 의존성 정리 | `apollo-boost`, `react-apollo`, `crypto` 제거 |
| graphql | 14.x → 16.x 업그레이드 |

### 새로 추가된 설정 파일
- `back/tsconfig.json` — Node16 모듈, ES2020 타겟, strict
- `front/tsconfig.json` — CRA 호환, react-jsx, strict
- `back/types/index.ts` — 6개 모델 인터페이스 + 16개 resolver args 인터페이스
- `front/src/types/index.ts` — 데이터 모델 + GraphQL 응답 + 컴포넌트 Props 타입
- `back/ServiceInformation.d.ts` — 백엔드 환경설정 타입
- `front/src/ServiceInformation.d.ts` — 프론트엔드 환경설정 타입
- `front/src/react-app-env.d.ts` — CRA + 이미지 모듈 선언

---

## 9. 알려진 이슈 및 기술 부채

### 설계 이슈 (마이그레이션 범위 밖)
1. **modifyPostbyID가 Query로 정의됨** — Mutation이어야 하나 원래 Query 타입에 포함. 스키마 재설계 필요.
2. **세션 인증 + MemoryStore** — 프로덕션 부적합. Redis 등으로 교체 권장.
3. **클라이언트 사이드 SHA512 해싱** — 서버에서 bcrypt/argon2로 해싱해야 안전.
4. **GraphQL 쿼리가 각 컴포넌트에 인라인** — 중앙 쿼리 파일로 분리 권장.
5. **커스텀 네비게이션 (screenStore)** — React Router가 있는데 별도 상태로 화면 전환. 통합 필요.

### 코드 이슈 (마이그레이션 중 수정됨)
1. ~~Clock useEffect 메모리 누수~~ — clearInterval 위치 수정 완료
2. ~~timeStore.ts `setDay()` 호출~~ — `setDate()`로 수정 완료
3. ~~SearchStore.ts `ExtendLimit` 미등록~~ — makeObservable에 추가 완료
4. ~~SearchScreen 배열 순회 off-by-one~~ — `<=` → `<` 수정 완료
5. ~~back/tsconfig.json 모듈 불일치~~ — `ES2022` → `Node16` 수정 완료

---

## 10. 빠른 참조

### GraphQL Playground
서버 실행 후 `http://localhost:3000/graphql`에서 Apollo Sandbox를 통해 쿼리 테스트 가능.

### 사용자 생성 (최초 설정)
```graphql
mutation {
  createUser(
    userID: "admin"
    userPW: "<SHA512-hashed-password>"
    userName: "Admin"
    credit: 100
    privilege: "admin"
    project: ["Public"]
  ) {
    userID
    userName
  }
}
```

### 프로젝트 생성
```graphql
mutation {
  createProject(
    title: "My Project"
    designer: "admin"
    status: "inProgress"
    funding: 0
    started: "2024.01.01"
    progress: 0
    privilege: "member"
    member: ["admin"]
    tech: ["React", "Node.js"]
    description: "프로젝트 설명"
  ) {
    title
  }
}
```

---

## 11. 관련 문서

- [PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md) — 프로젝트 코드 품질·보안 분석 결과
- [TYPESCRIPT_MIGRATION.md](./TYPESCRIPT_MIGRATION.md) — JS→TS 마이그레이션 상세 변경 기록
