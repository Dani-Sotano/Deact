let currentDeact;

const DeactDOM = {
    render: (child, parent) => {
        parentHTML = parent;
        const deactElement = createdReactBasedOnJsx(child, parent)
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
            let newElementChild = newElement.props.children[index]
            let oldElementChild = oldElement.props.children[index]
            if(typeof newElementChild === "string" && typeof oldElementChild === "string"){
                if(newElementChild !== oldElementChild){
                    oldElement.replaceChild(oldElementChild, newElementChild)
                    let oldJSElement = getOldJSElement(oldElement)
                    oldJSElement.textContent = newElementChild
                }
            } else {
                replaceElementsThatDiffer(newElementChild, oldElementChild)
            }
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

const getAllParentTypes = (oldElement) => {
    let arr = [{
        type: oldElement.type,
        id: oldElement.id,
        class: oldElement.class
    }]
    while(oldElement.parent){
        arr.unshift({
            type: oldElement.parent.type,
            id: oldElement.parent.id,
            class: oldElement.parent.class
        })
        oldElement = oldElement.parent
    }
    return arr
}

const changeClassName = (oldElement, newElement) => {
    let oldJSElement = getOldJSElement(oldElement)
    oldJSElement.className = newElement.class;
}


const createQuerySelector = (oldElement) => {
    let parents = getAllParentTypes(oldElement)
    let parents2 = parents.map(parent => createString(parent))
    return `${parents2.join(" ")}${oldElement.id ? "#" + oldElement.id : ""}${oldElement.class ? "." + oldElement.class : ""}`
}

const createString = (element) => {
    return `${element.type}${element.id ? "#" + element.id : ""}${element.class ? "." + element.class : ""}`

}



