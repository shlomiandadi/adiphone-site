import PortfolioEditor from '../../../components/PortfolioEditor';

interface EditPortfolioProjectProps {
  params: {
    slug: string;
  };
}

export default function EditPortfolioProject({ params }: EditPortfolioProjectProps) {
  return <PortfolioEditor mode="edit" projectId={params.slug} />;
} 