"use client";
import { Box, Container, Modal, Stack, Typography } from '@mui/material'
import React from 'react'
import OTP from '../../Form/otpinput'

export default function page() {
  return <>
  <Container>

      <Box>
        <Typography variant='h5'>Download your e-badge</Typography>
      </Box>

    <Box sx={{maxWidth:600,width:"100%",boxShadow:'0 0 20px #b5b3b3;',padding:2.5,borderRadius:'3px'}} className='bg-white w-full min-w-full mt-5' >
    <Typography textAlign={'center'} margin={"auto"} component={'p'}>Please Enter Registered Mobile Number Or Email or Unique reference Number(URN)</Typography>
              <Stack direction={"row"} gap={1}>
                    <OTP
                      separator={" "}
                      value={''}
                      disabled={false}
                      onChange={false ? () => {} : ()=>{}}
                      length={4}
                    />
                    </Stack>
    </Box>
  </Container>
  </>
}