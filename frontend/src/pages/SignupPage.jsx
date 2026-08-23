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
import { hasLength, isNotEmpty, matchesField, useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { signupUser } from "../api/authApi.js";
import AppHeader from "../components/AppHeader.jsx";
import { useTranslation } from "react-i18next";

const SignupPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const required = isNotEmpty(t("signup.errors.required"));

  const usernameLength = hasLength(
    { min: 3, max: 20 },
    t("signup.errors.usernameLength"),
  );

  const passwordLength = hasLength(
    { min: 6 },
    t("signup.errors.passwordLength"),
  );

  const passwordsMatch = matchesField(
    "password",
    t("signup.errors.passwordsMatch"),
  );

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      username: (value) => required(value) || usernameLength(value.trim()),

      password: (value) => required(value) || passwordLength(value),

      confirmPassword: (value, values) =>
        required(value) || passwordsMatch(value, values),
    },
  });

  const signupMutation = useMutation({
    mutationFn: signupUser,

    onSuccess: (data) => {
      localStorage.setItem("token", data.token);

      localStorage.setItem("username", data.username);

      navigate("/", {
        replace: true,
      });
    },

    onError: (error) => {
      if (error.response?.status === 409) {
        form.setFieldError("username", t("signup.errors.userExists"));

        return;
      }

      form.setFieldError("username", t("signup.errors.network"));
    },
  });

  const handleSubmit = ({ username, password }) => {
    form.clearErrors();

    signupMutation.mutate({
      username: username.trim(),
      password,
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
        <Paper withBorder shadow="sm" radius="sm" w={500} maw="100%" p="xl">
          <Title order={1} ta="center" mb="lg">
            {t("signup.title")}
          </Title>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                placeholder={t("signup.username")}
                autoFocus
                disabled={signupMutation.isPending}
                {...form.getInputProps("username")}
              />

              <PasswordInput
                placeholder={t("signup.password")}
                disabled={signupMutation.isPending}
                {...form.getInputProps("password")}
              />

              <PasswordInput
                placeholder={t("signup.confirmPassword")}
                disabled={signupMutation.isPending}
                {...form.getInputProps("confirmPassword")}
              />

              <Button type="submit" loading={signupMutation.isPending}>
                {t("signup.submit")}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Center>
    </Box>
  );
};

export default SignupPage;
