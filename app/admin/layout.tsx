import { redirect } from 'next/navigation';
import { getUser, getUserRole } from '@/lib/auth';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) {
    redirect('/auth/login');
  }

  const role = await getUserRole();
  if (role !== 'admin' && role !== 'super_admin') {
    redirect('/');
  }

  return <AdminLayout>{children}</AdminLayout>;
}

