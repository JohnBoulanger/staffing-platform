const { PrismaClient } = require("@prisma/client");
const haversineDistance = require("../helpers/haversineDistance");
const prisma = new PrismaClient();

class JobService {

    static async getJobs(data) {
        const { sort, order } = data;
        const lat = parseFloat(data.lat);
        const lon = parseFloat(data.lon);
        const position_type_id = parseInt(data.position_type_id);
        const business_id = parseInt(data.business_id);
        const page = parseInt(data.page) || 1;
        const limit = parseInt(data.limit) || 10;
        const skip = (page - 1) * limit;

        // build orderBy
        let sortValue = "start_time";
        let orderValue = "asc";
        let orderBy = { [sortValue]: orderValue };
        if (sort) {
            const sortValues = ["updatedAt", "start_time", "salary_min", "salary_max", "distance", "eta"];

            // default sort is start time
            if (sortValues.includes(sort)) {
                sortValue = sort;
            }

            // default order value is asc
            const orderValues = ["asc", "desc"];
            if (orderValues.includes(order)) {
                orderValue = order;
            }

            if ((sortValue === "distance" || sortValue === "eta") && (isNaN(lat) || isNaN(lon))) {
                throw { type: "validation" };
            }
            if (sortValue !== "distance" && sortValue !== "eta") {
                orderBy = { [sortValue]: orderValue };
            } else {
                orderBy = undefined;
            }
        }

        // filter to open jobs, by business and/or position if specified
        const where = {};
        where.status = "open";
        if (!isNaN(business_id)) {
            where.businessId = business_id
        }
        if (!isNaN(position_type_id)) {
            where.positionTypeId = position_type_id;
        }

        const count = await prisma.job.count({ where });

        const jobs = await prisma.job.findMany({
            where,
            orderBy,
            take: limit,
            skip,
            include: {
                business: true,
                positionType: true
            }
        });

        // compute distance and eta if lat and lon were provided
        if (!isNaN(lat) && !isNaN(lon)) {

            for (const job of jobs) {
                const distance = haversineDistance(lat, lon, job.business.lat, job.business.lon);
                const eta = distance / 30;
                job.distance = distance;
                job.eta = eta;
            }
        }

        // sorting for computed fields since they cant be part of the job query
        if (sortValue === "distance" || sortValue === "eta") {
            jobs.sort((a, b) => {
                if (orderValue === "desc") {
                    return b[sortValue] - a[sortValue];
                }
                return a[sortValue] - b[sortValue];
            });
        }

        // format results
        const results = jobs.map(job => {
            const result = {
                id: job.id,
                status: job.status,
                position_type: {
                    id: job.positionType.id,
                    name: job.positionType.name
                },
                business: {
                    id: job.business.accountId,
                    business_name: job.business.business_name
                },
                salary_min: job.salary_min,
                salary_max: job.salary_max,
                start_time: job.start_time,
                end_time: job.end_time,
                updatedAt: job.updatedAt
            };
            // add distance and eta if lat and lon were specified
            if (job.distance !== undefined) {
                result.distance = job.distance;
                result.eta = job.eta;
            }
            return result;
        });

        return {
            count,
            results
        };
    }

    static async getJob(data, jobId, user) {
        const lat = parseFloat(data.lat);
        const lon = parseFloat(data.lon);

        // find unique job
        const job = await prisma.job.findUnique({
            where: { id: jobId },
            include: {
                positionType: true,
                business: true,
                worker: true
            }
        });

        if (!job) {
            throw { type: "not_found" };
        }

        // handle regular user cases
        if (user.role === "regular") {
            // check if they are qualified for the job
            const qualification = await prisma.qualification.findFirst({
                where: {
                    userId: user.id,
                    positionTypeId: job.positionTypeId,
                    status: "approved"
                }
            });
            if (!qualification) {
                throw { type: "forbidden" };
            }
            // check if they have filled, cancelled, or completed a job or its open
            const allowed = job.status === "open" || (job.workerId === user.id && ["filled", "canceled", "completed"].includes(job.status));
            if (!allowed) {
                throw { type: "forbidden" };
            }
        }

        // handle business user cases
        if (user.role === "business") {
            // not allowed to provide lat or lon
            if (data.lat !== undefined || data.lon === undefined) {
                throw { type: "validation" };
            }
            if (job.businessId !== user.id) {
                throw { type: "not_found" };
            }
        }

        // construct the result
        const result = {
            id: job.id,
            status: job.status,
            position_type: {
                id: job.positionType.id,
                name: job.positionType.name
            },
            business: {
                id: job.business.id,
                business_name: job.business.business_name
            },
            worker: job.worker
                ? { id: job.worker.id }
                : null,
            note: job.note,
            salary_min: job.salary_min,
            salary_max: job.salary_max,
            start_time: job.start_time,
            end_time: job.end_time,
            updatedAt: job.updatedAt
        };

        // add distance and eta for regular user if lat and lon are provided
        if (user.role === "regular" && (!isNaN(lat) && !isNaN(lon))) {
            const distance = haversineDistance(lat, lon, job.business.lat, job.business.lon);
            const eta = distance / 30;
            result.distance = distance;
            result.eta = eta;
        }

        return result
    }

    static async setNoShow(data, jobId) {

        // find unique job
        const job = await prisma.job.findUnique({
            where: { id: jobId }
        });
        
    }

    static async setInterested(data, jobId) {

        // find unique job
        const job = await prisma.job.findUnique({
            where: { id: jobId }
        });

    }
}

module.exports = { JobService }