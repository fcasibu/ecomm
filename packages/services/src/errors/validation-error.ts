import { z, ZodIssue } from "zod";
import { BaseError } from "./base-error";

export class ValidationError extends BaseError {
  public readonly issues: ZodIssue[];

  constructor(readonly zodError: z.ZodError) {
    super("Input Validation Failed");

    this.name = "ValidationError";
    this.issues = zodError.issues;
  }
}
