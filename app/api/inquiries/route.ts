import { createInquiry, parseInquiryInput } from '../../../db/inquiries';
import { runInquiryEmailAutomation } from '../../lib/inquiry-email';
import { readJsonBody, sameOrigin } from '../../lib/request';
import { limitKey } from '../../lib/session';
import { consumeLimit } from '../../../db/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  try {
    const input = parseInquiryInput(await readJsonBody(request));
    if (input.website) return Response.json({ received: true }, { status: 201 });
    if (!await consumeLimit('public-inquiries', 100, 60 * 60 * 1000)
      || !await consumeLimit(limitKey('inquiry', input.email), 5, 15 * 60 * 1000)) {
      return Response.json({ error: 'Too many requests. Please try again later or call Gordon.' }, { status: 429 });
    }
    const inquiry = await createInquiry(input);
    const automation = await runInquiryEmailAutomation(inquiry);
    return Response.json({
      received: true,
      inquiryId: inquiry.id,
      acknowledgementSent: automation.customerSent,
    }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We could not send your request.';
    const validation = /^(Enter |Request |Use a JSON)/.test(message);
    if (!validation) console.error('Inquiry could not be saved.', error);
    return Response.json({ error: validation ? message : 'We could not save your request. Please try again or call 770-769-5281.' }, { status: validation ? 400 : 503 });
  }
}
