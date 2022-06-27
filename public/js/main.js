import {base64String} from './base64.js';
import {result} from './result.js';
import { newTab, colorTabInput } from './classification-result.js';
////////////////////////////////////////////////////////////////
///Permet de cacher la navbar et le aside sur les pages  : langue, connexion
//Mais cette solution n'est pas à garder
// if(document.querySelector('.accueil')){
//     document.querySelector('aside').style.display = "none";
//     document.querySelector('nav').style.display = "none";
//     document.querySelector('.container').style.minHeight = "100vh"
// }


///////////////////////////////////////////////////////////////
//Lancement du serveur Websocket
// const ws = new WebSocket("ws://xu@vm-sdc-09.icube.unistra.fr:8081");



////////////////////////////////////////////////////////
//Concernent les requetes
var parsed;
var file;
var statusReq;
var message;


//Concerne la barre d'outils
var zoomBtn = document.querySelectorAll(".zoom");
var dezoomBtn = document.querySelectorAll(".dezoom");
var imageCarte = document.querySelectorAll(".carte");
var birdView = document.querySelector(".birdView");
var brightnessPlusBtn = document.querySelectorAll(".brightnessPlus");
var brightnessMoinsBtn = document.querySelectorAll(".brightnessMoins");
var contrastPlusBtn = document.querySelectorAll(".contrastPlus");
var contrastMoinsBtn = document.querySelectorAll(".contrastMoins");
var initializeBtn = document.querySelectorAll(".initialize");

//Concerne le aside
const menuBurger = document.querySelector('#menu_checkbox');
const aside = document.querySelector('aside');
const containerInterface = document.querySelector('.container-interface');

//Concerne dans page results : les clusters
const racine = document.querySelectorAll('.racine');
const triangles = document.querySelectorAll('.triangle');
const childRacine = document.querySelectorAll('.racine ul');
const spanRacine = document.querySelectorAll('.racine span');
const cluster = document.querySelectorAll('.cluster');
/////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////
//Fonction envoyée avec la dernière requete
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

        //Fonctionnalité de zoom dans l'image
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

//Concerne le protobuf
var ws, Req, Resp;



const root = protobuf.load("protobuf/Messages.proto").catch((err)=>{
    console.log(err);
})
.then((root)=>{
    Req = root.lookupType("FoDoMustProto.RequestMessage");
    Resp = root.lookupType("FoDoMustProto.ResponseMessage");

    var uid;
    var result;
    var result2 = [];
    var second = false;
    var getImg = {base64File:""};
    var start = Date.now();
    var msg;
    console.log("After load");
    ws = new WebSocket("ws://xu@vm-sdc-09.icube.unistra.fr:8081");
    ws.binaryType = "arraybuffer";

    ws.addEventListener("open", () => {
        msg = {header:14};
        ws.send(Req.encode(Req.create(msg)).finish())
    });

    ws.addEventListener('message', (event) => {
        console.log(1);
        console.log(event);
        console.log(event.data);
        // message = Resp.decode(Uint8Array.from(event.data));
        // message = Resp.decode(event.data);

	function snd(msg){
		ws.send(Req.encode(Req.create(msg)).finish());
	}
        message = Resp.decode(new Uint8Array(event.data), event.data.length);
        console.log(message);
        //"Chargement d'image" -> "Génération de donnée" -> "Lancer une classification simple utilisant KMeans"
        switch (message.header){
            case 42:
                uid = message.responseClientBody.clientID;
                msg = {
                    imageOpenRequest:{
                        base64File: file,
                        checksum: "0333ff8c224366dac05ba154f2c6e4d9",
                        isLaunchOrthoRect: false,
                        fileName: "070992.tif",
                        overWrite: true
                    },
                    clientId: uid,
                    header: 20
                };

                ws.send(Req.encode(Req.create(msg)).finish()); break;
            case 16:
                    result = message.imageOpenResp.idData;
                    var ior = {
                        base64File: null,
                        checksum: "0333ff8c224366dac05ba154f2c6e4d9",
                        isLaunchOrthoRect: false,
                        fileName: "070992.tif",
                        overWrite: false
                    };
                    start = Date.now();
                    switch(message.status){
                        case 3: case 2:
                            result = message.imageOpenResp.idData;
                            snd({
                                clientId: uid, header: 21,
                                imageInterfaceRequest : {
                                    idMessage: result,
                                    // doRescale: false,
                                }
                            });
                        break;
                        case 5:
                            ior.overWrite = true;
                        case 4:
                            ior.base64File = file;
                        case 7:
                        default:
                            snd({
                                clientId: uid, header: 20,
                                imageOpenRequest: ior
                            });break;
                    } break;
                case 17:
                console.log( Date.now() - start);
                    result2.push(message.imageInterfaceResp.imageInterf);
                    snd({
                        bufferedImageRequest:{
                            idMessage: result,
                            doRescale: false
                        },
                        clientId: uid,
                        header: 22
                    }); break;
                // create data image
                case 18:
                    getImg.base64File = message.bufferedImageResp.base64File;
                    //fs.writeFileSync(__dirname+"/demo.tif", getImg.base64File);
                    //afficheZoomImg();
                    if (!second)
                        snd({
                            dataImageRequest:{
                                images: result2,
                                mask: [
                                    {path:"."}
                                ],
                                samplingMethod: 1,
                                paramSamplingMethode: 4.0,
                                idPercentage: 5,
                                nameData: ""
                            },
                            clientId: uid,
                            header: 23
                        });
                    else
                        /*MONO_STRATEGY_APPROACH 			= 1;
                        MULTI_STRATEGY_APPROACH 		= 2;
                        MULTI_STRATEGY_ETC_APPROACH 	= 3;
                        MACLAW_APPROACH 				= 4;
                        VOTING_APPROACH 				= 5;
                        MULTIRESOLUTION_APPROACH 		= 6;
                        IMPORT_APPROACH 				= 7; */
                        snd({
                            rootClassificationRequest:{
                                idClassif: 1
                            },
                            clientId: uid,
                            header: 18
                        });
                    break;
                case 19:
                    snd({
                        dataInterfaceRequest:{
                            id: message.dataImageResp.dataImageId
                        },
                        clientId: uid,
                        header: 1
                    });break;
                // create classification
                case 3:
                	
                    //mcb.IDData;
                    //mcb.b64DataInterface;
                    //mcb.dataInterface;
                    snd({
                        classificationRequest:{
                            idData: message.dataInterfaceResp.IDData,
                            classification: {
                                isHybrid: false,
                                isMaclaw: false,
                                idData: message.dataInterfaceResp.IDData,
                                choiceApproch: 1,
                                distanceUse: 1,
                                type: "utils.ParamClassifSimple",
                                selectedMethod: "0",
                                paramClustering: [
                                    10.0,
                                    10.0
                                ],
                                weightsParam: [
                                    1.0,
                                    1.0,
                                    1.0
                                ],
                                hClustering: false
                            }
                        },
                        clientId: uid,
                        header: 2
                    });break;
                case 6:
                    //mcb.code;
                    currentClassifID = message.classificationResp.code;
                    snd({
                        finishRequest:{
                            idClassif: String(message.classificationResp.code)
                        },
                        clientId: uid,
                        header: 15
                    });break;
                case 12:
                    //mcb.finish
                    if (message.finishResp.finish!='100') {
                        snd({
                            finishRequest:{
                                idClassif: String(currentClassifID)
                            },
                            clientId: uid,
                            header: 15
                        });break;
                    }
                    snd({
                        resultClassificationRequest:{
                            idClassif: String(currentClassifID)
                        },
                        clientId: uid,
                        header: 9
                    });break;
                case 7:
                    //mcb.resultClassification
                    second = true;
                    result2.push(message.resultClassificationResp.imageInterf);
                    snd({
                        bufferedImageRequest:{
                            idMessage: result,
                            doRescale: false
                        },
                        clientId: uid,
                        header: 22
                    });
                    break;
                case 15:console.log( Date.now() - start);break;
                default: break;
        }
    });

})
    


// run().then(()=>{console.log("Then")}).catch((err)=>{console.log(err)});

async function run() {

    const ws = new WebSocket("ws://xu@vm-sdc-09.icube.unistra.fr:8081");
    

    const root = await protobuf.load("protobuf/Messages.proto").catch((err)=>{
        console.log(err);
    });

    
    const Req = root.lookupType("FoDoMustProto.RequestMessage");
    const Resp = root.lookupType("FoDoMustProto.ResponseMessage");

    var connection;
        
    function snd(msg){
        connection.ws.send(Req.encode(Req.create(msg)).finish());
    }

    //Récupère le user id
    ws.addEventListener("open", () => {
        console.log(1);
        //connection = ws;
        msg = {header:14};
        // ws.send({header:14});
        send(Req.encode(Req.create(msg)).finish())
    });

    console.log("after loads")
    var second = false;
    var result2 = [];
    //Récupère le data lorsqu'il reçoit un message

    ws.addEventListener('message', function(event) {
        console.log(1);
        message = Resp.decode(event.binaryData);
        console.log(message);
        //"Chargement d'image" -> "Génération de donnée" -> "Lancer une classification simple utilisant KMeans"
        switch (message.header){
            case 42:
                uid = message.responseClientBody.clientID;
                msg = {
                    imageOpenRequest:{
                        base64File: file,
                        checksum: "0333ff8c224366dac05ba154f2c6e4d9",
                        isLaunchOrthoRect: false,
                        fileName: "070992.tif",
                        overWrite: true
                    },
                    clientId: uid,
                    header: 20
                };

                ws.send(Req.encode(Req.create(msg)).finish()); break;
            case 16:
                result = message.imageOpenResp.idData;
                msg = {
                    imageInterfaceRequest:{
                        idMessage: result
                    },
                    clientId: uid,
                    header: 21
                }

                ws.send(Req.encode(Req.create(msg)).finish()); break;
            case 17:
                result2.push(message.imageInterfaceResp.imageInterf);
                snd({
                    bufferedImageRequest:{
                        idMessage: result,
                        doRescale: false
                    },
                    clientId: uid,
                    header: 22
                }); break;
            // create data image
            case 18:
                getImg.base64File = message.bufferedImageResp.base64File;
                fs.writeFileSync(__dirname+"/demo.tif", getImg.base64File);
                //afficheZoomImg();
                if (!second)
                snd({
                        dataImageRequest:{
                            images: result2,
                            mask: [
                                {path:"."}
                            ],
                            samplingMethod: 1,
                            paramSamplingMethode: 4.0,
                            idPercentage: 5,
                            nameData: ""
                        },
                        clientId: uid,
                        header: 23
                    });
                else
                    /*MONO_STRATEGY_APPROACH 			= 1;
                    MULTI_STRATEGY_APPROACH 		= 2;
                    MULTI_STRATEGY_ETC_APPROACH 	= 3;
                    MACLAW_APPROACH 				= 4;
                    VOTING_APPROACH 				= 5;
                    MULTIRESOLUTION_APPROACH 		= 6;
                    IMPORT_APPROACH 				= 7; */
                    snd({
                        rootClassificationRequest:{
                            idClassif: 1
                        },
                        clientId: uid,
                        header: 18
                    });
                break;
            case 19:
                snd({
                    dataInterfaceRequest:{
                        id: message.dataImageResp.dataImageId
                    },
                    clientId: uid,
                    header: 1
                });break;
            // create classification
            case 3:
                //mcb.IDData;
                //mcb.b64DataInterface;
                //mcb.dataInterface;
                snd({
                    classificationRequest:{
                        idData: message.dataInterfaceResp.IDData,
                        classification: {
                            isHybrid: false,
                            isMaclaw: false,
                            idData: event.dataInterfaceResp.IDData,
                            choiceApproch: 1,
                            distanceUse: 1,
                            type: "utils.ParamClassifSimple",
                            selectedMethod: "0",
                            paramClustering: [
                                10.0,
                                10.0
                            ],
                            weightsParam: [
                                1.0,
                                1.0,
                                1.0
                            ],
                            hClustering: false
                        }
                    },
                    clientId: uid,
                    header: 2
                });break;
            case 6:
                //mcb.code;
                currentClassifID = message.classificationResp.code;
                snd({
                    finishRequest:{
                        idClassif: String(message.classificationResp.code)
                    },
                    clientId: uid,
                    header: 15
                });break;
            case 12:
                //mcb.finish
                if (message.finishResp.finish!='100') {
                    snd({
                        finishRequest:{
                            idClassif: String(currentClassifID)
                        },
                        clientId: uid,
                        header: 15
                    });break;
                }
                snd({
                    resultClassificationRequest:{
                        idClassif: String(currentClassifID)
                    },
                    clientId: uid,
                    header: 9
                });break;
            case 7:
                //mcb.resultClassification
                second = true;
                result2.push(message.resultClassificationResp.imageInterf);
                snd({
                    bufferedImageRequest:{
                        idMessage: result,
                        doRescale: false
                    },
                    clientId: uid,
                    header: 22
                });
                break;
            //case 15:console.log( Date.now() - start);break;
            default: break;
        }
    });
}

//Concerne la carte de différence
const differenceCard = document.querySelector('.difference');

if(differenceCard){
    let imgDiff = document.createElement('img');
    imgDiff.src = "../images/diff.png";
    differenceCard.appendChild(imgDiff);
}

//Modal window open : generate data
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

//Concerne les boutons valider et annuler rouges et verts
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

// //page results
// const projectionPanel = document.querySelector('.projection-panel');
// const centroids = document.querySelector('.centroids');
// const statsResults = document.querySelector('.stats-results');
// if(statsResults){
//     projectionPanel.addEventListener('click', function() {
//         statsResults.innerHTML = "<%- include('./results/projectionpanel'); %>";
//     })
//     centroids.addEventListener('click', function () {
//         statsResults.innerHTML = "<%- include('./results/centroids'); %>";
//     })
// }

console.log(newTab);


const tableCluster = document.querySelector('.divTable');
if(tableCluster){
    let table = document.createElement('table');
    tableCluster.appendChild(table);
    // for(let i = 0; i < 3; i++){
    //     let tr = document.createElement('tr');
    //     table.appendChild(tr);
    //     let th = document.createElement('th');
        
    //     switch(i){
    //         case 0:
    //             th.textContent = "Name";
    //             break;
    //         case 1:
    //             th.textContent = "Color";
    //             break;
    //         case 2: 
    //             th.textContent = "Cardinality";
    //             break;
    //     }
    //     tr.appendChild(th);
    //     for(let j = 0; j < colorscaleValue.length - 1; j++){
    //         let td = document.createElement('td');
    //         switch(i){
    //             case 0:
    //                 td.textContent = "Cluster " + (j + 1); 
    //                 break;
    //             case 1:
    //                 let inputColor = document.createElement('input');
    //                 inputColor.type = "color";
    //                 inputColor.value = colorTabInput[j];
    //                 td.appendChild(inputColor);
    //                 break;
    //             case 2: 
    //                 td.textContent = result._cardinalityCluster[j];
    //                 break;
    //         }
    //         tr.appendChild(td);
    //     }
    // }
    for(let i = 0; i < (result._numberCluster + 1); i++){
        let tr = document.createElement('tr');
        table.appendChild(tr);
        for(let j = 1; j <= 3; j++){
            let th = document.createElement('th');
            if(i == 0){
                switch(j){
                    case 1:
                        th.textContent = "Nom";
                        break;
                    case 2:
                        th.textContent = "Couleur";
                        break;
                    case 3: 
                        th.textContent = "Cardinalité";
                        break;
                }
                tr.appendChild(th);
            }else{
                let td = document.createElement('td');
                switch(j){
                    case 1:
                        td.textContent = "Cluster " + i; 
                        break;
                    case 2:
                        let inputColor = document.createElement('input');
                        inputColor.type = "color";
                        inputColor.value = colorTabInput[i];
                        td.appendChild(inputColor);
                        break;
                    case 3: 
                        td.textContent = result._cardinalityCluster[i - 1];
                        break;
                }
                tr.appendChild(td);
            }
            
        }
    }
}
////////Affichage optionnel de l'aside
menuBurger.addEventListener('click', function(){
    aside.classList.toggle('display-none');
    aside.classList.toggle('diplay-block');
    containerInterface.classList.toggle('w-85');
});
//////Clusters
for(let i = 0; i < racine.length; i++){

    for(let k = 0; k < result._numberCluster;k++){
        let newLi = document.createElement('li');
        newLi.className = "cluster";
        childRacine[i].appendChild(newLi);
        let liSpan = document.createElement('span');
        liSpan.innerText = "Cluster " + parseInt(k+1);
        liSpan.className = "cluster-span";
        newLi.appendChild(liSpan);
        //
        let canvas = document.createElement('canvas');
        canvas.width = 20;
        canvas.height = 20;
        
        let ctx = canvas.getContext('2d');
        console.log(colorTabInput[k]);
        ctx.fillStyle =  colorTabInput[k];
        ctx.fillRect(0, 0, 20, 20);
        newLi.insertBefore(canvas, liSpan);
    }
    
    racine[i].addEventListener('click', function(){
        triangles[i].classList.toggle('triangle-rotate');
        for(let j = 0; j < childRacine[i].children.length; j++){
            childRacine[i].children[j].classList.toggle('display-block');
        }
    })
}