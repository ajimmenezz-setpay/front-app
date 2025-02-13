import { Suspense } from 'react'

import { LoadingLogo } from '@/shared/components/loadings/LoadingLogo'

export const LoadableRoute = Component =>
  function (props) {
    // eslint-disable-next-line react-hooks/rules-of-hooks

    return (
      <Suspense fallback={<LoadingLogo />}>
        <Component {...props} />
      </Suspense>
    )
  }
