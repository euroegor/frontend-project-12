import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  AppShell,
  Badge,
  Box,
  Button,
  Center,
  Group,
  Loader,
  NavLink,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import {
  addMessage,
  getChannels,
  getMessages,
} from "../api/chatApi.js";
import socket from "../socket.js";
import useChatStore from "../store/useChatStore.js";

const HomePage = () => {
  const queryClient = useQueryClient();

  const [isSocketConnected, setIsSocketConnected] = useState(
    socket.connected,
  );

  const currentChannelId = useChatStore(
    (state) => state.currentChannelId,
  );

  const setCurrentChannelId = useChatStore(
    (state) => state.setCurrentChannelId,
  );

  const form = useForm({
    initialValues: {
      message: "",
    },
  });

  const channelsQuery = useQuery({
    queryKey: ["channels"],
    queryFn: getChannels,
  });

  const messagesQuery = useQuery({
    queryKey: ["messages"],
    queryFn: getMessages,
  });

  const sendMessageMutation = useMutation({
    mutationFn: addMessage,

    onSuccess: () => {
      form.reset();
    },

    onError: () => {
      form.setFieldError(
        "message",
        "Не удалось отправить сообщение",
      );
    },
  });

  const channels = useMemo(
    () => channelsQuery.data ?? [],
    [channelsQuery.data],
  );

  const messages = messagesQuery.data ?? [];

  useEffect(() => {
    if (currentChannelId === null && channels.length > 0) {
      const generalChannel = channels.find(
        (channel) => channel.name === "general",
      );

      setCurrentChannelId(
        generalChannel?.id ?? channels[0].id,
      );
    }
  }, [
    channels,
    currentChannelId,
    setCurrentChannelId,
  ]);

  useEffect(() => {
    const handleConnect = () => {
      setIsSocketConnected(true);
    };

    const handleDisconnect = () => {
      setIsSocketConnected(false);
    };

    const handleNewMessage = (newMessage) => {
      queryClient.setQueryData(
        ["messages"],
        (oldMessages = []) => {
          const messageExists = oldMessages.some(
            (message) => message.id === newMessage.id,
          );

          if (messageExists) {
            return oldMessages;
          }

          return [...oldMessages, newMessage];
        },
      );
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("newMessage", handleNewMessage);
    };
  }, [queryClient]);

  if (channelsQuery.isPending || messagesQuery.isPending) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  if (channelsQuery.isError || messagesQuery.isError) {
    return (
      <Center h="100vh">
        <Text c="red">
          Не удалось загрузить данные чата
        </Text>
      </Center>
    );
  }

  const currentChannel = channels.find(
    (channel) => channel.id === currentChannelId,
  );

  const currentMessages = messages.filter(
    (message) => message.channelId === currentChannelId,
  );

  const handleSubmit = ({ message }) => {
    const body = message.trim();
    const username = localStorage.getItem("username");

    if (!body || !username || !currentChannelId) {
      return;
    }

    form.clearErrors();

    sendMessageMutation.mutate({
      body,
      channelId: currentChannelId,
      username,
    });
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 260,
        breakpoint: "sm",
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group
          h="100%"
          px="md"
          justify="space-between"
        >
          <Title order={3}>
            Hexlet Chat
          </Title>

          <Badge
            color={isSocketConnected ? "green" : "red"}
            variant="light"
          >
            {isSocketConnected
              ? "В сети"
              : "Нет соединения"}
          </Badge>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Title order={4} mb="md">
          Каналы
        </Title>

        <Stack gap="xs">
          {channels.map((channel) => (
            <NavLink
              key={channel.id}
              label={`# ${channel.name}`}
              active={channel.id === currentChannelId}
              onClick={() => {
                setCurrentChannelId(channel.id);
              }}
            />
          ))}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Stack h="calc(100vh - 92px)">
          <Paper withBorder p="md">
            <Title order={4}>
              # {currentChannel?.name}
            </Title>

            <Text c="dimmed" size="sm">
              {currentMessages.length} сообщений
            </Text>
          </Paper>

          <ScrollArea flex={1}>
            <Stack gap="sm">
              {currentMessages.map((message) => (
                <Box key={message.id}>
                  <Text>
                    <Text span fw={700}>
                      {message.username}
                    </Text>
                    {": "}
                    {message.body}
                  </Text>
                </Box>
              ))}
            </Stack>
          </ScrollArea>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Group
              gap="sm"
              align="flex-start"
            >
              <TextInput
                placeholder="Введите сообщение..."
                flex={1}
                disabled={sendMessageMutation.isPending}
                {...form.getInputProps("message")}
              />

              <Button
                type="submit"
                loading={sendMessageMutation.isPending}
              >
                Отправить
              </Button>
            </Group>
          </form>
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
};

export default HomePage;