import {
  Box,
  Button,
  Center,
  Container,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import AppHeader from "../components/AppHeader.jsx";

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <Box mih="100vh" bg="gray.0">
      <Paper radius={0} shadow="xs" py="sm">
        <Container size="lg">
          <AppHeader />
        </Container>
      </Paper>

      <Center mih="calc(100vh - 60px)">
        <Stack align="center">
          <Title>{t("notFound.title")}</Title>

          <Text>{t("notFound.text")}</Text>

          <Button component={Link} to="/">
            {t("notFound.home")}
          </Button>
        </Stack>
      </Center>
    </Box>
  );
};

export default NotFoundPage;
