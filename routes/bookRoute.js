import express from "express";
import { createBooks, deleteBooks, getAllBooks, getBookDetails, updateBooks, createBookreview, getBookreview, deleteBookReview, getAdminBooks } from "../controllers/booksController.js";
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";

const router = express.Router();

router.route("/books").get(getAllBooks);

router.route("/admin/books/new").post(isAuthenticatedUser,authorizeRoles("admin"),createBooks); 

router.route("/admin/books/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateBooks).delete(isAuthenticatedUser,authorizeRoles("admin"),deleteBooks)

router.route("/books/:id").get(getBookDetails);

router.route("/review").put(isAuthenticatedUser, createBookreview);

router.route("/reviews").get(getBookreview).delete(isAuthenticatedUser, deleteBookReview);

router.route("/admin/books").get(isAuthenticatedUser,authorizeRoles("admin"),getAdminBooks);

export default router;