import CmsAdminPage from '../../_cms';
import { GeneralSettingsAdmin } from '../../components/cms/SettingsAdmins';

export default function Page() {
  return (
    <CmsAdminPage>
      <GeneralSettingsAdmin />
    </CmsAdminPage>
  );
}
