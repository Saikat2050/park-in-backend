import {Request, Response, NextFunction} from "express"
import CommonModel from "../models/CommonModel"
import { getObject } from "../utils/Helper"


export default class EntranceDataController{
    private commonModelVehicle
    private commonModelParking
    private commonModel
    private idColumnVehicle
    private idColumnParking
    private idColumn
    constructor() {
        this.idColumn = "entranceDataId"
        this.idColumn = "vehicleId"
        this.idColumn = "parkingInfoId"
        this.commonModel = new CommonModel("entranceDatas", this.idColumn, [])
        this.commonModel = new CommonModel("vehicles", this.idColumn, [])
        this.commonModel = new CommonModel("parkingInformations", this.idColumn, [])

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
            const entranceDatasData = await this.commonModel.list(inputData.filter, inputData.range, inputData.sort)
            if (!entranceDatasData.length) {
                return next({message:`entranceDatas is not exist or deleted`})
            }
            // get total count from models list
            const [{ total }] = await this.commonModel.list(inputData.filter, {}, {}, [`COUNT("${this.idColumn}")::integer AS total`], true)

            // result
            const result = {
                success: true,
                message: `Result of your Search`,
                total,
                data: entranceDatasData
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
            const entranceDatasCreateData = inputData

            // error handling 
            if (!entranceDatasCreateData || !Object.keys(entranceDatasCreateData).length) {
                return next({
                    status: 400,
                    code: "invalid_request",
                    message: "Please enter required fields"
                })
            }

            //using model function creating 
            const entranceDatasData = await this.commonModel.create(entranceDatasCreateData)
            if (!entranceDatasData) {
                return next(entranceDatasData)
            }

            // result
            const result = {
                success: true,
                message: 'New entranceDatas is Created Successfully',
                data: entranceDatasData[0]
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
            const { entranceDatasId, ...inputData } = await getObject(res, req.body, true)
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
            await this.commonModel.update(entranceDatasId, updateData, next)

            // finding data and show it in responce
            const updatedResult = await this.commonModel.list({ entranceDatasId: entranceDatasId })

            // result 
            const result = {
                success: true,
                message: `entranceDatas updated successfully`,
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
                message: `entranceDatas ${idArr} deleted`
            }
            return res.send(result)
        } catch (error: any) {
            next(error)
        }
    }
}