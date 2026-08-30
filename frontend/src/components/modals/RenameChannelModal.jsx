import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { renameChannel } from "../../api/chatApi.js";
import { useChatStore } from "../../hooks/useChatStore.js";
import cleanText from "../../utils/profanityFilter.js";
import validateChannelName from "../../utils/validateChannelName.js";

const RenameChannelModal = ({ channel, channels }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const closeModal = useChatStore((state) => state.closeModal);

  const form = useForm({
    initialValues: {
      name: channel.name,
    },

    validate: {
      name: (value) => validateChannelName(value, channels, t, channel.id),
    },
  });

  const mutation = useMutation({
    mutationFn: renameChannel,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["channels"],
      });

      notifications.show({
        color: "green",
        message: t("channels.notifications.renamed"),
      });

      closeModal();
    },

    onError: () => {
      form.setFieldError("name", t("channels.errors.rename"));
    },
  });

  const handleSubmit = ({ name }) => {
    mutation.mutate({
      id: channel.id,
      name: cleanText(name.trim()),
    });
  };

  return (
    <Modal
      opened
      onClose={closeModal}
      title={t("channels.rename.title")}
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            autoFocus
            aria-label={t("channels.add.placeholder")}
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
              {t("channels.rename.submit")}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default RenameChannelModal;
