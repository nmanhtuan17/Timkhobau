const api = "https://63331d67433198e79dbfa3d4.mockapi.io/api/DatasGame"
const main=document.querySelector('.main');

const chests=document.querySelectorAll('.chest');
const ship=document.querySelector('.ship');
const shipWave=document.querySelector('.ship-wave');
const wrapShipWave=document.querySelector('.wrap-ship-wave');
const map=document.querySelector('.main-map');
const quesBox=document.querySelectorAll('.ques-box');
const part_2=document.querySelector('.part__2-map')
const part_1=document.querySelector('.part__1')

const btnNext1=document.querySelector('.btn-next1');

const modal=document.querySelector('.modal-ques')
const trueAnswer=new Audio('./source/music/ting.mp3')
const failAnswer=new Audio('./source/music/fail.mp3')
const part_1Song=new Audio('./source/music/part1.mp3')
const beach=new Audio('./source/music/song.mp3')
beach.loop=true;
beach.volume=0.8;
part_1Song.loop=true;
part_1Song.volume=0.8;
const features=document.querySelectorAll('.feature')
const score=document.querySelector('.infor-score');
const quesTitle=document.querySelector('.ques-title')
const ansTitle=document.querySelectorAll('.modal-answer')

const inforTitle=document.querySelectorAll('.infor-title') 
const inputInfor=document.querySelectorAll('.body-input')
inputInfor[0].value=localStorage.getItem('name')?localStorage.getItem('name'):''
inputInfor[1].value=localStorage.getItem('msv')?localStorage.getItem('msv'):''
inputInfor[2].value=localStorage.getItem('_class')?localStorage.getItem('_class'):''
const btnStart=document.querySelector('.btn-start');
var myScore=0
var isClear
var nowIndex
var mainData



const chestsPos=[]
var shipPos={
 
}
function handleMusic(){
    if(features[1].classList.contains('fa-play')){
        part_1Song.play()
        features[1].classList.remove('fa-play')
        features[1].classList.add('fa-pause')
    }else{
        part_1Song.pause()
        features[1].classList.remove('fa-pause')
        features[1].classList.add('fa-play')
    }
}
document.addEventListener('keydown',(e)=>{
    if(e.key == "Enter"  ){
        handleMusic()
    }
})
features.forEach(feature=>{
    feature.addEventListener('click',()=>{
        handleMusic()
    })
})

btnStart.addEventListener('click',()=>{
    checkValidate()
    beach.play()

})
btnNext1.addEventListener('click',()=>{
    alert('Opps! chưa có vòng 2 nhé')
});
function startGame1(){
    localStorage.setItem('name',inputInfor[0].value)
    localStorage.setItem('msv',inputInfor[1].value)
    localStorage.setItem('_class',inputInfor[2].value)
    saveInfor(inputInfor[0].value,inputInfor[1].value,inputInfor[2].value)
    part_1.classList.remove('d-flex')
    part_2.classList.add('d-flex')
    part_1Song.volume=0.2;

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
function shipMove(x,y,i,data){
    console.log(x,y)
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

ansTitle[0].onclick=()=>{check(0)}
ansTitle[1].onclick=()=>{check(1)}
ansTitle[2].onclick=()=>{check(2)}
ansTitle[3].onclick=()=>{check(3)}

function displayQues(index,data){
    const progress=document.querySelector('.time-line')
    var width=100
    progress.style.width='100%'
    const timing=setInterval(()=>{
        if(isClear){
            clearInterval(timing)
            isClear = false
        }
        if(progress.style.width==='0.2%'){
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
                modal.classList.remove('d-flex');
                if(checkDone1()){
                    btnNext1.classList.add('d-block');
                }
            },2000);
        }
        width-=0.2;
        progress.style.width=width+'%';
    },20)
    
    part_2.classList.remove("d-flex");
    modal.classList.add('d-flex');
    quesTitle.innerHTML=data[index].ques
    ansTitle.forEach((item,i)=>{
        item.innerHTML=data[index].ans[i]
    })
    return 0;
}


function checkDone1(){
    var res=true
    chests.forEach((item)=>{
        if(item.classList.contains("open")){
            res= false;
        }
        console.log(res)
    })
    return res;
}
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
            modal.classList.remove('d-flex');
            if(checkDone1()){
                btnNext1.classList.add('d-block');
            }
        },2000)
        isClear=true;
        score.innerHTML=myScore
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
            modal.classList.remove('d-flex');
            if(checkDone1()){
                btnNext1.classList.add('d-block');
            }
        },2000)
        isClear=true;
        
    }
}

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
            wrapShipWave.classList.add('d-block');

            setTimeout(()=>{
                shipWave.classList.add('ship-move')
            },3000)
            setTimeout(()=>{
                wrapShipWave.classList.remove('d-block');

                startGame1()
            },7100)
        }
    })
}