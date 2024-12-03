import { Domains } from './dto/create-random-record.dto';
import { RandomValueGenerator } from './domain';

export interface RandomColumnModel {
  name: string;
  type: Domains;
  generator: RandomValueGenerator<any>;
  data: string[];
  blank: number;
}
