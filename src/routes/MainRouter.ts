import { Router } from "express"
import {
    userRouter,
    parkingInformationRouter,
    vehicleRouter,
    entranceDataRouter,
    paymentRouter,
    billRouter,

} from "."


const router = Router()

router.use("/user", userRouter)
router.use("/parking/info", parkingInformationRouter)
router.use("/vehicle/info", vehicleRouter)
router.use("/bills", entranceDataRouter)
router.use("/payments", billRouter)
router.use("/entrance/info", paymentRouter)

export default router