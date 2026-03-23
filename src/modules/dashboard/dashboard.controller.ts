import {  Response } from "express";
import { getDashboardData } from "./dashboard.service";
import { SessionInterface } from "../user/user.interface";
import { catchError } from "../../utils/serverErrorhandler";

export const dashboardController = async (req: SessionInterface, res: Response) => {
  try {
    const {role, id} = req.session!
    const data = await getDashboardData(id, role);
    res.status(200).json(data);
  } 
  catch (error) {
    return catchError(error, res)
  }
};