const scroller = new Scroller(false) // 스크롤 객체 생성 

window.addEventListener("load", (event) => {
  // 테마변경 (다크모드/ 일반모드)
  const mode = document.querySelector('.mode')
  const icons = mode.querySelectorAll('.fa-solid')
  const header = document.querySelector('header')
  const categoryContainer =  document.querySelector('.category-container') // 추가된 부분

  mode.addEventListener('click', (event) => {
    document.body.classList.toggle('dark')
    header.classList.toggle('dark')
    categoryContainer.classList.toggle('dark') // 추가된 부분 
    
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
})