///Modal window open : genrate data
const openModalBtn = document.querySelector('#btn-modal');
const modalWindow = document.querySelector('.modal-window');
const btnClose = document.querySelector('.btn-close');
const btnAnimGreen = document.querySelector('.btn-anim-green');
const btnAnimRed = document.querySelector('.btn-anim-red');


openModalBtn.addEventListener('click', function(){
    modalWindow.style.display = "block"
})
btnClose.addEventListener('click', function(){
    modalWindow.style.display = "none"
})
modalWindow.addEventListener('click', function(e){
    if (e.target == modalWindow) {
        modalWindow.style.display = "none";
        console.log('verfi');
      }
})
btnAnimRed.addEventListener('click', function(){
    modalWindow.style.display = "none"
})

btnAnimGreen.addEventListener('mousemove', e => {
    let rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    btn.style.setProperty('--x', x + 'px');
    btn.style.setProperty('--y', y + 'px');
});
btnAnimRed.addEventListener('mousemove', e => {
    let rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    btn.style.setProperty('--x', x + 'px');
    btn.style.setProperty('--y', y + 'px');
});