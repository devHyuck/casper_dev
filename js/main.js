const header = document.querySelector('.header');
const scrollButton = document.querySelector('.scroll-btn');

// 스크롤 다운 헤더 배경색 전환 이벤트
let isHeaderChange = false; // 헤더 클래스 변경을 한번만 하기 위한 변수

window.addEventListener('scroll', () => {
	let triggerPosition = window.innerHeight * 0.3;
	let currentPosition = window.scrollY;

	// 첫 화면에서의 30% 위치를 기준으로 헤더에 변화
	if (currentPosition >= triggerPosition && !isHeaderChange) {
		header.classList.add('active');
		isHeaderChange = true;
	} else if (currentPosition < triggerPosition && isHeaderChange) {
		header.classList.remove('active');
		isHeaderChange = false;
	}
});

// 메인 비주얼 스크롤 버튼 눌렀을때 스크롤 다운
scrollButton.addEventListener('click', () => {
	window.scrollTo({
		// 스크롤 이동 지점 (헤더가 화면을 가려서 헤더 크기만큼 뺌)
		top: window.innerHeight - header.offsetHeight,
		behavior: 'smooth',
	});
});

// --------------------
// 페이지 내 슬라이드 생성
// --------------------

// 메인 비주얼 슬라이드
const mainSlide = new Slide('.main-slide', {
	autoPlay: {
		time: 5000,
	},
	loop: true,
	navigation: {
		nextEl: '.slide-button-next',
		prevEl: '.slide-button-prev',
	},
	pagination: {
		el: '.slide-pagination',
	},
	autoPlayToggle: true,
});

// 이벤트 섹션 슬라이드
const eventSlide = new Slide('.event-slide', {
	autoPlay: true,
	loop: true,
	pauseOnMouseOver: true,
	navigation: {
		nextEl: '.slide-button-next',
		prevEl: '.slide-button-prev',
	},
	pagination: {
		el: '.slide-pagination',
	},
});

// 하단배너 슬라이드
const bottomSlide = new Slide('.notice-slide', {
	autoPlay: true,
	loop: true,
	pauseOnMouseOver: true,
	navigation: {
		nextEl: '.slide-button-next',
		prevEl: '.slide-button-prev',
	},
});
