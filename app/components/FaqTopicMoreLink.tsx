import Link from 'next/link';
import {
  faqTopicForService,
  faqTopicForServicePath,
  type ServiceFaqTopicLink,
} from '../../lib/service-faq-topic';

type Props = {
  topic?: string;
  titleHe?: string;
  href?: string;
  serviceType?: string;
  servicePath?: string;
};

function resolveLink(props: Props): ServiceFaqTopicLink | null {
  if (props.topic && props.titleHe) {
    return {
      topic: props.topic,
      titleHe: props.titleHe,
      href: props.href || `/faq/${props.topic}`,
    };
  }
  if (props.servicePath) {
    return faqTopicForServicePath(props.servicePath);
  }
  return faqTopicForService(props.serviceType, props.servicePath);
}

export default function FaqTopicMoreLink(props: Props) {
  const match = resolveLink(props);
  if (!match) return null;

  const label = `עוד שאלות ותשובות על ${match.titleHe}`;

  return (
    <p className="mt-8 text-center text-lg text-gray-700 dark:text-gray-300" dir="rtl">
      <Link
        href={match.href}
        className="font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        «{label}»
      </Link>
    </p>
  );
}
