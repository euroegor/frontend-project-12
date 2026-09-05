import { useRef } from "react";
import {
  Box,
  Button,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { signupUser } from "../api/authApi.js";
import AppHeader from "../components/AppHeader.jsx";

const SignupPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);
  const submitButtonRef = useRef(null);

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      username: (value) => {
        const requiredError = isNotEmpty(t("signup.errors.required"))(value);

        if (requiredError) {
          return requiredError;
        }

        return hasLength(
          { min: 3, max: 20 },
          t("signup.errors.usernameLength"),
        )(value.trim());
      },

      password: (value) => {
        const requiredError = isNotEmpty(t("signup.errors.required"))(value);

        if (requiredError) {
          return requiredError;
        }

        return hasLength({ min: 6 }, t("signup.errors.passwordLength"))(value);
      },

      confirmPassword: (value, values) => {
        if (!value) {
          return t("signup.errors.required");
        }

        if (value !== values.password) {
          return t("signup.errors.passwordsMatch");
        }

        return null;
      },
    },
  });

  const handleSubmit = ({ username, password }) => {
    form.clearErrors();

    signupUser({
      username: username.trim(),
      password,
    })
      .then((response) => {
        localStorage.setItem("token", response.token);

        localStorage.setItem("username", response.username);

        navigate("/", {
          replace: true,
        });
      })
      .catch((error) => {
        if (error.response?.status === 409) {
          form.setFieldError("username", t("signup.errors.userExists"));

          return;
        }

        form.setFieldError("username", t("signup.errors.network"));
      });
  };

  const handleUsernameKeyDown = (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    const username = form.values.username.trim();

    if (username.length < 3 || username.length > 20) {
      form.validateField("username");
      return;
    }

    passwordInputRef.current?.focus();
  };

  const handlePasswordKeyDown = (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    if (form.values.password.length < 6) {
      form.validateField("password");
      return;
    }

    confirmPasswordInputRef.current?.focus();
  };

  const handleConfirmPasswordKeyDown = (event) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    const confirmPassword = form.values.confirmPassword;

    if (!confirmPassword || confirmPassword !== form.values.password) {
      form.validateField("confirmPassword");

      return;
    }

    submitButtonRef.current?.focus();
  };

  return (
    <Box bg="gray.0" mih="100vh">
      <Paper radius={0} shadow="xs" px="md" h={60}>
        <AppHeader />
      </Paper>

      <Box maw={500} mx="auto" px="md" py={80}>
        <Paper withBorder shadow="sm" radius="md" p={48}>
          <Title order={2} ta="center" mb="xl">
            {t("signup.title")}
          </Title>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                autoFocus
                label={t("signup.username")}
                placeholder={t("signup.username")}
                onKeyDown={handleUsernameKeyDown}
                {...form.getInputProps("username")}
              />

              <PasswordInput
                ref={passwordInputRef}
                label={t("signup.password")}
                placeholder={t("signup.password")}
                onKeyDown={handlePasswordKeyDown}
                {...form.getInputProps("password")}
              />

              <PasswordInput
                ref={confirmPasswordInputRef}
                label={t("signup.confirmPassword")}
                placeholder={t("signup.confirmPassword")}
                onKeyDown={handleConfirmPasswordKeyDown}
                {...form.getInputProps("confirmPassword")}
              />

              <Button ref={submitButtonRef} type="submit" fullWidth>
                {t("signup.submit")}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default SignupPage;
