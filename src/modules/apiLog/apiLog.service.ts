// services/apiLog.service.ts

import { IApiLog } from "./apiLog.interface";
import ApiLogModels from "./apiLog.models";



interface GetLogsQuery {
  status?: string;
  method?: string;
  search?: string;
  page?: string;
  limit?: string;
}

export const createLog = async (data: IApiLog) => {
  return await ApiLogModels.create(data);
};

export const getLogs = async (query: GetLogsQuery) => {
  const { status, method, search, page = "1", limit = "10" } = query;

  const filter: any = {};

  //  Status Filter
  if (status) {
    if (status === "400") {
      filter.status = { $gte: 400 };
    } else {
      filter.status = Number(status);
    }
  }

  //  Method Filter
  if (method) {
    filter.method = method;
  }

  // Search Filter
  if (search) {
    filter.url = { $regex: search, $options: "i" };
  }

  //  Pagination
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const [logs, total] = await Promise.all([
    ApiLogModels.find(filter)
      .select("method url status time user createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),

    ApiLogModels.countDocuments(filter),
  ]);

  cleanupLogs()

  return {
    logs,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

export const cleanupLogs = async () => {
  try {
    const total = await ApiLogModels.countDocuments();

    if (total > 100) {
      await ApiLogModels.deleteMany({
        status: { $lt: 400 },   
        time: { $lt: 1000 },    
      });
    }
  } catch (error) {
    console.error("Cleanup Error:", error);
  }
};