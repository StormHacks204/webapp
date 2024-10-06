// import { Response, Request, NextFunction } from "express";

// import {verifyToken} from '@clerk/clerk-sdk-node';

// declare global {
//     namespace Express {
//       interface Request {
//         userId?: string;
//       }
//     }
//   }
  
// const clerk = new Clerk({
//     apiKey: process.env.CLERK_KEY,
//     apiVersion: 2, // Make sure to specify the correct version
//   });

//   export const authenticateUser = async (req: Request, res:Response, next: NextFunction) => {
//     try {
//       const authHeader = req.body;

//       if (!authHeader) {
//         return res.status(401).json("Authorization header missing")
//       }
//       const { userId } = await clerk.sessions.verifySession(authHeader.clerk_id as string);

//       req.userId = userId;
      
//       next();
//     } catch (err) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }
//   };