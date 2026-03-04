import type { NextFunction, Request, Response } from 'express';
import type { Role } from '../types/role.types';

// WE CHECK IF THE USER IS AUTHORIZED TO ACCESS THE ROUTE BASED ON THEIR ROLE
function Protect(allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role as Role | undefined;
    if (!userRole) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
}

export default Protect;
