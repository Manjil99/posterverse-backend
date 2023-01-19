import express from "express";
import { deleteUser, getAllUser, getSingleUser, getUserdetails, loginUser, logoutUser, registerUser, updatePassword, updateProfile, updateUserRole } from "../controllers/usersController.js";
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser); 
router.route("/logout").get(logoutUser);
router.route("/profile").get(isAuthenticatedUser, getUserdetails);
router.route("/password/update").put(isAuthenticatedUser,updatePassword);
router.route("/profile/update").put(isAuthenticatedUser, updateProfile);
router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUser);

router.route("/admin/user/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getSingleUser)
                               .put(isAuthenticatedUser,authorizeRoles("admin"),updateUserRole)
                               .delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUser);


export default router;