import { it } from 'mocha';
import { expect } from '../chai';
import { BaseFilterDto } from '../../dto/base/base-filter.dto';

type BaseFilterMethod = (query: Partial<BaseFilterDto>) => Promise<any>;
type Mock<T> = {
  data: T[];
  id: keyof T;
};

export function generateFilterTest<T>(method: BaseFilterMethod, mock: Mock<T>) {
  const { data, id } = mock;
  const col = id.toString();

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
      data.sort((a, b) => (a[id] > b[id] ? -1 : 1))[0][id]
    );
  });
}
