# TypeScript 마이그레이션 보고서

> 마이그레이션일: 2026-03-01
> 대상: PROJECT-PServer-V02 전체 (백엔드 + 프론트엔드)
> 작업 범위: 모든 `.js` 소스 파일 → `.ts`/`.tsx` 전환

---

## 목차

1. [마이그레이션 개요](#1-마이그레이션-개요)
2. [백엔드 변경 사항](#2-백엔드-변경-사항)
3. [프론트엔드 변경 사항](#3-프론트엔드-변경-사항)
4. [신규 생성 파일 목록](#4-신규-생성-파일-목록)
5. [삭제된 파일 목록](#5-삭제된-파일-목록)
6. [의존성 변경 사항](#6-의존성-변경-사항)
7. [타입 정의 상세](#7-타입-정의-상세)
8. [실행 방법 변경](#8-실행-방법-변경)
9. [주의 사항](#9-주의-사항)

---

## 1. 마이그레이션 개요

### 1.1 작업 요약

| 항목 | Before | After |
|------|--------|-------|
| 백엔드 소스 파일 | 10개 `.js` | 10개 `.ts` |
| 프론트엔드 소스 파일 | 43개 `.js` | 44개 `.ts`/`.tsx` |
| 타입 정의 파일 | 0개 | 6개 (`.d.ts`, `types/index.ts`) |
| 설정 파일 | 0개 | 2개 (`tsconfig.json`) |
| **전체 마이그레이션 파일** | **53개** | **62개** |

### 1.2 마이그레이션 원칙

- **런타임 동작 변경 없음**: 기존 로직을 그대로 유지하면서 타입만 추가
- **Strict 모드 활성화**: `"strict": true`로 강력한 타입 검사 적용
- **점진적 타입 적용**: 외부 라이브러리 호출부는 `any` 허용, 내부 코드는 명시적 타입
- **ServiceInformation.js 보호**: Git-ignored 파일은 `.d.ts`로 타입만 선언

---

## 2. 백엔드 변경 사항

### 2.1 package.json 변경

```diff
- "main": "index.js",
+ "main": "server.ts",

  "scripts": {
-   "server": "nodemon ./server.js"
+   "server": "tsx watch ./server.ts",
+   "build": "tsc",
+   "typecheck": "tsc --noEmit"
  },

  "dependencies": {
-   "apollo-boost": "^0.4.9",       // 제거 (미사용 deprecated 패키지)
-   "crypto": "^1.0.1",             // 제거 (Node.js 내장 모듈)
-   "graphql": "^14.7.0",           // 버전 업그레이드
+   "graphql": "^16.7.0",           // apollo-server-express 호환 버전
-   "nodemon": "^2.0.22",           // 제거 (tsx watch로 대체)
-   "react-apollo": "^3.1.5",       // 제거 (프론트엔드 패키지가 백엔드에 있었음)
  },

+ "devDependencies": {
+   "@types/cors": "^2.8.17",
+   "@types/crypto-js": "^4.2.2",
+   "@types/express": "^4.17.21",
+   "@types/express-session": "^1.18.0",
+   "@types/node": "^20.11.0",
+   "tsx": "^4.7.0",
+   "typescript": "^5.3.3"
+ }
```

**제거된 의존성 (3개):**
- `apollo-boost` — deprecated, 미사용
- `react-apollo` — 프론트엔드 패키지가 백엔드에 잘못 설치되어 있었음
- `crypto` — Node.js 내장 모듈이므로 별도 설치 불필요

**추가된 의존성 (7개):**
- `typescript`, `tsx` — TypeScript 컴파일/실행
- `@types/node`, `@types/express`, `@types/cors`, `@types/express-session`, `@types/crypto-js` — 타입 정의

**변경된 의존성 (1개):**
- `graphql: ^14.7.0` → `^16.7.0` — `apollo-server-express@3.12.0`와의 peer dependency 충돌 해결

### 2.2 tsconfig.json (신규)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2022",
    "moduleResolution": "node16",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist"
  }
}
```

### 2.3 파일별 변경 상세

#### server.js → server.ts
- Express `Request`/`Response` 타입 적용
- `express-session` 모듈 타입 확장 (`SessionData.user` 프로퍼티 추가)
- `memorystore` 임포트 방식 변경 (default import → 팩토리 함수)
- `session.destroy()` 콜백 에러 핸들링 추가

#### config/database.js → config/database.ts
- `useNewUrlParser` 옵션 제거 (Mongoose 7에서 deprecated)
- 에러 핸들러 `Error` 타입 명시

#### modules/graphql/graphqlSchema.js → graphqlSchema.ts
- 변경 최소 (gql 템플릿 리터럴은 런타임 타입이므로)
- `DocumentNode` 타입으로 export

#### modules/graphql/resolvers.js → resolvers.ts
- 모든 Query/Mutation 리졸버에 args 타입 인터페이스 적용
- `parent` → `_parent: unknown` 통일
- 20개 이상의 Args 인터페이스 정의 (`types/index.ts`)
- `contextValue` 오타 수정 (`contextVaule` → `contextValue`)

#### 6개 Mongoose 모델 (.js → .ts)
- `Schema<IDocument>` 제네릭 타입 적용
- `model<IDocument>` 제네릭 타입 적용
- Document 인터페이스 상속 (`extends Document`)

### 2.4 백엔드 타입 아키텍처

```
back/types/index.ts
├── Document Interfaces (6개)
│   ├── IAuth, IAuthDocument
│   ├── IPost, IPostDocument
│   ├── IProject, IProjectDocument
│   ├── INotice, INoticeDocument
│   ├── ISchedule, IScheduleDocument
│   └── ILog, ILogDocument
├── Resolver Arg Interfaces (16개)
│   ├── GetUserArgs, GetUsersArgs, GetUserInfoArgs
│   ├── GetPostsByTitlePaginatedArgs, GetPostsByTitleArgs, GetPostByIDArgs
│   ├── ModifyPostByIDArgs
│   ├── GetProjectsByStatusArgs, GetProjectByTitleArgs, GetProjectByIDArgs
│   ├── GetUserNoticeArgs, GetScheduleArgs
│   ├── CreateUserArgs, CreatePostArgs, CreateProjectArgs
│   ├── CreateNoticeArgs, DeleteNoticeArgs, CreateScheduleArgs
│   └── ...
└── SessionUser (세션 사용자 타입)
```

---

## 3. 프론트엔드 변경 사항

### 3.1 tsconfig.json (신규)

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "strict": true,
    "jsx": "react-jsx",
    "moduleResolution": "node",
    "isolatedModules": true,
    "noEmit": true
  }
}
```

CRA(Create React App)는 TypeScript를 네이티브로 지원하므로, `tsconfig.json`만 추가하면 별도 빌드 설정 없이 작동한다.

### 3.2 MobX 스토어 마이그레이션 (7개 파일)

| 파일 | 주요 변경 |
|------|----------|
| `userInfoStore.ts` | `CurUser` 인터페이스, `UserInfoStore` 클래스 export |
| `screenStore.ts` | `Screen` 인터페이스, `ScreenStore` 클래스 export |
| `postStore.ts` | `IPost[]` 타입으로 `loadedPosts` 타이핑 |
| `SearchStore.ts` | 모든 프로퍼티에 명시적 타입 |
| `timeStore.ts` | `Date` 타입 프로퍼티, setter 메서드 파라미터 타이핑 |
| `noticeStore.ts` | `number` 타입 프로퍼티 |
| `creditStore.ts` | `number` 타입 프로퍼티, getter 반환 타입 |

**핵심 변경**: 스토어 클래스를 `export class` 형태로도 내보내어, 컴포넌트에서 `typeof storeObj` 대신 클래스 타입을 직접 참조할 수 있도록 함.

### 3.3 컴포넌트 마이그레이션 (14개 파일)

| 컴포넌트 | Props 인터페이스 | 주요 타입 변경 |
|----------|-----------------|---------------|
| `TransitionObj` | `TransitionObjectProps` | `children: React.ReactNode` |
| `Clock` | `ClockDisplayProps` | `Time: Date` |
| `Displayer` | `DisplayerProps` | `action` 유니온 패턴, `handleImgError: React.SyntheticEvent` |
| `SearchBar` | `GetPostsbyTitleButtonProps` | `React.ChangeEvent`, `React.KeyboardEvent` |
| `Notice` | `NoticeMapperProps`, `NoticeBarProps` | GraphQL 응답 `any` 타이핑 |
| `NoticeMessenger` | `MessageInfo`, `SendMessengerButtonProps` | `useState<MessageInfo>` 제네릭 |
| `UserInfo` | `UserInfoViewProps` | `store: UserInfoStore` 클래스 타입 |
| `Calander` | 4개 Props 인터페이스 | `observer` 컴포넌트 타이핑 |
| `TimeBar` | `TimeBlockProps` | `store: typeof timeStoreObj` |
| `Reservation` | 3개 Props 인터페이스 | 복합 `observer` + 다중 Apollo 훅 |
| `ProjectOutline` | 6개 Props 인터페이스 | 깊은 컴포넌트 트리 타이핑 |
| `Navigation` | `NavigationBarProps` | `className?: string` |
| `ViewAreaScreenManager` | `ViewAreaScreenManagerProps` | `store: ScreenStore` import type |
| `ViewArea` | `ViewAreaProps` | `className?: string` |

### 3.4 스크린 마이그레이션 (11개 파일)

| 스크린 | Props 인터페이스 | 주요 타입 변경 |
|--------|-----------------|---------------|
| `LoginScreen` | `LoginButtonProps` | CryptoJS SHA512 타이핑, `useLazyQuery` |
| `SearchScreen` | `DisplayerPostMapProps` | `observer` + `postStoreObj` 타이핑 |
| `PostWriteScreen` | `PostButtonProps`, `SelectProjectProps` | MDEditor `onChange` 타이핑 |
| `PostModifyScreen` | `PostButtonProps`, `SelectProjectProps` | `useLocation` state 타이핑 |
| `PostReadScreen` | `PostReadScreenProps` | `postID?: string` |
| `WorksScreen` | — | GraphQL 응답 `.map()` 타이핑 |
| `InProgressScreen` | — | 동일 패턴 |
| `ReservationScreen` | — | 단순 컨테이너 |
| `AddProjectScreen` | `SubmitProps` | 복합 폼 유효성 검사 타이핑 |
| `MyPageScreen` | — | 레이아웃 컨테이너 |
| `ProjectDescriptScreen` | `ProjectDescriptionScreenProps` | `projectID?: string` |

### 3.5 진입점 파일 마이그레이션

| 파일 | 변경 |
|------|------|
| `index.js` → `index.tsx` | `document.getElementById("root") as HTMLElement` |
| `App.js` → `App.tsx` | `Response` 타입, `data: any` |
| `routes/index.js` → `index.tsx` | JSX import 추가 |
| `reportWebVitals.js` → `.ts` | `ReportHandler` 타입 |
| `setupTests.js` → `.ts` | 변경 없음 |
| `config/createApolloclient.js` → `.ts` | 주석 처리 유지 |
| `dev/devtools.js` → `.ts` | `void` 반환 타입 |
| `assets/img/index.js` → `.ts` | `Record<string, string>` |

---

## 4. 신규 생성 파일 목록

### 백엔드 (4개 신규 파일)

| 파일 | 용도 |
|------|------|
| `back/tsconfig.json` | TypeScript 컴파일러 설정 |
| `back/types/index.ts` | 공유 타입/인터페이스 정의 (6개 모델 + 16개 Args + SessionUser) |
| `back/ServiceInformation.d.ts` | Git-ignored 설정 파일의 타입 선언 |

### 프론트엔드 (4개 신규 파일)

| 파일 | 용도 |
|------|------|
| `front/tsconfig.json` | TypeScript 컴파일러 설정 (CRA 호환) |
| `front/src/react-app-env.d.ts` | CRA TypeScript 참조 + 이미지 모듈 선언 |
| `front/src/ServiceInformation.d.ts` | Git-ignored 설정 파일의 타입 선언 |
| `front/src/types/index.ts` | 공유 타입 정의 (모델, GraphQL 응답, Props) |

---

## 5. 삭제된 파일 목록

### 백엔드 (10개 삭제)

```
back/server.js
back/config/database.js
back/modules/graphql/graphqlSchema.js
back/modules/graphql/resolvers.js
back/modules/graphql/Auth/models/auth.model.js
back/modules/graphql/Post/models/post.model.js
back/modules/graphql/Project/models/project.model.js
back/modules/graphql/Notice/models/notice.model.js
back/modules/graphql/Log/models/log.model.js
back/modules/graphql/Schedule/schedule.model.js
```

### 프론트엔드 (43개 삭제)

```
front/src/index.js
front/src/App.js
front/src/App.test.js
front/src/reportWebVitals.js
front/src/setupTests.js
front/src/routes/index.js
front/src/config/createApolloclient.js
front/src/dev/devtools.js
front/src/assets/img/index.js
front/src/store/index.js (+ 7개 스토어 파일)
front/src/components/*/index.js (14개 컴포넌트)
front/src/screens/*/index.js (11개 스크린)
```

---

## 6. 의존성 변경 사항

### 백엔드

| 변경 유형 | 패키지 | 이유 |
|----------|--------|------|
| **제거** | `apollo-boost@^0.4.9` | deprecated, 미사용 |
| **제거** | `react-apollo@^3.1.5` | 프론트엔드 패키지가 백엔드에 잘못 설치됨 |
| **제거** | `crypto@^1.0.1` | Node.js 내장 모듈 |
| **제거** | `nodemon@^2.0.22` | `tsx watch`로 대체 |
| **업그레이드** | `graphql: ^14.7.0 → ^16.7.0` | apollo-server-express 호환성 |
| **추가 (dev)** | `typescript@^5.3.3` | TypeScript 컴파일러 |
| **추가 (dev)** | `tsx@^4.7.0` | TypeScript 실행 (nodemon 대체) |
| **추가 (dev)** | `@types/*` (5개) | 타입 정의 패키지 |

### 프론트엔드

| 변경 유형 | 패키지 | 이유 |
|----------|--------|------|
| **추가 (dev)** | `typescript` | TypeScript 컴파일러 |
| **추가 (dev)** | `@types/react` | React 타입 정의 |
| **추가 (dev)** | `@types/react-dom` | ReactDOM 타입 정의 |
| **추가 (dev)** | `@types/react-router-dom` | React Router 타입 정의 |
| **추가 (dev)** | `@types/react-transition-group` | 트랜지션 타입 정의 |
| **추가 (dev)** | `@types/crypto-js` | CryptoJS 타입 정의 |

---

## 7. 타입 정의 상세

### 7.1 백엔드 타입 (`back/types/index.ts`)

**모델 인터페이스 (12개):**
- `IAuth` / `IAuthDocument` — 사용자 인증
- `IPost` / `IPostDocument` — 게시글
- `IProject` / `IProjectDocument` — 프로젝트
- `INotice` / `INoticeDocument` — 알림
- `ISchedule` / `IScheduleDocument` — 일정
- `ILog` / `ILogDocument` — 로그

**리졸버 인자 인터페이스 (16개):**
- Query: `GetUserArgs`, `GetUsersArgs`, `GetUserInfoArgs`, `GetPostsByTitlePaginatedArgs`, `GetPostsByTitleArgs`, `GetPostByIDArgs`, `ModifyPostByIDArgs`, `GetProjectsByStatusArgs`, `GetProjectByTitleArgs`, `GetProjectByIDArgs`, `GetUserNoticeArgs`, `GetScheduleArgs`
- Mutation: `CreateUserArgs`, `CreatePostArgs`, `CreateProjectArgs`, `CreateNoticeArgs`, `DeleteNoticeArgs`, `CreateScheduleArgs`

### 7.2 프론트엔드 타입 (`front/src/types/index.ts`)

**데이터 모델 (5개):** `IAuth`, `IPost`, `IProject`, `INotice`, `ISchedule`
**세션/화면 (2개):** `CurUser`, `Screen`
**GraphQL 응답 (16개):** 각 Query/Mutation에 대한 응답 타입
**컴포넌트 Props (4개):** `DisplayerProps`, `DisplayerContainerProps`, `NavigationBarProps`, `ViewAreaScreenManagerProps`

---

## 8. 실행 방법 변경

### Before (JavaScript)

```bash
# 루트에서 동시 실행
npm start
# 또는 개별 실행
cd back && nodemon ./server.js
cd front && npm start
```

### After (TypeScript)

```bash
# 루트에서 동시 실행 (변경 없음)
npm start

# 백엔드 개별 실행
cd back && npm run server          # tsx watch ./server.ts

# 프론트엔드 개별 실행 (변경 없음)
cd front && npm start              # CRA가 자동으로 .tsx 처리

# 타입 체크
cd back && npm run typecheck       # tsc --noEmit
cd front && npx tsc --noEmit

# 백엔드 빌드
cd back && npm run build           # tsc → dist/ 출력
```

### 루트 package.json 변경 필요

```diff
  "scripts": {
-   "start": "concurrently \"cd ./back && npm run server\" \"cd ./front && npm start\""
+   "start": "concurrently \"cd ./back && npm run server\" \"cd ./front && npm start\""
  }
```
루트 스크립트는 변경 없음 — `back/package.json`의 `server` 스크립트가 내부적으로 변경됨.

---

## 9. 주의 사항

### 9.1 ServiceInformation.js

`ServiceInformation.js`는 Git-ignored 파일로, 프로젝트에 포함되지 않는다.
이 파일은 `.js` 형태를 그대로 유지하되, `.d.ts` 파일로 타입만 선언하였다.

**백엔드** (`back/ServiceInformation.d.ts`):
```typescript
declare const Info: { databaseURI: string; encryptKey: string; };
export default Info;
```

**프론트엔드** (`front/src/ServiceInformation.d.ts`):
```typescript
declare const Info: { databaseURI: string; getloginStateURI: string; setloginStateURI: string; logoutURI: string; };
export default Info;
```

### 9.2 GraphQL 응답 타이핑

현재 GraphQL 응답은 `any` 타입으로 처리된 부분이 있다. 향후 `@graphql-codegen`을 도입하면 GraphQL 스키마에서 자동으로 TypeScript 타입을 생성할 수 있다.

### 9.3 CRA와 TypeScript

CRA(react-scripts 5.0.1)는 TypeScript를 기본 지원하므로 별도의 webpack/babel 설정 없이 `.tsx` 파일을 처리한다. `tsconfig.json`만 올바르게 설정하면 된다.

### 9.4 `tsx` 런타임

백엔드에서 `nodemon`을 `tsx watch`로 대체하였다. `tsx`는 TypeScript를 별도 컴파일 없이 직접 실행하며, `watch` 모드로 파일 변경 시 자동 재시작한다.

---

> *이 문서는 JavaScript → TypeScript 전체 마이그레이션 작업의 상세 기록입니다.*
