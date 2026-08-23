import axios from "axios";

export const signupUser = ({ username, password }) => (
  axios
    .post("/api/v1/signup", {
      username,
      password,
    })
    .then((response) => response.data)
);