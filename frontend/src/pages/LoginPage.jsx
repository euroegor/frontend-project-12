import axios from "axios";
import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Link, useNavigate } from "react-router";
import AppHeader from "../components/AppHeader.jsx";

const LoginPage = () => {
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
      .post("/api/v1/login", values)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username);
        navigate("/");
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          form.setFieldError(
            "username",
            "Неверные имя пользователя или пароль",
          );
          return;
        }

        form.setFieldError("username", "Ошибка соединения с сервером");
      });
  };

  return (
    <Box mih="100vh" bg="gray.0">
      <Paper radius={0} shadow="xs" py="sm">
        <Container size="lg">
          <AppHeader />
        </Container>
      </Paper>

      <Center mih="calc(100vh - 60px)" px="md">
        <Paper withBorder shadow="sm" radius="sm" w={800} maw="100%">
          <Box p={48}>
            <Group align="center" justify="center" gap={64} wrap="nowrap">
              <Box w={340}>
                <Title order={1} ta="center" mb="md">
                  Войти
                </Title>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                  <Stack gap="md">
                    <TextInput
                      placeholder="Ваш ник"
                      size="md"
                      {...form.getInputProps("username")}
                    />

                    <PasswordInput
                      placeholder="Пароль"
                      size="md"
                      {...form.getInputProps("password")}
                    />

                    <Button type="submit" variant="outline" fullWidth>
                      Войти
                    </Button>
                  </Stack>
                </form>
              </Box>
            </Group>
          </Box>

          <Divider />

          <Box py="lg" bg="gray.0">
            <Text ta="center">
              Нет аккаунта?{" "}
              <Anchor component={Link} to="/signup">
                Регистрация
              </Anchor>
            </Text>
          </Box>
        </Paper>
      </Center>
    </Box>
  );
};

export default LoginPage;
