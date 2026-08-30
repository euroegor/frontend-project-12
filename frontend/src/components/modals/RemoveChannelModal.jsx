import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";

import { removeChannel } from "../../api/chatApi.js";
import { useChatStore } from "../../hooks/useChatStore.js";
import useNotificationsStore from "../../hooks/useNotificationsStore.js";

const RemoveChannelModal = ({ channel, channels }) => {
  const notificationsStore = useNotificationsStore();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const closeModal = useChatStore((state) => state.closeModal);

  const currentChannelId = useChatStore((state) => state.currentChannelId);

  const setCurrentChannelId = useChatStore(
    (state) => state.setCurrentChannelId,
  );

  const mutation = useMutation({
    mutationFn: removeChannel,

    onSuccess: () => {
      const defaultChannel = channels.find((item) => item.name === "general");

      if (currentChannelId === channel.id) {
        setCurrentChannelId(defaultChannel?.id ?? null);
      }

      queryClient.invalidateQueries({
        queryKey: ["channels"],
      });

      queryClient.invalidateQueries({
        queryKey: ["messages"],
      });

      notifications.show(
        {
          color: "green",
          message: t("channels.notifications.removed"),
        },
        notificationsStore,
      );

      closeModal();
    },
  });

  return (
    <Modal
      opened
      onClose={closeModal}
      title={t("channels.remove.title")}
      centered
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate(channel.id);
        }}
      >
        <Stack>
          <Text>
            {t("channels.remove.question", {
              name: channel.name,
            })}
          </Text>

          {mutation.isError && (
            <Text c="red" size="sm">
              {t("channels.remove.error")}
            </Text>
          )}

          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={closeModal}
              disabled={mutation.isPending}
            >
              {t("channels.cancel")}
            </Button>

            <Button type="submit" color="red" loading={mutation.isPending}>
              {t("channels.remove.submit")}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default RemoveChannelModal;
