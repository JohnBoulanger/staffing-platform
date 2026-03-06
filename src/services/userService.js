const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { isValidEmail, isValidPassword, parseBoolean } = require("../helpers/validation");
const encodePassword = require("../helpers/encodePassword");

async function createUser(data) {
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

async function getUsersService(data) {
    const { keyword } = data;
    const activated = parseBoolean(data.activated);
    const suspended = parseBoolean(data.suspended);
    const page = data.page ? parseInt(data.page) : 1;
    const limit = data.limit ? parseInt(data.limit) : 10;
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

    return {
        count: count,
        results: users
    };
}

module.exports = { createUser, getUsersService };