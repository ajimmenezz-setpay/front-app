import { getDecryptInfo } from '@/shared/utils'

export const GoogleAuthQRCodeAdapter = data => {
  const decryptedResponse = getDecryptInfo(data?.ciphertext, data?.iv)

  if (decryptedResponse) {
    return {
      qr: decryptedResponse?.qr,
      key: decryptedResponse?.secret
    }
  } else {
    throw new Error('Algo fallo al obtener la información')
  }
}
