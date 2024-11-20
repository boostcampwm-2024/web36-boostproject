import { RandomValueGenerator } from './random-value-generator.interface';

export class BooleanGenerator extends RandomValueGenerator<boolean> {
  getRandomValue(): boolean {
    return Math.random() > 0.5 ? true : false;
  }
}