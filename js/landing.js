const scroller = new Scroller(false) // 스크롤 객체 생성 

window.addEventListener("load", (event) => {
  scroller.setScrollPosition({ top: 0, behavior: "smooth" })

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

  let lastScrollLocation = 0 // 최근 스크롤 위치 기억하기
  let index = 0 // 현재 메뉴를 선택하기 위한 인덱스 값 
   

  window.addEventListener('scroll', (event) => {
    
    // 스크롤이 끝났음을 감지하기
    scroller.isScrollended()
    .then(result => {
      console.log('scroll ended!')
      lastScrollLocation = scroller.getScrollPosition()  // 최근 스크롤 위치 저장
    })
    .catch(err => console.log('scrolling...'))
    

    // 스크롤이 어느정도 아래로 내려오면 헤더에 그림자 주기
    scroller.getScrollPosition() > header.offsetHeight ? 
      header.classList.add('active') 
      : header.classList.remove('active')

    sections.forEach(section => {
      // console.log(section.id, section.getBoundingClientRect().top, section.offsetHeight)

      const title = section.querySelector('.content h3') 
      const paragraph = section.querySelector('.content p')

      if(section.getBoundingClientRect().top < header.offsetHeight + 50){
        // 해당 섹션이 헤더에 가까워지면 해당 메뉴에 하이라이트 주기
        nav.querySelector('a.active').classList.remove('active')
        nav.querySelector(`a[href="#${section.id}"]`).classList.add('active')

        // 해당 섹션이 헤더에 가까워지면 텍스트 애니메이션 적용하기
        title.classList.add('show')
        paragraph.classList.add('show')
      }

      // 스크롤바가 브라우저 상단에 도달하면 텍스트 애니메이션 해제하기
      if(scroller.getScrollPosition() < 10){
        title.classList.remove('show')
        paragraph.classList.remove('show')
      }
    })

    const menus = nav.querySelectorAll('li a') 
    if(!scroller.getScrollState()){ // 스크롤이 멈춘 경우 
  
      // 스크롤시 이전, 다음 섹션으로 불연속적으로 이동하기
      if (scroller.getScrollPosition() > lastScrollLocation) {              // 스크롤을 내리는 경우 
        index++                                                             // 다음 메뉴
      } else {                                                              // 스크롤을 올리는 경우            
        index--                                                             // 이전 메뉴
      }
      if(index < 0) index = 0
      if(index > menus.length - 1) index = menus.length - 1

      // 스크롤링할때 이전/다음 메뉴를 프로그램적으로 클릭함으로써 해당 섹션으로 이동함   
      if(menus[index]){ // 이동할 이전/다음 섹션이 존재하는 경우
        menus[index].click() // 이미 작성된 a 태그의 클릭 이벤트에서 처리함
      }
    }
  })
})