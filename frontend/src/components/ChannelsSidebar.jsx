import {
  ActionIcon,
  Box,
  Group,
  Menu,
  NavLink,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useTranslation } from "react-i18next";

import { useChatStore } from "../hooks/useChatStore.js";

const ChannelsSidebar = ({ channels }) => {
  const { t } = useTranslation();

  const currentChannelId = useChatStore((state) => state.currentChannelId);

  const setCurrentChannelId = useChatStore(
    (state) => state.setCurrentChannelId,
  );

  const openModal = useChatStore((state) => state.openModal);

  return (
    <>
      <Group justify="space-between" mb="md">
        <Title order={4}>{t("chat.channels")}</Title>

        <ActionIcon
          variant="subtle"
          aria-label={t("channels.addAction")}
          onClick={() => openModal("add")}
        >
          +
        </ActionIcon>
      </Group>

      <Stack gap="xs">
        {channels.map((channel) => (
          <Group key={channel.id} gap={4} wrap="nowrap">
            <Box flex={1} miw={0}>
              <NavLink
                component="button"
                type="button"
                aria-label={`# ${channel.name}`}
                active={channel.id === currentChannelId}
                onClick={() => {
                  setCurrentChannelId(channel.id);
                }}
                leftSection="#"
                label={<Text truncate="end">{channel.name}</Text>}
              />
            </Box>

            {channel.removable && (
              <Menu
                position="bottom-end"
                transitionProps={{
                  duration: 0,
                }}
              >
                <Menu.Target>
                  <ActionIcon
                    variant="subtle"
                    aria-label={t("channels.manage")}
                  >
                    ⋮
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    onClick={() => {
                      openModal("rename", channel.id);
                    }}
                  >
                    {t("channels.renameAction")}
                  </Menu.Item>

                  <Menu.Item
                    color="red"
                    onClick={() => {
                      openModal("remove", channel.id);
                    }}
                  >
                    {t("channels.removeAction")}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        ))}
      </Stack>
    </>
  );
};

export default ChannelsSidebar;
