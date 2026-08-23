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
import { Link } from "react-router";

import AppHeader from "../components/AppHeader.jsx";

const NotFoundPage = () => (
  <Box mih="100vh" bg="gray.0">
    <Paper radius={0} shadow="xs" py="sm">
      <Container size="lg">
        <AppHeader />
      </Container>
    </Paper>

    <Center mih="calc(100vh - 60px)">
      <Stack align="center">
        <Title>404</Title>

        <Text>Страница не найдена</Text>

        <Button component={Link} to="/">
          На главную
        </Button>
      </Stack>
    </Center>
  </Box>
);

export default NotFoundPage;
