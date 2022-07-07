const addAttributesToElement = (deactElement, jsElement) => {
    if (deactElement.class) {
        jsElement.classList.add(deactElement.class)
    }
    if (deactElement.id) {
        jsElement.setAttribute("id", deactElement.id)
    }
    if (deactElement.onClick != undefined) {
        jsElement.addEventListener('click', eval(deactElement.onClick));
    }
}

// append nested elements recursively
const createDocumentElement = (deact) => {
    let element = document.createElement(deact.tag);
    addAttributesToElement(deact, element)
    if (deact.props.children) {
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
    }
    return element;
}

const deactToJavaScript = (reactElement) => {
    return createDocumentElement(reactElement)
}   
