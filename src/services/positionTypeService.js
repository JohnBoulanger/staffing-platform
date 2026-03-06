const { PrismaClient } = require("@prisma/client");
const { parseBoolean } = require("../helpers/validation");
const prisma = new PrismaClient();

class PositionTypeService {
    static async createPositionType(data) {
        const { name, description } = data;

        if (!name || !description) {
            throw { type: "validation" };
        }
        const hidden = data.hidden ? parseBoolean(data.hidden) : true;

        const positionType = await prisma.positionType.create({
            data: {
                name,
                description,
                hidden
            }
        });

        // todo: add num_qualified to return value
        return positionType;
    }

    static async getPositionTypes(data, requesterRole) {
        const { keyword, name, num_qualified } = data;
        const hidden = parseBoolean(data.hidden);
        const page = parseInt(data.page) || 1;
        const limit = parseInt(data.limit) || 10;
        const skip = (page - 1) * limit;

        // construct where clause for position types
        // check if keyword is contained within the following fields
        const where = {};
        if (keyword) {
            where.OR = [
                { name: { contains: keyword } },
                { description: { contains: keyword } }
            ];
        }

        // handle admin only filters
        if (requesterRole !== "admin" && hidden !== undefined) {
            throw { type: "validation" };
        }

        // non-admins should never see hidden position types
        if (requesterRole !== "admin") {
            where.hidden = false;
        } else if (hidden !== undefined) {
            where.hidden = hidden;
        }

        // validate sorting inputs
        const orderValues = ["asc", "desc"];
        let orderBy = [];

        // name sorting
        const nameOrder = name || "asc";
        if (!orderValues.includes(nameOrder)) {
            throw { type: "validation" };
        }
        orderBy.push({ name: nameOrder });

        // admin only sort by num_qualified
        if (num_qualified !== undefined) {
            if (requesterRole !== "admin" || !orderValues.includes(num_qualified)) {
                throw { type: "validation" };
            }
            // sort by num_qualified first if provided
            orderBy.unshift({ num_qualified });
        }

        // compute filtered count of position types and get list
        const count = await prisma.positionType.count({ where });

        const positionTypes = await prisma.positionType.findMany({
            where,
            take: limit,
            skip: skip,
            orderBy: orderBy.length ? orderBy : undefined
        });

        // build return object
        const results = positionTypes.map((p) => {
            const positionTypeObj = {
                id: p.id,
                name: p.name,
                description: p.description
            };

            if (requesterRole === "admin") {
                positionTypeObj.hidden = p.hidden;
                positionTypeObj.num_qualified = p.num_qualified;
            }

            return positionTypeObj;
        });

        return {
            count,
            results
        };
    }

    static async updatePositionType(data) {

    }

    static async deletePositionType(data) {

    }
}

module.exports = { PositionTypeService }