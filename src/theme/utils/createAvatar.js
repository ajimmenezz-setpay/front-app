const PRIMARY_NAME = ['A', 'N', 'H', 'L', 'Q', '9', '8']
const INFO_NAME = ['F', 'G', 'T', 'I', 'J', '1', '2', '3']
const SUCCESS_NAME = ['K', 'D', 'Y', 'B', 'O', '4', '5']
const WARNING_NAME = ['P', 'E', 'R', 'S', 'C', 'U', '6', '7']
const ERROR_NAME = ['V', 'W', 'X', 'M', 'Z']

function getFirstCharacter(name) {
  return name && name.charAt(0).toUpperCase()
}

export function getAvatarColor(name) {
  if (PRIMARY_NAME.includes(getFirstCharacter(name))) return 'primary'
  if (INFO_NAME.includes(getFirstCharacter(name))) return 'info'
  if (SUCCESS_NAME.includes(getFirstCharacter(name))) return 'success'
  if (WARNING_NAME.includes(getFirstCharacter(name))) return 'warning'
  if (ERROR_NAME.includes(getFirstCharacter(name))) return 'warning'
  return 'default'
}

export function createAvatar(name) {
  return {
    name: getNameAvatar(name),
    color: getAvatarColor(name)
  }
}

export function stringToColor(string) {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}

export function getNameAvatar(name = '') {
  const cleanedName = name.trim().replace(/\s+/g, ' ')
  const nameParts = cleanedName.toUpperCase().split(' ')

  if (nameParts.length > 1) {
    return `${nameParts[0][0]}${nameParts[1][0]}`
  } else {
    return `${nameParts[0][0]}`
  }
}

export function stringAvatar(name) {
  if (name === '') {
    return {}
  }
  const nameChildren = getNameAvatar(name)
  return {
    sx: {
      bgcolor: stringToColor(name),
      color: 'white!important'
    },
    children: nameChildren
  }
}
