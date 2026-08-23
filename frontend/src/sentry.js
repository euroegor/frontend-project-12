import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_BUGSINK_DSN,
  enabled: Boolean(import.meta.env.VITE_BUGSINK_DSN),
  environment: import.meta.env.MODE,
});

export default Sentry;