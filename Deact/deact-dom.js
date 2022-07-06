let currentDeact;
let domState = {
    oldElement: "",
    newElement: ""
}


const DeactDOM = {
    render: (child, parent) => {
        domState.newElement = createdReactBasedOnJsx(child, parent)
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

            replaceJSElement(oldElement, newElement)
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
            for (let index in newElement.props.children) {
                addNewElementAsChild(oldElement, newElement, index)
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
            let oldJSElement = getJSElement(oldElement)
            oldJSElement.textContent = newElementChild
        }
    } else {
        replaceElementsThatDiffer(oldElementChild, newElementChild)
    }
}

const addNewElementAsChild = (oldElement, newElement, index) => {
    let newElementChild = newElement.props.children[index]
    oldElement.addChild(newElementChild)
    let oldJSElement = getJSElement(oldElement)
    if (typeof newElementChild === "string") {
        oldJSElement.textContent = newElementChild
    } else {
        replaceJSElement(oldElement, newElement)
    }
}


const replaceJSElement = (oldElement, newElement) => {
    let newJSElement = deactToJavaScript(newElement)
    let oldJSElement = getJSElement(oldElement)
    oldJSElement.replaceWith(newJSElement)
}

const getParentElement = (element) => {
    while (element.parent) {
        element = element.parent
    }
    return element
}

const getJSElement = (oldElement) => {
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
    let oldJSElement = getJSElement(oldElement)
    oldJSElement.className = newElement.class;
}


const createQuerySelector = (oldElement) => {
    let parentTypes = getAllParentTypes(oldElement)
    let parentsDefinitions = parentTypes.map(parent => createString(parent))
    return `${parentsDefinitions.join(" ")}`
    // ${oldElement.id ? "#" + oldElement.id : ""}${oldElement.class ? "." + oldElement.class : ""}`
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
