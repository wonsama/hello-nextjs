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

```tsx
// => /dashboard/invoices/create/page.tsx

import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';

export default async function Page() {
  const customers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}
```

## 2. 서버 액션 생성

create / update / delete 서버 엑션을 생성

## 3. 다음에서 데이터를 추출합니다.formData

```tsx
export async function createInvoice(formData: FormData) {
  const rawFormData = {
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  };
  // Test it out:
  console.log(rawFormData);
}
```

필드가 많은 경우 아래 코드를 사용하여 데이터를 추출할 수 있습니다.

```tsx
export async function createInvoice(formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());
  // Test it out:
  console.log(rawFormData);
}
```

## 4. 데이터 검증 및 준비

```tsx
// ...
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
}
```

## 5. 데이터베이스에 데이터 삽입

```tsx
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
}
```

## 6. 재검증 및 리디렉션

> 캐시를 지우고 재 검증 요청 트리거 후 리디렉션

Next.js에는 한동안 사용자 브라우저에 경로 세그먼트를 저장하는 클라이언트 측 라우터 캐시가 있습니다. 프리페칭 과 함께 이 캐시를 사용하면 사용자가 서버에 대한 요청 수를 줄이면서 경로 간을 빠르게 탐색할 수 있습니다.

청구서 경로에 표시된 데이터를 업데이트하고 있으므로 이 캐시를 지우고 서버에 대한 새 요청을 트리거하려고 합니다. Next.js의 함수를 사용하여 이 작업을 수행할 수 있습니다 revalidatePath.

```tsx
'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

// ...

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}
```

1. zod 를 통한 form schema 생성
2. zod 를 통해 제외(omit)할 필드 선택
3. sql 실행
4. revalidatePath : 값 변경시 재검증 경로를 지정
5. redirect : 리디렉션 경로 지정

## 송장 업데이트

1. 송장을 사용하여 새 동적 경로 세그먼트를 만듭니다 id.
2. id페이지 매개변수에서 송장을 읽어보세요 .
3. 데이터베이스에서 특정 송장을 가져옵니다.
4. 송장 데이터로 양식을 미리 채웁니다.
5. 데이터베이스의 송장 데이터를 업데이트하십시오.

<img src="images/12_mutating_02.png" alt="image" style="width:auto;max-height:300px;">

```txt
UUID와 자동 증가 키 비교

당사는 키(예: 1, 2, 3 등)를 증가시키는 대신 UUID를 사용합니다. 이로 인해 URL이 길어지지만, UUID는 ID 충돌의 위험을 없애고 전 세계적으로 고유하며 열거 공격의 위험을 줄여 대규모 데이터베이스에 이상적입니다.

그러나 보다 깔끔한 URL을 선호한다면 자동 증가 키를 사용하는 것이 좋습니다.
```

## 4. 서버 엑션에 id 값 전달

마지막으로 데이터베이스에서 올바른 레코드를 업데이트할 수 있도록 서버 액션에 ID를 전달하려고 합니다. 이렇게 ID를 인자로 전달할 수는 없습니다:

```tsx
// ID를 인수로 전달하면 작동하지 않습니다.
<form action={updateInvoice(id)}>
```

```tsx
// 대신 JS 바인딩을 사용하여 서버 액션에 아이디를 전달할 수 있습니다. 이렇게 하면 서버 액션에 전달된 모든 값이 인코딩됩니다.
const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);

<form action={updateInvoiceWithId}>
```

## 참조

- edit 후 다시 수정 화면 들어가면 이전 캐싱된 값이 남는 현상이 발생 ( revalidatePath ) 사용 부분 재확인 필요
