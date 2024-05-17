## 전제조건

-   [node + npm](https://nodejs.org/) (v20.11.1)

## 프로젝트 구조

-   src: 컨텐츠 스크립트 파일
-   public: 정적 파일
-   dist: 크롬 익스텐션 디렉토리
-   dist/js: 생성된 자바스크립트 파일

## 환경 설정

#### .env

-   프로젝트 루트에 위치

```ini
REACT_APP_GITHUB_CLIENT_ID={깃허브 클라이언트 ID}
REACT_APP_GITHUB_CLIENT_SECRET={깃허브 클라이언트 토큰}
REACT_APP_RAPID_API_KEY={RAPID API KEY}
REACT_APP_RAPID_API_HOST={RAPID API HOST}
```

#### 깃허브 연동

-

#### 컴파일러 API 연동

-

## 설치

```
npm install
```

## 빌드

```
npm run build
```

## 와치 모드로 빌드

```
npm run watch
```

## 크롬으로 로드 확장

Load `dist` directory

## 테스트

`npx jest` or `npm run test`
