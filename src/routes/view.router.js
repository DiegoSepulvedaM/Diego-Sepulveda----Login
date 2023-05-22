import { Router } from "express";
import ProductManager from "../dao/MongoDbManagers/ProductManager.js";
import CartManager from "../dao/MongoDbManagers/CartManager.js";

const router = Router();
const productManager = new ProductManager("./products.json");
const cartManager = new CartManager("./products.json");

router.get("/", async (request, response) => {
  response.render("index", {title: "Products", style: "home"});
});

router.get("/products", async (request, response) => {
  const { limit, sort, page, query } = request.query;
  const { docs, ...pag } = await productManager.getProducts(parseInt(limit), page, query, sort);
  let urlParams = `?`;
  if (query) urlParams += `query=${query}&`;
  if (limit) urlParams += `limit=${limit}&`;
  if (sort) urlParams += `sort=${sort}&`;
  pag.prevLink = pag.hasPrevPage ? `${urlParams}page=${pag.prevPage}` : null;
  pag.nextLink = pag.hasNextPage ? `${urlParams}page=${pag.nextPage}` : null;
  response.render("products", { error: docs === undefined, products: docs, pag, title: "Products", style: "home", sort, query });
});

router.get('/product/:pid',async (request,response)=>{
  let { pid } = request.params
  let product = await productManager.getProductById(pid)
  let error = product?.error ? true : false
  response.render("productdetail", { error , product, title: `Product ${product.title}`, style: "home" });
})

router.get("/newproduct", async (request, response) => {
  response.render("newproduct", {title: "Products", style: "home"});
});

router.get("/carts/:cid", async (request, response) => {
  let { cid } = request.params
  let { products, _id } = await cartManager.getCart(cid)
  response.render("carts", {title: "Products", style: "home", products ,_id});
});

export default router;
