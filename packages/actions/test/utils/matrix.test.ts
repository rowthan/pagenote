//jest 测试

import { generateMatrixTasks } from '../../src/utils/matrix';

describe('generateMatrixTasks', () => {
  const matrix: Record<string, any[]> = {
    node: [1, 2, 3, 4],
    version: [5, 6],
    c: [7, 8, 9],
  }

  const keys = Object.keys(matrix);
  let primaryKey = keys[0];
  keys.forEach(function (item) {
    if(matrix[item].length < matrix[primaryKey].length){
      primaryKey = item;
    }
  })

  it('should return a matrix by default key', () => {
    const result = generateMatrixTasks(matrix);
    expect(result.length).toEqual(matrix[primaryKey].length);
  })

  it('should return a matrix by confined key', function () {
    const groupByC = generateMatrixTasks(matrix,'c');
    expect(groupByC.length).toEqual(matrix.c.length);
    groupByC.forEach(function (list) {
      const everyItemAreEqual = list.every(function (item) {
        return item['c'] === list[0].c;
      })
      expect(everyItemAreEqual).toBeTruthy();
    })
  });


})
