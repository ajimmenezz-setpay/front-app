import PropTypes from 'prop-types'

import { ArrowDropDown, ArrowRight } from '@mui/icons-material'
import { Box, Icon, Link, ListItemText, Tooltip } from '@mui/material'
import { NavLink as RouterLink } from 'react-router-dom'

import { ListItemIconStyle, ListItemStyle, ListItemTextStyle } from './style'

import { isExternalLink } from '../index'

NavItemRoot.propTypes = {
  active: PropTypes.bool,
  open: PropTypes.bool,
  isCollapse: PropTypes.bool,
  onOpen: PropTypes.func,
  item: PropTypes.shape({
    children: PropTypes.array,
    icon: PropTypes.any,
    info: PropTypes.any,
    path: PropTypes.string,
    name: PropTypes.string
  })
}

export function NavItemRoot({ item, isCollapse, open = false, active, onOpen }) {
  const { name: title, path, icon, info, children } = item
  const renderContent = (
    <>
      {/* {icon && <ListItemIconStyle>{icon}</ListItemIconStyle>} */}

      <ListItemIconStyle>
        <Icon>{icon && icon}</Icon>
      </ListItemIconStyle>

      <ListItemTextStyle disableTypography primary={title} isCollapse={isCollapse} />
      {!isCollapse && (
        <>
          {info && info}
          {children && <ArrowIcon open={open} />}
        </>
      )}
    </>
  )

  if (children) {
    return (
      <Tooltip title={isCollapse ? title || '' : ''} arrow followCursor>
        <ListItemStyle onClick={onOpen} activeRoot={active}>
          {renderContent}
        </ListItemStyle>
      </Tooltip>
    )
  }

  return isExternalLink(path) ? (
    <Tooltip title={isCollapse ? title || '' : ''} arrow followCursor>
      <ListItemStyle component={Link} href={path} target="_blank" rel="noopener">
        {renderContent}
      </ListItemStyle>
    </Tooltip>
  ) : (
    <Tooltip title={isCollapse ? title || '' : ''} arrow followCursor>
      <ListItemStyle component={RouterLink} to={path} activeRoot={active}>
        {renderContent}
      </ListItemStyle>
    </Tooltip>
  )
}

// ----------------------------------------------------------------------

NavItemSub.propTypes = {
  active: PropTypes.bool,
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  item: PropTypes.shape({
    children: PropTypes.array,
    info: PropTypes.any,
    path: PropTypes.string,
    name: PropTypes.string
  })
}

export function NavItemSub({ item, open = false, active = false, onOpen }) {
  const { name: title, path, info, children } = item
  const renderContent = (
    <>
      <DotIcon active={active} />
      <ListItemText disableTypography primary={title} />
      {info && info}
      {children && <ArrowIcon open={open} />}
    </>
  )

  if (children) {
    return (
      <ListItemStyle onClick={onOpen} activeSub={active} subItem>
        {renderContent}
      </ListItemStyle>
    )
  }

  return isExternalLink(path) ? (
    <ListItemStyle component={Link} href={path} target="_blank" rel="noopener" subItem>
      {renderContent}
    </ListItemStyle>
  ) : (
    <ListItemStyle component={RouterLink} to={path} activeSub={active} subItem>
      {renderContent}
    </ListItemStyle>
  )
}

// ----------------------------------------------------------------------

DotIcon.propTypes = {
  active: PropTypes.bool
}

export function DotIcon({ active }) {
  return (
    <ListItemIconStyle>
      <Box
        component="span"
        sx={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          bgcolor: 'text.disabled',
          transition: theme =>
            theme.transitions.create('transform', {
              duration: theme.transitions.duration.shorter
            }),
          ...(active && {
            transform: 'scale(2)',
            bgcolor: 'primary.main'
          })
        }}
      />
    </ListItemIconStyle>
  )
}

// ----------------------------------------------------------------------

ArrowIcon.propTypes = {
  open: PropTypes.bool
}

export function ArrowIcon({ open }) {
  if (open) {
    return <ArrowDropDown sx={{ width: 16, height: 16, ml: 1 }} />
  }
  return <ArrowRight sx={{ width: 16, height: 16, ml: 1 }} />
}
