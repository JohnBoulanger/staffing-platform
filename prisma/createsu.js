/*
 * Complete this script so that it is able to add a superuser to the database
 * Usage example: 
 *   node prisma/createsu.js clive123 clive.su@mail.utoronto.ca SuperUser123!
 */
'use strict';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const encodePassword = require("../src/helpers/encodePassword")

async function main() {
    
    // extract user args for username, email, and password
    const args = process.argv;
    const userArgs = args.slice(2);
    const [ utorid, email, password ] = userArgs;
    const encPass = await encodePassword(password);

    // add account and admin to the database
    const account = await prisma.account.create({
        data: {
            email: email,
            password: encPass,
            role: "admin",
            activated: true
        }
    });

    await prisma.administrator.create({
        data: {
            accountId: account.id
        }
    });
}

main();

