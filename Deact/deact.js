const addAttributesToElement = (deactElement, jsElement) => {
    if(deactElement.className){
        jsElement.classList.add(deactElement.className)
    }
    if(deactElement.id){
        jsElement.setAttributes("id", deactElement.id)
    }
}

// append nested elements recursively
const createDocumentElement = (deact) => {

    let element = document.createElement(deact.type);
    addAttributesToElement(deact, element)
    if (typeof deact.props.children == 'string') {
        element.textContent = deact.props.children;
    } else {
        for (let child of deact.props.children) {
            if (child instanceof deactElement) {
                element.appendChild(createDocumentElement(child))
            } else {
                element.textContent = child
            }
        }
    }
    return element;
}

const deactToJavaScript = (reactElement) => {
    return createDocumentElement(reactElement)
}   
