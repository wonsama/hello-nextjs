'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { sql } from '@vercel/postgres';
import { z } from 'zod';

// FormSchema는 Zod 스키마로, 폼 검증을 위해 사용됩니다. 이 스키마는 다음 속성을 가진 객체의 형태를 정의합니다:
// id: 문자열
// customerId: 문자열
// amount: 숫자
// status: 'pending' 또는 'paid'만 가능한 문자열
// date: 문자열
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});
// CreateInvoice는 FormSchema에서 'id'와 'date' 속성을 생략한 새로운 스키마입니다.
// 이는 새로운 인보이스를 생성할 때 유용하며, 'id'와 'date'는 일반적으로 서버에서 생성되므로 사용자에게 제공되지 않습니다.
const CreateInvoice = FormSchema.omit({ id: true, date: true });

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

  // 이 코드는 '/dashboard/invoices' 경로의 데이터를 재검증하도록 트리거합니다.
  // SWR (Stale While Revalidate)의 맥락에서 이는 이 경로의 데이터가 서버에서 다시 가져와지도록 하여,
  // 대시보드의 송장 섹션에 가장 최신의 데이터가 표시되도록 합니다.
  revalidatePath('/dashboard/invoices');

  // 이 코드는 사용자를 '/dashboard/invoices' 경로로 리다이렉트합니다.
  // 이는 일반적으로 특정 작업을 완료한 후 사용자를 대시보드의 송장 섹션으로 안내할 때 사용됩니다.
  redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  // 위 작업은 `/dashboard/invoices` 경로에서 발생하기 때문에 `redirect` 를 수행할 필요가 없음
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}
