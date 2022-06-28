const Deact = {
    createElement: (type, content) => {
        const element = document.createElement(type)
        element.textContent = content.children
        element.className = content.className
        return element
      }, 
      deactToJavaScript: (content) => {
        const element = document.createElement(content.type)
        element.textContent = content.props.children
        element.className = content.props.className
        return element
      } 
  }