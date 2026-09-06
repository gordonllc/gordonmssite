import { createInquiry, parseInquiryInput } from '../../../db/inquiries';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const input = parseInquiryInput(await request.json());
    if (input.website) return Response.json({ received: true }, { status: 201 });
    const inquiry = await createInquiry(input);
    return Response.json({ received: true, inquiryId: inquiry.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We could not send your request.';
    return Response.json({ error: message }, { status: 400 });
  }
}
