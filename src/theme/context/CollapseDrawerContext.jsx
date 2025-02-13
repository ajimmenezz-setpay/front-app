import { createContext, useEffect, useState } from 'react'

import PropTypes from 'prop-types'

import { useResponsive } from '@theme/hooks'

const initialState = {
  isCollapse: false,
  collapseClick: false,
  collapseHover: false,
  onToggleCollapse: () => {},
  onHoverEnter: () => {},
  onHoverLeave: () => {},
  setCollapse: () => {}
}

const CollapseDrawerContext = createContext(initialState)

CollapseDrawerProvider.propTypes = {
  children: PropTypes.node
}

function CollapseDrawerProvider({ children }) {
  const isDesktop = useResponsive('up', 'lg')

  const [collapse, setCollapse] = useState({
    click: false,
    hover: false
  })

  useEffect(() => {
    if (!isDesktop) {
      setCollapse({
        click: collapse.click,
        hover: false
      })
    }
  }, [isDesktop])

  const handleToggleCollapse = () => {
    setCollapse({ ...collapse, click: !collapse.click })
  }

  const handleHoverEnter = () => {
    if (collapse.click) {
      setCollapse({ ...collapse, hover: true })
    }
  }

  const handleHoverLeave = () => {
    setCollapse({ ...collapse, hover: false })
  }

  return (
    <CollapseDrawerContext.Provider
      value={{
        isCollapse: Boolean(collapse.click && !collapse.hover),
        setCollapse: value =>
          setCollapse({
            click: value,
            hover: false
          }),
        collapseClick: collapse.click,
        collapseHover: collapse.hover,
        onToggleCollapse: handleToggleCollapse,
        onHoverEnter: handleHoverEnter,
        onHoverLeave: handleHoverLeave
      }}
    >
      {children}
    </CollapseDrawerContext.Provider>
  )
}

export { CollapseDrawerContext, CollapseDrawerProvider }
