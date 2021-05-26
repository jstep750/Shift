var usableCash = 300000; //가정, 현재 사용가능한 캐쉬 여기다가 저장.
var ipchalCash = 25500; // 시작은 제작사가 설정한 최소 가격으로 시작
var rate = 1;
var costTotal = ipchalCash * rate;
document.getElementById("ipchal").innerText = ipchalCash.toLocaleString('ko-KR');
document.getElementById("ipchalRate").innerText = rate/10;
document.getElementById("usableCash").innerText = usableCash.toLocaleString('ko-KR');
document.getElementById("costTotal").innerText = costTotal.toLocaleString('ko-KR');
function plusCash(){
    ipchalCash+=500;
    document.getElementById("ipchal").innerText = ipchalCash.toLocaleString('ko-KR');
    costTotal = ipchalCash * rate;
    document.getElementById("costTotal").innerText = costTotal.toLocaleString('ko-KR');
}
function minusCash(){ //이것도 제작자가 설정한 최소가격으로는 내려가지 않게
    ipchalCash-=500;
    document.getElementById("ipchal").innerText = ipchalCash.toLocaleString('ko-KR');
    costTotal = ipchalCash * rate;
    document.getElementById("costTotal").innerText = costTotal.toLocaleString('ko-KR');
}
function plusRate(){
    rate +=1;
    document.getElementById("ipchalRate").innerText = rate/10;
    costTotal = ipchalCash * rate;
    document.getElementById("costTotal").innerText = costTotal.toLocaleString('ko-KR');

}
function minusRate(){
    if(rate<2){
        alert("수량은 0.1% 이하로 내려갈 수 없습니다!");
    }
    else{
        rate -=1;
    document.getElementById("ipchalRate").innerText = rate/10;
    costTotal = ipchalCash * rate;
    document.getElementById("costTotal").innerText = costTotal.toLocaleString('ko-KR');
    }
    
}
function addRate(stock){
    rate+=stock;
    document.getElementById("ipchalRate").innerText = rate/10;
    costTotal = ipchalCash * rate;
    document.getElementById("costTotal").innerText = costTotal.toLocaleString('ko-KR');

}

