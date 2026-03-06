const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { isValidEmail, isValidPassword } = require("../helpers/validation");
const encodePassword = require("../helpers/encodePassword");

async function createBusiness(data) {
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

module.exports = { createBusiness };