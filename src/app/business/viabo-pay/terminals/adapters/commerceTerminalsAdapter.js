export const CommerceTerminalsAdapter = terminals =>
  terminals?.map(terminal => ({
    id: terminal?.id,
    commerceId: terminal?.commerceId,
    terminalId: terminal?.terminalId,
    terminalON: terminal?.apiData?.status === 1,
    country: terminal?.apiData?.country,
    date: {
      created: terminal?.apiData?.created_at,
      updated: terminal?.apiData?.updated_at,
      register: terminal?.registerDate
    },
    isVirtual: terminal?.typeId === '1',
    name: terminal?.name !== '' ? terminal?.name.toString().toUpperCase() : `TERMINAL-${terminal?.terminalId}`,
    active: terminal?.active === '1',
    isExternalConciliation: !!terminal?.isConciliationExternal
  })) || []
