import { Anchor, Button, Group } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";

import { useChatStore } from "../hooks/useChatStore.js";

const AppHeader = ({ children }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const setCurrentChannelId = useChatStore(
    (state) => state.setCurrentChannelId,
  );

  const closeModal = useChatStore(
    (state) => state.closeModal,
  );

  const isAuthenticated = Boolean(
    localStorage.getItem("token"),
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    queryClient.clear();

    setCurrentChannelId(null);
    closeModal();

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
        {t("header.title")}
      </Anchor>

      <Group gap="sm" wrap="nowrap">
        {children}

        {isAuthenticated && (
          <Button onClick={handleLogout}>
            {t("header.logout")}
          </Button>
        )}
      </Group>
    </Group>
  );
};

export default AppHeader;
