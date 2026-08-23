import SocketContext from "./socketContext.js";

const SocketProvider = ({
  socket,
  children,
}) => (
  <SocketContext.Provider value={socket}>
    {children}
  </SocketContext.Provider>
);

export default SocketProvider;