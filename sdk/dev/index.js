import PageNote from "../src/index";
import { getDefaultBrush, LightStatus, LightType } from "@pagenote/shared/lib/pagenote-brush";


const pagenote = new PageNote({
  brushes:[{
    bg: '#4accff',
    shortcut: '',
    label: '标记',
    level: 1,
    color: '',
    lightType: LightType.highlight,
    defaultStatus: LightStatus.full_light
  },getDefaultBrush()],
  actions: [],
  beforeRecord:function() {
    return true
  },
  onchange: function(data) {
    console.log('changed',data)
  }
});


let plainData;
try{
  const data = localStorage.getItem('p_data');
  plainData = JSON.parse(data);
}catch (e) {

}

pagenote.setData(plainData);