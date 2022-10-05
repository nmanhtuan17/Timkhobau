const api = "https://63331d67433198e79dbfa3d4.mockapi.io/api/DatasGame"
const api2="https://63331d67433198e79dbfa3d4.mockapi.io/api/DatasUserGame"
const main=document.querySelector('.main');
const question2=["Chữ T: Tên gọi của khoa Công nghệ thông tin vào năm 2021? ","Chữ L: Khi cần chứng minh 1 bài toán, chúng ta cần đưa ra điều gì?","Chữ U: Từ nào dùng để chỉ việc đưa từ lí thuyết mà chúng ta có được đi vào thực tiễn?" ]
const chests=document.querySelectorAll('.chest');
const ship=document.querySelector('.ship');
const shipWave=document.querySelector('.ship-wave');
const wrapShipWave=document.querySelector('.wrap-ship-wave');
const map=document.querySelector('.main-map');
const quesBox=document.querySelectorAll('.ques-box');
const myChest=document.querySelector('.myChest')

const part_2=document.querySelector('.part__2-map')
const part_1=document.querySelector('.part__1');
const part_3=document.querySelector('.part__3-map');

const go=document.querySelector('.go')

const btnNext2=document.querySelector(".btn-next2")
const btnNext1=document.querySelector('.btn-next1');
const btnStart=document.querySelector('.btn-start');


const popupContainer=document.querySelectorAll('.popup-container');
const modal=document.querySelectorAll('.modal-ques')

const trueAnswer=new Audio('./source/music/ting.mp3')
const failAnswer=new Audio('./source/music/fail.mp3')
const part_1Song=new Audio('./source/music/part1.mp3')
const beach=new Audio('./source/music/song.mp3')
beach.loop=true;
beach.volume=0.8;
part_1Song.loop=true;
part_1Song.volume=0.8;

const features=document.querySelector('.feature');

const score=document.querySelectorAll('.infor-score');
const quesTitle=document.querySelectorAll('.ques-title');
const ansTitle=document.querySelectorAll('.modal-answer');

const progress=document.querySelectorAll('.time-line')
const inforTitle=document.querySelectorAll('.infor-title') 
const inputInfor=document.querySelectorAll('.body-input')

inputInfor[0].value=localStorage.getItem('name')?localStorage.getItem('name'):''
inputInfor[1].value=localStorage.getItem('msv')?localStorage.getItem('msv'):''
inputInfor[2].value=localStorage.getItem('_class')?localStorage.getItem('_class'):''
var isRegist=localStorage.getItem('isRegist')?true:false
console.log(isRegist)
var myScore=0
var isClear
var nowIndex
var mainData
var users
// PUT request data to api
function updateData(api,data){
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
    fetch(`${api}/1`, requestOptions)
}
getData(api2,(datas)=>{
    users=datas
    
})
// -------------------------------------------------

const chestsPos=[]
var shipPos={
 
}
function handleMusic(){
    if(features.classList.contains('fa-play')){
        part_1Song.play()
        features.classList.remove('fa-play')
        features.classList.add('fa-pause')
    }else{
        part_1Song.pause()
        features.classList.remove('fa-pause')
        features.classList.add('fa-play')
    }
}
document.addEventListener('keydown',(e)=>{
    console.log(e.key);
    if(e.key == "Enter"){
        handleMusic()
    }
    if(e.key == "Shift"){
        if(beach.duration > 0 && !beach.paused){
            beach.pause();
        }
        else{
            beach.play();
        }
    }
})
features.addEventListener('click',()=>{
        handleMusic()
})

btnStart.addEventListener('click',()=>{
    checkValidate()
  
})
btnNext1.addEventListener('click',()=>{
    animShip("Đuổi theo hòm kho báu đang trôi dạt vào đảo tri thức!",2,2000,6000,10000)
});
btnNext2.addEventListener('click',()=>{
    animShip("Tiến tơi đảo chiến thắng nào!",3,2000,5000,9000)
});
function startGame1(){
    localStorage.setItem('name',inputInfor[0].value)
    localStorage.setItem('msv',inputInfor[1].value.toUpperCase())
    localStorage.setItem('_class',inputInfor[2].value.toUpperCase())

    localStorage.setItem('isRegist',true);
    
    console.log(isRegist)
    
    if(isRegist===false){
        const myData={
            name:inputInfor[0].value,
            msv:inputInfor[1].value.toUpperCase(),
            myclass:inputInfor[2].value.toUpperCase()
        }
        users[0].data.push(myData)
        console.log(users[0].data)
        updateData(api2,users[0])
    }
    saveInfor(inputInfor[0].value,inputInfor[1].value.toUpperCase(),inputInfor[2].value.toUpperCase())
    part_1.classList.remove('d-flex')
    part_2.classList.add('d-flex')
    shipPos={
        y:Math.round(ship.getBoundingClientRect().top),
        x:Math.round(ship.getBoundingClientRect().left),
    }

    getData(api,(datas)=>saveData(datas))
}

function saveInfor(name,msv,_class){
    inforTitle[0].innerHTML=name
    inforTitle[1].innerHTML=msv
    inforTitle[2].innerHTML=_class
}
// thuyen di chuyen
function shipMove(x,y,i,data){
    ship.style.transform =` translate(${x-shipPos.x-10}px,${y-shipPos.y-10}px)`;
    const myTime=setTimeout(()=>{
        const checkY=Math.round(ship.getBoundingClientRect().top)===y-10
        const checkX=Math.round(ship.getBoundingClientRect().left)===x-10
        if(checkX&&checkY){
            if(chests[i].classList.contains('open')){
                nowIndex=i;
                displayQues(i,data)
               
            }
            else
                if(chests[i].classList.contains('close'))
                    displayFail('Ôi không! Kho báu này đã đóng, chúng ta không thể lấy nó !!')
                else
                    displayFail('Ôi không! Kho báu này chúng ta đã lấy rồi !!')
                      
        }
    },1500)
}

function displayFail(content){
    const modalFalse=document.querySelector('.modal-failure');
    const modalFalseBody=document.querySelector('.modal-body');
    modalFalseBody.innerHTML = content;
    modalFalse.classList.add('d-block');
    const btnOops=document.querySelector('.btn-oops');
    btnOops.addEventListener('click',()=>{
        modalFalse.classList.remove('d-block');
    })

}
// click cau trl
ansTitle[0].onclick=()=>{check(0)}
ansTitle[1].onclick=()=>{check(1)}
ansTitle[2].onclick=()=>{check(2)}
ansTitle[3].onclick=()=>{check(3)}
// render question
function displayQues(index,data){
   
    var width=100
    progress[0].style.width='100%'
    const timing=setInterval(()=>{
        if(isClear){
            clearInterval(timing)
            isClear = false
        }
        if(progress[0].style.width==='0.2%'){
            failAnswer.play()
            if(mainData[nowIndex].trueAns[0]==='A'){
                tingting(0)
            }
            if(mainData[nowIndex].trueAns[0]==='B'){
                tingting(1)
            }
            if(mainData[nowIndex].trueAns[0]==='C'){
                tingting(2)
            }
            if(mainData[nowIndex].trueAns[0]==='D'){
                tingting(3)
            }
            mainData[nowIndex].trueAns='null'
            clearInterval(timing)
            chests[nowIndex].src='./source/img/chest_close.png'
            setTimeout(()=>{
                chests[nowIndex].classList.remove('open')
                chests[nowIndex].classList.add('close')
                part_2.classList.add("d-flex");
                modal[0].classList.remove('d-flex');
                if(checkDone1()){
                    btnNext1.classList.add('d-block');
                }
            },2000);
        }
        width-=0.2;
        progress[0].style.width=width+'%';
    },20)
    
    part_2.classList.remove("d-flex");
    modal[0].classList.add('d-flex');
    quesTitle[0].innerHTML=data[index].ques
    ansTitle.forEach((item,i)=>{
        item.innerHTML=data[index].ans[i]
    })
    return 0;
}

// kiem tra hoan thanh game 1
function checkDone1(){
    var res=true
    chests.forEach((item)=>{
        if(item.classList.contains("open")){
            res= false;
        }
        
    })
    return res;
}
// kiem tra xem dung sai
function check(index){
    isClear = false;
    if(ansTitle[index].innerHTML===`${mainData[nowIndex].trueAns}`){         
        trueAnswer.play()
        myScore+=10;
        chests[nowIndex].src='./source/img/chest_zero.png'
        mainData[nowIndex].trueAns='null'
        tingting(index)
        setTimeout(()=>{
            chests[nowIndex].classList.remove('open')
            part_2.classList.add("d-flex");
            modal[0].classList.remove('d-flex');
            if(checkDone1()){
                btnNext1.classList.add('d-block');
            }
        },2000)
        isClear=true;
        score[0].innerHTML=myScore
    }
    else{
        failAnswer.play()
        if(mainData[nowIndex].trueAns[0]==='A'){
            tingting(0)
        }
        if(mainData[nowIndex].trueAns[0]==='B'){
            tingting(1)
        }
        if(mainData[nowIndex].trueAns[0]==='C'){
            tingting(2)
        }
        if(mainData[nowIndex].trueAns[0]==='D'){
            tingting(3)
        }
        mainData[nowIndex].trueAns='null'
        chests[nowIndex].src='./source/img/chest_close.png'
        setTimeout(()=>{
            chests[nowIndex].classList.remove('open')
            chests[nowIndex].classList.add('close')
            part_2.classList.add("d-flex");
            modal[0].classList.remove('d-flex');
            if(checkDone1()){
                btnNext1.classList.add('d-block');
            }
        },2000)
        isClear=true;
        
    }
}
// am thanh chien thang
function tingting(index){
    ansTitle[index].innerHTML+=`<i class="fa-solid fa-check ting"></i>`
    ansTitle.forEach((item,i)=>{
        if(i!==index){
            item.style.filter='brightness(40%)'
            item.style.pointerEvents='none'
            setTimeout(()=>{
                item.style.pointerEvents='auto';
                item.style.filter='brightness(100%)'
                
            },2000)
        }
    })
}


function getData(api,callback){
    fetch(api)
        .then((response) => response.json())
        .then(callback);
}


function saveData(datas){
    var data
    data=datas
    data.forEach((item)=>{
        item.trueAns=atob(item.trueAns);
    })
    const mainData=data
    handleGetData(mainData)
}

function handleGetData(data){

    // lay vi tri cua ruong
    chests.forEach((chest)=>{
        var pos={
            y:Math.round(chest.getBoundingClientRect().top),
            x:Math.round(chest.getBoundingClientRect().left),
        }
        chestsPos.push(pos)
    })
    
    quesBox.forEach((quesBox,i)=>{
        quesBox.addEventListener('click',()=>{
            shipMove(chestsPos[i].x,chestsPos[i].y,i,data)
        })
    });
    mainData=data
}

function checkValidate(){
    var isContinue=true
    const message=document.querySelectorAll('.message')
    inputInfor.forEach((item,i)=>{
        if(item.value===''){
            message[i].innerHTML='Không bỏ trống trường này!';
            isContinue=false
            return;
        }
        else{
            message[i].innerHTML=''
        }
        if((i==2) && (isContinue===true)){
            beach.play()
            part_1Song.volume=0.2;
           animShip("Tiến lên thuyền trưởng!",1,2000,5000,9000)
        }
    })
}
function animShip(content,where,time1,time2,time3){
    if(where==2){
        myChest.classList.add('d-block');
    }
    go.innerHTML=content
    wrapShipWave.classList.add('d-block');
    shipWave.classList.add('d-block');
    shipWave.classList.add('ship-move1');
    setTimeout(()=>{
        if(where==2){
            myChest.classList.add('ship-move2');
        }
        shipWave.classList.remove('ship-move1');
        go.classList.add('d-block');
    },time1)
    setTimeout(()=>{
        if(where==2){
            myChest.classList.remove('d-block');
        }
        if(where==2){
            myChest.classList.remove('ship-move2');
        }
        shipWave.classList.add('ship-move2');
        go.classList.remove('d-block');
    },time2)
    setTimeout(()=>{
        wrapShipWave.classList.remove('d-block');
        shipWave.classList.remove('ship-move2');
        if(where ===1){
            startGame1()
        }
        if(where ===2){
            startGame2()
        }
        if(where ===3){
            finish()
        }
    },time3)
}
function startGame2(){
    const ship3=document.querySelector('.part_3-ship');
    const chest3=document.querySelector('.part_3-chest');
    part_2.classList.remove('d-flex');
    part_3.classList.add('d-flex');
    const shipPos3={
        y:Math.round(ship3.getBoundingClientRect().top),
        x:Math.round(ship3.getBoundingClientRect().left)
    }
    const ruongPos={
        y:Math.round(chest3.getBoundingClientRect().top),
        x:Math.round(chest3.getBoundingClientRect().left)
    }
    ship3.style.transform =` translate(${ruongPos.x-shipPos3.x-10}px,${ruongPos.y-shipPos3.y-20}px)`;
    setTimeout(() => {
        const checkY1=Math.round(ship3.getBoundingClientRect().top)===ruongPos.y-20
        const checkX1=Math.round(ship3.getBoundingClientRect().left)===ruongPos.x-10
        if(checkX1&&checkY1){
            const popup=document.querySelector('.popup');
            popup.classList.add('d-flex');
            handleGame2();
        }
    },3000)
    
}

// game 2------------------------------------------------------
function handleGame2(){
    isClear=false;
    popupContainer.forEach((item,index)=>{
        item.addEventListener('click',()=>{
            var width=100
            progress[1].style.width='100%'
            const timing=setInterval(()=>{
                if(isClear){
                    clearInterval(timing)
                    isClear = false
                }
                if(progress[1].style.width==='0.2%'){
                    const valueGame2=document.querySelector(".input-ans-2").value;
                    checkGame2(index,valueGame2.toLowerCase())
                    clearInterval(timing)
                }
                width-=0.2;
                progress[1].style.width=width+'%';
            },20)
            modal[1].classList.add('d-flex');
            quesTitle[1].innerHTML=question2[index];
            enterAnswer(index);
        });
    })
}
function enterAnswer(index){
    const btnGame2=document.querySelector('.btn-game2');
    btnGame2.onclick=()=>{
        isClear = true;
        const valueGame2=document.querySelector(".input-ans-2").value;
        checkGame2(index,valueGame2.toLowerCase())
    }
       
        
}
function checkGame2(index,value){
    if(index===0){
        if (value==="toan tin"||value==="toán tin"){
            done(index,1);
            myScore+=10;
        }
        else{
            done(index,0);
        }
    }
    if(index===1){
        if (value==="lap luan" || value==="lập luận"){
            done(index,1);
            myScore+=10;
        }
        else{
            done(index,0);
        }
    }
    if(index===2){
        if (value==="ung dung"||value==="ứng dụng"){
            done(index,1);
            myScore+=10;
        }
        else{
            done(index,0);
        }
    }
}
function done(index,flag){
    popupContainer[index].style.pointerEvents="none";
    popupContainer[index].classList.add("done");
    popupContainer[index].style.filter="brightness(70%)";
    score[1].innerHTML=myScore
    flag===1?trueAnswer.play():failAnswer.play();
    setTimeout(()=>{
        modal[1].classList.remove('d-flex');
        if(checkFinish()){
            btnNext2.classList.add('d-block');
        }
    },3000);
    if(index===0){
        quesTitle[1].innerHTML="Đáp án: Toán Tin";
    }
    if(index===1){
        quesTitle[1].innerHTML="Đáp án: Lập luận";
    }
    if(index===2){
        quesTitle[1].innerHTML="Đáp án: Ứng dụng";
    }
}
function checkFinish(){
    var res=true
    popupContainer.forEach((item)=>{
        console.log(item.classList.contains("done"))
        if(!item.classList.contains("done")){
            res=false;
        }
        
    })
    return res;
}

//----------------------------------------------------------------
import confetti from "https://cdn.skypack.dev/canvas-confetti";

function phaohoa(){
    setInterval(() => {
        confetti({
            articleCount: 100,
            spread: 150,
            origin: {
                x: 0.4,
    
                y: 0.4
              },
            ticks:400
        });
        
    }, 3000);
}
function finish(){
    part_3.classList.remove('d-flex');
    const finish=document.querySelector('.finish');
    const shipFinish=document.querySelector('.finish-ship');
    const flagFinish=document.querySelector('.flag-tlit');
    finish.classList.add('d-block');
    phaohoa()
    const shipFinishPos={
        y:Math.round(shipFinish.getBoundingClientRect().top),
        x:Math.round(shipFinish.getBoundingClientRect().left)
    }
    const flagFinishPos={
        y:Math.round(flagFinish.getBoundingClientRect().top),
        x:Math.round(flagFinish.getBoundingClientRect().left)
    }

    shipFinish.style.transform =` translate(${flagFinishPos.x-shipFinishPos.x-720}px,${flagFinishPos.y-shipFinishPos.y}px)`;
    setTimeout(() => {
        const checkY1=Math.round(shipFinish.getBoundingClientRect().top)===flagFinishPos.y
        const checkX1=Math.round(shipFinish.getBoundingClientRect().left)===flagFinishPos.x-720
        if(checkX1&&checkY1){
            bxhOpen();
        }
    },6000)
}
function bxhOpen(){
    const bxhBox=document.querySelector('.finish-score-table')
    bxhBox.classList.add('d-block')
}