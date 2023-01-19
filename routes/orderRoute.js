import express from "express";
import { deleteOrder, getAllOrders, getmyOrders, getSingleOrder, newOrder, updateOrder } from "../controllers/orderController.js";
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";


const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/user").get(isAuthenticatedUser, getmyOrders);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

export default router;