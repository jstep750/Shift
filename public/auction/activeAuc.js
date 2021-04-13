// auction 페이지는 마켓 - 1차 - 2차 - 심사중 순서
const marketTab = document.querySelector("#ex1-tab-1"),
    auc1stTab = document.querySelector("#ex1-tab-2"),
    auc2ndTab = document.querySelector("#ex1-tab-3"),
    judgeAucTab = document.querySelector("#ex1-tab-4"),
    marketPg = document.querySelector("#ex1-tabs-1"),
    auc1stPg = document.querySelector("#ex1-tabs-2"),
    auc2ndPg = document.querySelector("#ex1-tabs-3"),
    judgeAucPg = document.querySelector("#ex1-tabs-4");

const aucTabArr = [marketTab, auc1stTab, auc2ndTab, judgeAucTab];
const aucPgArr = [marketPg, auc1stPg, auc2ndPg, judgeAucPg];

function init() { 
    let pageNum = location.search.split("page=")[1]; // 쿼리스트링에서 숫자 받아오기
    if (pageNum == undefined) { // 아무런 파라미터 없는 경우 default값
        pageNum = 1;
    }

    setActive(pageNum - 1);
    // 버튼 누를 때마다 페이지 주소 바뀌도록 설정
    // aucTabArr.forEach(function(tab) {
    //     tab.addEventListener("click", handlePgLoca);
    // });
}

init(); 

function setActive(index) {
    // 1. action이 class에 포함되어 있는 것을 찾아, 목록에서 삭제
    for (let i = 0; i < 4; i++) {
        if (aucTabArr[i].classList.contains("active")) { // active인 경우
            if (i == index) break; // 원래 값과 바꿀 값 일치

            aucTabArr[i].classList.remove("active");
            aucPgArr[i].classList.remove("active");
        }
    }
    
    // 2. 목록에 action 추가하기
    aucTabArr[index].classList.add("active");
    aucPgArr[index].classList.add("active");
}

// function handlePgLoca(event) {
//     ocation.search = `?page=${aucTabArr.indexOf(event.target) + 1}`;
// }