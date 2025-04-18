import { convertCatalogToReactSelect } from '@/shared/utils'

const banks = [
  {
    clabe: '002',
    marca: 'BANAMEX',
    nombre: 'Banco Nacional de México, S.A., Institución de Banca Múltiple, Grupo Financiero Banamex'
  },
  {
    clabe: '006',
    marca: 'BANCOMEXT',
    nombre: 'Banco Nacional de Comercio Exterior, Sociedad Nacional de Crédito, Institución de Banca de Desarrollo'
  },
  {
    clabe: '009',
    marca: 'BANOBRAS',
    nombre:
      'Banco Nacional de Obras y Servicios Públicos, Sociedad Nacional de Crédito, Institución de Banca de Desarrollo'
  },
  {
    clabe: '012',
    marca: 'BBVA BANCOMER',
    nombre: 'BBVA Bancomer, S.A., Institución de Banca Múltiple, Grupo Financiero BBVA Bancomer'
  },
  {
    clabe: '014',
    marca: 'SANTANDER',
    nombre: 'Banco Santander (México), S.A., Institución de Banca Múltiple, Grupo Financiero Santander'
  },
  {
    clabe: '019',
    marca: 'BANJERCITO',
    nombre:
      'Banco Nacional del Ejército, Fuerza Aérea y Armada, Sociedad Nacional de Crédito, Institución de Banca de Desarrollo'
  },
  {
    clabe: '021',
    marca: 'HSBC',
    nombre: 'HSBC México, S.A., institución De Banca Múltiple, Grupo Financiero HSBC'
  },
  {
    clabe: '030',
    marca: 'BAJIO',
    nombre: 'Banco del Bajío, S.A., Institución de Banca Múltiple'
  },
  {
    clabe: '032',
    marca: 'IXE',
    nombre: 'IXE Banco, S.A., Institución de Banca Múltiple, IXE Grupo Financiero'
  },
  {
    clabe: '036',
    marca: 'INBURSA',
    nombre: 'Banco Inbursa, S.A., Institución de Banca Múltiple, Grupo Financiero Inbursa'
  },
  {
    clabe: '037',
    marca: 'INTERACCIONES',
    nombre: 'Banco Interacciones, S.A., Institución de Banca Múltiple'
  },
  {
    clabe: '042',
    marca: 'MIFEL',
    nombre: 'Banca Mifel, S.A., Institución de Banca Múltiple, Grupo Financiero Mifel'
  },
  {
    clabe: '044',
    marca: 'SCOTIABANK',
    nombre: 'Scotiabank Inverlat, S.A.'
  },
  {
    clabe: '058',
    marca: 'BANREGIO',
    nombre: 'Banco Regional de Monterrey, S.A., Institución de Banca Múltiple, Banregio Grupo Financiero'
  },
  {
    clabe: '059',
    marca: 'INVEX',
    nombre: 'Banco Invex, S.A., Institución de Banca Múltiple, Invex Grupo Financiero'
  },
  {
    clabe: '060',
    marca: 'BANSI',
    nombre: 'Bansi, S.A., Institución de Banca Múltiple'
  },
  {
    clabe: '062',
    marca: 'AFIRME',
    nombre: 'Banca Afirme, S.A., Institución de Banca Múltiple'
  },
  {
    clabe: '072',
    marca: 'BANORTE/IXE',
    nombre: 'Banco Mercantil del Norte, S.A., Institución de Banca Múltiple, Grupo Financiero Banorte'
  },
  {
    clabe: 102,
    marca: 'THE ROYAL BANK',
    nombre: 'The Royal Bank of Scotland México, S.A., Institución de Banca Múltiple'
  },
  {
    clabe: 103,
    marca: 'AMERICAN EXPRESS',
    nombre: 'American Express Bank (México), S.A., Institución de Banca Múltiple'
  },
  {
    clabe: 106,
    marca: 'BAMSA',
    nombre: 'Bank of America México, S.A., Institución de Banca Múltiple, Grupo Financiero Bank of America'
  },
  {
    clabe: 108,
    marca: 'TOKYO',
    nombre: 'Bank of Tokyo-Mitsubishi UFJ (México), S.A.'
  },
  {
    clabe: 110,
    marca: 'JP MORGAN',
    nombre: 'Banco J.P. Morgan, S.A., Institución de Banca Múltiple, J.P. Morgan Grupo Financiero'
  },
  {
    clabe: 112,
    marca: 'BMONEX',
    nombre: 'Banco Monex, S.A., Institución de Banca Múltiple'
  },
  {
    clabe: 113,
    marca: 'VE POR MAS',
    nombre: 'Banco Ve Por Mas, S.A. Institución de Banca Múltiple'
  },
  {
    clabe: 116,
    marca: 'ING',
    nombre: 'ING Bank (México), S.A., Institución de Banca Múltiple, ING Grupo Financiero'
  },
  {
    clabe: 124,
    marca: 'DEUTSCHE',
    nombre: 'Deutsche Bank México, S.A., Institución de Banca Múltiple'
  },
  {
    clabe: 126,
    marca: 'CREDIT SUISSE',
    nombre: 'Banco Credit Suisse (México), S.A. Institución de Banca Múltiple, Grupo Financiero Credit Suisse (México)'
  },
  {
    clabe: 127,
    marca: 'AZTECA',
    nombre: 'Banco Azteca, S.A. Institución de Banca Múltiple.'
  },
  {
    clabe: 128,
    marca: 'AUTOFIN',
    nombre: 'Banco Autofin México, S.A. Institución de Banca Múltiple'
  },
  {
    clabe: 129,
    marca: 'BARCLAYS',
    nombre: 'Barclays Bank México, S.A., Institución de Banca Múltiple, Grupo Financiero Barclays México'
  },
  {
    clabe: 130,
    marca: 'COMPARTAMOS',
    nombre: 'Banco Compartamos, S.A., Institución de Banca Múltiple'
  },
  {
    clabe: 131,
    marca: 'BANCO FAMSA',
    nombre: 'Banco Ahorro Famsa, S.A., Institución de Banca Múltiple'
  },
  {
    clabe: 132,
    marca: 'BMULTIVA',
    nombre: 'Banco Multiva, S.A., Institución de Banca Múltiple, Multivalores Grupo Financiero'
  },
  {
    clabe: 133,
    marca: 'ACTINVER',
    nombre: 'Banco Actinver, S.A. Institución de Banca Múltiple, Grupo Financiero Actinver'
  },
  {
    clabe: 134,
    marca: 'WAL-MART',
    nombre: 'Banco Wal-Mart de México Adelante, S.A., Institución de Banca Múltiple'
  },
  {
    clabe: 135,
    marca: 'NAFIN',
    nombre: 'Nacional Financiera, Sociedad Nacional de Crédito, Institución de Banca de Desarrollo'
  },
  {
    clabe: 136,
    marca: 'INTERCAM BANCO',
    nombre: 'Intercam Banco, S.A., Institución de Banca Múltiple, Intercam Grupo Financiero'
  },
  {
    clabe: 137,
    marca: 'BANCOPPEL',
    nombre: 'BanCoppel, S.A., Institución de Banca Múltiple'
  },
  {
    clabe: 138,
    marca: 'ABC CAPITAL',
    nombre: 'ABC Capital, S.A., Institución de Banca Múltiple'
  },
  {
    clabe: 139,
    marca: 'UBS BANK',
    nombre: 'UBS Bank México, S.A., Institución de Banca Múltiple, UBS Grupo Financiero'
  },
  {
    clabe: 140,
    marca: 'CONSUBANCO',
    nombre: 'Consubanco, S.A. Institución de Banca Múltiple'
  },
  {
    clabe: 141,
    marca: 'VOLKSWAGEN',
    nombre: 'Volkswagen Bank, S.A., Institución de Banca Múltiple'
  },
  {
    clabe: 143,
    marca: 'CIBANCO',
    nombre: 'CIBanco, S.A.'
  },
  {
    clabe: 145,
    marca: 'BBASE',
    nombre: 'Banco Base, S.A., Institución de Banca Múltiple'
  },
  {
    clabe: 147,
    marca: 'BANKAOOL',
    nombre: 'Bankaool, S.A., Institución de Banca Múltiple'
  },
  {
    clabe: 148,
    marca: 'PAGATODO',
    nombre: 'Banco PagaTodo, S.A., Institución de Banca Múltiple'
  },
  {
    clabe: 149,
    marca: 'FORJADORES',
    nombre: 'Banco Forjadores, S.A., Institución de Banca Múltiple'
  },
  {
    clabe: 150,
    marca: 'INMOBILIARIO',
    nombre: 'Banco Inmobiliario Mexicano, S.A., Institución de Banca Múltiple'
  },
  {
    clabe: 151,
    marca: 'DONDÉ',
    nombre: 'Fundación Dondé Banco, S.A., Institución de Banca Múltiple'
  },
  {
    clabe: 152,
    marca: 'BANCREA',
    nombre: 'Banco Bancrea, S.A., Institución de Banca Múltiple'
  },
  {
    clabe: 153,
    marca: 'PROGRESO',
    nombre: 'Banco Progreso Chihuahua, S.A.'
  },
  {
    clabe: 154,
    marca: 'BANCO FINTERRA',
    nombre: 'Banco Finterra, S.A., Institución de Banca Múltiple'
  },
  {
    clabe: 155,
    marca: 'ICBC',
    nombre: 'Industrial and Commercial Bank of China México, S.A., Institución de Banca Múltiple'
  },
  {
    clabe: 156,
    marca: 'SABADELL',
    nombre: 'Banco Sabadell, S.A., Institución de Banca Múltiple'
  },
  {
    clabe: 157,
    marca: 'SHINHAN',
    nombre: 'Banco Shinhan de México, S.A., Institución de Banca Múltiple'
  },
  {
    clabe: 158,
    marca: 'MIZUHO BANK',
    nombre: 'Mizuho Bank México, S.A., Institución de Banca Múltiple'
  },
  {
    clabe: 159,
    marca: 'BANK OF CHINA',
    nombre: 'Bank of China México, S.A., Institución de Banca Múltiple'
  },
  {
    clabe: 160,
    marca: 'BANCO S3',
    nombre: 'Banco S3 México, S.A., Institución de Banca Múltiple'
  },
  {
    clabe: 166,
    marca: 'BANSEFI',
    nombre:
      'Banco del Ahorro Nacional y Servicios Financieros, Sociedad Nacional de Crédito, Institución de Banca de Desarrollo'
  },
  {
    clabe: 168,
    marca: 'HIPOTECARIA FEDERAL',
    nombre: 'Sociedad Hipotecaria Federal, Sociedad Nacional de Crédito, Institución de Banca de Desarrollo'
  },
  {
    clabe: 600,
    marca: 'MONEXCB',
    nombre: 'Monex Casa de Bolsa, S.A. de C.V. Monex Grupo Financiero'
  },
  {
    clabe: 601,
    marca: 'GBM',
    nombre: 'GBM Grupo Bursátil Mexicano, S.A. de C.V. Casa de Bolsa'
  },
  {
    clabe: 602,
    marca: 'MASARI',
    nombre: 'Masari Casa de Bolsa, S.A.'
  },
  {
    clabe: 605,
    marca: 'VALUE',
    nombre: 'Value, S.A. de C.V. Casa de Bolsa'
  },
  {
    clabe: 606,
    marca: 'ESTRUCTURADORES',
    nombre: 'Estructuradores del Mercado de Valores Casa de Bolsa, S.A. de C.V.'
  },
  {
    clabe: 607,
    marca: 'TIBER',
    nombre: 'Casa de Cambio Tiber, S.A. de C.V.'
  },
  {
    clabe: 608,
    marca: 'VECTOR',
    nombre: 'Vector Casa de Bolsa, S.A. de C.V.'
  },
  {
    clabe: 610,
    marca: 'B&B',
    nombre: 'B y B, Casa de Cambio, S.A. de C.V.'
  },
  {
    clabe: 614,
    marca: 'ACCIVAL',
    nombre: 'Acciones y Valores Banamex, S.A. de C.V., Casa de Bolsa'
  },
  {
    clabe: 615,
    marca: 'MERRILL LYNCH',
    nombre: 'Merrill Lynch México, S.A. de C.V. Casa de Bolsa'
  },
  {
    clabe: 616,
    marca: 'FINAMEX',
    nombre: 'Casa de Bolsa Finamex, S.A. de C.V.'
  },
  {
    clabe: 617,
    marca: 'VALMEX',
    nombre: 'Valores Mexicanos Casa de Bolsa, S.A. de C.V.'
  },
  {
    clabe: 618,
    marca: 'UNICA',
    nombre: 'Unica Casa de Cambio, S.A. de C.V.'
  },
  {
    clabe: 619,
    marca: 'MAPFRE',
    nombre: 'MAPFRE Tepeyac, S.A.'
  },
  {
    clabe: 620,
    marca: 'PROFUTURO',
    nombre: 'Profuturo G.N.P., S.A. de C.V., Afore'
  },
  {
    clabe: 621,
    marca: 'CB ACTINVER',
    nombre: 'Actinver Casa de Bolsa, S.A. de C.V.'
  },
  {
    clabe: 622,
    marca: 'OACTIN',
    nombre: 'OPERADORA ACTINVER, S.A. DE C.V.'
  },
  {
    clabe: 623,
    marca: 'SKANDIA VIDA',
    nombre: 'Skandia Vida, S.A. de C.V.'
  },
  {
    clabe: 626,
    marca: 'CBDEUTSCHE',
    nombre: 'Deutsche Securities, S.A. de C.V. CASA DE BOLSA'
  },
  {
    clabe: 627,
    marca: 'ZURICH',
    nombre: 'Zurich Compañía de Seguros, S.A.'
  },
  {
    clabe: 628,
    marca: 'ZURICHVI',
    nombre: 'Zurich Vida, Compañía de Seguros, S.A.'
  },
  {
    clabe: 629,
    marca: 'SU CASITA',
    nombre: 'Hipotecaria Su Casita, S.A. de C.V. SOFOM ENR'
  },
  {
    clabe: 630,
    marca: 'CB INTERCAM',
    nombre: 'Intercam Casa de Bolsa, S.A. de C.V.'
  },
  {
    clabe: 631,
    marca: 'CI BOLSA',
    nombre: 'CI Casa de Bolsa, S.A. de C.V.'
  },
  {
    clabe: 632,
    marca: 'BULLTICK CB',
    nombre: 'Bulltick Casa de Bolsa, S.A., de C.V.'
  },
  {
    clabe: 633,
    marca: 'STERLING',
    nombre: 'Sterling Casa de Cambio, S.A. de C.V.'
  },
  {
    clabe: 634,
    marca: 'FINCOMUN',
    nombre: 'Fincomún, Servicios Financieros Comunitarios, S.A. de C.V.'
  },
  {
    clabe: 636,
    marca: 'HDI SEGUROS',
    nombre: 'HDI Seguros, S.A. de C.V.'
  },
  {
    clabe: 637,
    marca: 'ORDER',
    nombre: 'Order Express Casa de Cambio, S.A. de C.V'
  },
  {
    clabe: 638,
    marca: 'AKALA',
    nombre: 'Akala, S.A. de C.V., Sociedad Financiera Popular'
  },
  {
    clabe: 640,
    marca: 'CB JPMORGAN',
    nombre: 'J.P. Morgan Casa de Bolsa, S.A. de C.V. J.P. Morgan Grupo Financiero'
  },
  {
    clabe: 642,
    marca: 'REFORMA',
    nombre: 'Operadora de Recursos Reforma, S.A. de C.V., S.F.P.'
  },
  {
    clabe: 646,
    marca: 'STP',
    nombre: 'Sistema de Transferencias y Pagos STP, S.A. de C.V.SOFOM ENR'
  },
  {
    clabe: 647,
    marca: 'TELECOMM',
    nombre: 'Telecomunicaciones de México'
  },
  {
    clabe: 648,
    marca: 'EVERCORE',
    nombre: 'Evercore Casa de Bolsa, S.A. de C.V.'
  },
  {
    clabe: 649,
    marca: 'SKANDIA FONDOS',
    nombre: 'Skandia Operadora de Fondos, S.A. de C.V.'
  },
  {
    clabe: 651,
    marca: 'SEGMTY',
    nombre: 'Seguros Monterrey New York Life, S.A de C.V'
  },
  {
    clabe: 652,
    marca: 'ASEA',
    nombre: 'Solución Asea, S.A. de C.V., Sociedad Financiera Popular'
  },
  {
    clabe: 653,
    marca: 'KUSPIT',
    nombre: 'Kuspit Casa de Bolsa, S.A. de C.V.'
  },
  {
    clabe: 655,
    marca: 'SOFIEXPRESS',
    nombre: 'J.P. SOFIEXPRESS, S.A. de C.V., S.F.P.'
  },
  {
    clabe: 656,
    marca: 'UNAGRA',
    nombre: 'UNAGRA, S.A. de C.V., S.F.P.'
  },
  {
    clabe: 659,
    marca: 'OPCIONES EMPRESARIALES DEL NOROESTE',
    nombre: 'OPCIONES EMPRESARIALES DEL NORESTE, S.A. DE C.V., S.F.P.'
  },
  {
    clabe: 670,
    marca: 'LIBERTAD',
    nombre: 'Libertad Servicios Financieros, S.A. De C.V.'
  },
  {
    clabe: 901,
    marca: 'CLS',
    nombre: 'Cls Bank International'
  },
  {
    clabe: 902,
    marca: 'INDEVAL',
    nombre: 'SD. Indeval, S.A. de C.V.'
  }
]

export const banksNames = banks.map(bank => bank.marca)

export const bankCatalogs = convertCatalogToReactSelect(banks, 'clabe', 'marca')
