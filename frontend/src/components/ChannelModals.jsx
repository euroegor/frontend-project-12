import { useChatStore } from "../hooks/useChatStore.js";
import AddChannelModal from "./modals/AddChannelModal.jsx";
import RemoveChannelModal from "./modals/RemoveChannelModal.jsx";
import RenameChannelModal from "./modals/RenameChannelModal.jsx";

const ChannelModals = ({ channels }) => {
  const modal = useChatStore((state) => state.modal);

  if (!modal) {
    return null;
  }

  if (modal.type === "add") {
    return <AddChannelModal channels={channels} />;
  }

  const channel = channels.find((item) => item.id === modal.channelId);

  if (!channel || !channel.removable) {
    return null;
  }

  if (modal.type === "rename") {
    return (
      <RenameChannelModal
        key={channel.id}
        channel={channel}
        channels={channels}
      />
    );
  }

  if (modal.type === "remove") {
    return <RemoveChannelModal channel={channel} channels={channels} />;
  }

  return null;
};

export default ChannelModals;
