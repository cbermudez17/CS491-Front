import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './src/theme';
import App from './src';

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}
