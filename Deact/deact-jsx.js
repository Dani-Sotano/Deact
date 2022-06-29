const extractAttributesFromTag = (attributeString) => {
    let attributes = [];
    let regex = /(?<key>\w+)=["']+(?<value>\w+)["']+/g
    let match;
    while ((match = regex.exec(attributeString)) != null) {
        attributes.push({
            key: match.groups.key,
            value: match.groups.value
        })
    }
    return attributes
}

const addElementToParent = (child, parent) => {
    if (parent.props.children) {
        if (typeof parent.props.children == 'string') {
            let arr = [parent.props.children, child]
            parent.props.children = arr
        } else {
            parent.props.children.push(child);
        }
    } else {
        if (typeof child == 'string') {
            parent.props.children = child
        } else {
            parent.props.children = [child];
        }
    }
}


const createdDeactElementFromOpenTag = (match, parentElement) => {
    let elementAttributes = extractAttributesFromTag(match.groups.attributes)
    let newElement = new deactElement(match.groups.open, match.groups.any, elementAttributes, parentElement);
    
    if (parentElement) {
        newElement.parent = parentElement
        addElementToParent(newElement, parentElement)
    }
    return newElement;
}


const closeParentElement = (closeTag, parentElement) => {
    if (parentElement == null) {
        throw console.error(`opening tag is missing for ${closeTag}`);
    }
    if (closeTag != parentElement.type) {
        throw console.error(`current tag ${closeTag} does not match parent tag ${parentElement.type}`);
    }
    parentElement.closed = true;
}

const matchIsOpenTag = (match) => {
    return match.groups.open != null;
}

const matchIsCloseTag = (match) => {
    return match.groups.close != null;
}


const createdReactBasedOnJsx = (jsxString) => {
    const patternDividingJSXElements = /<(?<open>[a-z]+)(?<attributes>([^>]*))>(?<any>[^<>]*)|<\/(?<close>[a-z]*)>/g;
    jsxString = jsxString.replace(/(\r\n|\n|\r)/gm, "")
    let parentElement;
    let match;

    while ((match = patternDividingJSXElements.exec(jsxString)) != null) {
        if (matchIsOpenTag(match)) {
            parentElement = createdDeactElementFromOpenTag(match, parentElement)
        } else if (matchIsCloseTag) {
            closeParentElement(match.groups.close, parentElement)
            // tree structure: only top element has no parent
            // if element has no parent, we reached the top  
            if (!parentElement.parent) {
                break;
            }
            parentElement = parentElement.parent;
        }
    }
    return parentElement;
}


class deactElement {
    type;
    value;
    onChange;
    props = {};
    closed = false;
    parent;

    constructor(type, content, attributes, parent) {
        this.type = type;
        if (typeof content == deactElement) {
            this.props.children = new deactElement(content.type, content.content, content.parent);
        } else if (typeof content == 'string') {
            this.props.children = content;
            for (let attribute of attributes) {
                this[attribute.key] = attribute.value
            }
        }
        this.parent = parent;
    }
}