export const CommerceProcessAdapter = process => {
  const {
    id,
    fiscalPersonType,
    fiscalName,
    tradeName,
    rfc,
    employees,
    branchOffices,
    paymentApi,
    registerStep,
    legalRepresentative,
    services,
    pointSaleTerminal,
    documents
  } = process

  const serviceCard = services?.find(service => service.type === '2')
  const cardsNumber = serviceCard?.cardNumbers || 0
  const cardUse = serviceCard?.cardUse || ''
  const customCard = serviceCard?.personalized === '1' || false

  return {
    id,
    idUser: legalRepresentative,
    services,
    fiscalTypePerson: fiscalPersonType,
    fiscalName: fiscalName || '',
    rfc,
    commercialName: tradeName,
    employeesNumber: Number(employees),
    branchesNumber: Number(branchOffices),
    tpvsNumber: Number(pointSaleTerminal),
    apiRequired: Boolean(paymentApi === '1'),
    cardsNumber: Number(cardsNumber),
    cardsUse: cardUse,
    customCardsRequired: customCard,
    files: documents,
    step: Number(registerStep)
  }
}
