const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { isValidEmail, isValidPassword, parseBoolean } = require("../helpers/validation");
const encodePassword = require("../helpers/encodePassword");

class UserService {
    static async registerUser(data) {
        const { first_name, last_name, email, password, phone_number, postal_address, birthday } = data;

        // validate inputs
        if (!first_name || !last_name || !email || !password) {
            throw { type: "validation", message: "Bad Request" };
        }

        if (!isValidEmail(email)) {
            throw { type: "validation", message: "Invalid Email" };
        }

        if (!isValidPassword(password)) {
            throw { type: "validation", message: "Invalid Password" };
        }

        // check if a user already exists
        const existingUser = await prisma.account.findUnique({ where: { email } });

        if (existingUser) {
            throw { type: "conflict", message: "User Already Exists" };
        }

        const encPass = await encodePassword(password);

        // create the new account
        const account = await prisma.account.create({
            data: {
                email,
                password: encPass,
                role: "regular",
                activated: false,
                user: {
                    create: {
                        first_name,
                        last_name,
                        phone_number,
                        postal_address,
                        birthday: birthday ? new Date(birthday) : new Date("1970-01-01")
                    }
                }
            },
            include: { user: true }
        });

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        // create the reset token, used to prove that the user controls the email tied to this account. Used for activation
        const reset = await prisma.resetToken.create({
            data: {
                accountId: account.id,
                expiresAt
            }
        });

        return {
            id: account.id,
            first_name: account.user.first_name,
            last_name: account.user.last_name,
            email: account.email,
            activated: account.activated,
            role: account.role,
            phone_number: account.user.phone_number ?? "",
            postal_address: account.user.postal_address ?? "",
            birthday: account.user.birthday,
            createdAt: account.createdAt,
            resetToken: reset.token,
            expiresAt: reset.expiresAt
        };
    }

    static async getUsers(data) {
        const { keyword } = data;
        const activated = parseBoolean(data.activated);
        const suspended = parseBoolean(data.suspended);
        const page = parseInt(data.page) || 1;
        const limit = parseInt(data.limit) || 10;
        const skip = (page - 1) * limit;

        // construct where clause for regular users
        // check if keyword is contained within the following fields
        const where = {};
        if (keyword) {
            where.OR = [
                { first_name: { contains: keyword } },
                { last_name: { contains: keyword } },
                { account: { email: { contains: keyword } } },
                { phone_number: { contains: keyword } },
                { postal_address: { contains: keyword } },
            ];
        }
        // add activated and suspended to clause if provided
        if (activated !== undefined) {
            where.account = { ...(where.account || {}), activated };
        }
        if (suspended !== undefined) {
            where.suspended = suspended;
        }

        // compute filtered count of regularUsers
        const count = await prisma.regularUser.count({ where });

        const users = await prisma.regularUser.findMany({
            where,
            take: limit,
            skip: skip,
            include: { account: true }
        });

        const results = users.map((u) => ({
            id: u.accountId,
            first_name: u.first_name,
            last_name: u.last_name,
            email: u.account.email,
            activated: u.account.activated,
            suspended: u.suspended,
            role: u.account.role,
            phone_number: u.phone_number,
            postal_address: u.postal_address
        }));

        return {
            count,
            results
        };
    }

    static async updateUserSuspend(data, userId) {
        // parse suspended variable
        const suspended = parseBoolean(data.suspended);
        if (suspended === undefined) {
            throw { type: "validation" };
        }

        const user = await prisma.regularUser.findUnique({
            where: { accountId: userId }
        });

        if (!user) {
            throw { type: "not_found" };
        }

        const updated = await prisma.regularUser.update({
            where: { accountId: userId },
            data: { suspended },
            include: { account: true }
        });

        return {
            id: updated.accountId,
            first_name: updated.first_name,
            last_name: updated.last_name,
            email: updated.account.email,
            activated: updated.account.activated,
            suspended: updated.suspended,
            role: updated.account.role,
            phone_number: updated.phone_number ?? "",
            postal_address: updated.postal_address ?? ""
        };
    }
}

module.exports = { UserService };    
