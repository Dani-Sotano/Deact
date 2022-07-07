let currentDeact;
let domState = {
    oldElement: "",
    newElement: ""
}


const DeactDOM = {
    render: (element, parent) => {
        domState.newElement = createdReactBasedOnJsx(element)
        if (!currentDeact) {
            const javaScriptElement = deactToJavaScript(domState.newElement)
            currentDeact = domState.newElement
            parent.appendChild(javaScriptElement)
        } else {
            domState.oldElement = currentDeact
            replaceElementsThatDiffer(domState.oldElement, domState.newElement)
        }

    }
}

const completeTagIsReplaced = (oldElement, newElement) => {
    if (newElement.tag != oldElement.tag ||
        oldElement.id !== newElement.id) {
        if (oldElement.parent) {
            oldElement.parent.replaceChild(oldElement, newElement)
            currentDeact = getParentElement(oldElement)
            oldElement.replaceJSElement(newElement)
        } else {
            currentDeact = newElement
        }
        return true;
    }
    return false;
}
const elementIsAddedAsChild = (oldElement, newElement) => {
    if (newElement.props && newElement.props.children &&
        newElement.props.children.length > 0) {
        verifyAndReplaceClassNameIfRequierd(oldElement, newElement)
        if (!oldElement.props.children) {
            for (let child of newElement.props.children) {
                oldElement.addNewElementAsChild(newElement, child)
            }
        } else {
            verifyChildren(oldElement, newElement)
        }
        return true;
    }
    return false;
}
const classNameIsReplaced = (oldElement, newElement) => {
    if (oldElement.class !== newElement.class) {
        changeClassName(oldElement, newElement)
        oldElement.class = newElement.class
        return true;
    }
    return false;
}

const replaceElementsThatDiffer = (oldElement, newElement) => {
    return completeTagIsReplaced(oldElement, newElement) ||
        elementIsAddedAsChild(oldElement, newElement) ||
        classNameIsReplaced(oldElement, newElement)
}


const verifyChildren = (oldElement, newElement) => {
    // order children to detect if only order changed
    newElement.sort()
    oldElement.sort()

    for (let index in newElement.props.children) {
        if (!oldElement.props || !oldElement.props.children) {
            oldElement.addNewElementAsChild(newElement, newElement.props.children[index])
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
            let oldJSElement = oldElement.getJSElement()
            oldJSElement.textContent = newElementChild
        }
    } else {
        replaceElementsThatDiffer(oldElementChild, newElementChild)
    }
}

const getParentElement = (element) => {
    while (element.parent) {
        element = element.parent
    }
    return element
}


const changeClassName = (oldElement, newElement) => {
    let oldJSElement = oldElement.getJSElement(oldElement)
    oldJSElement.className = newElement.class;
}


const verifyAndReplaceClassNameIfRequierd = (oldElement, newElement) => {
    if (oldElement.class !== newElement.class) {
        changeClassName(oldElement, newElement)
        oldElement.class = newElement.class
    }
}
