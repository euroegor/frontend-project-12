import { hasLength, isNotEmpty } from "@mantine/form";

import cleanText from "./profanityFilter.js";

const validateChannelName = (value, channels, t, currentChannelId = null) => {
  const normalizedName = cleanText(value.trim());

  const validateNotEmpty = isNotEmpty(t("channels.errors.required"));

  const validateLength = hasLength(
    { min: 3, max: 20 },
    t("channels.errors.length"),
  );

  const emptyError = validateNotEmpty(normalizedName);

  if (emptyError) {
    return emptyError;
  }

  const lengthError = validateLength(normalizedName);

  if (lengthError) {
    return lengthError;
  }

  const channelExists = channels.some(
    (channel) =>
      channel.id !== currentChannelId && channel.name === normalizedName,
  );

  if (channelExists) {
    return t("channels.errors.duplicate");
  }

  return null;
};

export default validateChannelName;
