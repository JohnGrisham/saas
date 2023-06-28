'use client';
import { Field, FieldProps } from 'ui';
import { useSession } from 'next-auth/react';

export default function TemplateValue(props: FieldProps) {
  const session = useSession();

  console.log(session);
  return <Field {...props} />;
}
