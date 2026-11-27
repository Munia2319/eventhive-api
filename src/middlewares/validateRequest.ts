import type { Request, Response, NextFunction } from "express";
import type { z } from "zod";

const validateRequest = (schema: z.ZodType) =>
  (req: Request, res: Response, next: NextFunction):void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };

export default validateRequest;