import {
  Anchor,
  Button,
  Group,
} from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import {
  Link,
  useNavigate,
} from "react-router";

import useChatStore from "../store/useChatStore.js";

const AppHeader = ({ children }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isAuthenticated = Boolean(
    localStorage.getItem("token"),
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    queryClient.clear();

    useChatStore
      .getState()
      .setCurrentChannelId(null);

    useChatStore
      .getState()
      .closeModal();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <Group
      h="100%"
      justify="space-between"
      wrap="nowrap"
    >
      <Anchor
        component={Link}
        to="/"
        c="dark"
        underline="never"
        fw={500}
        size="xl"
      >
        Hexlet Chat
      </Anchor>

      <Group gap="sm" wrap="nowrap">
        {children}

        {isAuthenticated && (
          <Button onClick={handleLogout}>
            Выйти
          </Button>
        )}
      </Group>
    </Group>
  );
};

export default AppHeader;