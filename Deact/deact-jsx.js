// the splitting

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

const splitStringIntoTagsAttributesOrContent = function(string){
    jsxString = string.replace(/(\r\n|\n|\r)/gm, "")

    let tags = []
    let index = 0;
    let startIndex = jsxString.indexOf("<", index)
    let endIndex = getEndIndex(jsxString, startIndex)
    while(startIndex != -1 & endIndex != -1 & endIndex < jsxString.length){
      tags.push(defineTagObject(Type.TAG, jsxString.slice(startIndex, endIndex+1)))
      startIndex  = jsxString.indexOf("<", endIndex)
      let content = jsxString.slice(endIndex+1, startIndex).trim()
      if(content != ""){
        tags.push(defineTagObject(Type.CONTENT,jsxString.slice(endIndex+1, startIndex)))
      }
      
      endIndex  = getEndIndex(jsxString, startIndex)
    }
    return tags;
}

// the nesting

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
    if (closeTag != parentElement.tag) {
        throw console.error(`current tag ${closeTag} does not match parent tag ${parentElement.tag}`);
    }
    parentElement.closed = true;
}


const tagIsComponent = (tag) => {
   return tag.charCodeAt(0) >= 65 && tag.charCodeAt(0) <= 90
}



const createdComponentAndAddedAsChild = (element, parentElement) => {
    if (eval(element.tag)) {
        let component = eval(element.tag)()
        newElement = createdReactBasedOnJsx(component)
        newElement.id = element.tag
        newElement.parent = parentElement
        parentElement.addChild(newElement)
    }
    // parent element stays the same, only child is added
}

const createdAndNestedDeactElementsBasedOn = (splittedElements) =>{
    let parentElement;
    for (let element of splittedElements) {
        if(element.type == Type.OPEN_TAG) {
            if(tagIsComponent(element.tag)){
                createdComponentAndAddedAsChild(element, parentElement)
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

const createdReactBasedOnJsx = (jsxString) => {
    let splittedElements = splitStringIntoTagsAttributesOrContent(jsxString)
    return createdAndNestedDeactElementsBasedOn(splittedElements)
}


