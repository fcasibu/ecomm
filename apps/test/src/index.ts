import { productsController } from "@ecomm/services/registry";
import { md5 } from "utility";

async function run() {
  productsController.create({});
  console.log(md5("what is this"));
}

void run();
