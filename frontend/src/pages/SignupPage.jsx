import {
  Box,
  Button,
  Center,
  Container,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import {
  hasLength,
  isNotEmpty,
  matchesField,
  useForm,
} from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { signupUser } from "../api/authApi.js";
import AppHeader from "../components/AppHeader.jsx";

const required = isNotEmpty(
  "Обязательное поле",
);

const usernameLength = hasLength(
  { min: 3, max: 20 },
  "От 3 до 20 символов",
);

const passwordLength = hasLength(
  { min: 6 },
  "Не менее 6 символов",
);

const passwordsMatch = matchesField(
  "password",
  "Пароли должны совпадать",
);

const SignupPage = () => {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      username: (value) => (
        required(value)
        || usernameLength(value)
      ),

      password: (value) => (
        required(value)
        || passwordLength(value)
      ),

      confirmPassword: (value, values) => (
        required(value)
        || passwordsMatch(value, values)
      ),
    },
  });

  const signupMutation = useMutation({
    mutationFn: signupUser,

    onSuccess: (data) => {
      localStorage.setItem(
        "token",
        data.token,
      );

      localStorage.setItem(
        "username",
        data.username,
      );

      navigate("/", {
        replace: true,
      });
    },

    onError: (error) => {
      if (error.response?.status === 409) {
        form.setFieldError(
          "username",
          "Такой пользователь уже существует",
        );

        return;
      }

      form.setFieldError(
        "username",
        "Не удалось зарегистрироваться",
      );
    },
  });

  const handleSubmit = ({
    username,
    password,
  }) => {
    form.clearErrors();

    signupMutation.mutate({
      username: username.trim(),
      password,
    });
  };

  return (
    <Box mih="100vh" bg="gray.0">
      <Paper
        radius={0}
        shadow="xs"
        py="sm"
      >
        <Container size="lg">
          <AppHeader />
        </Container>
      </Paper>

      <Center
        mih="calc(100vh - 60px)"
        px="md"
      >
        <Paper
          withBorder
          shadow="sm"
          radius="sm"
          w={500}
          maw="100%"
          p="xl"
        >
          <Title
            order={1}
            ta="center"
            mb="lg"
          >
            Регистрация
          </Title>

          <form
            onSubmit={form.onSubmit(
              handleSubmit,
            )}
          >
            <Stack gap="md">
              <TextInput
                placeholder="Имя пользователя"
                autoFocus
                disabled={
                  signupMutation.isPending
                }
                {...form.getInputProps(
                  "username",
                )}
              />

              <PasswordInput
                placeholder="Пароль"
                disabled={
                  signupMutation.isPending
                }
                {...form.getInputProps(
                  "password",
                )}
              />

              <PasswordInput
                placeholder="Подтвердите пароль"
                disabled={
                  signupMutation.isPending
                }
                {...form.getInputProps(
                  "confirmPassword",
                )}
              />

              <Button
                type="submit"
                loading={
                  signupMutation.isPending
                }
              >
                Зарегистрироваться
              </Button>
            </Stack>
          </form>
        </Paper>
      </Center>
    </Box>
  );
};

export default SignupPage;