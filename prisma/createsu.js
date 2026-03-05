/*
 * Complete this script so that it is able to add a superuser to the database
 * Usage example: 
 *   node prisma/createsu.js clive123 clive.su@mail.utoronto.ca SuperUser123!
 */
'use strict';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bcrypt = require("bcrypt")

// use bcrypt to hash password
async function encodePassword(password) {
    const enc = await bcrypt.hash(password, 10);
    return enc;
}

async function main() {
    
    // extract user args for username, email, and password
    const args = process.argv;
    const userArgs = args.slice(2);
    const [ utorid, email, password ] = userArgs;
    const encPass = await encodePassword(password);

    // add admin to the database
    await prisma.administrator.create({
        data: {
            account: {
                create: {
                    email: email,
                    password: encPass,
                    role: "admin",
                    activated: true
                }
            }
        }
    })
}

main();

