import { forwardRef } from 'react'

import { IMaskInput } from 'react-imask'

export const MaskedInput = forwardRef((props, ref) => <IMaskInput overwrite {...props} inputRef={ref} />)
