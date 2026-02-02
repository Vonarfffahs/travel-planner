import { Prisma } from 'generated/prisma/client';

export type TripWithRelations = Prisma.TripGetPayload<{
  include: {
    algorithm: true;
    parameters: true;
    tripSteps: {
      include: { historicPlace: true };
    };
  };
}>;
