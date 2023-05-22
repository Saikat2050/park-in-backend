import {Request, Response, NextFunction} from "express"
import CommonModel from "../models/CommonModel"
import { getObject } from "../utils/Helper"

export default class VehicleController {
    private commonModel
    private commonModelUser
    private vehicleIdColumn
    constructor() {
        this.vehicleIdColumn = "vehicleId"
        this.commonModel = new CommonModel("vehicles", this.vehicleIdColumn, ["vehicleNumber"])
        this.commonModelUser = new CommonModel("users", "userId", ["firstName", "lastName"])
        this.list = this.list.bind(this)
        this.create = this.create.bind(this)
        this.update = this.update.bind(this)
        this.delete = this.delete.bind(this)
    }

    async list(req: Request, res: Response, next: NextFunction) {

        try {
            // getting data from body
            const inputData  = req.body

            //getting data from models list
            const vehicleData = await this.commonModel.list(inputData.filter, inputData.range, inputData.sort)
            if (!vehicleData.length) {
                return next({message:`vehicle is not exist or deleted`})
            }
            // get total count from models list
            const [{ total }] = await this.commonModel.list(inputData.filter, {}, {}, [`COUNT("${this.vehicleIdColumn}")::integer AS total`], true)

            // result
            const result = {
                success: true,
                message: `Result of your Search`,
                total,
                data: vehicleData
            }
            // return results
            return res.json(result)
        } catch (error: any) {
            return next(error)
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {

            // get data from body 
            const inputData = await getObject(res, req.body, false)
            const vehicleCreateData = inputData

            // error handling 
            if (!vehicleCreateData || !Object.keys(vehicleCreateData).length) {
                return next({
                    status: 400,
                    code: "invalid_request",
                    message: "Please enter required fields"
                })
            }

            //using model function creating 
            const vehicleData = await this.commonModel.create(vehicleCreateData)
            if (!vehicleData) {
                return next(vehicleData)
            }

            // result
            const result = {
                success: true,
                message: 'New vehicle is Created Successfully',
                data: vehicleData[0]
            }
            // result return
            return res.json(result)

        } catch (error: any) {
            return next(error)
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            // declare id and data             
            const { vehicleId, ...inputData } = await getObject(res, req.body, true)
            const updateData = inputData

            // error handling 
            if (!updateData || !Object.keys(updateData).length) {
                return next({
                    status: 400,
                    code: "invalid_request",
                    message: "Please enter required fields"
                })
            }

            //updating data
            await this.commonModel.update(vehicleId, updateData, next)

            // finding data and show it in responce
            const updatedResult = await this.commonModel.list({ vehicleId: vehicleId })

            // result 
            const result = {
                success: true,
                message: `vehicle updated successfully`,
                data: updatedResult[0]
            }
            // return 
            return res.json(result)

        } catch (error: any) {
            next(error)
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {

            // getting data what to delete
            const { ids } = req.body
            const idArr = ids.map((id) => parseInt(id))

            // check if data used in users 
            const checkIfInUse = await this.commonModelUser.list({ vehicleId: idArr })
            for (let i = 0; i < checkIfInUse.length; i++) {
                if (checkIfInUse[i].length > 0) {
                    return res.status(400).send({ message: `Selected vehicle Cannot Be deleted As it is mapped with users` })
                }
            }

            // controller
            await this.commonModel.deleteItems(idArr, next)

            //   result
            const result = {
                success: true,
                message: `vehicle ${idArr} deleted`
            }
            return res.send(result)
        } catch (error: any) {
            next(error)
        }
    }
}



