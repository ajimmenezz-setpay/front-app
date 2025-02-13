import numeral from 'numeral'

function fCurrency(number) {
  return numeral(number).format('$0,0.00')
}

function fPercent(number) {
  return numeral(number / 100).format('0.0%')
}

function fNumber(number) {
  return numeral(number).format()
}

function fShortenNumber(number) {
  return numeral(number).format('0.00a').replace('.00', '')
}

function fData(number) {
  return numeral(number).format('0.0 b')
}

function fCardNumber(card) {
  return card.toString().replace(/\d{4}(?=\d)/g, '$& ')
}

function fCardNumberHidden(card) {
  let formattedCard = card.toString().replace(/\d(?=\d{4})/g, '*')
  formattedCard = formattedCard.replace(/(\*{4})/g, '$1 ')
  formattedCard = formattedCard.replace(/(\*{4}) (\*{4}) (\*{4}) /g, '$1 $2 $3 ')
  return formattedCard
}

function fCardNumberShowLastDigits(card, digits = 8) {
  const cardNumber = card.toString()
  const visibleDigits = cardNumber.slice(-digits).replace(/\d{4}(?=\d)/g, '$& ')
  const hiddenDigits = cardNumber.slice(0, -digits).replace(/\d/g, '*')

  const formattedHiddenDigits = hiddenDigits.replace(/(\*{4})/g, '$1 ')
  return formattedHiddenDigits + visibleDigits
}

export {
  fCardNumber,
  fCardNumberHidden,
  fCardNumberShowLastDigits,
  fCurrency,
  fData,
  fNumber,
  fPercent,
  fShortenNumber
}
