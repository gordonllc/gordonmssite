import { redirect } from 'next/navigation';
import { getAdminUser } from '../lib/auth';
import { listEquipment } from '../../db/equipment';
import { listInquiries } from '../../db/inquiries';
import InventoryManager from './inventory-manager';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminPage() {
  const user = await getAdminUser();
  if (!user) redirect('/admin/login');
  const [items, inquiries] = await Promise.all([
    listEquipment({ publishedOnly: false }),
    listInquiries(),
  ]);

  return (
    <InventoryManager
      initialItems={items}
      initialInquiries={inquiries}
      userName={user.fullName || user.email}
    />
  );
}
