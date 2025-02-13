import CryptoJS from 'crypto-js'

import { KEY_SSL } from '@/config'

const SECRET_KEY = KEY_SSL

export const getCryptInfo = object => {
  // Convertir el objeto a una cadena JSON
  const jsonString = JSON.stringify(object)

  // Generar una clave de cifrado
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY)

  // Generar un vector de inicialización aleatorio
  const iv = CryptoJS.lib.WordArray.random(16)

  // Cifrar la cadena JSON utilizando AES-256-CBC
  const ciphertext = CryptoJS.AES.encrypt(jsonString, key, {
    iv
  }).toString()

  // Convertir el vector de inicialización a una cadena Base64
  const ivBase64 = CryptoJS.enc.Base64.stringify(iv)

  return {
    ciphertext,
    iv: ivBase64
  }
}

export const getDecryptInfo = (ciphertextBase64, ivBase64) => {
  try {
    const key = CryptoJS.enc.Utf8.parse(SECRET_KEY)
    // Decodificar el vector de inicialización desde Base64
    const iv = CryptoJS.enc.Base64.parse(ivBase64)
    // Decodificar el texto cifrado desde Base64
    const ciphertext = CryptoJS.enc.Base64.parse(ciphertextBase64)
    // Desencriptar el texto cifrado utilizando AES-256-CBC
    const decrypted = CryptoJS.AES.decrypt(
      {
        ciphertext
      },
      key,
      {
        iv
      }
    )

    // Convertir el resultado de desencriptar a una cadena UTF-8
    const plaintext = decrypted.toString(CryptoJS.enc.Utf8)
    const object = JSON.parse(plaintext)
    return object ?? null
  } catch (e) {
    return null
  }
}
export const getDecryptSerialize = (value, iv) => {
  try {
    // Obtén el IV del request y decodifícalo desde base64
    const key = CryptoJS.enc.Utf8.parse(SECRET_KEY)

    const ivBase64 = CryptoJS.enc.Base64.parse(iv)

    // Realiza la desencriptación
    const decrypted = CryptoJS.AES.decrypt(value, key, {
      iv: ivBase64,
      mode: CryptoJS.mode.CBC
    })

    // Convierte el resultado a texto legible
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8)

    // Extraer la parte del string que contiene el JSON
    const jsonString = decryptedText.match(/s:\d+:"(.*)"/)[1]

    // Parsear el JSON
    const data = JSON.parse(jsonString)
    return data ?? null
  } catch (e) {
    console.log(e)
    return null
  }
}
