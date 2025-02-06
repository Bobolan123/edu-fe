import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
 
export default function AdminPage() {
  const t = useTranslations('Home');
  return (
    <div>
      <h1>Admin</h1>
    </div>
  );
}