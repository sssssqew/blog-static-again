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

  // 파일입력 처리하기
  postContents.focus() // 첫로딩때 커서 보여주기
  postContents.insertAdjacentElement('afterbegin', createNewline()) // 첫번째 줄에 새로운 공백라인 추가 
  let lastCaretLine = postContents.firstChild // 아웃포커싱될때 첫번째 줄을 마지막 커서 위치로 설정
  const uploadInput = document.querySelector('.upload input')
  uploadInput.addEventListener('change', function(event){
    const files = this.files

    if(files.length > 0){
      for(const file of files){
        const fileType = file.type 

        if(fileType.includes('image')){
          console.log('image')
          const img = document.createElement('img')   
          img.src = URL.createObjectURL(file) // 업로드한 파일의 임시경로 (이미지 경로)
          lastCaretLine = addFileToCurrentLine(lastCaretLine, img) // 편집기의 마지막 커서 위치에 파일 추가 
        }else if(fileType.includes('video')){
          console.log('video')
          const video = document.createElement('video')
          video.className = 'video-file'
          video.controls = true
          video.src = URL.createObjectURL(file)
          lastCaretLine = addFileToCurrentLine(lastCaretLine, video)
        }else if(fileType.includes('audio')){
          console.log('audio')
          const audio = document.createElement('audio')
          audio.className = 'audio-file'
          audio.controls = true
          audio.src = URL.createObjectURL(file)
          lastCaretLine = addFileToCurrentLine(lastCaretLine, audio)
        }else{
          console.log('file')
          const div = document.createElement('div')
          div.className = 'normal-file'
          div.contentEditable = false 
          div.innerHTML = `
            <div class='file-icon'>
              <span class="material-icons">folder</span>
            </div>
            <div class='file-info'>
              <h3>${getFileName(file.name, 70)}</h3>
              <p>${getFileSize(file.size)}</p>
            </div>
          `
          lastCaretLine = addFileToCurrentLine(lastCaretLine, div) // 에디터에 파일추가 및 파일이 추가될때마다 커서위치 업데이트하기
        }
      }
      // 커서위치를 맨 마지막으로 추가된 파일 아래쪽에 위치시키기
      const selection = document.getSelection()
      selection.removeAllRanges()

      console.log(lastCaretLine)
      const range = document.createRange()
      range.selectNodeContents(lastCaretLine)
      range.collapse()
      selection.addRange(range) 

      postContents.focus() // 파일을 모두 업로드한 후 커서 보여주기
    }
  })
  // blur일때 마지막 커서 위치의 엘리먼트 저장하기
  postContents.addEventListener('blur', function(event){ 
    lastCaretLine = document.getSelection().anchorNode // 편집기 내부 커서가 위치한 곳의 엘리먼트 
    console.log(lastCaretLine.parentNode, lastCaretLine, lastCaretLine.length)
  })

  function createNewline(){
    const newline = document.createElement('div')
    newline.innerHTML = `<br/>`
    return newline
  }
  // blur 일때 마지막 커서 위치 바로 아래쪽에 새로운 줄을 생성하고 파일을 추가함
  // 파일 추가후 다시 아래쪽에 새로운 줄 생성함
  function addFileToCurrentLine(line, file){
    if(line.nodeType === 3) line = line.parentNode // 커서 위치에 글자가 있는 경우 line 은 텍스트노드기 때문에 insertAdjacentElement 적용하지 못함 (부모는 div 엘리먼트라 적용가능)
    line.insertAdjacentElement("afterend", createNewline())   // 추가
    line.nextSibling.insertAdjacentElement("afterbegin", file)  
    line.nextSibling.insertAdjacentElement("afterend", createNewline())

    return line.nextSibling.nextSibling // 추가된 파일 아래쪽에 새로 생성된 줄 
  }
  function getFileName(name, limit){
    return name.length > limit ? `${name.slice(0, limit)}... ${name.slice(name.lastIndexOf('.'), name.length)}` : name
}
  function getFileSize(number) {
    if(number < 1024) {
      return number + 'bytes';
    } else if(number >= 1024 && number < 1048576) {
      return (number/1024).toFixed(1) + 'KB';
    } else if(number >= 1048576) {
      return (number/1048576).toFixed(1) + 'MB';
    }
  }
})