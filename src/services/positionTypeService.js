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
}

module.exports = { PositionTypeService }