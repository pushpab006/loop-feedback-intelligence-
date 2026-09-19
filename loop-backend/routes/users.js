const express = require("express");
const bcrypt = require("bcryptjs");

const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// =====================================================
// GET WORKSPACE USERS
// =====================================================

router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    async (req, res) => {
        try {

            const allUsers =
                await db.orm.public.User.all();

            const users =
                allUsers.filter(
                    (user) =>
                        user.workspaceId === req.user.workspaceId
                );

            const safeUsers = users.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                workspaceId: user.workspaceId
            }));

            return res.json(safeUsers);

        } catch (error) {

            console.error(
                "Get users error:",
                error.stack
            );

            return res.status(500).json({
                message: "Failed to fetch users",
                error: error.message
            });
        }
    }
);


// =====================================================
// CREATE USER
// =====================================================

router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    async (req, res) => {

        try {

            const {
                name,
                email,
                password,
                role
            } = req.body;

            if (
                !name ||
                !email ||
                !password ||
                !role
            ) {
                return res.status(400).json({
                    message:
                        "Name, email, password and role are required"
                });
            }

            if (
                !["ADMIN", "ANALYST", "VIEWER"].includes(role)
            ) {
                return res.status(400).json({
                    message: "Invalid role"
                });
            }

            if (password.length < 6) {
                return res.status(400).json({
                    message:
                        "Password must be at least 6 characters"
                });
            }

            const allUsers =
                await db.orm.public.User.all();

            const existingUser =
                allUsers.find(
                    (user) =>
                        user.email.toLowerCase() ===
                        email.toLowerCase()
                );

            if (existingUser) {
                return res.status(400).json({
                    message: "User already exists"
                });
            }

            const hashedPassword =
                await bcrypt.hash(password, 10);

            const user =
                await db.orm.public.User.create({
                    name,
                    email,
                    password: hashedPassword,
                    role,
                    workspaceId:
                        req.user.workspaceId
                });

            return res.status(201).json({
                message: "User created successfully",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    workspaceId: user.workspaceId
                }
            });

        } catch (error) {

            console.error(
                "Create user error:",
                error.stack
            );

            return res.status(500).json({
                message: "Failed to create user",
                error: error.message
            });
        }
    }
);


module.exports = router;