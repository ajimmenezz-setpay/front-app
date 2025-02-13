import { jwtDecode } from 'jwt-decode'

import { API_SET_V2, axios } from '@/shared/interceptors'

const isValidToken = accessToken => {
  if (!accessToken) {
    return false
  }

  const decoded = jwtDecode(accessToken)
  const currentTime = Date.now() / 1000

  return decoded.exp > currentTime
}

//  const handleTokenExpired = (exp) => {
//   let expiredTimer;

//   window.clearTimeout(expiredTimer);
//   const currentTime = Date.now();
//   const timeLeft = exp * 1000 - currentTime;
//   console.log(timeLeft);
//   expiredTimer = window.setTimeout(() => {
//     console.log('expired');
//     // You can do what ever you want here, like show a notification
//   }, timeLeft);
// };

// ----------------------------------------------------------------------

const setSession = accessToken => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken)
    API_SET_V2.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    // This function below will handle when token is expired
    // const { exp } = jwtDecode(accessToken);
    // handleTokenExpired(exp);
  } else {
    localStorage.removeItem('accessToken')
    delete API_SET_V2.defaults.headers.common.Authorization
    delete axios.defaults.headers.common.Authorization
  }
}

const getTokenData = token => {
  const decoded = jwtDecode(token)

  return {
    name: decoded?.name,
    firstName: decoded?.firstName ?? '',
    lastName: decoded?.lastname ?? '',
    profile: decoded?.profile,
    email: decoded?.email,
    phone: decoded?.phone ?? '',
    urlInit: decoded?.urlInit ?? '',
    twoAuth: decoded?.authenticatorFactors || false,
    accessToken: token
  }
}

export { getTokenData, isValidToken, setSession }
