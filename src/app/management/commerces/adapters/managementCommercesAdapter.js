import { PROCESS_LIST_STEPS } from '@/app/business/commerce/services'
import { convertCatalogToReactSelect, fDateTime, getDecryptInfo } from '@/shared/utils'

const ViaboCardAdapter = services => {
  const viaboCard = services?.find(service => service?.type === '2')

  if (viaboCard) {
    return {
      id: viaboCard?.id,
      type: viaboCard?.type,
      name: viaboCard?.name,
      cardNumbers: viaboCard?.cardNumbers,
      cardUse: viaboCard?.cardUse,
      customCardsRequired: viaboCard?.personalized === '1'
    }
  }
  return null
}

const DocumentsAdapter = documents =>
  documents?.map(document => {
    const { Id, Name, storePath } = document

    return {
      id: Id,
      name: Name,
      path: storePath
    }
  }) ?? []

const CommissionsAdapter = commissions => ({
  available: Boolean(commissions),
  speiInCarnet: parseFloat(commissions?.SpeiInCarnet ?? '0.0'),
  speiOutCarnet: parseFloat(commissions?.SpeiOutCarnet ?? '0.0'),
  speiInMasterCard: parseFloat(commissions?.SpeiInMasterCard ?? '0.0'),
  speiOutMasterCard: parseFloat(commissions?.SpeiOutMasterCard ?? '0.0'),
  viaboPay: parseFloat(commissions?.Pay ?? '0.0'),
  cloud: parseFloat(commissions?.SharedTerminal ?? '0.0')
})

export const ManagementCommercesAdapter = commerces => commerces.map((commerce, index) => CommerceAdapter(commerce))

export const CommerceAdapter = (commerce, hasEncrypted = false) => {
  let commerceInformation = commerce

  if (hasEncrypted) {
    commerceInformation = getDecryptInfo(commerce?.ciphertext, commerce?.iv)
  }

  const {
    id,
    legalRepresentative,
    legalRepresentativeName,
    legalRepresentativePhone,
    legalRepresentativeLastSession,
    legalRepresentativeEmail,
    fiscalName,
    fiscalPersonType,
    tradeName,
    rfc,
    employees,
    branchOffices,
    pointSaleTerminal,
    paymentApi,
    register,
    statusId,
    registerStep,
    statusName,
    services,
    documents,
    terminals,
    commissions,
    slug,
    publicTerminal,
    postalAddress,
    phoneNumbers,
    logo
  } = commerceInformation
  const dateLastSession = legalRepresentativeLastSession || ''

  return {
    id,
    name: tradeName,
    account: {
      id: legalRepresentative,
      name: legalRepresentativeName,
      email: legalRepresentativeEmail,
      phone: legalRepresentativePhone,
      status: 'Activo',
      lastLogged: dateLastSession === '' ? 'No ha iniciado sesión' : fDateTime(dateLastSession),
      register: register ? fDateTime(register) : ''
    },
    information: {
      available: fiscalName !== '',
      fiscalName,
      commercialName: tradeName,
      fiscalTypePerson: fiscalPersonType,
      rfc,
      employeesNumber: employees,
      branchesNumber: branchOffices,
      terminalCommerceSlug: slug || '',
      publicTerminal: publicTerminal || null,
      postalAddress: postalAddress || '',
      phoneNumbers: phoneNumbers || '',
      logo: logo || null
    },
    terminals: convertCatalogToReactSelect(terminals || [], 'id', 'name'),
    services: {
      names: services?.map(service => service?.name) || [],
      catalog: services?.map(service => ({ id: service?.Id, type: service?.type, name: service?.name })) || [],
      available: pointSaleTerminal !== '0',
      viaboCard: ViaboCardAdapter(services),
      viaboPay: {
        tpvsNumber: pointSaleTerminal,
        apiRequired: paymentApi === '1'
      }
    },
    status: {
      id: statusId,
      name: statusName,
      step: PROCESS_LIST_STEPS.find(step => step.step.toString() === registerStep)?.name ?? ''
    },
    documents: DocumentsAdapter(documents),
    commissions: CommissionsAdapter(commissions)
  }
}
