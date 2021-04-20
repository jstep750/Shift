const containerDOM = document.querySelector("#ex1-content"),
    cardsContDOM = containerDOM.querySelector(".js-cardsContainer");

// selector
const lSelectorDOM = containerDOM.querySelector(".js-lSelector"),
    sSelectorDOM = containerDOM.querySelector(".js-sSelector"),
    sortSelectorDOM = containerDOM.querySelector(".js-sortSelector"),
    saleSelectorDOM = containerDOM.querySelector(".js-saleSelector"),
    priceSelectorDOM = containerDOM.querySelector(".js-priceSelector"),
    searchBtnDOM = containerDOM.querySelector(".js-searchBtn");

const cardsDOMArr = [ ], heartsDOMArr = [ ], goodsIdsArr = [ ];
let likesInfoArr = [ ], goodsInfoArr = [ ], userID;

function init() {
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
    const firestoreDB = firebase.firestore();

    const user = firebase.auth().currentUser;
    if (user !== null) userID = user.uid; 
    else userID = "xaPkyYa95hSXEcoqcH1CD99QWLU2"; // 현재는 로그인 기능과 연결 안 되어 있으므로 테스트를 위해 추가

    // 카드 정보 불러와 업데이트
    initCards(getData(firestoreDB, isMarketData = true));

    // 하트에 핸들러 추가, 유저 정보에 따라 색 업데이트
    initHearts(getData(firestoreDB, isMarketData = false));

    // 정렬 버튼에 핸들러 추가
    searchBtnDOM.addEventListener("click", handleSearchBtn);
}

init();

function getData(firestoreDB, isMarketData) {
    let ref, snapshot;

    // 데이터 불러오기
    if (isMarketData === true) ref = firestoreDB.collection("market");
    else ref = firestoreDB.collection("user").doc(userID); // false, userLike data

    snapshot = ref.get();
    if (snapshot.empty) { // 검색된 데이터가 없는 경우
        console.log(`Fail to load ${isMarketData === true ? "market" : "userLike"} data.`);
        return;
    }

    console.log(`Success to load ${isMarketData === true ? "market" : "userLike"} data.`);
    return snapshot;
}

function initCards(promisedSnapshots) {
    promisedSnapshots.then((snapshot) => {
        snapshot.forEach((doc) => {
            goodsIdsArr.push(doc.id);
            goodsInfoArr.push(doc.data());

            changeEachCard(doc.data());
        });
    });
}

function changeEachCard(goodsData) { // 상품 페이지로 이동 시 id를 쿼리 스트링으로 넘겨주면 될 듯 (idArr와 index 이용)
    // 0. 카테고리 배열 생성 
    const lCategoryStr = ["서비스", "상품"],
        sCategoryStr = ["보드게임", "공연", "음식", "패션", "디자인", "스포츠",
            "미술", "만화", "음악", "문학", "기술", "기타"];

    // 1. html 요소 생성 (하나의 카드가 로드될 span tag), 여기에 card.html 로드
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("col-lg-4", "col-md-6", "d-flex", "justify-content-center");

    // timestamp를 date str으로 변환
    const startDateStr = mkDateStr(goodsData.startDate);
    const endDateStr = mkDateStr(goodsData.endDate);

    // 2. html 파일 추가
    cardContainer.innerHTML = `
        <div class="card" style="max-width: 400px; height: 100%;">
        <div style="height: 60%;position: relative;">
            <img src="${goodsData.img}" alt="..." class="card-img-top js-img" style="height: 100%; object-fit: cover;overflow: hidden;">
            <div class="text-white font-weight-bold d-flex align-items-center justify-content-center js-percent" style="position: absolute; bottom: 0%;right: 0%; width: 25%; height: 15%;background-color: #367dd3;font-size: 24px;">${calcSale(goodsData)}%</div>
        </div>       
        <div class="card-body">
            <div class="card-title">
                <a class="font-weight-bold js-title" style="font-size: 24px;height: 76px;color: #454545;" href="#">[${goodsData.company}] ${goodsData.name}</a><!--여기서 이거 누르면 상품 설명 페이지로-->
                <div class="js-dateRange" style="font-size: 14px;color: #666666;">${startDateStr} ~ ${endDateStr}</div>
            </div>
            <p class="card-text" style="">
            <div class="font-weight-bold" style="font-size: 18px; color: #666666;">회사(개인)</div>
            <div style="color: #367dd3;font-size: 14px;">
                <span class="js-lCategory">#${lCategoryStr[goodsData.l_category]}</span>
                <span class="js-sCategory">#${sCategoryStr[goodsData.s_category]}</span>
            </div>
            <div class="d-flex justify-content-between mt-1">
                <div class="d-flex justify-content-start">
                    <span class="font-weight-bold mr-1 js-saleprice" style="font-size: 24px;">${goodsData.salePrice}원</span>
                    <span class="js-originalPrice" style="color: #999999;text-decoration: line-through;font-size: 14px;">${goodsData.originalPrice}원</span>
                </div>
                <div>
                    <span style="color: #999999">
                        <i class="fas fa-heart" style="font-size: 36px;"></i>
                    </span> 
                </div>
            </div>
            </p>
        </div>
        </div>`;
    
    // 2. 생성한 카드를 배열에 추가 후 append
    cardsDOMArr.push(cardContainer);
    cardsContDOM.appendChild(cardContainer);

    // 3. 하트 아이콘 배열에 넣기
    const heart = cardContainer.querySelector(".fa-heart");
    heartsDOMArr.push(heart);
}

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

function initHearts(promisedSnapshots) {
    promisedSnapshots.then((snapshot) => {
        likesInfoArr = snapshot.data().like;

        // 모든 상품 카드 개수만큼
        for (let i = 0; i < goodsIdsArr.length; i++) { 
            // 1. 사용자의 좋아요에 포함되는지 확인 후 색 변경
            if (userID !== null && likesInfoArr.includes(goodsIdsArr[i])) {
                // console.log(`User likes goods ${goodsIdsArr[i]}.`);
                heartsDOMArr[i].classList.add("js-like");
            }
            // 2. 하트 아이콘에 eventListener 추가
            // 마우스 가까이 가면 커서 모양 변경
            heartsDOMArr[i].addEventListener("mouseenter", function(event) {
                event.target.classList.add("js-mouse");
            });
            heartsDOMArr[i].addEventListener("mouseleave", function(event) {
                event.target.classList.remove("js-mouse");
            })

            // 클릭할 때 작업
            heartsDOMArr[i].addEventListener("click", handleHeart);
        }   
    });
}

function handleHeart(event) {
    if (userID !== null) {
        const firestoreDB = firebase.firestore();
        const ref = firestoreDB.collection("user").doc(userID);
        
        // 해당 heart가 몇 번째 배열에 있던 것인지 불러옴
        const index = heartsDOMArr.indexOf(event.target);

        // 로그인한 경우 - toggle
        if (event.target.classList.contains("js-like")) { // 좋아요 제거
            // 1. db에 제거
            ref.update({
                like: firebase.firestore.FieldValue.arrayRemove(goodsIdsArr[index])
            }).then(console.log(`Success to remove ${goodsIdsArr[index]} from firestore.`));

            // 2. likeArr에서 제거
            likesInfoArr.slice(likesInfoArr.indexOf(goodsIdsArr[index]), 1);

            // 3. 색 변경
            event.target.classList.remove("js-like"); 
        } else { // 좋아요 추가
            // 1. db에 추가
            ref.update({
                like: firebase.firestore.FieldValue.arrayUnion(goodsIdsArr[index])
            }).then(console.log(`Success to add ${goodsIdsArr[index]} from firestore.`));

            // 2. likeArr에서 추가
            likesInfoArr.push(goodsIdsArr[index]);

            // 3. 색 변경
            event.target.classList.add("js-like");
        }
    }

    // 로그인하지 않은 경우 - ?
}

function handleSearchBtn() { // 분류하기 기능 이용, 걸러진 것들에는 js-hide class 추가
    console.log("click");

    const NO_SELECT = -1, 
        NO_UPPER_LIMIT = "noUpperLimit", 
        SORT_LATEST = "latest", 
        SORT_DEAL_AMOUNT = "dealAmount", // 많이 팔린 순?
        SORT_END_DATE = "endDate"; 

    const saleUpperLimit = [NO_SELECT, 10, 20, 30, 40, 50, NO_UPPER_LIMIT], 
        priceUpperLimit = [NO_SELECT, 10000, 30000, 50000, 10000, NO_UPPER_LIMIT],
        sortKind = [NO_SELECT, SORT_LATEST, SORT_DEAL_AMOUNT, SORT_END_DATE];

    let selectedGoodsIdsArr = goodsIdsArr; // 처음에는 다 선택, 선택 결과에 따라 맞지 않는 것 제거

    // l/s catehory의 경우, db에 0부터 시작하는 숫자로 저장됨, but selector의 경우 0번째 것은 선택 안 된 경우
    // 이 두 수를 맞추려면 selectedIndex를 구해 -1 해주어야 함, 따라서 [인덱스 - 1]이 -1(NO_SELECT)인 경우가 카테고리 선택 안 된 경우
    const lSelectorResult = lSelectorDOM.selectedIndex - 1;
    if (lSelectorResult !== NO_SELECT) {
        console.log("l");
        selectedGoodsIdsArr = selectedGoodsIdsArr.filter(function(goodsId) {
            return goodsInfoArr[goodsIdsArr.indexOf(goodsId)].l_category === lSelectorResult;
        });
        console.log(selectedGoodsIdsArr);
    }
    const sSelectorResult = sSelectorDOM.selectedIndex - 1;
    if (sSelectorResult !== NO_SELECT) {
        console.log("s");
        selectedGoodsIdsArr = selectedGoodsIdsArr.filter(function(goodsId) {
            return goodsInfoArr[goodsIdsArr.indexOf(goodsId)].s_category === sSelectorResult;
        });
        console.log(selectedGoodsIdsArr);
    }

    const saleSelectorInd = saleSelectorDOM.selectedIndex;
    if (saleUpperLimit[saleSelectorInd] !== NO_SELECT) {
        console.log("sale");
        selectedGoodsIdsArr = selectedGoodsIdsArr.filter(function(goodsId) {
            const salePercent = calcSale(goodsInfoArr[goodsIdsArr.indexOf(goodsId)]);

            if (saleSelectorInd === 1) 
                return salePercent < saleUpperLimit[1];
            else if (saleSelectorInd === saleUpperLimit.length - 1) 
                return salePercent >= saleUpperLimit[saleUpperLimit.length - 2];
            else   
                return salePercent < saleUpperLimit[saleSelectorInd] && salePercent >= saleUpperLimit[saleSelectorInd - 1];
        });
        console.log(selectedGoodsIdsArr);
    }
    const priceSelectorInd = priceSelectorDOM.selectedIndex;
    if (priceUpperLimit[priceSelectorInd] !== NO_SELECT) {
        console.log("price");
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
        console.log(selectedGoodsIdsArr);
    }

    // 정렬은 가장 마지막에 하는 것이 효과적, 모든 정렬에서 2차 정렬은 항상 데이터가 나중에 입력된 것부터 (최신순?)
    // const sortSelectorResult = sortKind[sortSelectorDOM.selectedIndex];
    // if (sortSelectorResult === SORT_LATEST) {

    // } else if (sortSelectorResult === SORT_DEAL_AMOUNT) {

    // } else if (sortSelectorResult === SORT_END_DATE) {
        
    // }

    // cardsDOMArr.forEach((card) => {  
    // }); 

    // 결과 적용 - 근데 정렬 있으면... 다른 함수도 추가적으로 불러야 함 ㄱ- 
    updateHideClass(selectedGoodsIdsArr);
}

function updateHideClass(selectedIdsArr) {
    console.log("update hide");

    for (let i = 0; i < goodsIdsArr.length; i++) {
        // 선택된 애가 감춰져 있는 경우, 해당 card에 js-hide 클래스 제거
        if (selectedIdsArr.includes(goodsIdsArr[i]) && cardsDOMArr[i].children[0].classList.contains("js-hide")) {
            console.log(`remove js-hide to ${goodsIdsArr[i]}`);
            cardsDOMArr[i].classList.add("col-lg-4", "col-md-6");
            cardsDOMArr[i].children[0].classList.remove("js-hide");
        }
        // 선택되지 않은 애가 보이는 경우, 해당 card에 js-hide 클래스 추가
        else if (!(selectedIdsArr.includes(goodsIdsArr[i])) && !(cardsDOMArr[i].children[0].classList.contains("js-hide"))) {
            console.log(`add js-hide to ${goodsIdsArr[i]}`);
            cardsDOMArr[i].classList.remove("col-lg-4", "col-md-6");
            cardsDOMArr[i].children[0].classList.add("js-hide");
        }
    }
}