const scroller = new Scroller(false) // 스크롤 객체 생성 

window.addEventListener("load", (event) => {
  // 테마변경 (다크모드/ 일반모드)
  const mode = document.querySelector('.mode')
  const icons = mode.querySelectorAll('.fa-solid')
  const header = document.querySelector('header')

  mode.addEventListener('click', (event) => {
    document.body.classList.toggle('dark')
    header.classList.toggle('dark')
    
    for(const icon of icons){
      icon.classList.contains('active') ? 
        icon.classList.remove('active') 
        : icon.classList.add('active')
    }
  })

  // 브라우저 상단으로 스크롤하기
  const arrowUp = document.querySelector('.footer .icons .scroll-up') // 위쪽 화살표 클릭 
  arrowUp.addEventListener('click', (event) => {
    history.pushState({}, "", `#`); // URL 주소 변경 
    scroller.setScrollPosition({top: 0, behavior: 'smooth'})
  })

  const logo = document.querySelector('header .logo') // 로고 클릭 
  logo.addEventListener('click', (event) => {
    event.preventDefault() // 부드러운 스크롤링
    history.pushState({}, "", `#`); // URL 주소 변경 
    scroller.setScrollPosition({top: 0, behavior: 'smooth'}) 
  })

  // 네비게이션 메뉴 클릭시 해당 섹션으로 스크롤하기
  const sections = document.querySelectorAll('section:not(.footer)') // 푸터를 제외한 section 엘리먼트 조회
  const nav = document.querySelector('.navbar ul')

  nav.querySelectorAll('li a').forEach(anchor => {
    anchor.addEventListener('click', function (event) {
      const section = this.getAttribute('href') // 네비게이션 메뉴에서 클릭한 섹션 
      const offsetToElementFromViewport = document.querySelector(section).getBoundingClientRect().top // 브라우저 상단에서 엘리먼트까지의 거리

      if(!scroller.getScrollState()){ // 스크롤링이 멈춘 경우만 해당 섹션으로 스크롤링
        event.preventDefault() // 부드러운 스크롤링 
        history.pushState({}, "", `${section}`);  // URL 주소에 #about, #story, #contact 과 같은 파라미터 추가해서 URL 변경하기

        const offsetToElementFromDocument = offsetToElementFromViewport + scroller.getScrollPosition() // 문서 상단에서 엘리먼트까지의 거리 
        scroller.setScrollPosition({
          top: offsetToElementFromDocument - header.offsetHeight - 10, // 헤더높이에서 10px 아래 위치로 스크롤링 
          behavior: "smooth",
        })
      }
    });
  });
})