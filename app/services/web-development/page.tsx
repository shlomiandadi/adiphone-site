import WebDevelopmentView from './WebDevelopmentView';
import { getWebsitePortfolioProjects } from '../../../lib/website-projects';

export default async function WebDevelopmentPage() {
  const projects = await getWebsitePortfolioProjects();
  return <WebDevelopmentView projects={projects} />;
}
