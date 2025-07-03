'use client';
import Link from 'next/link';
import { Box, Button, Container, Typography } from '@mui/material';
import Layout from '../shared/layouts/layout';

export default function HomePage() {
  return (
    <Layout title="Todos App">
      <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 30 }}>
        <Typography variant="h2" gutterBottom>
          Todos App
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Welcome! This is a protal that helps you in tracking and organising
          tasks.
        </Typography>

        <Box mt={4}>
          <Link href="/todos" passHref>
            <Button variant="contained" color="secondary">
              View the Todos
            </Button>
          </Link>
        </Box>
      </Container>
    </Layout>
  );
}
