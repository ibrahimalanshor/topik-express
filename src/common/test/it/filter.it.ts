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
  total?: number;
  query?: Record<string, any>;
  expected?: {
    offset: T | null;
    sort: T;
  };
};

export function generateFilterTest<T>(method: BaseFilterMethod, mock: Mock<T>) {
  const { data, id, query, expected, total } = mock;
  const col = id.toString();

  describe('base filter test', () => {
    it('should get all limited 2', async () => {
      const meta = {
        count: total ?? mock.data.length,
        limit: 1,
        offset: 10,
      };
      const res = await method({
        limit: 1,
        ...query,
      });

      expect(res.meta).to.eql(meta);
      expect(res.data).to.be.an('array').and.have.length(1);
      expect(res.data[0][id]).to.equal(data[0][id]);
    });

    it('should get all limited 2 and offseted 1', async () => {
      const meta = {
        count: total ?? mock.data.length,
        limit: 1,
        offset: 1,
      };
      const res = await method({
        limit: 1,
        offset: 1,
        ...query,
      });

      if (expected?.offset) {
        expect(res.meta).to.eql(meta);
        expect(res.data).to.be.an('array').and.have.length(1);
        expect(res.data[0][id]).to.equal(expected?.offset[id] ?? data[1][id]);
      }
    });

    it(`should get all sorted by ${col} desc`, async () => {
      const meta = {
        count: total ?? mock.data.length,
        limit: 10,
        offset: 10,
      };
      const res = await method({
        sort: `-${col}`,
        ...query,
      });

      expect(res.meta).to.eql(meta);
      expect(res.data)
        .to.be.an('array')
        .and.have.length(total ?? data.length);
      expect(res.data[0][id]).to.equal(
        expected?.sort[id] ??
          data.slice(0).sort((a, b) => (a[id] > b[id] ? -1 : 1))[0][id]
      );
    });

    // Api

    it('should return 200 limited 2', async () => {
      const meta = {
        count: total ?? mock.data.length,
        limit: 1,
        offset: 10,
      };
      const res = await supertest(server.httpServer)
        .get(mock.endpoint)
        .query({
          limit: 1,
          ...query,
        })
        .expect(200);

      expect(res.body.data.meta).to.eql(meta);
      expect(res.body.data.data).to.be.an('array').and.have.length(1);
      expect(res.body.data.data[0][id]).to.equal(data[0][id]);
    });

    it('should return 200 limited 2 and offseted 1', async () => {
      const meta = {
        count: total ?? mock.data.length,
        limit: 1,
        offset: 1,
      };
      const res = await supertest(server.httpServer)
        .get(mock.endpoint)
        .query({
          limit: 1,
          offset: 1,
          ...query,
        })
        .expect(200);

      if (expected?.offset) {
        expect(res.body.data.meta).to.eql(meta);
        expect(res.body.data.data).to.be.an('array').and.have.length(1);
        expect(res.body.data.data[0][id]).to.equal(
          expected?.offset[id] ?? data[1][id]
        );
      }
    });

    it(`should return 200 sorted by ${col} desc`, async () => {
      const meta = {
        count: total ?? mock.data.length,
        limit: 10,
        offset: 10,
      };
      const res = await supertest(server.httpServer)
        .get(mock.endpoint)
        .query({
          sort: `-${col}`,
          ...query,
        })
        .expect(200);

      expect(res.body.data.meta).to.eql(meta);
      expect(res.body.data.data)
        .to.be.an('array')
        .and.have.length(total ?? data.length);
      expect(res.body.data.data[0][id]).to.equal(
        expected?.sort[id] ??
          data.slice(0).sort((a, b) => (a[id] > b[id] ? -1 : 1))[0][id]
      );
    });
  });
}
