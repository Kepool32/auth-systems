import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

type ClassConstructor<T = unknown> = new (...args: any[]) => T;

@Injectable()
export class ValidationPipe implements PipeTransform<unknown> {
  async transform(
    value: unknown,
    { metatype }: ArgumentMetadata,
  ): Promise<unknown> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    if (typeof value !== 'object' || value === null) {
      throw new BadRequestException('Validation failed: expected an object');
    }

    const object = plainToInstance(metatype as ClassConstructor, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const messages = errors
        .map((err) => (err.constraints ? Object.values(err.constraints) : []))
        .flat()
        .join(', ');

      throw new BadRequestException(messages);
    }

    return object;
  }

  private toValidate(metatype: ClassConstructor): boolean {
    const types: ClassConstructor[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
