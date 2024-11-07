const canvas = document.getElementById('canvas');
const cc = canvas.getContext('2d');
const message = document.getElementById('message');
const restart = document.getElementById('restart');
const crown1 = document.getElementById('c1');
const crown1_2 = document.getElementById('c1_2');
const crown2 = document.getElementById('c2');
const crown2_2 = document.getElementById('c2_2');
let row;
let col;
let count;
let playerflg;
let gameflg;
let array = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
];

for(let r = 0; r < 3; r++){
    for(let c = 0; c < 3; c++){
        console.log(array[r][c]);
    }
}

function drawGrid(){
    cc.save();
    cc.beginPath();
    cc.linewidth = 1;
    for(let i=0; i<=3; i++){
        cc.moveTo(i*100, 0);
        cc.lineTo(i*100, 300);
        cc.moveTo(0, i*100);
        cc.lineTo(300, i*100);
    }
    cc.stroke();
    cc.restore();
    }

function drawMaru(row, col) {
    cc.save();
    cc.beginPath();
    cc.strokeStyle = '#000000';
    cc.arc(col*100+50, row*100+50, 30, 0, Math.PI*2, false); //x:col,y:rowなので注意 
    cc.stroke();
    cc.restore();
    array[row][col] = 1;
    }

function drawBatsu(row, col) {
    cc.save();
    cc.beginPath();
    cc.strokeStyle = '#000000';
    cc.moveTo(col*100+20, row*100+20);
    cc.lineTo(col*100+80, row*100+80);
    cc.moveTo(col*100+80, row*100+20);
    cc.lineTo(col*100+20, row*100+80);
    cc.stroke();
    cc.restore();
    array[row][col] = -1;
}

function getPos(point) {
    if (point < 100) { return 0; } 
    if (point >= 200) { return 2; } 
    return 1;
}

function onMouseClick(e) {
    //クリックされた座標取得
    const rect = canvas.getBoundingClientRect(); // Canvasの位置を取得 
    let mx = e.clientX - rect.left; // クリックされたX座標
    let my = e.clientY - rect.top; // クリックされたY座標
    console.log(mx, my); // 確認のための表示 
    row = getPos(my);
    col = getPos(mx);
    if(!isEmpty(row, col))return;
    if(playerflg===1)drawMaru(row, col);
    // else drawBatsu(row, col);
    count++;
    playerflg*=-1;
    // if(playerflg===-1)window.setTimeout(cpu,500);
    nowplay();
    result();
    cpu();
    if(result())return;
//     // console.log(row, col); // 確認のための表示
console.log(playerflg);
}

function isEmpty(row, col) {
    if(array[row][col] == 0){
        return true;
    }
    return false;
}

function judge() {
    //行が揃っているかを判定
    for (let r = 0; r < 3; r++) {
        if (array[r][0] == 1 && array[r][1] == 1 && array[r][2] == 1) { return 1; }
        if (array[r][0] == -1 && array[r][1] == -1 && array[r][2] == -1) { return -1; }
    }
    //TODO: 列が揃っているかを判定 
    for(let c = 0; c < 3; c++){
        if(array[0][c] == 1 && array[1][c] == 1 && array[2][c] == 1) { return 1; }
        if(array[0][c] == -1 && array[1][c] == -1 && array[2][c] == -1) { return -1; }
    }
    //TODO: 斜めが揃っているかを判定 
    if(array[0][0] == 1 && array[1][1] == 1 && array[2][2] == 1) { return 1; }
    if(array[0][0] == -1 && array[1][1] == -1 && array[2][2] == -1) { return -1; }
    if(array[0][2] == 1 && array[1][1] == 1 && array[2][0] == 1) { return 1; }
    if(array[0][2] == -1 && array[1][1] == -1 && array[2][0] == -1) { return -1; }
    //揃っていなかったら0を返す 
    return 0;
}

function result(){
    if(judge()===1){message.textContent = '○の勝ち';finish();crown1.classList.remove("hidden");crown1_2.classList.remove("hidden");return true;};
    if(judge()===-1){message.textContent = '×の勝ち';finish();crown2.classList.remove("hidden");crown2_2.classList.remove("hidden");return true;};
    if(count===9){message.textContent = '引き分け';finish();return true;};
    return false;
}

function clear(){
    cc.clearRect(0, 0, canvas.width, canvas.height);
    for(let r = 0; r < 3; r++){
        for(let c = 0; c < 3; c++){
            array[r][c] = 0;
        }
    }
}

function nowplay(){
    if(playerflg===-1)message.textContent = '×の番です';
    if(playerflg===1)message.textContent = '◯の番です';
}

function finish(){
    gameflg = false;
    canvas.removeEventListener('click', onMouseClick);
}

function restartplay(){
    canvas.addEventListener('click', onMouseClick);
    init();
}

function cpu(){
    if(playerflg!=-1)return;
    if(!gameflg)return;
    //2pの行動
    canvas.removeEventListener('click', onMouseClick);
    const rectp = canvas.getBoundingClientRect(); // Canvasの位置を取得 
    while(1){
        row = getPos(Math.random()*300 );
        col = getPos(Math.random()*300 );
        if(isEmpty(row, col))break;
    }
    count++;
    window.setTimeout(function(){drawBatsu(row, col)},300);
    window.setTimeout(nowplay,310);
    window.setTimeout(result,320);
    playerflg*=-1;
    canvas.addEventListener('click', onMouseClick);
}

function test(){

}

function init(){
    gameflg = true;
    count = 0;
    playerflg = 1;
    clear();
    drawGrid();
    crown1.classList.add('hidden');
    crown2.classList.add('hidden');
    crown1_2.classList.add('hidden');
    crown2_2.classList.add('hidden');
    nowplay();
}

function main(){
    init();
    test();
    canvas.addEventListener('click', onMouseClick);
    restart.addEventListener('click', restartplay);
    document.addEventListener('keydown', function(e){
        if(e.key === 'r'){
            restartplay();
        }
    });
}
        
main();