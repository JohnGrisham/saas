import InnerHTML from 'dangerously-set-html-content';

export interface TemplateProps {
  html: string;
}

export const Template: React.FC<TemplateProps> = ({ html }) => (
  <InnerHTML className="template-container" html={html} />
);
