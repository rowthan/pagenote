import * as React from 'react';
import {createRoot} from 'react-dom/client';
import '@pagenote/component'
import {LetMeKnow,Highlight} from '@pagenote/component'

const rootElement = document.getElementById('root');
const App = () => {
  return (
    <div>
      react component
      <LetMeKnow></LetMeKnow>
      <Highlight>
        内容<h2>h2</h2>
      </Highlight>
    </div>
  );
};


export default function init(){
  const root = createRoot(rootElement!)
  root.render(<App />);
}