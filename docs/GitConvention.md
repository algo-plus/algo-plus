# Branch Naming Convention

## Branch Naming

-   `type/[요약]`
-   kebab-case
    -   무조건 소문자로 작성
    -   띄어쓰기는 대시(-)
-   `요약`은 영어로 작성
-   ex) feature/login-api

## Type

-   **feature**
-   **fix**
-   **hotfix**
-   **test**

# Commit Message Convention

## Commit Message

-   `Type: content`
-   `:`뒤에만 space가 있음에 유의한다.
-   `content`는 한글로 자세히 작성

## Type

-   **Feat**: 새로운 기능 추가
-   **Fix**: 버그 수정
-   **Docs**: 문서 수정
-   **Style**: 코드 포맷 변경, 세미콜론 누락, 오타, 변수명 변경 등; 코드 수정이 없는 경우
-   **Refactor**: 코드 리팩토링
-   **Test**: 테스트 추가, 테스트 리팩토링; 프로덕션 코드 수정이 없는 경우
-   **Chore**: 빌드 태스크 업데이트, 패키지 매니저 실행 등; 프로덕션 코드 수정이 없는 경우
-   **Design**: CSS 등 사용자 UI 디자인 변경
-   **Comment**: 필요한 주석 추가 및 변경
-   **Rename**: 파일, 폴더명 수정 및 이동
-   **Remove**: 파일 삭제
-   **Conflict:** 머지 시 충돌을 해결한 경우
-   **Merge:** 브랜치명 into develop
-   **!HOTFIX**: 급하게 치명적인 버그를 고쳐야 하는 경우

## Pull Request Template

## ✅ DONE

-   완료된 작업

## 📝 TODO

-   브랜치 안에서 미완료된 작업

## 🚀 RESULT

-   보여줄 수 있는 결과물
