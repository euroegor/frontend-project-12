const apiPath = "/api/v1";

const routes = {
  loginPath: () => `${apiPath}/login`,
  signupPath: () => `${apiPath}/signup`,
  channelsPath: () => `${apiPath}/channels`,
  channelPath: (id) => `${apiPath}/channels/${id}`,
  messagesPath: () => `${apiPath}/messages`,
};

export default routes;