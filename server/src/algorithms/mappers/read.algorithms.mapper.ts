import { Algorithm } from 'generated/prisma/client';
import { ReadAlgorithmDTO, ReadAllAlgorithmsDTO } from '../dto';

export class ReadAlgorithmMapper {
  public mapOne(algorithm: Algorithm): ReadAlgorithmDTO {
    return {
      id: algorithm.id,
      name: algorithm.name,
      description: algorithm.description,
      createdAt: algorithm.createdAt,
      updatedAt: algorithm.updatedAt,
    };
  }

  public mapMany(count: number, data: Algorithm[]): ReadAllAlgorithmsDTO {
    return {
      count,
      data: data.map((one) => this.mapOne(one)),
    };
  }
}
