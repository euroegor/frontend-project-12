import axios from "axios";

import routes from "../routes.js";

export const signupUser = ({ username, password }) => (
  axios
    .post(routes.signupPath(), {
      username,
      password,
    })
    .then((response) => response.data)
);