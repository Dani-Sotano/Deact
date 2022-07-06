let currentDeact;


const DeactDOM = {
    render: (child, parent) => {
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
    if (newElement.tag != oldElement.tag || oldElement.id !== newElement.id) {
        replaceDOMElement(oldElement, newElement)
    } else if (newElement.props && newElement.props.children && newElement.props.children.length > 0) {
        verifyAndReplaceClassNameIfRequierd(oldElement, newElement)
        if(!oldElement.props.children){
            for(let index in newElement.props.children){
                addNewElementAsChild(oldElement, newElement, index)
            }
        } else{
            verifyChildren(oldElement, newElement)
        } 
    } else if (oldElement.class !== newElement.class) {
        changeClassName(oldElement, newElement)
        oldElement.class = newElement.class
    }

}

const verifyChildren = (oldElement, newElement) => {
    // order children to detect if only order changed
        newElement.sort()
        oldElement.sort()

        for (let index in newElement.props.children) {
            if (!oldElement.props || !oldElement.props.children) {
                addNewElementAsChild(oldElement, newElement, index)
            } else {
                replaceElements(oldElement, newElement, index)
            }
        }
}

const replaceElements = (oldElement, newElement, index) => {
    let newElementChild = newElement.props.children[index]
    let oldElementChild = oldElement.props.children[index]
    if (typeof newElementChild === "string" && typeof oldElementChild === "string") {
        if (newElementChild !== oldElementChild) {
            oldElement.replaceChild(oldElementChild, newElementChild)
            let oldJSElement = getOldJSElement(oldElement)
            oldJSElement.textContent = newElementChild
        }
    } else {
        replaceElementsThatDiffer(newElementChild, oldElementChild)
    }
} 

const addNewElementAsChild = (oldElement, newElement, index) => {
    let newElementChild = newElement.props.children[index]
    oldElement.addChild(newElementChild)
    let oldJSElement = getOldJSElement(oldElement)
    if (typeof newElementChild === "string") {
        oldJSElement.textContent = newElementChild
    } else {
        let newJSElement = deactToJavaScript(newElement)
        let elementToBeReplaced = getOldJSElement(oldElement)
        elementToBeReplaced.replaceWith(newJSElement)
    }
}

const replaceDOMElement = (oldElement, newElement) => {
    if (oldElement.parent) {
        oldElement.parent.replaceChild(oldElement, newElement)
        currentDeact = getParentElement(oldElement)

        let newJSElement = deactToJavaScript(newElement)
        let elementToBeReplaced = getOldJSElement(oldElement)
        elementToBeReplaced.replaceWith(newJSElement)
    } else {
        currentDeact = newElement
    }

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
        tag: oldElement.tag,
        id: oldElement.id,
        class: oldElement.class
    }]
    while (oldElement.parent) {
        arr.unshift({
            tag: oldElement.parent.tag,
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
    let parentTypes = getAllParentTypes(oldElement)
    let parentsDefinitions = parentTypes.map(parent => createString(parent))
    return `${parentsDefinitions.join(" ")}${oldElement.id ? "#" + oldElement.id : ""}${oldElement.class ? "." + oldElement.class : ""}`
}

const createString = (element) => {
    return `${element.tag}${element.id ? "#" + element.id : ""}${element.class ? "." + element.class : ""}`

}

const verifyAndReplaceClassNameIfRequierd = (oldElement, newElement) => {
    if (oldElement.class !== newElement.class) {
        changeClassName(oldElement, newElement)
        oldElement.class = newElement.class
    }
}





