const documentTypes = {
  ACTA_CONSTITUTIVA: 'Acta Constitutiva',
  DOCUMENTO_PODER: 'Documento Poder',
  IDENTIFICACION: 'Identificación',
  CEDULA_FISCAL_EMPRESA: 'Cédula Fiscal de la Empresa',
  CEDULA_FISCAL_APODERADO: 'Cédula Fiscal del Apoderado',
  COMPROBANTE_DOMICILIO: 'Comprobante de Domicilio'
}

const documentList = {
  ACTA_CONSTITUTIVA: {
    accept: {
      'image/*': ['.jpeg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    expiration: null,
    moralPerson: true
  },
  DOCUMENTO_PODER: {
    accept: {
      'image/*': ['.jpeg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    expiration: null,
    moralPerson: true
  },
  IDENTIFICACION: {
    accept: {
      'image/*': ['.jpeg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    expiration: null,
    moralPerson: 'all'
  },
  CEDULA_FISCAL_EMPRESA: {
    accept: {
      'image/*': ['.jpeg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    expiration: 'No Mayor a 2 meses',
    moralPerson: true
  },
  CEDULA_FISCAL_APODERADO: {
    accept: {
      'image/*': ['.jpeg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    expiration: 'No Mayor a 2 meses',
    moralPerson: 'all'
  },
  COMPROBANTE_DOMICILIO: {
    accept: {
      'image/*': ['.jpeg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    expiration: 'No Mayor a 2 meses',
    moralPerson: 'all'
  }
}

export { documentList, documentTypes }
