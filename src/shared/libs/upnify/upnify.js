const UPNIFY = {
  tke: 'E-F5082522-75B5-4BC8-9B8C-621CAA7F6CB1',
  tki: 'P078D7F9015-0C74-4D1F-84CC-A0E1F6CF4C99',
  tkw: '84760E5D-55D2-4F20-A1C9-28AD4E870511'
}

export const loadUpnifyScript = () => {
  const { tke, tki, tkw } = UPNIFY

  const existingScript = document.getElementById('upnifyWAOS')

  // Evitar cargar el script varias veces
  if (!existingScript) {
    const script = document.createElement('script')
    script.defer = true
    script.id = 'upnifyWAOS'
    script.dataset.identifier = tke
    script.src = `https://suite.upnify.com/addons/js/suite.min.js?tke=${tke}&tki=${tki}`

    // Configuración adicional para el widget
    script.onload = () => {
      window.Suite.init()
      const interval = setInterval(() => {
        if (window.Suite?.Mkt?.setNewWidget && window.Suite.Mkt.currentConfig) {
          clearInterval(interval)
          const widgetConfig = {
            tkWidget: tkw,
            tkIntegration: tki,
            notDestroy: true
          }
          window.Suite.Mkt.setNewWidget(widgetConfig)
        }
      }, 100)
    }

    // Agregar el script al documento
    document.head.appendChild(script)
  }
}
