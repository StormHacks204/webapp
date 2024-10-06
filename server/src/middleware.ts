import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'
import { NextFunction } from 'express';
import { UserModel } from './database/models/User';

export function ClerkRequireAuthAndCreateAcc(req: Request, res: Response, next: NextFunction): void {
  try {
    ClerkExpressRequireAuth()(req , res, async (err: any) => {
      if (err) {
        return next(err);
      }
      
      if (!await UserModel.findOne({clerkId: req.auth.userId})) {
        
        const user = new UserModel({
          clerkId: req.auth.userId
        })

        await user.save()
      }

      next();
    });
  } catch (e) {
    console.log(e)
  }
}