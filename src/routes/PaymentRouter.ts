import { Router } from "express"
import PaymentController from "../controllers/PaymentController"

const controller = new PaymentController()

const router = Router()

router.post("/list", controller.list)
router.post("/create", controller.create)
router.post("/update", controller.update)
router.post("/delete", controller.delete)

export default router