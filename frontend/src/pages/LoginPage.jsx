import {
  Anchor,
  Box,
  Button,
  Divider,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";

import AppHeader from "../components/AppHeader.jsx";
import routes from "../routes.js";

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = (values) => {
    form.clearErrors();

    axios
      .post(routes.loginPath(), values)
      .then((response) => {
        localStorage.setItem("token", response.data.token);

        localStorage.setItem("username", response.data.username);

        navigate("/", {
          replace: true,
        });
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          form.setFieldError("username", t("login.errors.invalidCredentials"));

          return;
        }

        form.setFieldError("username", t("login.errors.network"));
      });
  };

  return (
    <Box bg="gray.0" mih="100vh">
      <Paper radius={0} shadow="xs" px="md" h={60}>
        <AppHeader />
      </Paper>

      <Box maw={800} mx="auto" px="md" py={80}>
        <Paper withBorder shadow="sm" radius="md" p={48}>
          <Box maw={340} mx="auto">
            <Title order={2} ta="center" mb="xl">
              {t("login.title")}
            </Title>

            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack>
                <TextInput
                  label={t("login.username")}
                  placeholder={t("login.username")}
                  disabled={form.submitting}
                  {...form.getInputProps("username")}
                />

                <PasswordInput
                  label={t("login.password")}
                  placeholder={t("login.password")}
                  disabled={form.submitting}
                  {...form.getInputProps("password")}
                />

                <Button type="submit" variant="outline" fullWidth>
                  {t("login.submit")}
                </Button>
              </Stack>
            </form>

            <Divider my="xl" />

            <Text ta="center" c="dimmed">
              {t("login.noAccount")}{" "}
              <Anchor component={Link} to="/signup">
                {t("login.signup")}
              </Anchor>
            </Text>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginPage;
