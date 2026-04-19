import os from "os";
import { performance } from "perf_hooks";
import checkDiskSpace from "check-disk-space";
import { tryError } from "../../utils/serverErrorhandler"
import UserModel from "../user/user.model"
import { formatBytes, formatUptime } from "./admin.utils";
import ReportModel from "../reports/reports.model";
import ProjectModel from "../project/project.model";
import { IssueModel } from "../issue/issue.model";

export const fetchUser = async(role: any, page: number, limit: number) => {
    if(role !== "ADMIN"){
        throw tryError("Unauthorized Access",403)
    }

    const skip = (page-1) * limit

    const [users, total] = await Promise.all([
        UserModel.find({ role: "USER" })
            .select("fullname email verify createdAt status")
            .skip(skip)
            .limit(limit),

        UserModel.countDocuments({ role: "USER" })
    ])

    return {users, totalUser: total}
}

export const fetchActiveUser = async(role: any, page: number, limit: number) => {
    if(role !== "ADMIN"){
        throw tryError("Unauthorized Access",403)
    }

    const skip = (page-1) * limit

    const filter = {
        role: "USER",
        status: "ACTIVE"
    }

    const [activeUsers, total] = await Promise.all([
        UserModel.find(filter)
            .select("fullname email verify createdAt status")
            .skip(skip)
            .limit(limit),

        UserModel.countDocuments(filter)
    ])

    return {activeUsers, totalActiveUsers: total}
}

export const fetchBlockedUser = async(role: any, page: number, limit: number) => {
    if(role !== "ADMIN"){
        throw tryError("Unauthorized Access",403)
    }

    const filter = {
        role: "USER",
        status: "BLOCK"
    }

    const skip = (page-1) * limit

    const [blockedUsers, total] = await Promise.all([
        UserModel.find(filter)
            .select("fullname email verify createdAt status")
            .skip(skip)
            .limit(limit),

        UserModel.countDocuments(filter)
    ])  
    
    return {blockedUsers, totalBlockeduser:total}
}


export const serverStatus = async (role: string) => {
    if(role !== "ADMIN"){
        throw tryError("Unauthorized Access",403)
    }

    const start = performance.now(); 

    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();

    const cpuCores = os.cpus().length;
    const loadAvg = os.loadavg();

    let dbStatus = "DOWN";
    try {
        await UserModel.findOne().select("_id");
        dbStatus = "UP";
    } catch {
        dbStatus = "DOWN";
    }

    const activeUsers = await UserModel.countDocuments({
        role: "USER",
        status: "ACTIVE"
    });

    const disk = await checkDiskSpace("C:");

    const end = performance.now();
    const responseTime = `${(end - start).toFixed(2)} ms`;

  const health = {
    success: true,
    message: "Server status fetched successfully",

    server: "UP",
    uptime: formatUptime(process.uptime()),

    responseTime: `${(end - start).toFixed(2)} ms`,

    timestamp: new Date().toLocaleString(),

    memory: {
      total: formatBytes(totalMemory),
      free: formatBytes(freeMemory),
      used: formatBytes(totalMemory - freeMemory),
    },

    cpu: {
      cores: cpuCores,
      loadAverage: loadAvg.map((l) => l.toFixed(2)), // clean numbers
    },

    disk: {
      total: formatBytes(disk.size),
      free: formatBytes(disk.free),
      used: formatBytes(disk.size - disk.free),
    },

    process: {
      pid: process.pid,
      nodeVersion: process.version,
      platform: process.platform,
    },

    database: dbStatus,

    activeUsers,
  };

    return health
};


export const getAdminProfile = async(role: string,id: string) => {
    if(role !== "ADMIN"){
        throw tryError("Unauthorized Access",403)
    }

    const adminProfile = await UserModel.findById(id).select("fullname email verify createdAt status")

    return adminProfile
}

export const getAllReports = async(role: string, page: number, limit: number)=>{
    if(role !== "ADMIN"){
        throw tryError("Unauthorized Access",403)
    }

    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
        ReportModel.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate("reportedUser", "_id fullname eamil status").
        populate("reporter", "_id fullname eamil status"),

        ReportModel.countDocuments(),
    ]);

    return {reports, total}
}

export const getAllProjects = async(role: string, page: number, limit: number)=>{
    if(role !== "ADMIN"){
        throw tryError("Unauthorized Access",403)
    }

    const skip = (page - 1) * limit;

    const [Projects, total] = await Promise.all([
        ProjectModel.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate("createdBy", "_id fullname eamil status").
        populate("members.userId", "_id fullname eamil status"),

        ProjectModel.countDocuments(),
    ]);

    return {Projects, total}
}


export const getAllIssues = async(role: string, page: number, limit: number)=>{
    if(role !== "ADMIN"){
        throw tryError("Unauthorized Access",403)
    }

    const skip = (page - 1) * limit;

    const [Issues, total] = await Promise.all([
        IssueModel.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate("projectId"),

        IssueModel.countDocuments(),
    ]);

    return {Issues, total}
}
