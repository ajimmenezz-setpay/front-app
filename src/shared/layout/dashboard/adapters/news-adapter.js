export const NewsAdapter = news =>
  news?.map(message => ({
    text: message?.message,
    severity: message?.alertTypeName || 'info'
  })) || []
