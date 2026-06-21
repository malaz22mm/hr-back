import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { UserRole } from '../../../generated/prisma/enums';

export function RequiresEmployeeRole(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'requiresEmployeeRole',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // If the property (employee_id) is null or undefined, validation passes
          if (value == null) return true;

          // If the property has a value, check if the role is EMPLOYEE
          const role = (args.object as any).role;
          return role === UserRole.EMPLOYEE; 
        },
        defaultMessage(args: ValidationArguments) {
          return `If ${args.property} is provided, the user role must be ${UserRole.EMPLOYEE}.`;
        },
      },
    });
  };
}