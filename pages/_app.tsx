import { AppProps } from "next/app";
import Layout from '../components/layout/layout';
import { ThemeProvider } from "@chakra-ui/react";
import theme from '../components/layout/theme';
import '../styles/globals.css';
import { useState } from 'react';
import { Switch, FormControl, FormLabel } from "@chakra-ui/react";

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  const [isDark, setIsDark] = useState(false);
  
  const SwitchChakrauiTheme = () => {
    return (
      <FormControl display='flex' alignItems='center'>
        <FormLabel htmlFor='email-alerts' mb='0' fontFamily={'Rubik Maze'} fontSize='xs'>
          light/dark theme
        </FormLabel>
        <Switch size={'sm'} onChange={() => setIsDark(!isDark)} />
      </FormControl>
    )
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Layout themehandler={SwitchChakrauiTheme}>
          <Component {...pageProps} />
          <style jsx global>{`
              body {
                background: ${isDark ? "black" : "white"};
                color: ${isDark ? "white" : "black"};
              }
          `}</style>

        </Layout>
      </ThemeProvider>
    </>

  );
};

export default App;
