import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'

import { UpnifyWidget } from './shared/libs/upnify'

import App from '@/App'
import { AuthProvider } from '@/shared/contexts'
import '@/shared/utils/highlight'
import '@fontsource-variable/raleway'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </AuthProvider>
    <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    <UpnifyWidget />
  </QueryClientProvider>
)
