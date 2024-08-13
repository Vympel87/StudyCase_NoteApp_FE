"use client";

import { ChakraProvider } from '@chakra-ui/react';
import { ApolloProvider } from '@apollo/client';
import client from '../lib/apolloClient';
import { ReactNode } from 'react';

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <ApolloProvider client={client}>
          <ChakraProvider>
            {children}
          </ChakraProvider>
        </ApolloProvider>
      </body>
    </html>
  );
};

export default RootLayout;
