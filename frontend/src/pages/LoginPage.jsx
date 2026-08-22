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

const LoginPage = () => {
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
  });

  return (
    <Box mih="100vh" bg="gray.0">
      <Paper radius={0} shadow="xs" py="sm">
        <Container size="lg">
          <Text size="xl" fw={500}>
            Hexlet Chat
          </Text>
        </Container>
      </Paper>

      <Center mih="calc(100vh - 60px)" px="md">
        <Paper
          withBorder
          shadow="sm"
          radius="sm"
          w={800}
          maw="100%"
        >
          <Box p={48}>
            <Group
              align="center"
              justify="center"
              gap={64}
              wrap="nowrap"
            >
              <Box w={340}>
                <Title order={1} ta="center" mb="md">
                  Войти
                </Title>

                <form onSubmit={form.onSubmit(() => {})}>
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

                    <Button
                      type="submit"
                      variant="outline"
                      fullWidth
                    >
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
              <Anchor href="#">
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