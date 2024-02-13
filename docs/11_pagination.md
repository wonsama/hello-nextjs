# 11 Adding Search and Pagination

## 이 장에서 배울 것

- Next.js API searchParams, usePathname, useRouter 에 대해 알아봅니다.
- URL 검색 매개변수를 사용하여 검색 및 페이징을 구현합니다.

## 시작하기

```tsx
//=>app\dashboard\invoices\page.tsx
export default async function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      {/*  <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense> */}
      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
    </div>
  );
}
```

작업할 페이지와 구성 요소에 익숙해지는 데 시간을 투자하세요.

- `<Search/>` 사용자가 특정 송장을 검색할 수 있습니다.
- `<Pagination/>` 사용자가 청구서 페이지 간을 탐색할 수 있습니다.
- `<Table/>` 송장을 표시합니다.

검색 기능은 클라이언트와 서버에 걸쳐 있습니다. 사용자가 클라이언트에서 송장을 검색하면 URL 매개변수가 업데이트되고 서버에서 데이터를 가져오며 테이블은 새 데이터로 서버에서 다시 렌더링됩니다.

## URL 검색 매개변수를 사용하는 이유는 무엇입니까?

URL 검색 매개변수를 사용하여 검색 상태를 관리하게 됩니다. 클라이언트측 상태를 사용하여 수행하는 데 익숙하다면 이 패턴이 새로운 것일 수 있습니다.

URL 매개변수를 사용하여 검색을 구현하면 다음과 같은 몇 가지 이점이 있습니다.

- 북마크 가능 및 공유 가능 URL : 검색 매개변수가 URL에 있으므로 사용자는 향후 참조 또는 공유를 위해 검색 쿼리 및 필터를 포함하여 애플리케이션의 현재 상태를 북마크에 추가할 수 있습니다.
- 서버 측 렌더링 및 초기 로드 : URL 매개변수를 서버에서 직접 사용하여 초기 상태를 렌더링할 수 있으므로 서버 렌더링을 더 쉽게 처리할 수 있습니다.
- 분석 및 추적 : URL에 직접 검색어와 필터가 있으면 추가 클라이언트 측 논리 없이도 사용자 행동을 더 쉽게 추적할 수 있습니다.

## 검색 기능 추가

검색 기능을 구현하는 데 사용할 Next.js 클라이언트 후크는 다음과 같습니다.

- useSearchParams- 현재 URL의 매개변수에 액세스할 수 있습니다. 예를 들어, 이 URL에 대한 검색 매개변수는 /dashboard/invoices?page=1&query=pending다음과 같습니다 {page: '1', query: 'pending'}.
- usePathname- 현재 URL의 경로명을 읽을 수 있습니다. 예를 들어 경로의 경우 /dashboard/invoices는 usePathname을 반환합니다 '/dashboard/invoices'.
- useRouter- 프로그래밍 방식으로 클라이언트 구성 요소 내의 경로 간 탐색을 활성화합니다. 사용할 수 있는 방법은 여러 가지가 있습니다 .

구현 단계에 대한 간략한 개요는 다음과 같습니다.

1. 사용자의 입력을 캡처합니다.
2. 검색 매개변수로 URL을 업데이트합니다.
3. URL을 입력 필드와 동기화 상태로 유지하세요.
4. 검색어를 반영하도록 테이블을 업데이트합니다.

## 1. 사용자의 입력을 캡처합니다

```tsx
//=> app\ui\search.tsx
function handleSearch(term: string) {
  console.log(term);
}

...

onChange={(e) => {
  handleSearch(e.target.value);
}}
```

## 2. 검색 매개변수로 URL을 업데이트합니다

```tsx
//=> app\ui\search.tsx
'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function Search() {
  const searchParams = useSearchParams(); // 파라미터
  const pathname = usePathname(); // 경로
  const { replace } = useRouter(); // 경로 변경

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }
}
```

- ${pathname}귀하의 경우 현재 경로입니다 "/dashboard/invoices".
- 사용자가 검색창에 입력하면 params.toString()이 입력이 URL 친화적인 형식으로 변환됩니다.
- Next.js의 클라이언트 측 탐색 덕분에 페이지를 다시 로드하지 않고도 URL이 업데이트됩니다

## 참조링크

- [use-router#userouter](https://nextjs.org/docs/app/api-reference/functions/use-router#userouter)
- [navigating-between-pages](https://nextjs.org/learn/dashboard-app/navigating-between-pages)
