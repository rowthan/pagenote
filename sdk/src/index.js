import PageNote from './react-view/PageNote';

const data = localStorage.getItem('p_data');

let plainData;
try{
    plainData = JSON.parse(data);
}catch (e) {

}
const pagenote = new PageNote(function (data) {
    localStorage.setItem('p_data',JSON.stringify(data))
});
pagenote.init(plainData);

