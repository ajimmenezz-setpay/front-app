// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { renderHook, waitFor } from '@testing-library/react'
// import nock from 'nock'
// import { describe, expect, test } from 'vitest'

// import { useSignIn } from '@/app/authentication/hooks'

// describe('useSignIn', () => {
//   test('should handle successful sign in and user modules retrieval', async () => {
//     const queryClient = new QueryClient()
//     const wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>

//     const { result, ...others } = renderHook(() => useSignIn(), { wrapper })

//     nock('http://viabo:80', {
//       reqheaders: {
//         'app-id': () => true
//       }
//     })
//       .post(`/login`)
//       // Mocking the response with status code = 200
//       .reply(200, {})

//     await result.current.mutate({
//       username: 'mulsum@viabodemo.com',
//       password: 'B4CKD00RVI4B0.'
//     })

//     await waitFor(() => result.current.data, { interval: 2000 })

//     console.log(result.current)

//     expect(result.current.isSuccess).toBe(true)
//   })
// })
