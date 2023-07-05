'use client';
import * as React from 'react';
import { Field, FieldProps } from 'ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';

export default function TemplateValue(props: FieldProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const session = useSession();

  if (session.status === 'authenticated' && isEditing) {
    return (
      <Field
        {...props}
        onBlur={() => setIsEditing(false)}
        onKeyDown={({ key }) => {
          if (key === 'Enter') {
            setIsEditing(false);
          }
        }}
        inset
      />
    );
  }

  if (session.status === 'authenticated' && !isEditing) {
    return (
      <div
        className="cursor-pointer group"
        onDoubleClick={() => setIsEditing(true)}
      >
        {props.defaultValue ?? props.value}
        &nbsp;
        <FontAwesomeIcon
          className="invisible text-primary group-hover:visible"
          onClick={() => setIsEditing(true)}
          icon={faPenToSquare}
        />
      </div>
    );
  }

  return props.defaultValue ?? props.value;
}
