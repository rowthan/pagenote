import Workflows from '../src/index';
import * as fs from "fs";
import * as path from "path";
import {MockEnv, MockRegisterAction} from "./mock/Mock";
import {IAction} from "../src/typing/IAction";
import {genMemoData} from "./data";

const yml = fs.readFileSync(path.join(__dirname, './export.yml'),'utf-8');


describe('workflow and action run', () => {
  const workflow = new Workflows({
    registerAction: MockRegisterAction,
    prepareEnv: MockEnv
  });

  it('works to transform a yml file', () => {
    workflow._updateYml(yml);
    expect(workflow.workflowInfo?.jobs.length).toBe(2);
  });

  it('works to write data to database', async () => {
    const database: IAction = await MockRegisterAction('pagenote/table@v1');
    const initData = genMemoData('test')
    await database.run({
      table: 'memo',
      db: 'lightpage',
      method: 'put',
      params: initData,
    })

    await database.run({
      table: 'memo',
      db: 'lightpage',
      method: 'put',
      params: genMemoData('test2'),
    })

    const getDataResponse = await database.run({
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

    console.log(workflow.runtime)

    expect(workflow.state).toEqual(2)
  });
});
