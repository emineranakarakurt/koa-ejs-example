import {tab} from './matrice.js';
import {base64String} from './base64.js';

//Lancement du serveur Websocket
// const ws = new WebSocket("ws://xu@vm-sdc-09.icube.unistra.fr:8081");
const ws = new WebSocket("ws://127.0.0.1:8081");

const userId = JSON.stringify({
    header:"REQUEST_CLIENT_ID"
});
////////////////////////////////////////////////////////
var getImg;
var uid;
var parsed;
var file;
var statusReq;
var zoomBtn = document.querySelectorAll(".zoom");
var dezoomBtn = document.querySelectorAll(".dezoom");
var imageCarte = document.querySelectorAll(".carte");
var birdView = document.querySelector(".birdView");
var brightnessPlusBtn = document.querySelectorAll(".brightnessPlus");
var brightnessMoinsBtn = document.querySelectorAll(".brightnessMoins");
var contrastPlusBtn = document.querySelectorAll(".contrastPlus");
var contrastMoinsBtn = document.querySelectorAll(".contrastMoins");
var initializeBtn = document.querySelectorAll(".initialize");

/////////////////////////////////////////////////////////////

/* GET_IMAGE_INTERFACE */

var ImageInterface = {
    tempPath : 'FS/1/0/e28d8de75117d6235de61c6fa55a5fc9f59210955d8a195c979046021915edf5.tif',
    r : 0,
    g : 1,
    b : 2,
    buffer : '',
    path : 'FS/1/0/e28d8de75117d6235de61c6fa55a5fc9f59210955d8a195c979046021915edf5.tif',
    tempPath : 'FS/1/0/e28d8de75117d6235de61c6fa55a5fc9f59210955d8a195c979046021915edf5.tif',
    isGeoReferenced : false,
    isOrthoReady : false,
    filename : "070992.tif",
    sizeX : 219,
    sizeY : 216,
    pixelSizeX : 1,
    pixelSizeY : 1,
    imageOrigineX : 0,
    imageOrigineY : 0,
    groundSpacingX : 1,
    groundSpacingY : 1,
    numberOfBands : 3,
    sensorId : '',
    imageId : 0,
    time : '',
    driverName : "GeoTIFF",
    projectionName : "PROJCS[\"unnamed\",GEOGCS[\"unknown\",DATUM[\"unknown\",SPHEROID[\"unretrievable - using WGS84\",6378137,298.257223563]],PRIMEM[\"Greenwich\",0],UNIT[\"degree\",0.0174532925199433]],PROJECTION[\"Lambert_Conformal_Conic_2SP\"],PARAMETER[\"standard_parallel_1\",48.598523],PARAMETER[\"standard_parallel_2\",50.395912],PARAMETER[\"latitude_of_origin\",49.5],PARAMETER[\"central_meridian\",2.337229167],PARAMETER[\"false_easting\",600000],PARAMETER[\"false_northing\",1200000],UNIT[\"metre\",1,AUTHORITY[\"EPSG\",\"9001\"]]]",
    adfGeoTransform : [
        999760.0,
        20.0,
        0.0,
        1116540.0,
        0.0,
        -20.0
      ],
    latLong : [
        [
          7.759132419298201,
          48.574032980612216,
          0.0
        ],
        [
          7.818329689008556,
          48.57118576280115,
          0.0
        ],
        [
          7.823376643420943,
          48.61710622338708,
          0.0
        ],
        [
          7.764125244764069,
          48.61995607119527,
          0.0
        ]
      ],
    reader : {
        "projection": "PROJCS[\"unnamed\",GEOGCS[\"unknown\",DATUM[\"unknown\",SPHEROID[\"unretrievable - using WGS84\",6378137,298.257223563]],PRIMEM[\"Greenwich\",0],UNIT[\"degree\",0.0174532925199433]],PROJECTION[\"Lambert_Conformal_Conic_2SP\"],PARAMETER[\"standard_parallel_1\",48.598523],PARAMETER[\"standard_parallel_2\",50.395912],PARAMETER[\"latitude_of_origin\",49.5],PARAMETER[\"central_meridian\",2.337229167],PARAMETER[\"false_easting\",600000],PARAMETER[\"false_northing\",1200000],UNIT[\"metre\",1,AUTHORITY[\"EPSG\",\"9001\"]]]",
        "geoTransform": [
          999760.0,
          20.0,
          0.0,
          1116540.0,
          0.0,
          -20.0
        ],
    },
    b64Data : base64String,
    doubleData : '',
    bands : [
        true,
        true,
        true
      ],
};
// var ImageInterfaceResp = {
//     ImageInterface 
// };

/////////////////////////////////////////////////////////////
var divImage = document.querySelectorAll('.divImage');
//Affiche et zoom, dézoom sur l'image
function afficheZoomImg(){
    //Création de l'image
    
    var imageSmall = document.createElement('img');
    var imageSrc = 'data:image/png;base64,' + base64String;
    birdView.appendChild(imageSmall);
    imageSmall.src = imageSrc;
    for(let i = 0; i < divImage.length; i++){
        
        let image = document.createElement('img');
        image.src = imageSrc;
        divImage[i].appendChild(image);

        /////////////////////////////////////
        //Fonctionnalité de zoom dans l'image
        ////////////////////////////////////
        var zoomScale = 1;
        var brightness = 100;
        var contrast = 100;
        let pos = { top: 0, left: 0, x: 0, y: 0 };

        const mouseDownHandler = function (e) {
            pos = {
                left: divImage[i].scrollLeft,
                top: divImage[i].scrollTop,
                // position actuel du curseur
                x: e.clientX,
                y: e.clientY,
            };

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        };
        const mouseMoveHandler = function (e) {
            // distance entre curseur et déplacement
            const dx = e.clientX - pos.x;
            const dy = e.clientY - pos.y;

            // Scroller divImage vers la nouvelle position
            divImage[i].scrollTop = pos.top - dy;
            divImage[i].scrollLeft = pos.left - dx;
        };

        const mouseUpHandler = function () {
            divImage[i].style.cursor = 'grab';

            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };
        divImage[i].addEventListener('mousedown', mouseDownHandler);


        //Ecouteur d'évenements pour les boutons de zoom
        zoomBtn[i].addEventListener('click', function(){
            if(zoomScale < 15){
                zoomScale++;
                //image.style.scale = zoomScale;
                image.style.cssText = "transform : scale("+ zoomScale +"); "
            }
        });
        dezoomBtn[i].addEventListener('click', function(){
            if(zoomScale > 1){
                zoomScale--;
                //image.style.scale = zoomScale;
                image.style.cssText = "transform : scale("+ zoomScale +"); "
            }
        });

        // Ecouteur d'évenements pour les boutons de luminosité
        brightnessPlusBtn[i].addEventListener('click', function(){
            brightness = brightness + 50;
            image.style.filter = `brightness(${brightness}%)`;
        });
        brightnessMoinsBtn[i].addEventListener('click', function(){
            brightness = brightness - 50;
            image.style.filter = `brightness(${brightness}%)`;
        });

        //Ecouteur d'évenements pour les boutons de contraste
        contrastPlusBtn[i].addEventListener('click', function(){
            contrast = contrast + 50;
            image.style.filter = `contrast(${contrast}%)`;
        });
        contrastMoinsBtn[i].addEventListener('click', function(){
            contrast = contrast - 50;
            image.style.filter = `contrast(${contrast}%)`;
        });

        //Tous les filtres sont enlevés de l'image
        initializeBtn[i].addEventListener('click', function(){
            image.style.removeProperty('filter');
            zoomScale = 1;
            //image.style.scale = zoomScale;
            image.style.cssText = "transform : scale("+ zoomScale +"); "
        })
    }
}
//Récupère le user id
ws.addEventListener("open", () => {
    ws.send(userId);
});
var second = false;
var result2 = [];
//Récupère le data lorsqu'il reçoit un message
ws.addEventListener('message',function(event){
    parsed = JSON.parse(event.data);
    switch (parsed.header){
        case "REQUEST_CLIENT_ID":
            uid = String(parsed.clientId);
            console.log(parsed);
            getImg = JSON.stringify({
                clientId: uid,
                base64File: null,
                checksum: "0333ff8c224366dac05ba154f2c6e4d9",
                isLaunchOrthoRect: false,
                fileName: "070992.tif",
                overWrite: false,
                header: "OPEN_IMAGE",
            });

            ws.send(getImg);
                break;
        case "OPEN_IMAGE_RESPONSE":
            console.log(parsed);
            var result = parsed.idData;

            //En fonction du statut de la requete
            switch(parsed.status){
                case "FS_IO_EXCEPTION":
                    console.log(parsed);
                    getImg = JSON.stringify({
                        clientId: uid,
                        base64File: null,
                        checksum: "0333ff8c224366dac05ba154f2c6e4d9",
                        isLaunchOrthoRect: false,
                        fileName: "070992.tif",
                        overWrite: false,
                        header: "OPEN_IMAGE",
                    });

                    ws.send(getImg);
                    break;
                case "TO_UP_LOAD":
                    console.log(parsed);
                    getImg = JSON.stringify({
                        clientId: uid,
                        base64File: base64String,
                        checksum: "0333ff8c224366dac05ba154f2c6e4d9",
                        isLaunchOrthoRect: false,
                        fileName: "070992.tif",
                        overWrite: false,
                        header: "OPEN_IMAGE",
                    });

                    ws.send(getImg);
                    break;
                case "IMAGE_DUPLICATED":
                    console.log(parsed);
                    getImg = JSON.stringify({
                        clientId: uid,
                        base64File: base64String,
                        checksum: "0333ff8c224366dac05ba154f2c6e4d9",
                        isLaunchOrthoRect: false,
                        fileName: "070992.tif",
                        overWrite: true,
                        header: "OPEN_IMAGE",
                    });

                    ws.send(getImg);
                    break;
                case "UP_LOAD_SUCCESS":
                    console.log(parsed);
                    getImg = JSON.stringify({
                        imageInterfaceRequest : {
                            idMessage: /*parsed.clientId*/result,
                            // doRescale: false,
                        },
                        clientId: uid,
                        header: "GET_IMAGE_INTERFACE"
                    });
                    ws.send(getImg);
                    break;
                case "EXISTENT_IMAGE":
                    console.log(parsed);
                    getImg = JSON.stringify({
                        imageInterfaceRequest : {
                            idMessage: /*parsed.clientId*/result,
                            // doRescale: false,
                        },
                        clientId: uid,
                        header: "GET_IMAGE_INTERFACE"
                    });
                    ws.send(getImg);
                break;
                default:
                    break;
            }
                break;
        case "IMAGE_INTERFACE":
            console.log(parsed);
            result2.push(parsed.imageInterf);
            console.log('result 2 : ' , result2[0]);
            getImg = JSON.stringify({
                bufferedImageRequest : {
                    idMessage: result,
                    doRescale: false,
                },
                clientId: uid,
                header: "GET_BUFFER_IMAGE"
            });

            ws.send(getImg);
                break;
        case "BUFFERED_IMAGE":
            console.log('buffered img', parsed);
            base64String;
            afficheZoomImg();
            if(!second){
                console.log(ImageInterface);
                getImg = JSON.stringify({
                    images : result2,
                    mask : null,
                    samplingMethod : 2,
                    paramSamplingMethode : 1.0,
                    idPercentage : 0,
                    nameData : "070992.tif(Mono)",
                    clientId: uid,
                    header: "CREATE_DATA_IMAGE"
                });
    
                ws.send(getImg);
            }else{
                console.log(parsed);
                getImg = JSON.stringify({
                    rootClassificationRequest:{
                        idClassif: 1,
                    },
                    clientId: uid,
                    header: "GET_ROOT_CLASSIFICATION"
                });
                ws.send(getImg);
            }
                break;
        case "DATA_IMAGE":
            console.log(parsed);
            getImg = JSON.stringify({
                dataInterfaceRequest: {
                    id : 0,
                },
                clientId: uid,
                header: "GET_DATA_INTERFACE_BY_ID"
            });
            ws.send(getImg);
            break;
        //////////////////////////
        //CREATE CLASSIFICATION//
        /////////////////////////
        case "DATA_INTERFACE":
            console.log(parsed);
            getImg = JSON.stringify({
                idData : parsed.IDData,
                isHybrid: false,
                isMaclaw: false,
                idData: parsed.IDData,
                choiceApproach: 1,
                distanceUse: 1,
                type: "utils.ParamClassifSimple",
                selectedMethod: 1,
                paramClustering: [
                    10.0,
                    10.0
                ],
                weightsParam: [
                    1.0,
                    1.0,
                    1.0
                ],
                hClustering: false,
                clientId: uid,
                header: "CREATE_CLASSIFICATION"
            });

            ws.send(getImg);
            break;
        case "CLASSIFICATION_RESPONSE_CODE":
            console.log(parsed);
            var currentClassifID = parsed.code;
            getImg = JSON.stringify({
                // finishRequest: {
                    idClassif: String(parsed.code),
                // },
                clientId: uid,
                header: "GET_FINISH"
            });
            ws.send(getImg);
            break;
        case "FINISH_RESULT":
            console.log(parsed);
            if(parsed.finish != 100){
                getImg = JSON.stringify({
                    // finishRequest: {
                        idClassif: String(currentClassifID),
                    // },
                    clientId: uid,
                    header: "GET_FINISH"
                });    
            }
            getImg = JSON.stringify({
                // resultClassification: {
                    idClassif: String(currentClassifID),
                // },
                clientId: uid,
                header: "GET_RESULT_CLASSIFICATION"
            })
            ws.send(getImg);
            break;
        case "RESULT_CLASSIFICATION":
            console.log(parsed);
            second = true;
            result2 = parsed.imageInterf;
            getImg = JSON.stringify({
                // bufferedImageRequest: {
                    idMessage: result, 
                    doRescale: false,
                // },
                clientId: uid,
                header: "GET_BUFFER_IMAGE"
            });

            ws.send(getImg);
            break;
        // //BUFFERED_IMAGE
        // case "ROOT_CLASSIFICATION":
        //     getImg = JSON.stringify({
        //         idClassif: '',
        //         clientId: uid,
        //         header: "GET_MATRICE"
        //     });

        //     ws.send(getImg);
        //     break;
        // case "MATRICE":
        //     getImg = JSON.stringify({
        //         idClassification: '',
        //         type: '',
        //         nbObject: '',
        //         clientId: uid,
        //         header: "GET_SCALING"
        //     });

        //     ws.send(getImg);
        //     break;
        // case "SCALING":
        //     getImg = JSON.stringify({
        //         idClassification: '',
        //         method: '',
        //         type: '',
        //         dim: '',
        //         nbObject: '',
        //         clientId: uid,
        //     });

        //     ws.send(getImg);
        //     break;
        default:
            break;
    }
});
///carte de différence
const differenceCard = document.querySelector('.difference');

if(differenceCard){
    let imgDiff = document.createElement('img');
    imgDiff.src = "../images/diff.png";
    differenceCard.appendChild(imgDiff);
}

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


//////////////////////////////////////////////////////
///////Affichage tableau après classification////////
////////////////////////////////////////////////////

var newTab = [];
var height = 218;
var width = 255;
var clusterColor = [{
    'value': -8191745,
    'falpha': 0.0
}, {
    'value': -65463,
    'falpha': 0.0
}, {
    'value': -5888,
    'falpha': 0.0
}, {
    'value': -16711907,
    'falpha': 0.0
}, {
    'value': -16732161,
    'falpha': 0.0
}, {
    'value': -4802890,
    'falpha': 0.0
}, {
    'value': -10616650,
    'falpha': 0.0
}, {
    'value': -4848896,
    'falpha': 0.0
}, {
    'value': -10963456,
    'falpha': 0.0
}, {
    'value': -16730954,
    'falpha': 0.0
}];

function toColor(num) {
    num >>>= 0;
    var b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16,
        a = ((num & 0xFF000000) >>> 24) / 255;
    return "rgba(" + [r, g, b, a].join(",") + ")";
}
var colorscaleValue = [];
for (let i = 0; i < 10; i++) {
    let tab = [];
    let number = '0.' + i;
    tab.push(parseFloat(number));
    tab.push(toColor(clusterColor[i].value));
    colorscaleValue.push(tab);
}
colorscaleValue.push([1,
    toColor(clusterColor[9].value)
]);
console.log(colorscaleValue);
for (let i = height; i > 0; i--) {
    let tabTab = [];
    for (let j = width; j > 0; j--) {
        tabTab.push(tab[i * height + j]);
    }
    newTab.push(tabTab);
}
console.log(newTab);
var data = [{
    z: newTab,
    type: 'heatmap',
    colorscale: colorscaleValue,
}];
if(document.querySelector('#myDiv')){
    Plotly.newPlot('myDiv', data);
}

