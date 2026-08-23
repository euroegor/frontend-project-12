import { Anchor, Button, Group } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import useChatStore from "../store/useChatStore.js";
import { useTranslation } from "react-i18next";

const AppHeader = ({ children }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    queryClient.clear();

    useChatStore.getState().setCurrentChannelId(null);

    useChatStore.getState().closeModal();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <Group h="100%" justify="space-between" wrap="nowrap">
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
          <Button onClick={handleLogout}>{t("header.logout")}</Button>
        )}
      </Group>
    </Group>
  );
};

export default AppHeader;
