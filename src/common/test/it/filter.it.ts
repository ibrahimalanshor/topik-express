import { describe, it } from 'mocha';
import { expect } from '../chai';
import { BaseFilterDto } from '../../dto/base/base-filter.dto';
import supertest from 'supertest';
import { server } from '../../../../server';

type BaseFilterMethod = (query: Partial<BaseFilterDto>) => Promise<any>;
type Mock<T> = {
  data: T[];
  id: keyof T;
  endpoint: string;
};

export function generateFilterTest<T>(method: BaseFilterMethod, mock: Mock<T>) {
  const { data, id } = mock;
  const col = id.toString();

  describe('base filter test', () => {
    it('should get all limited 2', async () => {
      const res = await method({
        limit: 1,
      });

      expect(res).to.be.an('array').and.have.length(1);
      expect(res[0][id]).to.equal(data[0][id]);
    });

    it('should get all limited 2 and offseted 1', async () => {
      const res = await method({
        limit: 1,
        offset: 1,
      });

      expect(res).to.be.an('array').and.have.length(1);
      expect(res[0][id]).to.equal(data[1][id]);
    });

    it(`should get all sorted by ${col} desc`, async () => {
      const res = await method({
        sort: `-${col}`,
      });

      expect(res).to.be.an('array').and.have.length(data.length);
      expect(res[0][id]).to.equal(
        data.slice(0).sort((a, b) => (a[id] > b[id] ? -1 : 1))[0][id]
      );
    });

    // Api

    it('should return 200 limited 2', async () => {
      const res = await supertest(server.httpServer)
        .get(mock.endpoint)
        .query({
          limit: 1,
        })
        .expect(200);

      expect(res.body.data).to.be.an('array').and.have.length(1);
      expect(res.body.data[0][id]).to.equal(data[0][id]);
    });

    it('should return 200 limited 2 and offseted 1', async () => {
      const res = await supertest(server.httpServer)
        .get(mock.endpoint)
        .query({
          limit: 1,
          offset: 1,
        })
        .expect(200);

      expect(res.body.data).to.be.an('array').and.have.length(1);
      expect(res.body.data[0][id]).to.equal(data[1][id]);
    });

    it(`should return 200 sorted by ${col} desc`, async () => {
      const res = await supertest(server.httpServer)
        .get(mock.endpoint)
        .query({
          sort: `-${col}`,
        })
        .expect(200);

      expect(res.body.data).to.be.an('array').and.have.length(data.length);
      expect(res.body.data[0][id]).to.equal(
        data.slice(0).sort((a, b) => (a[id] > b[id] ? -1 : 1))[0][id]
      );
    });
  });
}
