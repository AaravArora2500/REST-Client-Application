import { EntitySchema } from '@mikro-orm/core';

class RequestLog {}

export const schema = new EntitySchema({
  class: RequestLog,
  properties: {
    id: { primary: true, type: 'number' },
    method: { type: 'string' },
    url: { type: 'string' },
    headers: { type: 'json' },
    body: { type: 'json', nullable: true },
    response: { type: 'json' },
    statusCode: { type: 'number' },
    createdAt: { type: 'Date', onCreate: () => new Date() },
  },
});
