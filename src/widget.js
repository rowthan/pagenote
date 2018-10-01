/** @jsx h */
// import { h, render, Component } from 'preact';  // normally this would be an import statement.

// class Clock extends Component {
//     constructor() {
//         super();
//         // set initial time:
//         this.state.time = Date.now();
//     }

//     componentDidMount() {
//         // update time every second
//         this.timer = setInterval(() => {
//             this.setState({ time: Date.now() });
//         }, 1000);
//     }

//     componentWillUnmount() {
//         // stop when not renderable
//         clearInterval(this.timer);
//     }

//     render(props, state) {
//         let time = new Date(state.time).toLocaleTimeString();
//         return <span>{ time }</span>;
//     }
// }

// render(<Clock />, document.body);

import {  h,app } from "hyperapp"
const state = {
    count: 0
}
  
  const actions = {
    down: value => state => ({ count: state.count - value }),
    up: value => state => ({ count: state.count + value })
  }
  
  const view = (state, actions) => (
    <div oncreate={()=>{const timer = setInterval(()=>actions.up(1),1000)}}>
      <h1>{state.count}</h1>
      <button onclick={() => actions.down(1)}>-</button>
      <button onclick={() => actions.up(1)}>+</button>
    </div>
  )
  
  app(state, actions, view, document.body)