import { Router } from "express"
import BillController from "../controllers/BillController"

const controller = new BillController()

const router = Router()

router.post("/list", controller.list)
router.post("/create", controller.create)
router.post("/update", controller.update)
router.post("/delete", controller.delete)

export default router