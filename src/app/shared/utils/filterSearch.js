export const searchByTerm = (list, searchTerm) =>
  list.filter(element => {
    const searchInObject = obj => {
      if (!obj || typeof obj !== 'object') {
        return false
      }

      return Object.keys(obj).some(key => {
        if (typeof obj[key] === 'object') {
          return searchInObject(obj[key])
        } else {
          return obj[key] && obj[key].toString().toLowerCase().includes(searchTerm.toLowerCase())
        }
      })
    }

    return searchInObject(element)
  })
