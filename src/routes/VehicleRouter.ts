import { Router } from "express"
import VehicleController from "../controllers/VehicleController"

const controller = new VehicleController()

const router = Router()

router.post("/list", controller.list)
router.post("/create", controller.create)
router.post("/update", controller.update)
router.post("/delete", controller.delete)

export default router