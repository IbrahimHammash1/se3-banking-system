import { ValidationError } from "class-validator";
import { BadRequestException } from "@nestjs/common";
import { ErrorsEnum } from "../enums/errors.enum";
import { StatusCodesEnum } from "../enums/status-codes.enum";

export const customValidationFormatter = (
  validationErrors: ValidationError[] = [],
) => {
  const getPrettyClassValidatorErrors = (
    validationErrors: ValidationError[],
    parentProperty = "",
  ): Array<{ property: string; errors: string[] }> => {
    const errors = [];

    const getValidationErrorsRecursively = (
      validationErrors: ValidationError[],
      parentProperty = "",
    ) => {
      for (const error of validationErrors) {
        const propertyPath = parentProperty
          ? `${parentProperty}.${error.property}`
          : error.property;

        if (error.constraints) {
          errors.push({
            property: propertyPath,
            errors: Object.values(error.constraints),
          } as never);
        }

        if (error.children?.length) {
          getValidationErrorsRecursively(error.children, propertyPath);
        }
      }
    };

    getValidationErrorsRecursively(validationErrors, parentProperty);
    return errors;
  };

  const errors = getPrettyClassValidatorErrors(validationErrors);

  return new BadRequestException({
    message: errors,
    error: ErrorsEnum["BAD_REQUEST"],
    statusCode: StatusCodesEnum["BAD_REQUEST"],
  });
};
