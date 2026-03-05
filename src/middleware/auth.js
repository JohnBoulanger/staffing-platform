const jwt = require('jsonwebtoken');
require('dotenv').config();

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const SECRET_KEY = process.env.JWT_SECRET;

const jwtAuth = (req, res, next) => {
  // extract token from request header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  // check if a token was provided
  if (!token) {
    return res.status(401).json({ error: "Unauthorized"});
  }

  // verify the tokens signature and expiration using the secret key
  jwt.verify(token, SECRET_KEY, async (err, userData) => {

    // verification failed
    if (err) {
      return res.status(401).json({ error: "Unauthorized"});
    }

    // find the user with associated with the token
    try {
        const user = await prisma.account.findUnique({
            where: { id: userData.accountId }
        });

        if(!user) {
            return res.status(401).json({ error: "Unauthorized"});
        }
        
        // attach the authenticated user to the associated request
        req.user = user;
        // continue processing next request
        next();
    }
    catch(error) {
        return res.status(500).json({ error: "Internal Server Error"});
    }
    
  });
}

module.exports = jwtAuth