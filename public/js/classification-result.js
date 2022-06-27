
//////////////////////////////////////////////////////
///////Affichage tableau après classification////////
////////////////////////////////////////////////////
import { result } from "./result.js";
// const result = require('./classification-result');
var newTab = [];
var height = 218;
var width = 255;

//Fonction qui permet de convertir les couleurs du result en rgba
function toColor(num) {
    num >>>= 0;
    var b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16,
        a = ((num & 0xFF000000) >>> 24) / 255;
    return "rgba(" + [r, g, b, a].join(",") + ")";
}

//Permet de convertir le rgba en hex
function hexify(color) {
    var values = color
      .replace(/rgba?\(/, '')
      .replace(/\)/, '')
      .replace(/[\s+]/g, '')
      .split(',');
    var a = parseFloat(values[3] || 1),
        r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
        g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
        b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
    return "#" +
      ("0" + r.toString(16)).slice(-2) +
      ("0" + g.toString(16)).slice(-2) +
      ("0" + b.toString(16)).slice(-2);
  }
//Contient uniquement les couleurs en hex
var colorTabInput = [];

//Contient le rang (index) et la valeur hex de la couleur
var colorscaleValue = [];
for (let i = 0; i < 10; i++) {
    let tab = [];
    let number = '0.' + i;
    tab.push(parseFloat(number));
    console.log(result._clusterColor);
    tab.push(toColor(result._clusterColor[i].value));
    colorscaleValue.push(tab);
}
colorscaleValue.push([1,
    toColor(result._clusterColor[9].value)
]);

for(let i = 0; i < colorscaleValue.length; i++){
    colorTabInput.push(hexify(colorscaleValue[i][1]));
}
console.log(colorscaleValue);
for (let i = width; i > 0; i--) {
    let tabTab = [];
    for (let j = height; j > 0; j--) {
        tabTab.push(result.clusterMap[i * height + j]);
    }
    newTab.push(tabTab);
}
export {newTab,colorTabInput};

//Concerne la librairie Plotly
var data = [{
    z: newTab,
    type: 'heatmap',
    colorscale: colorscaleValue,
}];


if(document.querySelector('#myDiv')){
    Plotly.newPlot('myDiv', data);
}

//////////////////////////////////////////////////
///Conception de l'image avec canvas et newTab///
////////////////////////////////////////////////
// const myDiv = document.querySelector('#myDiv');
// for(let i = 0; i < height; i++){
//     for(let j = 0; j < width; j++){
//         let canvas = document.createElement('canvas');
//         let ctx = canvas.getContext('2d');
//         let color;

//         //Attribution des codes hex couleurs aux chiffres dans newTab
//         switch(newTab){
//             case 0:
//                 color = colorTabInput[0];
//             break;
//             case 1:
//                 color = colorTabInput[1];
//             break;
//             case 2:
//                 color = colorTabInput[2];
//             break;
//             case 3:
//                 color = colorTabInput[3];
//             break;
//             case 4:
//                 color = colorTabInput[4];
//             break;
//             case 5:
//                 color = colorTabInput[5];
//             break;
//             case 6:
//                 color = colorTabInput[6];
//             break;
//             case 7:
//                 color = colorTabInput[7];
//             break;
//             case 8:
//                 color = colorTabInput[8];
//             break;
//             case 9:
//                 color = colorTabInput[9];
//             break;
//         }

//         ctx.fillStyle = color;
//         ctx.fillRect(j+1, i+1, 10, 10);
//         myDiv.appendChild(canvas);
//     }
    
    
// }
