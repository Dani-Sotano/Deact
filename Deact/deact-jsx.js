
const createdDeactElementFromOpenTag = (element, parentElement) => {
    let elementAttributes;
    if(element.attributes){
        elementAttributes = extract(element.attributes)
    }
    let newElement = new deactElement(element.tag, null, elementAttributes, parentElement);

    if (parentElement) {
        newElement.parent = parentElement
        parentElement.addChild(newElement, parentElement)
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


const tagIsComponent = (tag) => {
   return tag.charCodeAt(0) >= 65 && tag.charCodeAt(0) <= 90
}

const getEndIndex = (string, start) => {
    let endIndex = string.indexOf(">", start+1)
    while(string[endIndex-1] == "="){
        endIndex  = string.indexOf(">", endIndex+1)
    }
    return endIndex
}

const Type = {
    TAG: 1,
    OPEN_TAG: 2,
    CLOSE_TAG: 3,
    ATTRIBUTE: 4,
    CONTENT: 5
 };

 const defineTagObject = (type, subString) => {
    let element = {}
    if(type == Type.TAG){
        let regex = /((<(?<open>\w+))|(<\/(?<close>(\w)+)))(?<attributes>.*)>/
        let match = subString.match(regex)
        if(match != null){
            if(match.groups.open){
                    element.type = Type.OPEN_TAG
                    element.tag = match.groups.open
            } else {
                element.type = Type.CLOSE_TAG
                element.tag = match.groups.close
            }
            if(match.groups.attributes != ""){
                element.attributes = match.groups.attributes
            }
        }
    } else if(type == Type.CONTENT && subString.trim() != ""){
        element.type = type 
        element.string = subString
    }
    return element
 }

const splitStringByTags = function(string){
    let tags = []
    let index = 0;
    let startIndex = string.indexOf("<", index)
    let endIndex = getEndIndex(string, startIndex)
    while(startIndex != -1 & endIndex != -1 & endIndex < string.length){
      tags.push(defineTagObject(Type.TAG, string.slice(startIndex, endIndex+1)))
      startIndex  = string.indexOf("<", endIndex)
      let content = string.slice(endIndex+1, startIndex).trim()
      if(content != ""){
        tags.push(defineTagObject(Type.CONTENT, string.slice(endIndex+1, startIndex)))
      }
      
      endIndex  = getEndIndex(string, startIndex)
    }
    return tags;
}

const createdReactBasedOnJsx = (jsxString, parent) => {
    jsxString = jsxString.replace(/(\r\n|\n|\r)/gm, "")
    let detectedElements = splitStringByTags(jsxString)
    let parentElement;
    for (let element of detectedElements) {
        if(element.type == Type.OPEN_TAG) {
            if(tagIsComponent(element.tag)){
                if (eval(element.tag)) {
                    let component = eval(element.tag)()
                    newElement = createdReactBasedOnJsx(component)
                    newElement.id = element.tag
                    newElement.parent = parentElement
                    parentElement.addChild(newElement)
                }
                // parent element stays the same, only child is added
            } else {
                parentElement = createdDeactElementFromOpenTag(element, parentElement)
            }
        } else if (element.type == Type.CLOSE_TAG) {
            closeParentElement(element.tag, parentElement)
            // tree structure: only top element has no parent
            // if element has no parent, we reached the top  
            if (!parentElement.parent) {
                break
            }
            parentElement = parentElement.parent
        } else if(element.type == Type.CONTENT){
            parentElement.addChild(element.string);
        }
    }
    return parentElement;
}


class deactElement {
    type
    value
    onChange
    props = {}
    closed = false
    parent

    constructor(type, content, attributes, parent) {
        this.type = type
        if (typeof content == deactElement) {
            debugger;
            // attributes are missing
            this.props.children = new deactElement(content.type, content.content, content.parent);
        } else if (typeof content == 'string') {
            this.props.children = [content];
            for (let attribute of attributes) {
                this[attribute.key] = attribute.value
            }
        }
        if(attributes){
            for(let attribute of attributes){
                this[attribute.key] =  attribute.value
            }
        }

        this.parent = parent
    }

    addChild = (child) => {
        if (this.props.children) {
                this.props.children.push(child)
        } else {
            this.props.children = [child]

        }
    }

    replaceChild = (oldElement, newElement) => {
        let index = this.props.children.indexOf(oldElement);
        if(index == -1){
            this.props.children.push(newElement)
        }
        this.props.children[index] = newElement
    }

    addContent = (content) => {
        if(this.content){
            this.content = this.content+content
        }else{
            this.content = content
        }
    }


}