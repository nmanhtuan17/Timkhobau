var round2 = document.querySelector('.round_2')
var ques = document.querySelectorAll('.round2_ques img')
var modal_ques = document.querySelector('.round2_modal-ques')
for (const el of ques) {
    el.addEventListener('click',()=>{
        
        round2.classList.remove('on')
        modal_ques.classList.add('on')
    })
}