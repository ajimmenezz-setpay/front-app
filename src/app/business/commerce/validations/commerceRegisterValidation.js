import * as Yup from 'yup'

export const commerceRegisterValidation = store => {
  const registerValidation = Yup.object({
    name: Yup.string().required('El nombre es requerido'),
    lastName: Yup.string().required('Los apellidos son requeridos'),
    email: Yup.string().email('Ingresa un correo valido').required('El correo es requerido'),
    phone: Yup.string()
      .required('El telefono es requerido')
      .test('longitud', 'El telefono es muy corto', value => !(value && value.replace(/[\s+]/g, '').length < 10)),
    password: Yup.string()
      .required('La contraseña es requerida')
      .matches(
        '^(?=(?:.*\\d))(?=.*[A-Z])(?=.*[a-z])(?=.*[_\\-.\\@])\\S{8,16}$',
        'La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula , un número y un caracter especial [ - _ . @]'
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden')
      .required('La confirmación de la contraseña es requerida'),
    terms: Yup.bool().oneOf([true], 'Debe aceptar los acuerdos y condiciones')
  })

  const initRegister = {
    name: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  }

  return {
    schema: registerValidation,
    initialValues: initRegister
  }
}
