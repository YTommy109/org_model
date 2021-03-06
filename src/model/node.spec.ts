import { CATEGORY } from "./node.interface";
import { Company, Department, Facility } from "./node";

describe('会社について', () => {
  const target = new Company({name: '会社'});
  it('名前を取れること', () => {
    expect(target.name).toEqual('会社');
  });
  it('カテゴリが会社であること', () => {
    expect(target.category).toBe(CATEGORY.COMPANY);
  });

  it('内部データを取れること', () => {
    const exp = {
      id: null,
      name: '会社',
      category: CATEGORY.COMPANY,
      parent: null
    };
    expect(target.data).toEqual(exp);
  });
});

describe('部門について', () => {
  const target = new Department({name: '組織'});
  it('名前を取れること', () => {
    expect(target.name).toEqual('組織');
  });
  it('カテゴリが部門であること', () => {
    expect(target.category).toBe(CATEGORY.DEPARTMENT);
  });
  it('内部データを取れること', () => {
    const exp = {
      id: null,
      name: '組織',
      category: CATEGORY.DEPARTMENT,
      parent: null
    };
    expect(target.data).toEqual(exp);
  });
});

describe('施設について', () => {
  const target = new Facility({name: '施設'});
  it('名前を取れること', () => {
    expect(target.name).toEqual('施設');
  });
  it('カテゴリが施設であること', () => {
    expect(target.category).toBe(CATEGORY.FACILITY);
  });
  it('内部データを取れること', () => {
    const exp = {
      id: null,
      name: '施設',
      category: CATEGORY.FACILITY,
      parent: null
    };
    expect(target.data).toEqual(exp);
  });
});
