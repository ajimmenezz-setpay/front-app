import {
  isEmpty as isLodashEmpty,
  isEqual as isLodashEqual,
  isFunction as isLodashFunction,
  isObject as isLodashObject
} from 'lodash'

export function matchIsNumeric(text) {
  const isNumber = typeof text === 'number'
  const isString = matchIsString(text)
  return (isNumber || (isString && text !== '')) && !isNaN(Number(text))
}

export function matchIsString(text) {
  return typeof text === 'string' || text instanceof String
}

export const convertCatalogToReactSelect = (data, valueObject, label, disabledProperty) =>
  data.map((item, index) => ({
    value: getValueFromNestedObject(item, valueObject),
    label: getValueFromNestedObject(item, label),
    isDisabled: getValueFromNestedObject(item, disabledProperty) === '0' || false,
    index,
    ...item
  }))
const getValueFromNestedObject = (object, propertyPath) => {
  if (!propertyPath) return object
  const properties = propertyPath.split('.')
  let value = object
  for (const property of properties) {
    if (value && value.hasOwnProperty(property)) {
      value = value[property]
    } else {
      return undefined // or whatever default value you want to return if property doesn't exist
    }
  }
  return value
}

export const isFunction = possibleFunction => isLodashFunction(possibleFunction)

export const isObject = possibleObject => isLodashObject(possibleObject)

export const isEmpty = possibleObject => isLodashEmpty(possibleObject)

export const isEqual = (value, other) => isLodashEqual(value, other)

export const jsonHighlight = (json, key, color) => {
  const jsonStr = JSON.stringify(json, null, 2)
  const regex = new RegExp(`("${key}":\\s")([^"]+)(")`, 'g')
  return jsonStr?.replace(regex, `$1<span style="color: ${color}">$2</span>$3`)
}
