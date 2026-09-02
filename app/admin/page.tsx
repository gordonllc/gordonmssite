import { notFound } from 'next/navigation';
import { chatGPTSignOutPath, requireChatGPTUser } from '../chatgpt-auth';
import { isAdminEmail, listEquipment } from '../../db/equipment';
import InventoryManager from './inventory-manager';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await requireChatGPTUser('/admin');
  if (!isAdminEmail(user.email)) notFound();
  const items = await listEquipment({ publishedOnly: false });

  return (
    <InventoryManager
      initialItems={items}
      userName={user.fullName || user.email}
      signOutHref={chatGPTSignOutPath('/')}
    />
  );
}
