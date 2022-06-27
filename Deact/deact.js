const Deact = {
    createElement: () => {
        const element = document.createElement('div')
        element.textContent = 'Hello World'
        element.className = 'container'
        return element
      } 
  }