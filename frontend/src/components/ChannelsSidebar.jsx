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

import useChatStore from "../store/useChatStore.js";

const ChannelsSidebar = ({ channels }) => {
  const currentChannelId = useChatStore(
    (state) => state.currentChannelId,
  );

  const setCurrentChannelId = useChatStore(
    (state) => state.setCurrentChannelId,
  );

  const openModal = useChatStore(
    (state) => state.openModal,
  );

  return (
    <>
      <Group justify="space-between" mb="md">
        <Title order={4}>
          Каналы
        </Title>

        <ActionIcon
          variant="subtle"
          aria-label="Добавить канал"
          onClick={() => openModal("add")}
        >
          +
        </ActionIcon>
      </Group>

      <Stack gap="xs">
        {channels.map((channel) => (
          <Group
            key={channel.id}
            gap={4}
            wrap="nowrap"
          >
            <Box flex={1} miw={0}>
              <NavLink
                active={channel.id === currentChannelId}
                onClick={() => {
                  setCurrentChannelId(channel.id);
                }}
                label={(
                  <Text truncate="end">
                    # {channel.name}
                  </Text>
                )}
              />
            </Box>

            {channel.removable && (
              <Menu position="bottom-end">
                <Menu.Target>
                  <ActionIcon
                    variant="subtle"
                    aria-label={`Управление каналом ${channel.name}`}
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
                    Переименовать
                  </Menu.Item>

                  <Menu.Item
                    color="red"
                    onClick={() => {
                      openModal("remove", channel.id);
                    }}
                  >
                    Удалить
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