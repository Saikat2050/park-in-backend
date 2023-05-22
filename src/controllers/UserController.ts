import {Request, Response, NextFunction} from "express"
import CommonModel from "../models/CommonModel"


export default class UserController{
    private commonModel
    private IdColumn
    constructor() {
        this.IdColumn = "userId"
        this.commonModel = new CommonModel("users", this.IdColumn, [])
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
            const usersData = await this.commonModel.list(inputData.filter, inputData.range, inputData.sort)
            if (!usersData.length) {
                return next({message:`users is not exist or deleted`})
            }
            // get total count from models list
            const [{ total }] = await this.commonModel.list(inputData.filter, {}, {}, [`COUNT("${this.IdColumn}")::integer AS total`], true)

            // result
            const result = {
                success: true,
                message: `Result of your Search`,
                total,
                data: usersData
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
            const usersCreateData = inputData

            // error handling 
            if (!usersCreateData || !Object.keys(usersCreateData).length) {
                return next({
                    status: 400,
                    code: "invalid_request",
                    message: "Please enter required fields"
                })
            }

            //using model function creating 
            const usersData = await this.commonModel.create(usersCreateData)
            if (!usersData) {
                return next(usersData)
            }

            // result
            const result = {
                success: true,
                message: 'New users is Created Successfully',
                data: usersData[0]
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
            const { usersId, ...inputData } = await getObject(res, req.body, true)
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
            await this.commonModel.update(usersId, updateData, next)

            // finding data and show it in responce
            const updatedResult = await this.commonModel.list({ usersId: usersId })

            // result 
            const result = {
                success: true,
                message: `users updated successfully`,
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
            // const checkIfInUse = await this.commonModelUser.list({ usersId: idArr })
            // for (let i = 0; i < checkIfInUse.length; i++) {
            //     if (checkIfInUse[i].length > 0) {
            //         return res.status(400).send({ message: `Selected users Cannot Be deleted As it is mapped with users` })
            //     }
            // }

            // controller
            await this.commonModel.deleteItems(idArr, next)

            //   result
            const result = {
                success: true,
                message: `users ${idArr} deleted`
            }
            return res.send(result)
        } catch (error: any) {
            next(error)
        }
    }
}