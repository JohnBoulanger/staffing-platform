const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { isValidEmail, isValidPassword, parseBoolean } = require("../helpers/validation");
const encodePassword = require("../helpers/encodePassword");

class BusinessService {
    static async registerBusiness(data) {
        const { business_name, owner_name, email, password, phone_number, postal_address, location } = data;

        // validate inputs
        if (!business_name || !owner_name || !email || !password || !phone_number || !postal_address || !location) {
            throw { type: "validation", message: "Bad Request" };
        }

        if (typeof location.lat !== "number" || typeof location.lon !== "number") {
            throw { type: "validation", message: "Invalid Location" };
        }

        if (!isValidEmail(email)) {
            throw { type: "validation", message: "Invalid Email" };
        }

        if (!isValidPassword(password)) {
            throw { type: "validation", message: "Invalid Password" };
        }

        // check if a business already exists
        const existingBusiness = await prisma.account.findUnique({ where: { email } });

        if (existingBusiness) {
            throw { type: "conflict", message: "Business Already Exists" };
        }

        const encPass = await encodePassword(password);

        // create the new account
        const account = await prisma.account.create({
            data: {
                email,
                password: encPass,
                role: "business",
                activated: false,
                business: {
                    create: {
                        business_name,
                        owner_name,
                        phone_number,
                        postal_address,
                        lat: location.lat,
                        lon: location.lon
                    }
                }
            },
            include: { business: true }
        });

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        // create the reset token, used to prove that the business controls the email tied to this account. Used for activation
        const reset = await prisma.resetToken.create({
            data: {
                accountId: account.id,
                expiresAt
            }
        });

        return {
            id: account.id,
            business_name: account.business.business_name,
            owner_name: account.business.owner_name,
            email: account.email,
            activated: account.activated,
            verified: account.business.verified,
            role: account.role,
            phone_number: account.business.phone_number ?? "",
            postal_address: account.business.postal_address ?? "",
            location: {
                lon: account.business.lon,
                lat: account.business.lat
            },
            createdAt: account.createdAt,
            resetToken: reset.token,
            expiresAt: reset.expiresAt
        };
    }

    static async verifyBusiness(data, businessId) {
        const verified = parseBoolean(data.verified);

        const business = await prisma.business.findUnique({
            where: { accountId: businessId }
        });

        if (!business) {
            throw { type: "not_found" };
        }

        const updated = await prisma.business.update({
            where: { accountId: businessId },
            data: { verified },
            include: { account: true }
        });

        return {
            id: updated.accountId,
            business_name: updated.business_name,
            owner_name: updated.owner_name,
            email: updated.account.email,
            activated: updated.account.activated,
            verified: updated.verified,
            role: updated.account.role,
            phone_number: updated.phone_number,
            postal_address: updated.postal_address
        };
    }

    static async getBusiness(businessId, requesterRole) {
        const business = await prisma.business.findUnique({
            where: { accountId: businessId },
            include: { account: true }
        });

        if (!business) {
            throw { type: "not_found" };
        }

        const response = {
            id: business.accountId,
            business_name: business.business_name,
            email: business.account.email,
            role: business.account.role,
            phone_number: business.phone_number,
            postal_address: business.postal_address,
            location: {
                lon: business.lon,
                lat: business.lat
            },
            avatar: business.avatar,
            biography: business.biography
        };

        if (requesterRole === "admin") {
            response.owner_name = business.owner_name;
            response.activated = business.account.activated;
            response.verified = business.verified;
            response.createdAt = business.account.createdAt;
        }

        return response;
    }

    static async getBusinesses(data, requesterRole) {
        const { keyword, sort, order } = data;
        const activated = parseBoolean(data.activated);
        const verified = parseBoolean(data.verified);
        const page = parseInt(data.page) || 1;
        const limit = parseInt(data.limit) || 10;
        const skip = (page - 1) * limit;

        // construct where clause for businesses
        // check if keyword is contained within the following fields
        const where = {};
        if (keyword) {
            where.OR = [
                { business_name: { contains: keyword } },
                { account: { email: { contains: keyword } } },
                { phone_number: { contains: keyword } },
                { postal_address: { contains: keyword } },
            ];
            if (requesterRole === "admin") {
                where.OR.push({ owner_name: { contains: keyword }});
            }
        }
        // handle admin only filters
        if (requesterRole !== "admin" && (activated !== undefined || verified !== undefined)) {
            throw { type: "validation" };
        }
        if (activated !== undefined) {
            where.account = { ...(where.account || {}), activated };
        }
        if (verified !== undefined) {
            where.verified = verified;
        }

        // validate sort and orderBy inputs
        let orderBy;

        if (sort) {
            const sortValues = ["business_name", "email"];
            if (requesterRole === "admin") sortValues.push("owner_name");

            if (!sortValues.includes(sort)) {
                throw { type: "validation" };
            }

            const orderValue = order || "asc";
            const orderValues = ["asc", "desc"];
            if (!orderValues.includes(orderValue)) {
                throw { type: "validation" };
            }

            if (sort === "email") {
                orderBy = { account: { email: orderValue } };
            } else {
                orderBy = { [sort]: orderValue };
            }
        }

        // compute filtered count of businesses
        const count = await prisma.business.count({ where });

        const businesses = await prisma.business.findMany({
            where,
            take: limit,
            skip: skip,
            include: { account: true },
            orderBy
        });

        // construct return value
        const results = businesses.map((b) => {
            const businessObj = {
                id: b.accountId,
                business_name: b.business_name,
                email: b.account.email,
                role: b.account.role,
                phone_number: b.phone_number,
                postal_address: b.postal_address
            };

            if (requesterRole === "admin") {
                businessObj.owner_name = b.owner_name;
                businessObj.verified = b.verified;
                businessObj.activated = b.account.activated;
            }

            return businessObj;
        });

        return {
            count,
            results
        };
    }
}


module.exports = { BusinessService };