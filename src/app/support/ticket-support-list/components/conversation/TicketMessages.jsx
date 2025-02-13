import { Fragment, memo, useEffect, useMemo, useRef } from 'react'

import PropTypes from 'prop-types'

import { AccessTime, DoneAll } from '@mui/icons-material'
import { Alert, Avatar, Box, CircularProgress, Skeleton, Stack, Tooltip, styled } from '@mui/material'
import InfiniteScroll from 'react-infinite-scroll-component'

import TicketMessageFile from './TicketMessageFile'
import { ContentStyle, InfoStyle } from './TicketMessageItemStyles'

import { createAvatar } from '@/theme/utils'

const TicketMessages = ({ queryTicketConversation, scroll, setScroll }) => {
  const { data, isLoading, fetchNextPage, hasNextPage, refetch } = queryTicketConversation

  const dataLength = data?.pages?.reduce((counter, page) => counter + (page.results?.messages?.length || 0), 0) ?? 0

  const scrollRef = useRef(null)

  const scrollMessagesToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollMessagesToBottom()
  }, [])

  useEffect(() => {
    if (scroll) {
      scrollMessagesToBottom()
      setScroll(false)
    }
  }, [scroll])

  const direction = useMemo(() => (dataLength === 0 ? 'column' : 'column-reverse'), [dataLength])

  return (
    <Stack ref={scrollRef} gap={2} p={3} sx={{ overflow: 'auto' }} id="scrollbar-target" flexDirection={direction}>
      <Box
        component={InfiniteScroll}
        dataLength={dataLength}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        inverse
        sx={{
          display: 'flex',
          flexDirection: direction,
          overflow: 'none'
        }}
        loader={
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
            <CircularProgress />
          </Box>
        }
        scrollableTarget="scrollbar-target"
        endMessage={
          !isLoading && (
            <Alert variant="outlined" severity="info" sx={{ justifyContent: 'center', m: 2 }}>
              Este es el principio del chat
            </Alert>
          )
        }
        refreshFunction={refetch}
        pullDownToRefresh
        pullDownToRefreshThreshold={50}
      >
        {(isLoading ? [...Array(12)] : data?.pages)?.map((group, index) =>
          group ? (
            <Fragment key={index}>
              {group.results?.messages?.map((message, index) => (
                <TicketMessageItem key={index} message={message} />
              ))}
            </Fragment>
          ) : (
            <MessageSkeleton key={index} />
          )
        )}
      </Box>
    </Stack>
  )
}

TicketMessages.propTypes = {
  queryTicketConversation: PropTypes.shape({
    data: PropTypes.shape({
      pages: PropTypes.array
    }),
    fetchNextPage: PropTypes.any,
    hasNextPage: PropTypes.any,
    isFetching: PropTypes.any,
    isLoading: PropTypes.any,
    refetch: PropTypes.any
  }),
  scroll: PropTypes.any,
  setScroll: PropTypes.func
}

export default memo(TicketMessages)

function MessageSkeleton() {
  return (
    <Stack direction={'row'} spacing={1} p={3}>
      <Skeleton variant="circular" width={40} height={40} />
      <Stack spacing={1}>
        <Skeleton variant="text" width={100} />
        <Skeleton animation={'wave'} variant="rounded" width={300} height={60} />
      </Stack>
    </Stack>
  )
}

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  paddingTop: theme.spacing(1.5)
}))

function TicketMessageItem({ message }) {
  const isMe = Boolean(message?.my)
  const hasFiles = message?.attachment?.length > 0
  const files = message?.attachment || []
  const { color } = createAvatar(message?.name)

  return (
    <RootStyle>
      <Box
        sx={{
          display: 'flex',
          ...(isMe && {
            ml: 'auto'
          })
        }}
      >
        {!isMe && (
          <Avatar
            alt={message?.name}
            src={message?.avatar}
            sx={theme => ({
              width: 32,
              height: 32,
              fontSize: 'inherit',
              mr: 2,
              color: theme.palette[color].contrastText,
              backgroundColor: theme.palette[color].main
            })}
          >
            {message?.initials}
          </Avatar>
        )}

        <div>
          <InfoStyle
            variant="caption"
            sx={{
              ...(isMe && { justifyContent: 'flex-end' })
            }}
          >
            {!isMe && `${message?.name}`}&nbsp;
            {
              <Tooltip title={message?.createDate?.original || ''} followCursor>
                <Box component={'span'} color={'text.disabled'}>
                  {!isMe && <>&bull; {message?.createDate?.fToNow}</>}
                  {isMe && message?.createDate?.fToNow}
                </Box>
              </Tooltip>
            }
          </InfoStyle>
          <Stack gap={1}>
            <ContentStyle
              sx={{
                ...(isMe && {
                  color: 'grey.800',
                  bgcolor: 'success.lighter',
                  '&:before': {
                    bottom: '100%',
                    left: '100%',
                    border: '10px solid transparent',
                    content: '" "',
                    height: 0,
                    width: 0,
                    position: 'absolute',
                    pointerEvents: 'none',
                    borderBottomColor: 'success.lighter',
                    borderWidth: '7px',
                    marginLeft: '-30px'
                  }
                })
              }}
            >
              {hasFiles ? (
                <Stack flexDirection={'row'} justifyContent={'space-between'} gap={1}>
                  <Stack spacing={2}>
                    <Box
                      sx={{ wordWrap: 'break-word', textWrap: 'pretty', fontSize: 'small' }}
                      dangerouslySetInnerHTML={{
                        __html: `<p style='font-size: small'>${message?.message}</p>`
                      }}
                    />

                    <Stack
                      flexDirection="row"
                      flexWrap="wrap"
                      justifyContent="start"
                      alignItems="end"
                      gap={2}
                      sx={{ overflow: 'auto', pb: 2 }}
                    >
                      {files?.map((file, index) => (
                        <TicketMessageFile key={index} file={file} isURL={!!message?.isSent} />
                      ))}
                    </Stack>
                  </Stack>
                  {isMe && (
                    <Box component={'span'} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                      {message?.isSent ? (
                        <DoneAll sx={{ color: 'info.main', fontSize: 16 }} />
                      ) : (
                        <AccessTime sx={{ color: 'info.main', fontSize: 16 }} />
                      )}
                    </Box>
                  )}
                </Stack>
              ) : (
                <Stack flexDirection={'row'} justifyContent={'space-between'} gap={1}>
                  <Box
                    sx={{ wordWrap: 'break-word', textWrap: 'pretty' }}
                    dangerouslySetInnerHTML={{
                      __html: `<p style='font-size: small'>${message?.message}</p>`
                    }}
                  />
                  {isMe && (
                    <Box component={'span'} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                      {message?.isSent ? (
                        <DoneAll sx={{ color: 'info.main', fontSize: 16 }} />
                      ) : (
                        <AccessTime sx={{ color: 'info.main', fontSize: 16 }} />
                      )}
                    </Box>
                  )}
                </Stack>
              )}
            </ContentStyle>
          </Stack>
        </div>
      </Box>
    </RootStyle>
  )
}

TicketMessageItem.propTypes = {
  message: PropTypes.shape({
    attachment: PropTypes.array,
    avatar: PropTypes.any,
    createDate: PropTypes.shape({
      fToNow: PropTypes.any,
      original: PropTypes.string
    }),
    initials: PropTypes.any,
    message: PropTypes.any,
    my: PropTypes.any,
    name: PropTypes.any
  })
}
