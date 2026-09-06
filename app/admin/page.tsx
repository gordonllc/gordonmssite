import { notFound } from 'next/navigation';
import { chatGPTSignOutPath, requireChatGPTUser } from '../chatgpt-auth';
import { isAdminEmail, listEquipment } from '../../db/equipment';
import { listInquiries } from '../../db/inquiries';
import InventoryManager from './inventory-manager';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await requireChatGPTUser('/admin');
  if (!isAdminEmail(user.email)) notFound();
  const [items, inquiries] = await Promise.all([
    listEquipment({ publishedOnly: false }),
    listInquiries(),
  ]);

  return (
    <InventoryManager
      initialItems={items}
      initialInquiries={inquiries}
      userName={user.fullName || user.email}
      signOutHref={chatGPTSignOutPath('/')}
    />
  );
}
