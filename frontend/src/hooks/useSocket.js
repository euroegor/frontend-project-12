import { useContext } from "react";

import SocketContext from "../providers/socketContext.js";

const useSocket = () => {
  const socket = useContext(SocketContext);

  if (!socket) {
    throw new Error("SocketProvider is missing");
  }

  return socket;
};

export default useSocket;