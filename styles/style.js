function show(value) {
	document.querySelector('.val').value = value;
}

let drop = document.querySelector('.dropdown');

// dropdown.onclick = () => {
// 	dropdown.classList.toggle('active');
// };

drop.addEventListener('click', () => {
	drop.classList.toggle('active');
});

document.addEventListener('click', e => {
	if (!drop.contains(e.target)) {
		drop.classList.remove('active');
	}
});

document.querySelector('.dropdown').addEventListener('click', e => {
	e.stopPropagation();
});
