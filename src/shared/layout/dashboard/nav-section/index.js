import { matchPath } from 'react-router-dom'

export { default as NavSectionVertical } from './vertical/NavSectionVertical'

export function isExternalLink(path) {
  return path.includes('http')
}

export function getActive(path, pathname) {
  return path ? !!matchPath({ path, end: true }, pathname) : false
}

export function getActiveSubmenu(path, pathname) {
  return path ? !!matchPath({ path, end: false }, pathname) : false
}
