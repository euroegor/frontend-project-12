import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createInstance } from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { BrowserRouter } from "react-router";

import App from "./App.jsx";
import ru from "./locales/ru.js";
import createChatStore from "./store/chatStore.js";
import ChatStoreProvider from "./providers/ChatStoreProvider.jsx";
import SocketProvider from "./providers/SocketProvider.jsx";

const init = async (socket) => {
  const queryClient = new QueryClient();
  const chatStore = createChatStore();
  const i18n = createInstance();

  await i18n.use(initReactI18next).init({
    resources: {
      ru: {
        translation: ru,
      },
    },
    lng: "ru",
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false,
    },
  });

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <ChatStoreProvider store={chatStore}>
          <SocketProvider socket={socket}>
            <MantineProvider>
              <Notifications position="top-right" />

              <BrowserRouter>
                <App />
              </BrowserRouter>
            </MantineProvider>
          </SocketProvider>
        </ChatStoreProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
};

export default init;
