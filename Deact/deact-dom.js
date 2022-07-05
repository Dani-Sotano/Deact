let currentDeact;

const DeactDOM = {
    render: (child, parent) => {
        const deactElement = createdReactBasedOnJsx(child)
        if (!currentDeact) {
            const javaScriptElement = deactToJavaScript(deactElement)
            currentDeact = deactElement
            parent.appendChild(javaScriptElement)
        } else {
            replaceElementsThatDiffer(deactElement, currentDeact)
        }
    }
}

const replaceElementsThatDiffer = (newElement, oldElement) => {
    if (newElement.type != oldElement.type || oldElement.id !== newElement.id) {
        if (oldElement.parent) {
            replaceDOMElement(oldElement, newElement)
        } else {
            currentDeact = newElement
        }
    } else if (newElement.props && newElement.props.children && newElement.props.children.length > 0) {
        // TODO find match of child
        if (oldElement.class !== newElement.class) {
            changeClassName(oldElement, newElement)
            oldElement.class = newElement.class
        }
        for (let index in newElement.props.children) {
            replaceElementsThatDiffer(newElement.props.children[index], oldElement.props.children[index])
        }
    } else if (oldElement.class !== newElement.class) {
        changeClassName(oldElement, newElement)
        oldElement.class = newElement.class
    }
}

const replaceDOMElement = (oldElement, newElement) => {
    let newJSElement = deactToJavaScript(newElement)
    oldElement.parent.replaceChild(oldElement, newElement)
    currentDeact = getParentElement(oldElement)
    let elementToBeReplaced = getOldJSElement(oldElement)
    elementToBeReplaced.replaceWith(newJSElement)
}

const getParentElement = (element) => {
    while (element.parent) {
        element = element.parent
    }
    return element
}

const getOldJSElement = (oldElement) => {
    let getQuerySelector = createQuerySelector(oldElement)
    return document.querySelector(getQuerySelector)
}

const changeClassName = (oldElement, newElement) => {
    let oldJSElement = getOldJSElement(oldElement)
    oldJSElement.className = newElement.class;
}


const createQuerySelector = (oldElement) => {
    return `${oldElement.type}${oldElement.id ? "#" + oldElement.id : ""}${oldElement.class ? "." + oldElement.class : ""}`
}



