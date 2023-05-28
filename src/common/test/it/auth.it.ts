import { describe, it } from 'mocha';
import supertest from 'supertest';
import { server } from '../../../../server';

export function generateAuthTest(method: string, url: string) {
  describe('auth middleware test', () => {
    it('should return 401', async () => {
      if (method === 'get') {
        return await supertest(server.httpServer).get(url).expect(401);
      }

      if (method === 'post') {
        return await supertest(server.httpServer).post(url).expect(401);
      }

      if (method === 'patch') {
        return await supertest(server.httpServer).patch(url).expect(401);
      }

      if (method === 'delete') {
        return await supertest(server.httpServer).delete(url).expect(401);
      }
    });
  });
}
