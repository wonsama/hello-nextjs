# 01 getting started

> [dashboard-app/getting-started](https://nextjs.org/learn/dashboard-app/getting-started)

## 폴더 구조

/app: 애플리케이션에 대한 모든 경로, 구성 요소 및 논리가 포함되어 있으며 여기서 주로 작업하게 됩니다.
/app/lib: 재사용 가능한 유틸리티 함수, 데이터 가져오기 함수 등 애플리케이션에서 사용되는 함수가 포함되어 있습니다.
/app/ui: 카드, 테이블, 양식 등 애플리케이션의 모든 UI 구성 요소가 포함되어 있습니다. 시간을 절약하기 위해 이러한 구성 요소의 스타일이 미리 지정되어 있습니다.
/public: 이미지와 같은 애플리케이션의 모든 정적 자산을 포함합니다.
/scripts: 이후 장에서 데이터베이스를 채우는 데 사용할 시드 스크립트가 포함되어 있습니다.
구성 파일next.config.js : 애플리케이션 루트에 구성 파일도 있습니다 . 이러한 파일의 대부분은 를 사용하여 새 프로젝트를 시작할 때 생성되고 사전 구성됩니다 create-next-app. 이 과정에서는 수정할 필요가 없습니다.

## placeholder 데이터

사용자 인터페이스를 구축할 때 일부 자리 표시자 데이터가 있으면 도움이 됩니다. 데이터베이스나 API를 아직 사용할 수 없는 경우 다음을 수행할 수 있습니다.

> /app/lib/placeholder-data.js

## 타입스크립트

> /app/lib/definitions.ts

데이터베이스에서 반환될 유형을 수동으로 정의

## 설치 및 실행

```bash
# 의존성 설치
npm i

# 개발 서버 실행
npm run dev
```
