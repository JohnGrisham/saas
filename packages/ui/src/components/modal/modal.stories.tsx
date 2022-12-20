import * as React from 'react';
import { Button } from '../button';
import { Modal } from './modal';

const modal = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Modal',
  component: Modal,
};

export default modal;

export const Basic = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col justify-center">
      <Button onClick={() => setOpen(true)}>Show Modal</Button>
      <Modal title="Modal Title" isOpen={open} onClose={() => setOpen(false)}>
        <>Modal body text goes here.</>
      </Modal>
    </div>
  );
};
