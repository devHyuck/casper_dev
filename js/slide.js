class Slide {
	constructor(selector, options) {
		// 슬라이드 기본 요소
		this.slideContainer = document.querySelector(selector);
		this.slideList = this.slideContainer.querySelector('.slide-list');
		this.slides = this.slideList.querySelectorAll('.slide-item');
		// 슬라이드 현재 인덱스
		this.currentIndex = 0;
		// 슬라이드 옵션
		this.options = {
			loop: false,
			autoPlay: false,
			pauseOnMouseOver: false,
			autoPlayToggle: false,
			...options,
		};
		this.init();
	}

	init() {
		// 슬라이드 셋업
		this.setSlide();
		// 슬라이드 크기 정수화 (css오류 예방)
		this.adjustSlideWidths(); // 초기 너비 조정
		window.addEventListener('resize', () => this.adjustSlideWidths()); // 창 크기 변경에 반응

		// 슬라이드 순환 설정
		if (this.options.loop) {
			this.setLoopSlide();
		}

		// 자동재생 설정
		if (this.options.autoPlay) {
			this.startAutoPlay();
		}

		// 자동재생 토글 마우스 Hover 설정
		if (this.options.pauseOnMouseOver) {
			this.pauseOnHover();
		}

		// 슬라이드 화살표 설정
		if (this.options.navigation) {
			this.setNavigation();
		}

		// 슬라이드 페이지네이션 설정
		if (this.options.pagination) {
			this.setPagination();
		}

		// 자동재성 토글버튼 옵션
		if (this.options.autoPlayToggle) {
			this.setAutoPlayToggle();
		}
	}

	// ---------------
	// 슬라이드 이동 함수
	// ---------------

	// 다음으로 넘기기
	moveNext() {
		// loop 옵션 적용 및 첫번째 슬라이드 클론까지 순환 뒤의 동작
		if (this.options.loop && this.currentIndex === this.slides.length - 1) {
			// 딜레이 없이 실제 첫번째 슬라이드로 이동
			this.slideList.style.transition = 'none';
			this.currentIndex = 1;
			this.moveToSlide(this.currentIndex);
			// 애니메이션 복구 후 다음 슬라이드로 이동
			requestAnimationFrame(() => {
				this.slideList.style.transition = '';
				this.moveNext();
			});
			// 기본 옵션 동작 (마지막 슬라이드 이상으로는 이동불가)
		} else if (this.currentIndex < this.slides.length - 1) {
			this.currentIndex++;
			this.moveToSlide(this.currentIndex);
		}
	}

	// 이전으로 넘기기
	movePrev() {
		// loop 옵션 적용 및 마지막 슬라이드 클론까지 순환 뒤의 동작
		if (this.options.loop && this.currentIndex === 0) {
			// 딜레이 없이 실제 마지막 슬라이드로 이동
			this.slideList.style.transition = 'none';
			this.currentIndex = this.slides.length - 1;
			this.moveToSlide(this.currentIndex);
			// 애니메이션 복구 후 이전 슬라이드로 이동
			requestAnimationFrame(() => {
				this.slideList.style.transition = '';
				this.movePrev();
			});
			// 기본 옵션 동작 (첫번째 슬라이드 이전으로는 이동불가)
		} else if (this.currentIndex > 0) {
			this.currentIndex--;
			this.moveToSlide(this.currentIndex); // 이전 슬라이드로 이동
		}
	}

	// 슬라이드 동작 함수
	moveToSlide(index) {
		this.currentIndex = index;
		const offset = -(index * 100);
		this.slideList.style.transform = `translateX(${offset}%)`;
		this.updatePagination();
	}

	// ---------------
	// 슬라이드 기본 함수
	// ---------------

	// 슬라이드 셋업 함수
	setSlide() {
		this.slideContainer.classList.add('slide-container');
		const track = document.createElement('div');
		track.classList.add('slide-track');
		track.appendChild(this.slideList);
		this.slideContainer.appendChild(track);
	}

	// 슬라이드 크기 정수화 함수
	adjustSlideWidths() {
		const containerWidth = Math.round(this.slideContainer.clientWidth);
		const slideTrack = this.slideContainer.querySelector('.slide-track');
		slideTrack.style.width = `${containerWidth}px`;
	}
	// ---------------
	// 슬라이드 옵션 함수
	// ---------------

	// 슬라이드 순환 함수
	setLoopSlide() {
		// 첫번째와 마지막 슬라이드 클론생성
		const firstSlideClone = this.slides[0].cloneNode(true);
		const lastSlideClone = this.slides[this.slides.length - 1].cloneNode(true);
		// 슬라이드 양 끝에 클론배치
		this.slideList.appendChild(firstSlideClone);
		this.slideList.insertBefore(lastSlideClone, this.slideList.firstChild);
		// 슬라이드 리스트 업데이트
		this.slides = this.slideContainer.querySelectorAll('.slide-item');
		this.currentIndex++;
		// 슬라이드 이동
		this.moveToSlide(this.currentIndex);
	}

	// 자동재생 함수
	startAutoPlay() {
		let interval = 3000; // 기본값
		// time 옵션 값 검사
		if (typeof this.options.autoPlay.time === 'number') {
			interval = this.options.autoPlay.time;
		} else if (this.options.autoPlay.time || typeof this.options.autoPlay.time == !'number') {
			console.warn('autoPlay.time 옵션을 number로 입력하세요. 현재 기본값:', interval);
		}
		this.autoPlayTimer = setInterval(() => this.moveNext(), interval);
	}

	// 자동재생 중지 함수
	stopAutoPlay() {
		clearInterval(this.autoPlayTimer);
	}

	// 자동재생 토글 마우스 Hover 함수
	pauseOnHover() {
		if (this.options.autoPlay) {
			this.slideContainer.addEventListener('mouseenter', () => this.stopAutoPlay());
			this.slideContainer.addEventListener('mouseleave', () => this.startAutoPlay(this.options.autoPlay.time));
		} else {
			console.warn(
				'autoPlay 옵션이 설정되지 않았습니다. pauseOnMouseOver 옵션은 autoPlay 옵션 설정 후 사용 가능합니다.'
			);
		}
	}

	// 슬라이드 화살표 지정 함수
	setNavigation() {
		if (this.options.navigation.nextEl && this.options.navigation.prevEl) {
			const nextBtn = this.slideContainer.querySelector(this.options.navigation.nextEl);
			const prevBtn = this.slideContainer.querySelector(this.options.navigation.prevEl);
			nextBtn.classList.add('slide-button');
			prevBtn.classList.add('slide-button');
			nextBtn.addEventListener('click', () => this.moveNext());
			prevBtn.addEventListener('click', () => this.movePrev());
		} else {
			console.error('navigation.nextEl, navigation.prevEl 옵션을 입력하세요');
		}
	}

	// 페이지네이션 셋업 함수
	setPagination() {
		// 페이지네이션 요소지정 여부 검사
		if (this.options.pagination.el) {
			const pagination = this.slideContainer.querySelector(this.options.pagination.el); // 페이지네이션 컨테이너
			// 슬라이드 갯수 (loop 설정이 있는 경우 클론 숫자를 제외)
			const slidesCount = this.options.loop ? this.slides.length - 2 : this.slides.length;
			// 페이지네이션 불릿 생성
			for (let i = 0; i < slidesCount; i++) {
				const bullet = document.createElement('button');
				bullet.classList.add('slide-bullet');
				// 불릿 클릭시 해당 슬라이드로 이동 (loop 옵션 적용시 불릿 인덱스에 + 1)
				bullet.addEventListener('click', () => this.moveToSlide(i + (this.options.loop ? 1 : 0)));
				pagination.appendChild(bullet);
			}
			this.updatePagination();
		} else {
			console.error('pagination.el 옵션을 입력하세요');
		}
	}

	// // 페이지네이션 업데이트 함수
	updatePagination() {
		const bullets = this.slideContainer.querySelectorAll('.slide-bullet');
		// loop 옵션 적용시 인덱스 조정
		let activeIndex = this.currentIndex - (this.options.loop ? 1 : 0);
		// 첫 번째 클론(마지막 실제 슬라이드의 클론)일 경우
		if (this.options.loop && this.currentIndex === 0) {
			activeIndex = this.slides.length - 3; // 마지막 실제 슬라이드의 인덱스
		}
		// 마지막 클론(첫 번째 실제 슬라이드의 클론)일 경우
		else if (this.options.loop && this.currentIndex === this.slides.length - 1) {
			activeIndex = 0; // 첫 번째 실제 슬라이드의 인덱스
		}

		bullets.forEach((bullet, index) => {
			if (index === activeIndex) {
				bullet.classList.add('active');
			} else {
				bullet.classList.remove('active');
			}
		});
	}

	// 슬라이드 자동재생 토글버튼 생성 함수
	setAutoPlayToggle() {
		// autoPlay 옵션 활성화 여부 검사
		if (this.options.autoPlay) {
			const pagination = this.slideContainer.querySelector('.slide-pagination');
			const togglePlayButton = document.createElement('button');
			togglePlayButton.classList.add('toggle-play-button', 'active');
			pagination.appendChild(togglePlayButton);

			// autoPlay 원래 설정 저장
			const originalAutoPlaySetting = { ...this.options.autoPlay };

			// 토글버튼 기능
			togglePlayButton.addEventListener('click', () => {
				if (this.options.autoPlay) {
					this.stopAutoPlay();
					// autoPlay 옵션 비활성화
					this.options.autoPlay = false;
					togglePlayButton.classList.remove('active');
				} else {
					// 자동재생을 다시 활성화할 때 원래 설정 복원
					this.options.autoPlay = originalAutoPlaySetting;
					this.startAutoPlay();
					togglePlayButton.classList.add('active');
				}
			});
		} else {
			console.warn('autoPlay 옵션이 설정되지 않았습니다. autoPlayToggle 옵션은 autoPlay 옵션 설정 후 사용 가능합니다.');
		}
	}
}
