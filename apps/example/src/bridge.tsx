import * as React from 'react';
import {useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {getIframeBridge, getLocalStorageBridge, getSessionStorageBridge} from '@pagenote/bridge'

const rootElement = document.getElementById('root');
const sessionBridgeClientA = getSessionStorageBridge('clientA',{
    asServer: true,
    listenKey: "test-bridge",
    timeout: 1000
});

const sessionBridgeClientB = getSessionStorageBridge('clientB',{
    asServer: true,
    listenKey: "test-bridge",
    timeout: 1000
});

const sessionBridgeClientC = getSessionStorageBridge('clientC',{
    asServer: true,
    listenKey: "test-bridge",
    timeout: 1000
});

const localStorageClientC = getLocalStorageBridge('clientC',{
    asServer: true,
    listenKey: "test-bridge",
    timeout: 1000
});

const localStorageClientD = getLocalStorageBridge('clientD',{
    asServer: true,
    listenKey: "test-bridge",
    timeout: 1000
});

const frameClientE = getIframeBridge('clientE',{
    asServer: true,
    listenKey: "test-bridge",
    timeout: 1000
});

const frameClientF = getIframeBridge('clientF',{
    asServer: true,
    listenKey: "test-bridge",
    timeout: 1000
});

const frameClientG = getIframeBridge('clientG',{
    asServer: true,
    listenKey: "test-bridge",
    timeout: 1000
});

const clients = {
    sessionBridgeClientA,
    sessionBridgeClientB,
    sessionBridgeClientC,
    sessionBridgeClientCTOA: getSessionStorageBridge('clientD',{
        asServer: true,
        listenKey: "test-bridge",
        timeout: 1000,
        targetClientId: 'clientA'
    }),

    localStorageClientA:getLocalStorageBridge('clientA',{
        asServer: true,
        listenKey: "test-bridge",
        timeout: 1000
    }),
    localStorageClientC,
    localStorageClientD,
    frameClientE,
    frameClientF,
    frameClientG,
}

const App = () => {
    const [messageMap,setMessage] = useState<Record<string, string>>({});
    useEffect(() => {
        Object.keys(clients).forEach(function (clientName) {
            clients[clientName].addProxy(function (data,sender,callback) {
                setMessage(function (prev) {
                    return {
                        ...prev,
                        [clientName]: 'proxy::'+JSON.stringify(data)
                    }
                })

                callback({
                    success: true,
                    statusText: 'response by '+ clientName,
                    status: 0,
                    data: '0K',
                })
            })
        })
    }, []);

    function request(clientName: string) {
        const data = {
            message: 'request hello world',
            time: Date.now(),
            tip: '来自测试请求'+clientName
        }
        const client = clients[clientName];
        client.requestMessage('test',data).then(function (res) {
            console.log(res,'response')
            setMessage(function (prev) {
                return {
                    ...prev,
                    [clientName]: 'response::'+JSON.stringify(res)
                }
            })
        })
    }


    return (
        <div>
            {
                Object.keys(clients).map((clientName)=>(
                    <div key={clientName}>
                        <h3>{clientName}</h3>
                        <button onClick={() => request(clientName)}>请求</button>
                        <button onClick={()=>{
                            clients[clientName].broadcast('broadcast',{
                                client: clientName
                            })
                        }}>广播</button>
                        <div>
                            {messageMap[clientName]}
                        </div>
                    </div>
                ))
            }
        </div>
    );
};

const root = createRoot(rootElement!)
root.render(<App />);
