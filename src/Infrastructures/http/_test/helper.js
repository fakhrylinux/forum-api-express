import request from "supertest";

const getAccessToken = async (app, username, password, fullname) => {
  await request(app).post("/users").send({
    username: username,
    password: password,
    fullname: fullname,
  });

  const loginResponse = await request(app).post("/authentications").send({
    username: username,
    password: password,
  });

  const {
    data: { accessToken },
  } = loginResponse.body;

  return accessToken;
};

export { getAccessToken };
