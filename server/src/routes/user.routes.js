import { Router } from "express";
import { body } from "express-validator";
import * as userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
    "/user/register",
    [
        body("name")
            .trim()
            .notEmpty()
            .withMessage("Name is required")
            .isLength({ min: 3 })
            .withMessage("Name must be at least 3 characters long"),

        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Invalid email address"),

        body("password")
            .notEmpty()
            .withMessage("Password is required")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long"),
    ],
    userController.registerUser
);

router.post(
    "/user/login",
    [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Invalid email"),

        body("password")
            .notEmpty()
            .withMessage("Password is required"),
    ],
    userController.loginUser
);

router.get(
    "/user/details",
    authMiddleware,
    userController.getUserDetails
);

router.post("/user/logout", userController.logoutUser);

export default router;