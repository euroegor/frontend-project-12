import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AppShell,
  Badge,
  Box,
  Button,
  Center,
  Group,
  Loader,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";

import { addMessage, getChannels, getMessages } from "../api/chatApi.js";
import AppHeader from "../components/AppHeader.jsx";
import ChannelModals from "../components/ChannelModals.jsx";
import ChannelsSidebar from "../components/ChannelsSidebar.jsx";
import {
  useChatStore,
  useChatStoreApi,
} from "../hooks/useChatStore.js";
import useSocket from "../hooks/useSocket.js";
import cleanText from "../utils/profanityFilter.js";

const HomePage = () => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const socket = useSocket();
  const chatStore = useChatStoreApi();

  const [isSocketConnected, setIsSocketConnected] = useState(
    Boolean(socket.connected),
  );

  const currentChannelId = useChatStore((state) => state.currentChannelId);

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
      form.setFieldError("message", t("chat.sendError"));
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

      setCurrentChannelId(generalChannel?.id ?? channels[0].id);
    }
  }, [channels, currentChannelId, setCurrentChannelId]);

  useEffect(() => {
    const handleConnect = () => {
      setIsSocketConnected(true);

      notifications.hide("network-error");
    };

    const handleDisconnect = () => {
      setIsSocketConnected(false);

      notifications.show({
        id: "network-error",
        color: "red",
        message: t("chat.notifications.networkError"),
        autoClose: false,
      });
    };

    const handleNewMessage = (newMessage) => {
      queryClient.setQueryData(["messages"], (oldMessages = []) => {
        const messageExists = oldMessages.some(
          (message) => message.id === newMessage.id,
        );

        if (messageExists) {
          return oldMessages;
        }

        return [...oldMessages, newMessage];
      });
    };

    const handleNewChannel = (newChannel) => {
      queryClient.setQueryData(["channels"], (oldChannels = []) => {
        const channelExists = oldChannels.some(
          (channel) => channel.id === newChannel.id,
        );

        if (channelExists) {
          return oldChannels;
        }

        return [...oldChannels, newChannel];
      });
    };

    const handleRenameChannel = (renamedChannel) => {
      queryClient.setQueryData(["channels"], (oldChannels = []) =>
        oldChannels.map((channel) =>
          channel.id === renamedChannel.id ? renamedChannel : channel,
        ),
      );
    };

    const handleRemoveChannel = ({ id }) => {
      const oldChannels = queryClient.getQueryData(["channels"]) ?? [];

      const defaultChannel = oldChannels.find(
        (channel) => channel.name === "general",
      );

      queryClient.setQueryData(
        ["channels"],
        oldChannels.filter((channel) => channel.id !== id),
      );

      queryClient.setQueryData(["messages"], (oldMessages = []) =>
        oldMessages.filter((message) => message.channelId !== id),
      );

      const activeChannelId = chatStore.getState().currentChannelId;

      if (activeChannelId === id) {
        chatStore.getState().setCurrentChannelId(defaultChannel?.id ?? null);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("newMessage", handleNewMessage);
    socket.on("newChannel", handleNewChannel);
    socket.on("renameChannel", handleRenameChannel);
    socket.on("removeChannel", handleRemoveChannel);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("newMessage", handleNewMessage);
      socket.off("newChannel", handleNewChannel);
      socket.off("renameChannel", handleRenameChannel);
      socket.off("removeChannel", handleRemoveChannel);
    };
  }, [socket, queryClient, chatStore, t]);

  useEffect(() => {
    if (channelsQuery.isError || messagesQuery.isError) {
      notifications.show({
        id: "chat-load-error",
        color: "red",
        message: t("chat.notifications.loadError"),
      });
    }
  }, [channelsQuery.isError, messagesQuery.isError, t]);

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
        <Text c="red">{t("chat.loadError")}</Text>
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
    const body = cleanText(message.trim());

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
        <Box h="100%" px="md">
          <AppHeader>
            <Badge color={isSocketConnected ? "green" : "red"} variant="light">
              {isSocketConnected ? t("chat.online") : t("chat.offline")}
            </Badge>
          </AppHeader>
        </Box>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <ChannelsSidebar channels={channels} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Stack h="calc(100vh - 92px)">
          <Paper withBorder p="md">
            <Title order={4}># {currentChannel?.name}</Title>

            <Text c="dimmed" size="sm">
              {t("chat.messagesCount", {
                count: currentMessages.length,
              })}
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
            <Group gap="sm" align="flex-start">
              <TextInput
                aria-label={t("chat.messagePlaceholder")}
                placeholder={t("chat.messagePlaceholder")}
                flex={1}
                disabled={sendMessageMutation.isPending}
                {...form.getInputProps("message")}
              />

              <Button type="submit" loading={sendMessageMutation.isPending}>
                {t("chat.send")}
              </Button>
            </Group>
          </form>
        </Stack>
      </AppShell.Main>

      <ChannelModals channels={channels} />
    </AppShell>
  );
};

export default HomePage;
