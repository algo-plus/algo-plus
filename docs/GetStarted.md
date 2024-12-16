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
JDOODLE_CLIENT_ID=YOUR_CLIENT_ID
JDOODLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
JDOODLE_API_URL=https://api.jdoodle.com/v1/execute
```

#### 컴파일러 API 연동
Algo Plus에서는 테스트케이스 실행 기능을 위해 [JDoodle Compiler API](https://www.jdoodle.com/integrate-online-ide-compiler-api-plugins)를 이용하고 있습니다. <br>
테스트 케이스 실행 관련한 기능 이용이나 기여 참여를 위해 해당 설정이 필요합니다. <br>

아래는 JDoodle Compiler API의 클라이언트 id와 secret을 발급받는 과정입니다.
1. __[JDoodle](https://www.jdoodle.com/) 사이트에 접속합니다.__
2. __회원 가입 및 로그인을 실시합니다.__ <br>
3. __[Subscribe Plan](https://www.jdoodle.com/subscribe-api) 페이지로 이동해 Free Plan이 활성화되어 있는지 확인합니다.__
    - 해당 플랜은 하루에 20번 API 호출이 가능합니다. _(2024년 12월 기준)_
5. __페이지 좌측 상단 `Generate Client ID` 버튼을 클릭하여 Client ID를 생성합니다.__
   ![image](https://github.com/user-attachments/assets/8f54d041-23ad-4c65-89c9-11a487c36577)
6. __발급된 Client ID와 Secret을 .env 파일에 각각 채워주세요!__

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
