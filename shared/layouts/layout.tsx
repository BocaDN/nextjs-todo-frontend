import React, { ReactNode } from 'react';
import Head from 'next/head';
import { Box, Container } from '@mui/material';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'This is the default title' }: Props) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      minWidth: '100%',
    }}
  >
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>

    <Container sx={{ flexGrow: 1, py: 4 }}>{children}</Container>

    <Box
      component="footer"
      sx={{
        py: 3,
        textAlign: 'center',
        fontSize: '0.75rem',
        color: 'text.secondary',
        mt: 'auto',
        mb: '0',
      }}
    ></Box>
  </Box>
);

export default Layout;
