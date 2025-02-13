import { Alert, Box, Stack, Typography } from '@mui/material'

import { useFindNews } from '../hooks'

const News = () => {
  const { data: newsList } = useFindNews()

  return (
    <Box display={'flex'} flexGrow={1}>
      <Box component={'marquee'} behavior="scroll" direction="left">
        <Stack direction={'row'} spacing={2}>
          {newsList?.map((news, index) => (
            <Alert variant="outlined" key={index} severity={news?.severity} sx={{ maxWidth: 'auto' }}>
              {/* <AlertTitle>{news.title}</AlertTitle> */}
              <Typography variant="body2">{news?.text}</Typography>
            </Alert>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

export default News
