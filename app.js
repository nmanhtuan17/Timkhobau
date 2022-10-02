const api = "https://63331d67433198e79dbfa3d4.mockapi.io/api/DatasGame"
const chests=document.querySelectorAll('.chest');
const ship=document.querySelector('.ship');
const map=document.querySelector('.main-map');
const quesBox=document.querySelectorAll('.ques-box');
const part_2=document.querySelector('.part__2-map')
const modal=document.querySelector('.modal-ques')
const trueAnswer=new Audio('./source/music/ting.mp3')
const failAnswer=new Audio('./source/music/fail.mp3')

const quesTitle=document.querySelector('.ques-title')
const ansTitle=document.querySelectorAll('.modal-answer')

const chestsPos=[]
const shipPos={
    y:Math.round(ship.getBoundingClientRect().top),
    x:Math.round(ship.getBoundingClientRect().left),
}
var isClear
var nowIndex
var mainData
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

function displayQues(index,data){
    const progress=document.querySelector('.time-line')
    var width=100
    progress.style.width='100%'
    const timing=setInterval(()=>{
        console.log(progress.style.width,isClear)
            if(isClear){
                clearInterval(timing)
                isClear = false
            }
        if(progress.style.width==='0.2%'){
            failAnswer.play()
            mainData[nowIndex].trueAns='null'
            clearInterval(timing)
            chests[nowIndex].src='./source/img/chest_close.png'
            setTimeout(()=>{
                chests[nowIndex].classList.remove('open')
                chests[nowIndex].classList.add('close')
                part_2.classList.add("d-flex");
                modal.classList.remove('d-flex');
            },2000);
        }
        width-=0.2;
        progress.style.width=width+'%';
    },50)
    
    part_2.classList.remove("d-flex");
    modal.classList.add('d-flex');
    quesTitle.innerHTML=data[index].ques
    ansTitle.forEach((item,i)=>{
        item.innerHTML=data[index].ans[i]
    })
    return 0;
}


function check(index){
    isClear = false;
    if(ansTitle[index].innerHTML===`${mainData[nowIndex].trueAns}`){         
        trueAnswer.play()
        chests[nowIndex].src='./source/img/chest_zero.png'
        mainData[nowIndex].trueAns='null'
        tingting(index)
        setTimeout(()=>{
            chests[nowIndex].classList.remove('open')
            part_2.classList.add("d-flex");
            modal.classList.remove('d-flex');
        },2000)
        isClear=true;
    }
    else{
        failAnswer.play()
        console.log(mainData[nowIndex].trueAns)
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

                item.style.pointerEvents='default';

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


getData(api,(datas)=>saveData(datas))
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