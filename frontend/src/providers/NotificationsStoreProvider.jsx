import NotificationsStoreContext from "./notificationsStoreContext.js";

const NotificationsStoreProvider = ({
  store,
  children,
}) => (
  <NotificationsStoreContext.Provider value={store}>
    {children}
  </NotificationsStoreContext.Provider>
);

export default NotificationsStoreProvider;