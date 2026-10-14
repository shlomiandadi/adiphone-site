import CmsAdminPage from '../_cms';
import { AnnouncementAdmin } from '../components/cms/SettingsAdmins';

export default function Page() {
  return (
    <CmsAdminPage>
      <AnnouncementAdmin />
    </CmsAdminPage>
  );
}
