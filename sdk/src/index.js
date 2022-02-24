import PageNote from './react-view/PageNote';


let plainData;
try{
    const data = localStorage.getItem('p_data');
    plainData = JSON.parse(data);
}catch (e) {

}
const pagenote = new PageNote(function (data) {
    localStorage.setItem('p_data',JSON.stringify(data))
});
pagenote.init(plainData);

