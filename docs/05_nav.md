# 05 navigating between pages

## 이 장에서 배울 것

- 구성 요소를 사용하는 방법 next/link.
- 후크 를 사용하여 활성 링크를 표시하는 방법 usePathname().
- Next.js에서 탐색이 작동하는 방식.

## 탐색 최적화 이유

a 태그를 사용하는 경우에는 page refresh가 발생하므로, next/link를 사용하여 페이지 이동을 하면 페이지 이동이 더 빠르게 이루어진다.

## nextjs 에서 페이지 이동

애플리케이션의 일부가 서버에서 렌더링되지만 전체 페이지 새로 고침이 없으므로 웹 앱처럼 느껴집니다

```tsx
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// ...

export default function NavLinks() {
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
```

## 자동 코드 분할 및 프리패치

탐색 경험을 향상시키기 위해 Next.js는 경로 세그먼트별로 애플리케이션을 자동으로 코드 분할합니다. 기존 React SPA 와는 다릅니다., 브라우저는 초기 로드 시 모든 애플리케이션 코드를 로드합니다.

경로별로 코드를 분할한다는 것은 페이지가 격리된다는 의미입니다. 특정 페이지에서 오류가 발생하더라도 애플리케이션의 나머지 부분은 계속 작동합니다.

또한 프로덕션 환경에서 `<Link>` 구성 요소가 브라우저의 뷰포트에 나타날 때마다 Next.js는 백그라운드에서 연결된 경로에 대한 코드를 자동으로 미리 가져옵니다 . 사용자가 링크를 클릭하면 대상 페이지의 코드가 이미 백그라운드에 로드되어 페이지 전환이 거의 즉각적으로 이루어집니다!

## 참조 링크

- [how-routing-and-navigation-works](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#how-routing-and-navigation-works)
