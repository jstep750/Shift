var ipchalCash = 25500; // 시작은 제작사가 설정한 최소 가격으로 시작
var rate = 0.1;
document.getElementById("ipchal").innerText = ipchalCash;
document.getElementById("ipchalRate").innerText = rate;
function plusCash(){
    ipchalCash+=500;
    document.getElementById("ipchal").innerText = ipchalCash;
}
function minusCash(){ //이것도 제작자가 설정한 최소가격으로는 내려가지 않게
    ipchalCash-=500;
    document.getElementById("ipchal").innerText = ipchalCash;
}
function plusRate(){
    rate +=0.1;
    
    document.getElementById("ipchalRate").innerText = rate.toFixed(1);

}
function minusRate(){
    if(rate<0.2){
        alert("수량은 0.1% 이하로 내려갈 수 없습니다!");
    }
    else{
        rate -=0.1;
    document.getElementById("ipchalRate").innerText = rate.toFixed(1);
    }
    
}
//일단 여기까지 하고 이제 해야할 거는 그 가격 계산이랑 버튼누르면 더 되는거.
