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
REACT_APP_RAPID_API_KEY={RAPID_API_KEY}
REACT_APP_RAPID_API_HOST=code-compiler10.p.rapidapi.com
```

#### 컴파일러 API 연동
Algo Plus에서는 테스트케이스 실행 기능을 위해 Rapid API의 Code compiler를 이용하고 있습니다. <br>
테스트 케이스 실행 관련 기능을 이용하시거나, 기여에 참여하시기 위해선 해당 설정이 필요합니다. <br>

아래는 Code compiler의 API Key를 발급받는 과정입니다.
1. __[rapidapi-code-compiler](https://rapidapi.com/realbrain-realbrain-default/api/code-compiler10/) 사이트에 접속합니다.__
2. __Pricing 탭으로 이동한 후, 원하는 요금제를 선택해주세요.__ <br>
   기여를 위해 테스트를 하는 정도라면 Basic 요금제를 추천드립니다. 해당 서비스는 로그인을 필요로 합니다.
   ![image](https://github.com/algo-plus/algo-plus/assets/72266806/22833871-afd7-41d1-a5f2-a2d0caecede4)
3. __요금제 가입을 위해 카드 정보 입력이 필요합니다. 카드 정보를 입력한 후, subscribe 버튼을 눌러주세요.__
4. __구독이 완료한 후 다시 Pricing 탭으로 이동하면 결제한 요금제에 Manage And View Usage 버튼이 활성화됩니다.__
5. __버튼을 눌러 이동하면 왼쪽 사이드 바의 My Apps에서 앱 이름을 누른 후 Authorization 버튼을 눌러주세요.__
6. __발급된 API Key를 확인할 수 있습니다. 해당 API 키를 .env 파일의 {RAPID_API_KEY} 란에 채워주세요!__

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
