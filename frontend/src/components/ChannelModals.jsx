import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addChannel, removeChannel, renameChannel } from "../api/chatApi.js";
import useChatStore from "../store/useChatStore.js";
import { notifications } from "@mantine/notifications";

const validateNotEmpty = isNotEmpty("Введите имя канала");

const validateLength = hasLength({ min: 3, max: 20 }, "От 3 до 20 символов");

const validateChannelName = (value, channels, currentChannelId = null) => {
  const emptyError = validateNotEmpty(value);

  if (emptyError) {
    return emptyError;
  }

  const lengthError = validateLength(value);

  if (lengthError) {
    return lengthError;
  }

  const normalizedName = value.trim();

  const channelExists = channels.some(
    (channel) =>
      channel.id !== currentChannelId && channel.name === normalizedName,
  );

  if (channelExists) {
    return "Канал с таким именем уже существует";
  }

  return null;
};

const AddChannelModal = ({ channels }) => {
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
      name: (value) => validateChannelName(value, channels),
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
        message: "Канал создан",
      });

      form.reset();
      closeModal();
    },

    onError: () => {
      form.setFieldError("name", "Не удалось создать канал");
    },
  });

  const handleSubmit = ({ name }) => {
    mutation.mutate(name.trim());
  };

  return (
    <Modal opened onClose={closeModal} title="Добавить канал" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            autoFocus
            placeholder="Имя канала"
            disabled={mutation.isPending}
            {...form.getInputProps("name")}
          />

          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={closeModal}
              disabled={mutation.isPending}
            >
              Отмена
            </Button>

            <Button type="submit" loading={mutation.isPending}>
              Добавить
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

const RenameChannelModal = ({ channel, channels }) => {
  const closeModal = useChatStore((state) => state.closeModal);

  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      name: channel.name,
    },

    validate: {
      name: (value) => validateChannelName(value, channels, channel.id),
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
        message: "Канал переименован",
      });

      closeModal();
    },

    onError: () => {
      form.setFieldError("name", "Не удалось переименовать канал");
    },
  });

  const handleSubmit = ({ name }) => {
    mutation.mutate({
      id: channel.id,
      name: name.trim(),
    });
  };

  return (
    <Modal opened onClose={closeModal} title="Переименовать канал" centered>
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
              Отмена
            </Button>

            <Button type="submit" loading={mutation.isPending}>
              Переименовать
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

const RemoveChannelModal = ({ channel, channels }) => {
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
        message: "Канал удалён",
      });

      closeModal();
    },
  });

  return (
    <Modal opened onClose={closeModal} title="Удалить канал" centered>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate(channel.id);
        }}
      >
        <Stack>
          <Text>
            Уверены, что хотите удалить канал{" "}
            <Text span fw={700}>
              # {channel.name}
            </Text>
            ?
          </Text>

          {mutation.isError && (
            <Text c="red" size="sm">
              Не удалось удалить канал
            </Text>
          )}

          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={closeModal}
              disabled={mutation.isPending}
            >
              Отмена
            </Button>

            <Button type="submit" color="red" loading={mutation.isPending}>
              Удалить
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
