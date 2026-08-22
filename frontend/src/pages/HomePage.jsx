import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AppShell,
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

import { getChannels, getMessages } from "../api/chatApi.js";
import useChatStore from "../store/useChatStore.js";

const HomePage = () => {
  const currentChannelId = useChatStore(
    (state) => state.currentChannelId,
  );

  const setCurrentChannelId = useChatStore(
    (state) => state.setCurrentChannelId,
  );

  const channelsQuery = useQuery({
    queryKey: ["channels"],
    queryFn: getChannels,
  });

  const messagesQuery = useQuery({
    queryKey: ["messages"],
    queryFn: getMessages,
  });

  const channels = useMemo(
  () => channelsQuery.data ?? [],
  [channelsQuery.data],
);
  const messages = messagesQuery.data ?? [];

  useEffect(() => {
    if (currentChannelId === null && channels.length > 0) {
      setCurrentChannelId(channels[0].id);
    }
  }, [channels, currentChannelId, setCurrentChannelId]);

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
        <Group h="100%" px="md">
          <Title order={3}>Hexlet Chat</Title>
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

          <form
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <Group gap="sm">
              <TextInput
                placeholder="Введите сообщение..."
                flex={1}
              />

              <Button type="submit">
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