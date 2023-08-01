'use client';
import { Form } from 'ui';

const TemplateForm = () => (
  <Form
    innerFormProps={{ id: 'template-form' }}
    initialValues={{}}
    onSubmit={(values) => console.log(values)}
  />
);

export default TemplateForm;
