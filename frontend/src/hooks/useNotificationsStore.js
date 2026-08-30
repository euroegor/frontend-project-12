import { useContext } from "react";

import NotificationsStoreContext from "../providers/notificationsStoreContext.js";

const useNotificationsStore = () => {
  const store = useContext(
    NotificationsStoreContext,
  );

  if (!store) {
    throw new Error(
      "NotificationsStoreProvider is missing",
    );
  }

  return store;
};

export default useNotificationsStore;