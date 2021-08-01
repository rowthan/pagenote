import { h, render } from 'preact';
import "../src/pagenote";
import Demo from './Demo'
import "../demo/init"

const root = document.getElementById('guide');
render(<Demo />, root);
