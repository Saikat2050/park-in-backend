import {Request, Response, NextFunction} from "express"
import CommonModel from "../models/CommonModel"
import { getObject } from "../utils/Helper"


export default class PaymentController{
    private commonModel
    private commonModelBill
    private idColumn
    private idColumnBill
    constructor() {
        this.idColumn = "paymentId"
        this.idColumnBill = "paymentId"
        this.commonModel = new CommonModel("payments", this.idColumn, [])
        this.commonModelBill = new CommonModel("Bills", this.idColumnBill, [])

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
            const paymentsData = await this.commonModel.list(inputData.filter, inputData.range, inputData.sort)
            if (!paymentsData.length) {
                return next({message:`payments is not exist or deleted`})
            }
            // get total count from models list
            const [{ total }] = await this.commonModel.list(inputData.filter, {}, {}, [`COUNT("${this.idColumn}")::integer AS total`], true)

            // result
            const result = {
                success: true,
                message: `Result of your Search`,
                total,
                data: paymentsData
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
            const paymentsCreateData = inputData

            // error handling 
            if (!paymentsCreateData || !Object.keys(paymentsCreateData).length) {
                return next({
                    status: 400,
                    code: "invalid_request",
                    message: "Please enter required fields"
                })
            }

            //using model function creating 
            const paymentsData = await this.commonModel.create(paymentsCreateData)
            if (!paymentsData) {
                return next(paymentsData)
            }

            // result
            const result = {
                success: true,
                message: 'Payments is done Successfully',
                data: paymentsData[0]
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
            const { paymentsId, ...inputData } = await getObject(res, req.body, true)
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
            await this.commonModel.update(paymentsId, updateData, next)

            // finding data and show it in responce
            const updatedResult = await this.commonModel.list({ paymentsId: paymentsId })

            // result 
            const result = {
                success: true,
                message: `payments updated successfully`,
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
                message: `payments ${idArr} deleted`
            }
            return res.send(result)
        } catch (error: any) {
            next(error)
        }
    }
}