
const containerDOM = document.querySelector("#deadline-contents"),
cardsContDOM = containerDOM.querySelector(".content-slider");
console.log("cardsContDom:"+cardsContDOM);

const tabDOM = document.querySelector("#tab-contents"),
tabContDOM1 = tabDOM.querySelector(".tab1-container"),
tabContDOM2 = tabDOM.querySelector(".tab2-container");

const waitingContDOM = document.querySelector("#waiting-container");

// selector
/*const lSelectorDOM = containerDOM.querySelector(".js-lSelector"),
sSelectorDOM = containerDOM.querySelector(".js-sSelector"),
sortSelectorDOM = containerDOM.querySelector(".js-sortSelector"),
priceSelectorDOM = containerDOM.querySelector(".js-priceSelector"),
searchBtnDOM = containerDOM.querySelector(".js-searchBtn");*/

// 넷은 같은 인덱스를 공유 (합쳐서 객체 배열로 만들어도 좋을 듯)
const cardsDOMArr = [ ], heartsDOMArr = [ ], goodsIdsArr = [ ], goodsInfoArr = [ ]; 
/*const tab1DOMArr = [ ], tab1goodsIdsArr = [ ], tab1goodsInfoArr = [ ]; 
const tab2DOMArr = [ ], tab2goodsIdsArr = [ ], tab2goodsInfoArr = [ ]; 
const waitingDOMArr = [ ], waitingHeartsDOMArr = [ ], waitingGoodsIdsArr = [ ], waitingGoodsInfoArr = [ ]; */
let firestoreDB, userId, likesInfoArr = [ ]; 


function init() { // 해당 함수만 실행됨, 나머지 함수는 
const firebaseConfig = {
    apiKey: "AIzaSyCXRTprV0yWYk8YrVpopvkFM4Cv_Nmhb2g",
    authDomain: "shift-f80bc.firebaseapp.com",
    databaseURL: "https://shift-f80bc-default-rtdb.firebaseio.com",
    projectId: "shift-f80bc",
    storageBucket: "shift-f80bc.appspot.com",
    messagingSenderId: "111516463886",
    appId: "1:111516463886:web:f7ae7d49add43d4cc0dd5f",
    measurementId: "G-QXHD4RJNKQ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firestoreDB = firebase.firestore();

// 로그인 상태면 userId, 아니면 null로 설정하기
// const user = firebase.auth().currentUser;
// if (user !== null) userId = user.uid; 
// else userId = null;

userId = "xaPkyYa95hSXEcoqcH1CD99QWLU2"; // 테스트를 위해 추가 (firestore의 kimgostring 유저정보 이용)

// 카드 정보 불러와 업데이트
initCards(getData(isMarketData = true));

// 로그인 된 경우, 유저 정보에 따라 하트 색 업데이트 
//if (userId !== null) changeHeartsColor(getData(isMarketData = false));

// 정렬 버튼에 핸들러 추가
//searchBtnDOM.addEventListener("click", handleSearchBtn);
}   

init();

function getData(isMarketData) {
    let ref, snapshot; 

    // 데이터 불러오기
    if (isMarketData) ref = firestoreDB.collection("market").where("endDate", ">=", new Date()); 
    else ref = firestoreDB.collection("user").doc(userId); // false, userLike data

    snapshot = ref.get();
    if (snapshot.empty) { // 검색된 데이터가 없는 경우
        console.log(`Fail to load ${isMarketData ? "market" : "userLike"} data.`);
        return;
    }

    console.log(`Success to load ${isMarketData ? "market" : "userLike"} data.`);
    console.log(snapshot)
    return snapshot;
    }

    function initCards(promisedSnapshots) {
    promisedSnapshots.then((snapshot) => {
        snapshot.forEach((doc) => {
            console.log(doc.id)
            console.log(doc.data())
            goodsIdsArr.push(doc.id);
            goodsInfoArr.push(doc.data());
        });

        defaultSortAfterGetMarket();

        goodsInfoArr.forEach((goodsInfo) => {
            cardContainer = mkCardDOM(goodsInfo);
            
            cardsContDOM.appendChild(cardContainer); // DOM 객체 html에 추가
        });
    });
}

function defaultSortAfterGetMarket() {
    // 데이터는... 쿼리 추가하니 아무래도 endDate를 기준으로 정렬한 뒤 끊어오는듯 
    // 먼저 최신순 정렬 실행 (최신순 = 데이터 입력이 가장 나중에 된 순서대로)

    // console.log("before sort - endDate", goodsIdsArr, goodsInfoArr);
    goodsInfoArr.sort(compLatestFuncForInfo); // 정렬은 id 정보로 해야 하므로, id 순서 바뀌기 전에 꼭 먼저 정렬하기
    goodsIdsArr.sort(compLatestFunc);
    // console.log("after sort - latest", goodsIdsArr, goodsInfoArr);
}

function compLatestFunc(aId, bId) { // id가 큰(나중에 추가된) 순서대로
    return bId - aId; 
}

function compLatestFuncForInfo(aInfo, bInfo) {
    return goodsIdsArr[goodsInfoArr.indexOf(bInfo)] - goodsIdsArr[goodsInfoArr.indexOf(aInfo)];
}

function mkCardDOM(goodsData) { // 상품 페이지로 이동 시 id를 쿼리 스트링으로 넘겨주면 될 듯 (idArr와 index 이용)
    // 0. 카테고리 배열 생성 
    /*const lCategoryStr = ["상품", "서비스"],
        sCategoryStr = ["보드게임", "공연", "음식", "패션", "디자인", "스포츠",
            "미술", "만화", "음악", "문학", "기술", "기타"];*/

    // 1. html 요소 생성 (하나의 카드가 로드될 span tag), 여기에 card.html 로드
    const cardContainer = document.createElement("li");
    cardContainer.classList.add("lslide");

    // timestamp를 date str으로 변환
    const startDateStr = mkDateStr(goodsData.startDate);
    
    cardContainer.innerHTML = `
        <div class="card" style="height: 100%; position: relative;">
            
            <img src="${goodsData.img}" alt="..." class="card-img-top" style="height: 50%; object-fit: cover;overflow: hidden;">
            <div class="text-white font-weight-bold d-flex align-items-center justify-content-center" style="position: absolute; bottom: 50%;right: 0%; width: 25%; height: 10%;background-color: #367dd3;font-size: 24px;">50%</div>
            <a style="color: #999999;position: absolute; top: 3%; left: 3%;" onclick="changeColor();">
                <i class="fas fa-star" id="icon"></i>
                <!--위에다가 대충 구현해놨음-->
            </a>
            <div class="card-body">
                <div class="card-title">
                    <div>${goodsData.name}</div>
                    <div style="font-size: 14px;color: #666666;">${goodsData.company}</div>
                </div>
                <p class="card-text" style="font-size: 14px;">
                    <div style="font-size: 11px; color: #367dd3;">
                        <span>#상품</span>
                        <span>#게임</span>
                    </div>
                    <div class="d-flex justify-content-start">
                        <span class="mr-2" style="font-size: 24px;">${goodsData.salePrice}원</span>
                        <span style="color: #999999;text-decoration: line-through;font-size: 14px;">${goodsData.originalPrice}원</span>
                    </div>
                    <p>
                        <div class="row">
                            <div class="col"><div style="height: 50%; border-bottom: 2px solid #17375e;"></div></div>
                            <div class="col font-weight-bold text-center" style="color: #17375e;padding: 0;"><i class="far fa-clock"></i> 남은 시간</div>
                            <div class="col"><div style="height: 50%; border-bottom: 2px solid #17375e;"></div></div>
                        </div>
                        <div class="text-center" style="color: #17375e; font-weight: 700;">
                            <span id="days"></span>
                            <span> : </span>
                            <span id="hours"></span>
                            <span> : </span>
                            <span id="minutes"></span>
                            <span> : </span>
                            <span id="seconds"></span>
                        </div>
                        
                    </p>
                    
                </p>
            </div>
        </div>
    `;

    setTime(startDateStr, cardContainer);

    console.log(typeof(cardContainer));
    // 2. 생성한 카드를 배열에 추가
    cardsDOMArr.push(cardContainer);

    /*    // 3. 하트 아이콘 핸들러 연결
    const heart = cardContainer.querySelector(".fa-heart");
    heart.addEventListener("click", handleHeart);
    // 마우스 가까이 가면 커서 모양 변경
    heart.addEventListener("mouseenter", function(event) {
        event.target.classList.add("js-mouse");
    });
    heart.addEventListener("mouseleave", function(event) {
        event.target.classList.remove("js-mouse");
    });

    // 4. 하트 배열에 추가
    heartsDOMArr.push(heart);*/

    return cardContainer;
}

function setTime(birthday, cardContainer) {
    console.log("setTime = " + birthday)
    const second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;
        function pad2(number) {

        return (number < 10 ? '0' : '') + number
    }

    let birthday = "May 30, 2021 00:00:00",
    countDown = new Date(birthday).getTime(),
    x = setInterval(function() {    

        let now = new Date().getTime(),
            distance = countDown - now;

        cardContainer.getElementById("days").innerText = pad2(Math.floor(distance / (day))),
        cardContainer.getElementById("hours").innerText = pad2(Math.floor((distance % (day)) / (hour))),
        cardContainer.getElementById("minutes").innerText = pad2(Math.floor((distance % (hour)) / (minute))),
        cardContainer.getElementById("seconds").innerText = pad2(Math.floor((distance % (minute)) / second));

        if (distance < 0) {            
        clearInterval(x);
        }
        //seconds
    }, 0)
};

function mkDateStr(date) {
    const dateObj = new Date();
    dateObj.setTime(date.seconds * 1000); // ms로 변환하려면 1000 곱해야 함

    return `${(dateObj.getFullYear() + "").slice(2, 4)}.${
            dateObj.getMonth() + 1 < 10 ? `0${dateObj.getMonth() + 1}` : dateObj.getMonth() + 1}.${
            dateObj.getDate() < 10 ? `0${dateObj.getDate()}` : dateObj.getDate()}`;
    }

    function calcSale(goodsData) {
    return 100 - (Math.round(goodsData.salePrice * 100 / goodsData.originalPrice));
}

/*function changeHeartsColor(promisedSnapshots) {
promisedSnapshots.then((snapshot) => {
    likesInfoArr = snapshot.data().like;

    // 모든 상품 카드 개수만큼
    for (let i = 0; i < goodsIdsArr.length; i++) { 
        // 사용자의 좋아요에 포함되는지 확인 후 색 변경
        if (userId !== null && likesInfoArr.includes(goodsIdsArr[i])) {
            // console.log(`User likes goods ${goodsIdsArr[i]}.`);
            heartsDOMArr[i].classList.add("js-like");
        }
    }   
});
}

function handleHeart(event) {
if (userId !== null) {        
    // 해당 heart의 인덱스 확인
    const index = heartsDOMArr.indexOf(event.target);

    // 로그인한 경우 - toggle
    if (event.target.classList.contains("js-like")) { // 좋아요 제거
        // 1. db 업데이트
        heartDBUpdate(goodsIdsArr[index], isPlus = false);

        // 업데이트 실패한 경우에도 뒤쪽 내용 변경시킴, 어차피 뒤쪽 내용들은 f5 누르면 초기화됨
        // 2. goodsInfoArr 배열 업데이트
        goodsInfoArr[index].likeNum--;

        // 3. likeArr에서 제거
        likesInfoArr.slice(likesInfoArr.indexOf(goodsIdsArr[index]), 1);

        // 4. 색 변경
        event.target.classList.remove("js-like"); 
    } else { // 좋아요 추가
        // 1. db 업데이트
        heartDBUpdate(goodsIdsArr[index], isPlus = true);

        // 2. goodsInfoArr 배열 업데이트
        if (goodsInfoArr[index].likeNum === undefined) goodsInfoArr[index].likeNum = 0;
        goodsInfoArr[index].likeNum++;

        // 3. likeArr에서 추가
        likesInfoArr.push(goodsIdsArr[index]);

        // 4. 색 변경
        event.target.classList.add("js-like");
    }
} else { // 로그인하지 않은 경우
    // 1. alert
    alert("로그인이 필요합니다.");
    // 2. 페이지 이동
    location.href = "../../account/loginpage.html";
}
}

function heartDBUpdate (goodsId, isPlus) {
const userRef = firestoreDB.collection("user").doc(userId),
    goodsRef = firestoreDB.collection("market").doc(goodsId);

// transaction
return firestoreDB.runTransaction((transaction) => {
    // This code may get re-run multiple times if there are conflicts.
    return transaction.get(goodsRef).then((goods) => {
        if (goods.empty) {
            console.log("Fail to load goods data for transaction.");
            return;
        }

        // 1. 사용자 db like에서 추가/제거
        let newUserLike;
        if (isPlus) newUserLike = firebase.firestore.FieldValue.arrayUnion(goodsId); // *** 이거 그거...그거도보기 그 정수와문자열 맞게저장하는지
        else newUserLike = firebase.firestore.FieldValue.arrayRemove(goodsId);

        transaction.update(userRef, { like: newUserLike });
        
        // 2. 상품 likeNum +- 1     
        let updatedLikeNum;
        if (isPlus) {
            if (goods.data().likeNum === undefined) updatedLikeNum = 1; // likeNum 항목이 없는 경우
            else updatedLikeNum = goods.data().likeNum + 1;
        } else updatedLikeNum = goods.data().likeNum - 1; // minus
        
        transaction.update(goodsRef, { likeNum: updatedLikeNum });
    });
}).then(() => {
    console.log(`Success to ${isPlus ? "add" : "remove"} ${goodsId} from like.`);
}).catch((err) => {
    console.log(`Fail to ${isPlus ? "add" : "remove"} ${goodsId} from like.`, err);
});
}

function handleSearchBtn() { 
const NO_SELECT = -1, 
    NO_UPPER_LIMIT = "noUpperLimit", 
    SORT_DEFAULT = "latest", 
    SORT_LIKE = "like", 
    SORT_END_DATE = "endDate"; 

const priceUpperLimit = [NO_SELECT, 10000, 30000, 50000, 100000, NO_UPPER_LIMIT],
    sortKind = [NO_SELECT, SORT_DEFAULT, SORT_LIKE, SORT_END_DATE];

// 그 사이에 추가된 데이터/눌린 좋아요 업데이트 위해 마켓 데이터 불러오기
getData(isMarketData = true).then((snapshot) => {
    let index;
    snapshot.forEach((doc) => {
        index = goodsIdsArr.indexOf(doc.id);
        if (index === -1) { // 새로 추가된 데이터, 카드 만들기 (append는 일단 X)
            goodsIdsArr.push(doc.id);
            goodsInfoArr.push(doc.data());

            cardContainer = mkCardDOM(doc.data());
            // *** heart handler 추가해야 함
        } else { // 원래 있던 데이터, 좋아요가 변했을 수도 있으므로 업데이트 실행
            goodsInfoArr[index].likeNum = doc.data().likeNum;
        }
    });

    let selectedGoodsIdsArr = goodsIdsArr.slice(); // 처음에는 다 선택, 선택 결과에 따라 맞지 않는 것 제거

    // l/s catehory의 경우, db에 0부터 시작하는 숫자로 저장됨, but selector의 경우 0번째 것은 선택 안 된 경우
    // 이 두 수를 맞추려면 selectedIndex를 구해 -1 해주어야 함, 따라서 [인덱스 - 1]이 -1(NO_SELECT)인 경우가 카테고리 선택 안 된 경우
    const lSelectorResult = lSelectorDOM.selectedIndex - 1;
    if (lSelectorResult !== NO_SELECT) {
        selectedGoodsIdsArr = selectedGoodsIdsArr.filter(function(goodsId) {
            return goodsInfoArr[goodsIdsArr.indexOf(goodsId)].l_category === lSelectorResult;
        });

        console.log("l", selectedGoodsIdsArr);
    }
    const sSelectorResult = sSelectorDOM.selectedIndex - 1;
    if (sSelectorResult !== NO_SELECT) {
        selectedGoodsIdsArr = selectedGoodsIdsArr.filter(function(goodsId) {
            return goodsInfoArr[goodsIdsArr.indexOf(goodsId)].s_category === sSelectorResult;
        });

        console.log("s", selectedGoodsIdsArr);
    }

    const priceSelectorInd = priceSelectorDOM.selectedIndex;
    if (priceUpperLimit[priceSelectorInd] !== NO_SELECT) {
        selectedGoodsIdsArr = selectedGoodsIdsArr.filter(function(goodsId) {
            const price = goodsInfoArr[goodsIdsArr.indexOf(goodsId)].salePrice;

            if (priceSelectorInd === 1) 
                return price < priceUpperLimit[1];
            else if (priceSelectorInd === priceUpperLimit.length - 1) 
                return price >= priceUpperLimit[priceUpperLimit.length - 2];
            else 
                return price < priceUpperLimit[priceSelectorInd] 
                    && price >= priceUpperLimit[priceSelectorInd - 1];
        });

        console.log("price", selectedGoodsIdsArr);
    }

    // 정렬은 가장 마지막에 하는 것이 효과적, 모든 정렬에서 2차 정렬은 항상 데이터가 나중에 입력된 것부터 (최신순)
    const sortSelectorResult = sortKind[sortSelectorDOM.selectedIndex];
    console.log(sortSelectorResult);
    if (sortSelectorResult === SORT_LIKE) { // 좋아요가 많은 순으로 정렬
        selectedGoodsIdsArr.sort(compLikeFunc);
        
        console.log("sort - like", selectedGoodsIdsArr);
    } else if (sortSelectorResult === SORT_END_DATE) { // 마감 임박 순
        selectedGoodsIdsArr.sort(compEndDateFunc);
        
        console.log("sort - end date", selectedGoodsIdsArr);
    } else { // default 혹은 latest 선택한 경우
        selectedGoodsIdsArr.sort(compLatestFunc);
        
        console.log("sort - latest", selectedGoodsIdsArr);
    }

    // HTML에 적용 
    updateCardHTML(selectedGoodsIdsArr);
}).catch((err) => {
    console.log(err);
});
}

function compLikeFunc(aId, bId) { // 좋아요가 더 많은 순서대로
let aLikeNum = goodsInfoArr[goodsIdsArr.indexOf(aId)].likeNum, 
    bLikeNum = goodsInfoArr[goodsIdsArr.indexOf(bId)].likeNum;
    
// likeNum 요소가 없는 경우(좋아요 0개)는 불러와진 데이터 없을 것
if (aLikeNum === undefined) aLikeNum = 0;
if (bLikeNum === undefined) bLikeNum = 0; 

return bLikeNum - aLikeNum; 
}

function compEndDateFunc(aId, bId) { // 마감기한이 더 이른 순서대로
return goodsInfoArr[goodsIdsArr.indexOf(aId)].endDate - goodsInfoArr[goodsIdsArr.indexOf(bId)].endDate;
}

// function updateHideClass(selectedIdsArr) {
//     for (let i = 0; i < goodsIdsArr.length; i++) {
//         // 선택된 애가 감춰져 있는 경우, 해당 card에 js-hide 클래스 제거
//         if (selectedIdsArr.includes(goodsIdsArr[i]) && cardsDOMArr[i].children[0].classList.contains("js-hide")) {
//             console.log(`remove js-hide to ${goodsIdsArr[i]}`);
//             cardsDOMArr[i].classList.add("col-lg-4", "col-md-6");
//             cardsDOMArr[i].children[0].classList.remove("js-hide");
//         }
//         // 선택되지 않은 애가 보이는 경우, 해당 card에 js-hide 클래스 추가
//         else if (!(selectedIdsArr.includes(goodsIdsArr[i])) && !(cardsDOMArr[i].children[0].classList.contains("js-hide"))) {
//             console.log(`add js-hide to ${goodsIdsArr[i]}`);
//             cardsDOMArr[i].classList.remove("col-lg-4", "col-md-6");
//             cardsDOMArr[i].children[0].classList.add("js-hide");
//         }
//     }
// }

function updateCardHTML(sortedIdsArr) {
// 1. html에서 모든 카드 삭제
cardsContDOM.innerHTML = "";

// 2. 정렬한 순서대로 요소 추가
sortedIdsArr.forEach((id) => {
    cardsContDOM.appendChild(cardsDOMArr[goodsIdsArr.indexOf(id)]);
});
}
*/

