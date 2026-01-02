import { Router } from "express";
import { syncUser } from "../controllers/userController";
import { requireAuth } from "@clerk/express";

const router = Router();

//api/users/sync - POST => sync the user to database.(Protected)

router.post("/sync", requireAuth(), syncUser);

export default router;
