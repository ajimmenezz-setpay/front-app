import { alpha } from '@mui/material/styles'

function createGradient(color1, color2) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`
}

// SETUP COLORS
export const PRIMARY = {
  lighter: '#b2e4fe',
  light: '#37a4f9',
  main: '#02539E',
  dark: '#18407B',
  darker: '#172E4B'
}

const SECONDARY = {
  lighter: '#edfaff',
  light: '#CCD1DC',
  main: '#000',
  dark: '#000',
  darker: '#000'
}

const PRIMARY_DARK = {
  lighter: '#b2e4fe',
  light: '#37a4f9',
  main: '#0d89ea',
  dark: '#02539e',
  darker: '#172E4B'
}

const SECONDARY_DARK = {
  lighter: '#d6edff',
  light: '#e9e9e9',
  main: '#fff',
  dark: '#F0EEEF',
  darker: '#CCD1DC'
}
const INFO = {
  lighter: '#EBD6FD',
  light: '#B985F4',
  main: '#7635dc',
  dark: '#431A9E',
  darker: '#200A69'
}
const SUCCESS = {
  lighter: '#C8FACD',
  light: '#AAF27F',
  main: '#54D62C',
  dark: '#229A16',
  darker: '#08660D'
}
const WARNING = {
  lighter: '#FFF7CD',
  light: '#FFE16A',
  main: '#FFC107',
  dark: '#B78103',
  darker: '#7A4F01'
}
const ERROR = {
  lighter: '#FFE7D9',
  light: '#FFA48D',
  main: '#FF4842',
  dark: '#B72136',
  darker: '#7A0C2E'
}

const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
  500_8: alpha('#919EAB', 0.08),
  500_12: alpha('#919EAB', 0.12),
  500_16: alpha('#919EAB', 0.16),
  500_24: alpha('#919EAB', 0.24),
  500_32: alpha('#919EAB', 0.32),
  500_48: alpha('#919EAB', 0.48),
  500_56: alpha('#919EAB', 0.56),
  500_80: alpha('#919EAB', 0.8)
}

const GRADIENTS = {
  primary: createGradient(PRIMARY.light, PRIMARY.main),
  info: createGradient(INFO.light, INFO.main),
  success: createGradient(SUCCESS.light, SUCCESS.main),
  warning: createGradient(WARNING.light, WARNING.main),
  error: createGradient(ERROR.light, ERROR.main)
}

const CHART_COLORS = {
  violet: ['#826AF9', '#9E86FF', '#D0AEFF', '#F7D2FF'],
  blue: ['#2D99FF', '#83CFFF', '#A5F3FF', '#CCFAFF'],
  green: ['#2CD9C5', '#60F1C8', '#A4F7CC', '#C0F2DC'],
  yellow: ['#FFE700', '#FFEF5A', '#FFF7AE', '#FFF3D6'],
  red: ['#FF6C40', '#FF8F6D', '#FFBD98', '#FFF2D4']
}

const COMMON = {
  common: { black: '#000', white: '#fff' },
  primary: { ...PRIMARY, contrastText: '#fff' },
  secondary: { ...SECONDARY, contrastText: '#fff', color: '#fff' },
  info: { ...INFO, contrastText: '#fff' },
  success: { ...SUCCESS, contrastText: GREY[800] },
  warning: { ...WARNING, contrastText: GREY[800] },
  error: { ...ERROR, contrastText: '#fff' },
  grey: GREY,
  gradients: GRADIENTS,
  chart: CHART_COLORS,
  divider: GREY[500_24],
  action: {
    hover: GREY[500_8],
    selected: GREY[500_16],
    disabled: GREY[500_80],
    disabledBackground: GREY[500_24],
    focus: GREY[500_24],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48
  }
}

const COMMON_DARK = {
  common: { black: '#000', white: '#fff' },
  primary: { ...SECONDARY_DARK, contrastText: '#001750' },
  secondary: { ...PRIMARY_DARK, contrastText: '#fff' },
  info: { ...INFO, contrastText: '#fff' },
  success: { ...SUCCESS, contrastText: GREY[800] },
  warning: { ...WARNING, contrastText: GREY[800] },
  error: { ...ERROR, contrastText: '#fff' },
  grey: GREY,
  gradients: GRADIENTS,
  chart: CHART_COLORS,
  divider: GREY[500_24],
  action: {
    hover: alpha(GREY[300], 0.5),
    selected: GREY[500_16],
    disabled: GREY[500_80],
    disabledBackground: GREY[500_24],
    focus: GREY[500_24],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48
  }
}
export const palette = {
  light: {
    ...COMMON,
    mode: 'light',
    text: { primary: GREY[900], secondary: GREY[700], disabled: '#757B8A' },
    background: { paper: '#fff', default: '#fff', neutral: '#efedee' },
    action: { active: GREY[600], ...COMMON.action }
  },
  dark: {
    ...COMMON_DARK,
    mode: 'dark',
    text: { primary: '#fff', secondary: 'rgba(218, 218, 218, 0.77)', disabled: alpha('#fff', 0.3) },
    background: { paper: '#353e57', default: '#202431', neutral: '#30374a' },
    action: { active: GREY[500], ...COMMON.action }
  }
}
