import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {

  transform(value: string, metadata: ArgumentMetadata) {
    if(!isValidObjectId(value)) throw new BadRequestException(`El id ${value}, no es un MongoId válido`) 

    // console.log({value, metadata});
    return value;
  }
}
