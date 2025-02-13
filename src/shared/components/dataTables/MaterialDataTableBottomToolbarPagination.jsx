import { Checkbox, FormControlLabel, Stack } from '@mui/material'

import { TablePagination } from './MaterialDataTable'

export const MaterialDataTableBottomToolbarPagination = ({ table, enablePagination, setEnablePagination }) => (
  <Stack flexDirection={'row'} justifyContent={'flex-end'} py={2}>
    <Stack flexDirection={'row'}>
      <FormControlLabel
        control={
          <Checkbox
            checked={!enablePagination}
            onClick={() => {
              setEnablePagination(prev => !prev)
            }}
          />
        }
        label={!enablePagination ? 'Dejar Ver Todos' : 'Ver Todos'}
      />
      {enablePagination && <TablePagination table={table} />}
    </Stack>
  </Stack>
)
