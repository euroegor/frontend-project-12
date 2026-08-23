import ChatStoreContext from "./chatStoreContext.js";

const ChatStoreProvider = ({
  store,
  children,
}) => (
  <ChatStoreContext.Provider value={store}>
    {children}
  </ChatStoreContext.Provider>
);

export default ChatStoreProvider;