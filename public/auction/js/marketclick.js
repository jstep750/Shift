document.getElementById("marketTitle").innerText = "마켓-"+ "Sid Meier's Civilization VI"
//위에 이렇게 상품 이름 들어가게
var optionNum = 0;
var addiOptionNum = 0;
//사용자가 설정한 옵션의 수량, 그리고 추가옵션의 수량
const hashTag = document.getElementById("hashTag");
var tag = ["#상품","#게임"];
var hashTagNum = tag.length;
for(var i = 0;i < hashTagNum;i++){
    hashTag.innerText += tag[i];
}
//해쉬태그, 서버에서 해쉬태그 정보 가져와서 추가하면 될듯
document.getElementById("productImg").innerHTML
='<img id="productImg" class="img-square" src="../img/shift/warlord_gandhi.jpg">'
//상품 이미지. 이것도 서버에서 가져오기. src부분 수정하면 될듯
var optionCost = 28000;
var addiOptionCost = 20000;
//서버에서 가져오는 옵션의 가격, 그리고 추가옵션의 가격
document.getElementById("productName").innerText="Sid Meier's Civilization VI";
document.getElementById("productSub").innerText="전쟁광을 피해 살아남아라";
document.getElementById("term").innerText = "21.04.21~21.06.21";
document.getElementById("productExp").innerText = "살려주세요 전 암것도 안했어요 옆에 있단 죄밖에 없는데 왜 공개비난 하세요 안돼요 싫어요 상인보내지 마세요"
//서버에서 가져오는 마켓상품의 이름,서브 이름, 상품 구매 가능 기간, 그리고 상품에 관한 설명
const optionGaesu = document.getElementById("optionGaesu");
const addiOptionGaesu = document.getElementById("addiOptionGaesu");
optionGaesu.innerText=optionNum;
addiOptionGaesu.innerText=addiOptionNum;
//버튼 내부의 개수 기본 설정
function addOptionNum(){
    optionNum++;
    optionGaesu.innerText=optionNum;
}
function subOptionNum(){
    if(optionNum>0){
        optionNum--;
        optionGaesu.innerText=optionNum;
    }
    else{
        alert("옵션 수량이 0개입니다!");
    }
}
function addAddiOptionNum(){
    addiOptionNum++;
    addiOptionGaesu.innerText = addiOptionNum;
}
function subAddiOptionNum(){
    if(addiOptionNum>0){
        addiOptionNum--;
        addiOptionGaesu.innerText = addiOptionNum;
    }
    else{
        alert("추가옵션 수량이 0개입니다!");
    }  
}