const Deact = {
    createElement: (type, content) => {
        const element = document.createElement(type)
        element.textContent = content.children
        element.className = content.className
        return element
      } 
  }