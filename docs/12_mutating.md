# 11 Mutating Data

이제 송장 생성, 업데이트 및 삭제 기능을 추가하여 송장 페이지에서 계속 작업해 보겠습니다

## 이 장에서 배울 것

- React 서버 액션이란 무엇이며, 이를 사용하여 데이터를 변경하는 방법을 알아봅니다.
- 폼과 서버 컴포넌트로 작업하는 방법.
- 타입 유효성 검사를 포함한 네이티브 formData 객체로 작업하는 모범 사례.
- 재검증 경로 API를 사용하여 클라이언트 캐시를 재검증하는 방법.
- 특정 ID로 동적 경로 세그먼트를 만드는 방법.

## 서버 작업과 함께 양식 사용

```tsx
// Server Component
export default function Page() {
  // Action
  async function create(formData: FormData) {
    'use server';

    // Logic to mutate data...
  }

  // Invoke the action using the "action" attribute
  return <form action={create}>...</form>;
}
```

## 송장 만들기

새 송장을 생성하기 위해 수행할 단계는 다음과 같습니다.

1. 사용자의 입력을 캡처하는 양식을 만듭니다.
2. 서버 작업을 만들고 양식에서 호출합니다.
3. 서버 작업 내에서 formData개체에서 데이터를 추출합니다.
4. 데이터베이스에 삽입할 데이터를 검증하고 준비합니다.
5. 데이터를 삽입하고 오류를 처리합니다.
6. 캐시를 재검증하고 사용자를 청구서 페이지로 다시 리디렉션합니다.

### 1. 사용자의 입력을 캡처하는 양식을 만듭니다

<img src="images/12_mutating_01.png" alt="image" style="width:auto;max-height:300px;">
