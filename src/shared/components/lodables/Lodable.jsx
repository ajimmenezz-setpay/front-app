import { Suspense } from 'react'

import { RequestLoading } from '@/shared/components/loadings'

const Lodable = Component =>
  function (props) {
    // eslint-disable-next-line react-hooks/rules-of-hooks

    return (
      <Suspense fallback={<RequestLoading open={true} />}>
        <Component {...props} />
      </Suspense>
    )
  }

export default Lodable
