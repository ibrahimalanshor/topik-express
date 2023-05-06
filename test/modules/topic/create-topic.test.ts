import { describe, it } from 'mocha';
import { expect } from '../../../src/common/test/chai';
import { createObjectTransformerWithValidator } from '../../../src/common/dto/transform-and-validate-object';
import { ValidationSchemaError } from '../../../src/common/errors/validation-schema-error';
import { CreateTopicDto } from '../../../src/modules/topic/dto/create-topic.dto';
import supertest from 'supertest';
import { server } from '../../../server';

describe('create topic test', () => {
  describe('validation test', () => {
    it('when object is invalid return validation schema error', async () => {
      const invalidPayload = {
        name: [],
      };
      const transformPayload =
        createObjectTransformerWithValidator(CreateTopicDto);

      expect(transformPayload(invalidPayload)).to.be.rejectedWith(
        ValidationSchemaError
      );
    });

    it('when body request is invalid return 422', async () => {
      const invalidPayload = {
        name: [],
      };
      const res = await supertest(server.httpServer)
        .post('/api/topics')
        .send(invalidPayload)
        .expect(422);

      expect(res.body).to.have.property('errors');
      expect(res.body.errors).to.have.property('name');
    });
  });
});
