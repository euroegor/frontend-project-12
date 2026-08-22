import { Button, Container, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router";

const NotFoundPage = () => (
  <Container size="xs" py="xl">
    <Stack align="center">
      <Title>404</Title>
      <Text>Page not found</Text>
      <Button component={Link} to="/">
        Go to chat
      </Button>
    </Stack>
  </Container>
);

export default NotFoundPage;