import {Request, Response, NextFunction} from "express"
import CommonModel from "../models/CommonModel"
import { getObject } from "../utils/Helper"


export default class ParkingInformationController{
    private commonModel
    private IdColumn
    constructor() {
        this.IdColumn = "parkingInfoId"
        this.commonModel = new CommonModel("parkingInformations", this.IdColumn, [])
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
            const parkingInfoData = await this.commonModel.list(inputData.filter, inputData.range, inputData.sort)
            if (!parkingInfoData.length) {
                return next({message:`parkingInfo is not exist or deleted`})
            }
            // get total count from models list
            const [{ total }] = await this.commonModel.list(inputData.filter, {}, {}, [`COUNT("${this.IdColumn}")::integer AS total`], true)

            // result
            const result = {
                success: true,
                message: `Result of your Search`,
                total,
                data: parkingInfoData
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
            const parkingInfoCreateData = inputData

            // error handling 
            if (!parkingInfoCreateData || !Object.keys(parkingInfoCreateData).length) {
                return next({
                    status: 400,
                    code: "invalid_request",
                    message: "Please enter required fields"
                })
            }

            //using model function creating 
            const parkingInfoData = await this.commonModel.create(parkingInfoCreateData)
            if (!parkingInfoData) {
                return next(parkingInfoData)
            }

            // result
            const result = {
                success: true,
                message: 'New parkingInfo is Created Successfully',
                data: parkingInfoData[0]
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
            const { parkingInfoId, ...inputData } = await getObject(res, req.body, true)
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
            await this.commonModel.update(parkingInfoId, updateData, next)

            // finding data and show it in responce
            const updatedResult = await this.commonModel.list({ parkingInfoId: parkingInfoId })

            // result 
            const result = {
                success: true,
                message: `parkingInfo updated successfully`,
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
                message: `parkingInfo ${idArr} deleted`
            }
            return res.send(result)
        } catch (error: any) {
            next(error)
        }
    }
}