import { catchError } from "../../utils/serverErrorhandler"
import { Response} from "express"
import { SessionInterface } from "../user/user.interface";
import * as MessageService from './message.service'

export const sendMessage = async(req: SessionInterface, res: Response)=>{
    try {
        const body = req.body
        const {id, role} = req.session!
        const projectId = req.params.projectId as string

        const message = await MessageService.sendMessage(body, projectId, id, role)
        res.json(message)
    } 
    catch (error) {
        return catchError(error, res)
    }
}


export const getMessages = async (req: SessionInterface, res: Response) => {
    try {
        const { id, role } = req.session!;
        const projectId = req.params.projectId as string;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;

        const data = await MessageService.getMessages(
            projectId,
            id,
            role,
            page,
            limit
        );

        res.json({
            success: true,
            ...data,
        });
    } 
    catch (error) {
        return catchError(error, res);
    }
};