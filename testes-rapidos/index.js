const btn = document.getElementById('btnAction');
const btnClose = document.getElementById('btnClose');
const modal = document.getElementById('modal');

btn.addEventListener('click', event=>{
	modal.classList.toggle('closed');
})

btnClose.addEventListener('click', event=>{
	modal.classList.toggle('closed');
})