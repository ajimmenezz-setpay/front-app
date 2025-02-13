import PropTypes from 'prop-types'

import { Form, FormikProvider } from 'formik'

FormProvider.propTypes = {
  children: PropTypes.node.isRequired,
  formik: PropTypes.object.isRequired
}

export function FormProvider({ children, formik }) {
  return (
    <FormikProvider value={formik}>
      <Form onSubmit={formik.handleSubmit}>{children}</Form>
    </FormikProvider>
  )
}
