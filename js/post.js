const scroller = new Scroller(false)

window.addEventListener("load", (event) => {
  // 테마변경 (다크모드/ 일반모드)
  const mode = document.querySelector('.mode')
  const icons = mode.querySelectorAll('.fa-solid')
  const header = document.querySelector('header')
  const footer = document.querySelector('.footer')

  const title = document.querySelector('.post-container .post-title input') // 추가
  const postContents = document.querySelector('.post-container .post-contents') // 추가
  const tagInput = document.querySelector('.post-container .post-tags input') // 추가

  mode.addEventListener('click', (event) => {
    document.body.classList.toggle('dark')
    header.classList.toggle('dark')

    title.classList.toggle('dark') // 추가 
    postContents.classList.toggle('dark') // 추가
    tagInput.classList.toggle('dark') // 추가 
    
    for(const icon of icons){
      icon.classList.contains('active') ? 
        icon.classList.remove('active') 
        : icon.classList.add('active')
    }
  })

  // 태그입력 기능
  const tagList = document.querySelector('.post-container .post-tags ul')
  // const tagInput = document.querySelector('.post-container .post-tags input') 
  const tagslimit = 10 // 태그 갯수 제한
  const tagLength = 10 // 태그 글자수 제한

  tagInput.addEventListener('keyup', function(event){
    console.log('태그 입력중...', event.key)
    
    const trimTag = this.value.trim()
    if(event.key === 'Enter' && trimTag !== '' && trimTag.length <= tagLength && tagList.children.length < tagslimit){
      const tag = document.createElement('li') // 태그 생성 
      tag.innerHTML = `#${trimTag}<a href='#'>x</a>`
      tagList.appendChild(tag) // 태그 추가
      this.value = '' // 태그 입력창 초기화
    }
  })

  // 태그 삭제 (이벤트 위임 사용)
  tagList.addEventListener('click', function(event){
    console.log(event.target, event.target.parentElement, event.target.hasAttribute('href'))

    event.preventDefault() // 삭제후 브라우저 상단으로 이동하는 문제 해결 
    if(event.target.hasAttribute('href')){ // 취소(x)를 클릭하는 경우 (a 태그인지 확인)
      tagList.removeChild(event.target.parentElement) // 클릭이 발생한 a 요소의 부모요소인 li 태그 삭제
    }
  })
})