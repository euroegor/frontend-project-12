import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { addChannel, removeChannel, renameChannel } from "../api/chatApi.js";
import useChatStore from "../store/useChatStore.js";
import cleanText from "../utils/profanityFilter.js";

const validateChannelName = (value, channels, t, currentChannelId = null) => {
  const normalizedName = cleanText(value.trim());

  const validateNotEmpty = isNotEmpty(t("channels.errors.required"));

  const validateLength = hasLength(
    { min: 3, max: 20 },
    t("channels.errors.length"),
  );

  const emptyError = validateNotEmpty(normalizedName);

  if (emptyError) {
    return emptyError;
  }

  const lengthError = validateLength(normalizedName);

  if (lengthError) {
    return lengthError;
  }

  const channelExists = channels.some(
    (channel) =>
      channel.id !== currentChannelId && channel.name === normalizedName,
  );

  if (channelExists) {
    return t("channels.errors.duplicate");
  }

  return null;
};

const AddChannelModal = ({ channels }) => {
  const { t } = useTranslation();

  const closeModal = useChatStore((state) => state.closeModal);

  const setCurrentChannelId = useChatStore(
    (state) => state.setCurrentChannelId,
  );

  const queryClient = useQueryClient();

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

      notifications.show({
        color: "green",
        message: t("channels.notifications.created"),
      });

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

const RenameChannelModal = ({ channel, channels }) => {
  const { t } = useTranslation();

  const closeModal = useChatStore((state) => state.closeModal);

  const queryClient = useQueryClient();

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

const RemoveChannelModal = ({ channel, channels }) => {
  const { t } = useTranslation();

  const closeModal = useChatStore((state) => state.closeModal);

  const currentChannelId = useChatStore((state) => state.currentChannelId);

  const setCurrentChannelId = useChatStore(
    (state) => state.setCurrentChannelId,
  );

  const queryClient = useQueryClient();

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

      notifications.show({
        color: "green",
        message: t("channels.notifications.removed"),
      });

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
