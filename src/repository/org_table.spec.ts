import { client } from "./db";
import { NotFoundError } from '../exception';
import { CATEGORY } from '../model/node.interface';
import { Node, Company, Department, Facility } from '../model/node';
import { CmpTable, DepTable, FacTable } from './org_table';

const TEST_DATA = [
  {id:'c01', category:1, name:'会社1', parent:null},
  {id:'d0121', category:2, name:'部門121', parent:'c01'},
  {id:'f0131', category:3, name:'施設131', parent:'c01'}
];

jest.mock('./db');
const mockQuery = client.query as jest.MockedFunction<typeof client.query>;

mockQuery.mockImplementation((query:string, arg:string[]) => {
  if (arg.length === 3) {
    const result = TEST_DATA.filter(it => 
      [`${arg[1]}`, `${arg[2]}`].includes(`${it.category}`));
    return {rowCount: result.length, rows:result};
  } else {
    const result = TEST_DATA.filter(it => it.id === arg[0]);
    return {rowCount: result.length, rows:result};
  }
});

beforeEach(() => {
  mockQuery.mockClear();
});

describe('会社のテーブル操作について', () => {
  const target = new CmpTable(client);
  
  it('ID で会社オブジェクトを返すこと', async () => {
    const exp:Company = new Company({id: 'c01', name: '会社1'});
    const result = await target.getNodeById('c01');
    expect(mockQuery).toBeCalledWith(expect.any(String), ['c01', CATEGORY.COMPANY]);
    expect(result.data).toMatchObject(exp.data);
  });
  it('存在しなければ例外になること', async () => {
    await expect(target.getNodeById('c99')).rejects.toThrow(NotFoundError);
  });
});

describe('部門のテーブル操作について', () => {
  const target = new DepTable(client);
  
  it('ID で部門オブジェクトを返すこと', async () => {
    const exp:Department = new Department({id: 'd0121', name: '部門121', parent: 'c01'});
    const result = await target.getNodeById('d0121');
    expect(mockQuery).toBeCalledWith(expect.any(String), ['d0121', CATEGORY.DEPARTMENT]);
    expect(result.data).toMatchObject(exp.data);
  });
  it('存在しなければ例外になること', async () => {
    await expect(target.getNodeById('c99')).rejects.toThrow(NotFoundError);
  });
});

describe('施設のテーブル操作について', () => {
  const target = new FacTable(client);
  
  it('ID で施設オブジェクトを返すこと', async () => {
    const exp:Department = new Facility({id: 'f0131', name: '施設131', parent: 'c01'});
    const result = await target.getNodeById('f0131');
    expect(mockQuery).toBeCalledWith(expect.any(String), ['f0131', CATEGORY.FACILITY]);
    expect(result.data).toMatchObject(exp.data);
  });
  it('存在しなければ例外になること', async () => {
    await expect(target.getNodeById('c99')).rejects.toThrow(NotFoundError);
  });
});

describe('組織階層の取得について', () => {
  const target = new CmpTable(client);
  it('部門階層をすべて取れること', async () => {
    const exp:Node[] = [
      new Company({id: 'c01', name: '会社1'}),
      new Department({id: 'd0121', name: '部門121', parent: 'c01'})
    ];

    const result = await target.getAllDepartmentsById('c01');
    expect(result).toEqual(exp);
  });

  it('施設階層をすべて取れること', async () => {
    const exp:Node[] = [
      new Company({id: 'c01', name: '会社1'}),
      new Facility({id: 'f0131', name: '施設131', parent: 'c01'})
    ];

    const result = await target.getAllFacilitiesById('c01');
    expect(result).toEqual(exp);
  });
});
