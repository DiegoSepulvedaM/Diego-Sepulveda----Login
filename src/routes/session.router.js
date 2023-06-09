import { Router } from "express";
import UserManager from "../dao/MongoDbManagers/UserManager.js";

const router = new Router();
const userManager = new UserManager();

router.post("/login", async (request, response) => {
  if (request.session?.email) return response.redirect("/products");
  if (
    request.body.email === "adminCoder@coder.com" &&
    request.body.password === "´"
  ) {
    request.session.name = `Coder House`
    request.session.email = request.body.email;
    request.session.rol = "admin";
    return response.send({
      success: `Bienvenido, en breve sera redireccionado automaticamente.`,
    });
  }
  let res = await userManager.login(request.body);
  if (res?.error) {
    response.status(400).send({ error: res.error });
  } else {
    request.session.name = `${res.payload.first_name} ${res.payload.last_name}`;
    request.session.email = request.body.email;
    request.session.rol = "usuario";
    response.send({
      success: `Bienvenido, en breve sera redireccionado automaticamente.`,
    });
  }
});

router.post("/register", async (request, response) => {
  let res = await userManager.register(request.body);
  res?.error
    ? response.status(400).send({ error: res.error })
    : response.send({
        success: `Se registro correctamente. Por favor dirijase al inicio de sesión.`,
      });
});

export default router;
