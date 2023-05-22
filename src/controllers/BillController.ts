import {Request, Response, NextFunction} from "express"
import CommonModel from "../models/CommonModel"
import { getObject } from "../utils/Helper"


export default class BillController{
    private commonModel
    private commonModelVehicle
    private idColumn
    private idColumnVehicle
    constructor() {
        this.idColumn = "billId"
        this.idColumnVehicle = "vehicleId"
        this.commonModel = new CommonModel("bills", this.idColumn, [])
        this.commonModelVehicle = new CommonModel("vehicles", this.idColumnVehicle, [])
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
            const billsData = await this.commonModel.list(inputData.filter, inputData.range, inputData.sort)
            if (!billsData.length) {
                return next({message:`bills is not exist or deleted`})
            }
            // get total count from models list
            const [{ total }] = await this.commonModel.list(inputData.filter, {}, {}, [`COUNT("${this.idColumn}")::integer AS total`], true)

            // result
            const result = {
                success: true,
                message: `Result of your Search`,
                total,
                data: billsData
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
            const billsCreateData = inputData

            // error handling 
            if (!billsCreateData || !Object.keys(billsCreateData).length) {
                return next({
                    status: 400,
                    code: "invalid_request",
                    message: "Please enter required fields"
                })
            }

            //using model function creating 
            const billsData = await this.commonModel.create(billsCreateData)
            if (!billsData) {
                return next(billsData)
            }

            // result
            const result = {
                success: true,
                message: 'New bills is Created Successfully',
                data: billsData[0]
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
            const { billsId, ...inputData } = await getObject(res, req.body, true)
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
            await this.commonModel.update(billsId, updateData, next)

            // finding data and show it in responce
            const updatedResult = await this.commonModel.list({ billsId: billsId })

            // result 
            const result = {
                success: true,
                message: `bills updated successfully`,
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

            // controller
            await this.commonModel.deleteItems(idArr, next)

            //   result
            const result = {
                success: true,
                message: `bills ${idArr} deleted`
            }
            return res.send(result)
        } catch (error: any) {
            next(error)
        }
    }
}