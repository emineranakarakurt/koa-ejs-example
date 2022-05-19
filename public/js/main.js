//Modal window open : genrate data
const openModalBtn = document.getElementsByClassName('btn-modal');
const modalWindow = document.querySelectorAll('.modal-window');
const btnClose = document.querySelectorAll('.btn-close');
const btnAnimSubmit = document.querySelector('.btn-anim-submit');
const btnAnimClose = document.querySelector('.btn-anim-close');
const accordeonTitle = document.querySelectorAll('.accordeon-title');
const accordeonContent = document.querySelectorAll('.accordeon-content');
const chevronAccordeon = document.querySelectorAll('.accordeon-title i');
const dataTable = document.querySelector('.data-table table tbody');
//Page generate data : modal window
// if(openModalBtn){
//     openModalBtn.addEventListener('click', function(){
//         modalWindow.style.display = "block"
//     })
// }
// if(btnClose){
//     btnClose.addEventListener('click', function(){
//         modalWindow.style.display = "none"
//     })
// }
// if(modalWindow){
//     modalWindow.addEventListener('click', function(e){
//         if (e.target == modalWindow) {
//             modalWindow.style.display = "none";
//             console.log('verfi');
//         }
//     })
// }

if(modalWindow){
    for(let i = 0; i < openModalBtn.length; i++){
        openModalBtn[i].addEventListener('click', function(){
            modalWindow[i].style.display = "block";
        })
        btnClose[i].addEventListener('click', function(){
            modalWindow[i].style.display = "none";
        })
        modalWindow[i].addEventListener('click', function(e){
            if (e.target == modalWindow[i]) {
                modalWindow[i].style.display = "none";
                console.log('verfi');
            }
        })
    }
}
if(btnAnimClose){
    btnAnimClose.addEventListener('click', function(){
        modalWindow.style.display = "none"
    })
    btnAnimClose.addEventListener('mousemove', e => {
        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        btn.style.setProperty('--x', x + 'px');
        btn.style.setProperty('--y', y + 'px');
    });
}
if(btnAnimSubmit){
    btnAnimSubmit.addEventListener('mousemove', e => {
        let rect = e.target.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        btn.style.setProperty('--x', x + 'px');
        btn.style.setProperty('--y', y + 'px');
    });
}
   
/////////////////////////////
//Page data panel : accordeon
if(accordeonTitle){
    for(let i = 0; i < accordeonTitle.length; i++){
        accordeonTitle[i].addEventListener('click', function(){
            accordeonContent[i].classList.toggle('display-block');
            chevronAccordeon[i].classList.toggle('fa-chevron-down');
            chevronAccordeon[i].classList.toggle('fa-chevron-up');
        });
        
    }
}

//Data table 
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
if(dataTable){
    for(let i = 0; i < 255; i++){
        let tr = document.createElement('tr');
        dataTable.appendChild(tr);
        for(let j = 0; j < 4; j++){
            let td = document.createElement('td');
            if(j === 0){
                td.textContent = i;
            }else{
                td.textContent = getRandomInt(255);
            }
            
            tr.appendChild(td);
        }
    }
}

//page results
const projectionPanel = document.querySelector('.projection-panel');
const centroids = document.querySelector('.centroids');
const statsResults = document.querySelector('.stats-results');
if(statsResults){
    projectionPanel.addEventListener('click', function() {
        statsResults.innerHTML = "<%- include('./results/projectionpanel'); %>";
    })
    centroids.addEventListener('click', function () {
        statsResults.innerHTML = "<%- include('./results/centroids'); %>";
    })
}
