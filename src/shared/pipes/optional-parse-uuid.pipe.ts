import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  ParseUUIDPipe,
} from "@nestjs/common";
@Injectable()
export class OptionalParseUUIDPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined || value === null) {
      return value;
    }
    const uuidPipe = new ParseUUIDPipe();
    return uuidPipe.transform(value, metadata);
  }
}
