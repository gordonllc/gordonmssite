import { authorizeAdminRequest } from '../../../../lib/admin';
import { updateInquiryStatus, type InquiryStatus } from '../../../../../db/inquiries';
import { readJsonBody } from '../../../../lib/request';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authorizeAdminRequest(request);
  if (auth.error) return auth.error;

  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id < 1) return Response.json({ error: 'Invalid inquiry.' }, { status: 400 });

  const body = await readJsonBody(request).catch(() => ({})) as { status?: InquiryStatus };
  const statuses: InquiryStatus[] = ['New', 'Contacted', 'Closed'];
  if (!body.status || !statuses.includes(body.status)) {
    return Response.json({ error: 'Choose a valid inquiry status.' }, { status: 400 });
  }

  try {
    const inquiry = await updateInquiryStatus(id, body.status);
    if (!inquiry) return Response.json({ error: 'Inquiry not found.' }, { status: 404 });
    return Response.json({ inquiry });
  } catch {
    return Response.json({ error: 'Unable to update the inquiry. Please try again.' }, { status: 503 });
  }
}
