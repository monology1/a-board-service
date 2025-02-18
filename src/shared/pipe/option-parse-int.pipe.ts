import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';

export class OptionalParseIntPipe implements PipeTransform<string, number | undefined> {
  transform(value: string, metadata: ArgumentMetadata): number | undefined {
    if (value === undefined || value === null || value.trim() === '') {
      return undefined;
    }
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException(`Validation failed. "${value}" is not a number`);
    }
    return val;
  }
}