class Scroller{
  #isScrolling    // 스크롤 상태 
  #scrollEndTimer // 스크롤 타이머 

  constructor(isScrolling){
    this.#isScrolling = isScrolling
    this.#scrollEndTimer = null 
  }
  getScrollPosition(){  // 현재 스크롤 위치 조회
    return window.pageYOffset
  }
  setScrollPosition(position){ // 해당 위치로 스크롤링
    window.scrollTo(position);
    this.#setScrollState(true)
  }
  getScrollState(){ // 스크롤 상태 조회 
    return this.#isScrolling
  }
  #setScrollState(state){ // 스크롤 상태 변경 
    this.#isScrolling = state 
  }
  isScrollended(){ // 스크롤이 끝났음을 감지
    return new Promise((resolve, reject) => {
      clearTimeout(this.#scrollEndTimer)
      this.#scrollEndTimer = setTimeout(() => {
        this.#setScrollState(false)
        resolve()
      }, 50)
    })
  }
}