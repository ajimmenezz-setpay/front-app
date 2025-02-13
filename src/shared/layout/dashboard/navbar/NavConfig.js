const ICONS = {
  blog: 'ic_blog',
  cart: 'ic_cart',
  chat: 'ic_chat',
  mail: 'ic_mail',
  user: 'account_box',
  kanban: 'ic_kanban',
  banking: 'account_balance',
  booking: 'luggage',
  invoice: 'ic_invoice',
  calendar: 'ic_calendar',
  ecommerce: 'shopping_bag',
  analytics: 'analytics',
  dashboard: 'dashboard'
}

const navConfigTest = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    category: 'general',
    modules: [
      { name: 'app', path: '/', icon: ICONS.dashboard },
      { name: 'e-commerce', path: '/', icon: ICONS.ecommerce },
      { name: 'analytics', path: '/', icon: ICONS.analytics },
      { name: 'banking', path: '/', icon: ICONS.banking },
      { name: 'booking', path: '/', icon: ICONS.booking }
    ]
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    category: 'management',
    modules: [
      // USER
      {
        name: 'user',
        path: '/user',
        icon: ICONS.user,
        children: [
          { name: 'profile', path: '/profile' },
          { name: 'cards', path: '/cards' },
          { name: 'list', path: '/list' },
          { name: 'create', path: '/create' },
          { name: 'edit', path: '/edit' },
          { name: 'account', path: '/acount' }
        ]
      }
    ]
  }
]

export default navConfigTest
