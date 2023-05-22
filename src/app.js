import cartRouter from "./routes/cart.router.js";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/view.router.js";
import handlebars from "express-handlebars";
import express from "express";
import cors from "cors";
import { __dirname,} from "./utils.js";
import { Server } from "socket.io";
import mongoose from "mongoose";

const PORT = 8080;

const app = express();
mongoose.connect(
  `mongodb+srv://diegosepu:2hQM9Rr3XUvfbwMs@cluster1ds.czhv5gd.mongodb.net/?retryWrites=true&w=majority`
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

const socketio = app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);

const io = new Server(socketio);
app.set("socketio", io);

