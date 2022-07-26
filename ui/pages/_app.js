import '../styles/globals.css';
import { ChakraProvider, Spinner, Center } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';

function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
  const [fsEnabled, setFsEnabled] = useState(false);
  const [settings, setSettings] = useState();
  const [connection, setConnection] = useState();

  useEffect(() => {
    (async () => {
      if (!loading)
        return;

      let endpoint = "";
      let fullscreen = false;
      if (!settings) {
        let res = await fetch('settings.json').catch(e => { });
        if (res === undefined)
          return console.log('Error fetching settings');

        let settings = await res.json().catch(e => { });
        if (settings === undefined)
          return console.log('Error fetching settings');

        setSettings(settings);
        endpoint = settings.endpoint;
        fullscreen = settings.fullscreen;
      } else {
        endpoint = settings.endpoint;
        fullscreen = settings.fullscreen;
      }

      if (fullscreen && !fsEnabled) {
        document.documentElement.requestFullscreen().catch(e => { });
        setFsEnabled(true);
      }

      const connection = new signalR.HubConnectionBuilder()
        .withUrl(endpoint)
        .configureLogging(signalR.LogLevel.Information)
        .build();

      async function start() {
        try {
          await connection.start();
          console.log("SignalR Connected.");
          setConnection(connection);
          setLoading(false);
        } catch (err) {
          console.log(err);
          setTimeout(start, 5000);
        }
      };

      connection.onclose(async () => {
        await start();
      });

      start();
    })();
  });

  if (loading)
    return (
      <ChakraProvider>
        <Center h='100vh'>
          <Spinner />
        </Center>
      </ChakraProvider>
    );

  return (
    <ChakraProvider>
      <Component connection={connection} settings={settings} {...pageProps} />
    </ChakraProvider>
  );
}

export default App;
