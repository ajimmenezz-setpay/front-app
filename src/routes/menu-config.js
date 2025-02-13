const SYSTEM_ROLES = {
  LEGAL_REPRESENTATIVE: 'Representante Legal',
  ADMINISTRATOR: 'Administrador',
  USER_CARD: 'Propietario de tarjeta',
  USER_CARD_DEMO: 'Propietario de tarjeta demo'
}

export const MENU_CONFIG = [
  {
    category: 'General',

    modules: [
      {
        name: 'Dashboard Master',
        path: '/dashboard-master',
        icon: 'leaderboard',
        roles: [SYSTEM_ROLES.LEGAL_REPRESENTATIVE]
      },
      {
        name: 'Órdenes de Fondeo',
        path: '/funding-orders',
        icon: 'receipt_long',
        roles: [SYSTEM_ROLES.LEGAL_REPRESENTATIVE]
      },
      {
        name: 'Comprobación',
        path: '/expenses-control',
        icon: 'price_check',
        roles: [SYSTEM_ROLES.LEGAL_REPRESENTATIVE]
      }
    ]
  },
  {
    category: 'Servicios',

    modules: [
      {
        name: 'Viabo Card',
        path: '/viabo-card',
        icon: 'credit_card',
        items: [
          {
            name: 'Tarjetas',
            path: '/viabo-card/cards',
            roles: [SYSTEM_ROLES.LEGAL_REPRESENTATIVE, SYSTEM_ROLES.USER_CARD, SYSTEM_ROLES.USER_CARD_DEMO]
          },
          {
            name: 'Stock de Tarjetas',
            path: '/viabo-card/stock-cards',
            roles: [SYSTEM_ROLES.LEGAL_REPRESENTATIVE]
          }
        ]
      },

      {
        name: 'Viabo Pay',
        path: '/viabo-pay',
        icon: 'contactless',
        items: [
          {
            name: 'Terminales',
            path: '/viabo-pay/terminals',
            roles: [SYSTEM_ROLES.LEGAL_REPRESENTATIVE]
          },
          {
            name: 'Nube',
            path: '/viabo-pay/cloud',
            roles: [SYSTEM_ROLES.LEGAL_REPRESENTATIVE]
          }
        ]
      }
    ]
  },
  {
    category: 'Administración',

    modules: [
      {
        name: 'Tarjetas',
        path: '/management/commerces',
        icon: 'domain',
        roles: [SYSTEM_ROLES.ADMINISTRATOR]
      },

      {
        name: 'Stock de Tarjetas',
        path: '/management/stock-cards',
        icon: 'payments',
        roles: [SYSTEM_ROLES.ADMINISTRATOR]
      }
    ]
  }
]

export const getMenuByRole = role => {
  if (!role) {
    return MENU_CONFIG
  }
  // Filtrar categorías y módulos por el rol del usuario
  const filteredCategories = MENU_CONFIG.filter(category =>
    category.modules.some(module => {
      if (module?.roles) {
        return module.roles.includes(role)
      }
      if (module?.items) {
        // Verificar si alguno de los elementos de menú tiene el rol
        return module.items.some(item => item.roles.includes(role))
      }
      return false
    })
  )

  // Construir la estructura de menú filtrada
  const filteredMenu = filteredCategories.map(category => ({
    category: category.category,
    modules: category.modules
      .filter(module => {
        if (module.roles) {
          return module.roles.includes(role)
        }
        if (module.items) {
          // Verificar si alguno de los elementos de menú tiene el rol
          return module.items.some(item => item.roles.includes(role))
        }
        return false
      })
      .map(module => {
        const filteredItems = module.items ? module.items.filter(item => item.roles.includes(role)) : null
        return {
          name: module.name,
          path: module.path,
          icon: module.icon,
          items: filteredItems
        }
      })
  }))

  return filteredMenu
}
