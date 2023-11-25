function show(value) {
	document.querySelector('.val').value = value;
}

let drop = document.querySelector('.dropdown');

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

// KARUSELKA

const carousel = document.querySelector('.carousel');
firstImg = carousel.querySelectorAll('img')[0];
arrowIcons = document.querySelectorAll('.wrapper i');

let isDragStart = false,
	prevPageX,
	prevScrollLeft;
let firstImgWidth = firstImg.clientWidth + 18;
let scrollWidth = carousel.scrollWidth - carousel.clientWidth;

const showHideIcons = () => {
	let scrollWidth = carousel.scrollWidth - carousel.clientWidth;
	if (carousel.scrollLeft == 0) {
		arrowIcons[0].style.display = 'none';
	} else {
		arrowIcons[0].style.display = 'block';
	}
	if (carousel.scrollLeft == scrollWidth) {
		arrowIcons[1].style.display = 'none';
	} else {
		arrowIcons[1].style.display = 'block';
	}
};

arrowIcons.forEach(icon => {
	icon.addEventListener('click', () => {
		if (icon.id == 'left') {
			carousel.scrollLeft -= firstImgWidth;
		} else {
			carousel.scrollLeft += firstImgWidth;
		}
		setTimeout(() => showHideIcons(), 60);
	});
});

const dragStart = e => {
	isDragStart = true;
	prevPageX = e.pageX;
	prevScrollLeft = carousel.scrollLeft;
};

const dragging = e => {
	if (!isDragStart) return;
	e.preventDefault();
	carousel.classList.add('dragging');
	let = positionDiff = e.pageX - prevPageX;
	carousel.scrollLeft = prevScrollLeft - positionDiff;
	showHideIcons();
};

const dragStop = () => {
	isDragStart = false;
	carousel.classList.remove('dragging');
};

carousel.addEventListener('mousedown', dragStart);
carousel.addEventListener('mousemove', dragging);
carousel.addEventListener('mouseup', dragStop);
carousel.addEventListener('mouseleave', dragStop);
