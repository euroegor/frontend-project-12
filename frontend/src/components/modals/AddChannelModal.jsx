import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import useNotificationsStore from "../../hooks/useNotificationsStore.js";

import { addChannel } from "../../api/chatApi.js";
import { useChatStore } from "../../hooks/useChatStore.js";
import cleanText from "../../utils/profanityFilter.js";
import validateChannelName from "../../utils/validateChannelName.js";

const AddChannelModal = ({ channels }) => {
  const notificationsStore = useNotificationsStore();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const closeModal = useChatStore((state) => state.closeModal);

  const setCurrentChannelId = useChatStore(
    (state) => state.setCurrentChannelId,
  );

  const form = useForm({
    initialValues: {
      name: "",
    },

    validate: {
      name: (value) => validateChannelName(value, channels, t),
    },
  });

  const mutation = useMutation({
    mutationFn: addChannel,

    onSuccess: (newChannel) => {
      setCurrentChannelId(newChannel.id);

      queryClient.invalidateQueries({
        queryKey: ["channels"],
      });

      notifications.show(
        {
          color: "green",
          message: t("channels.notifications.created"),
        },
        notificationsStore,
      );

      form.reset();
      closeModal();
    },

    onError: () => {
      form.setFieldError("name", t("channels.errors.add"));
    },
  });

  const handleSubmit = ({ name }) => {
    mutation.mutate(cleanText(name.trim()));
  };

  return (
    <Modal opened onClose={closeModal} title={t("channels.add.title")} centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            autoFocus
            aria-label={t("channels.add.placeholder")}
            placeholder={t("channels.add.placeholder")}
            disabled={mutation.isPending}
            {...form.getInputProps("name")}
          />

          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={closeModal}
              disabled={mutation.isPending}
            >
              {t("channels.cancel")}
            </Button>

            <Button type="submit" loading={mutation.isPending}>
              {t("channels.add.submit")}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddChannelModal;
