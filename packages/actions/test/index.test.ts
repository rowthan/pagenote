import Workflows from '../src/index';
import * as fs from "fs";
import * as path from "path";
import {MockEnv, MockRegisterAction} from "./mock/Mock";
import {IAction} from "../src/typing/IAction";
import {genMemoData} from "./data";

const workflow = new Workflows({
  registerAction: MockRegisterAction,
  prepareEnv: MockEnv
});

describe('workflow and action run', () => {
  const yml = fs.readFileSync(path.join(__dirname, './export.yml'),'utf-8');
  it('works to transform a yml file', () => {
    workflow._updateYml(yml);
    expect(workflow.workflowInfo?.jobs.length).toBe(2);
  });

  it('works to write data to database', async () => {
    const database= await MockRegisterAction('pagenote/table@v1') as IAction
    const initData = genMemoData('test')
    await database({
      table: 'memo',
      db: 'lightpage',
      method: 'put',
      params: initData,
    })

    await database({
      table: 'memo',
      db: 'lightpage',
      method: 'put',
      params: genMemoData('test2'),
    })

    const getDataResponse = await database({
      table: 'memo',
      db:'lightpage',
      method: 'get',
      params: initData.id
    });
    expect(getDataResponse).toEqual(initData)

    expect(workflow.state).toEqual(0)
  })


  it('should run workflow', async () => {
    const workflow = new Workflows({
      registerAction: MockRegisterAction,
      yml: yml,
      prepareEnv: MockEnv,
    });
    await workflow.run();
    expect(workflow.state).toEqual(2)
  });
});
