import React from 'react'
import { Typography } from '@mui/material';
import { Link } from '@mui/material';
import { Box } from '@mui/material';
import { Stack } from '@mui/material';
import { Card } from '@mui/material';

export default function Heading() {
  return (
    <>
    <div style={{margin:"20px"}}>

          <Typography sx={{ fontSize: '30px', fontWeight: '500' }} variant="h3">
              Exalens
          </Typography>
          <Card
              sx={{
                  backgroundColor: '#FFFF',
                  border: '1px solid rgb(247, 252, 252)',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  columnGap: '1rem',
                  width: '100%',
                  borderRadius: '4px',
              }}>
              <img
                  sx={{ minWidth: '16px', alignSelf: 'flex-start', marginTop: '4px' }}
                  size="17px"
                  radius="4px"></img>
              <Stack
                  sx={{
                      alignItems: 'flex-start',
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                  }}
                  gap="0px"
                  direction="column">
                  <Typography
                      sx={{
                          fontSize: '17px',
                          fontWeight: '500',
                          '@media(max-width:991px)': { fontSize: '17px' },
                          '@media(max-width:479px)': { fontSize: '15px' },
                      }}
                      variant="h5">
                      Introducing a chart report builder
                  </Typography>
                  
              </Stack>
          </Card>
    </div>
          </>
  )
}
