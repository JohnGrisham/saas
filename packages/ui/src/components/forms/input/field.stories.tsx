import { Field } from './field';
import { Formik } from 'formik';

const field = {
  title: 'Field',
  component: Field,
};

export default field;

export const Basic = () => (
  <div className="flex justify-center">
    <Formik initialValues={{}} onSubmit={() => {}}>
      <section>
        <Field name="Text No Label" placeholder="No Label" />
        <Field label="With Label" name="Text With Label" />
        <Field
          label="Number"
          name="number"
          type="number"
          placeholder="Enter a number"
        />
        <Field
          label="Required Email"
          name="email"
          type="email"
          placeholder="Email"
          required
        />
        <Field
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
        />
        <Field label="Date" name="date" type="date" />
      </section>
    </Formik>
  </div>
);
