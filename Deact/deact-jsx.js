const createAttributesFromString = (attributeString) => {
    let arr = [];
    let regex = /(?<key>\w+)=["']+(?<value>\w+)["']+/g
    let match;
    while((match  = regex.exec(attributeString)) != null){
        arr.push({
        key: match.groups.key,
        value: match.groups.value
        })
    }
    return arr
}



const createdDeactElementFromOpenTag = (match, parentElement) => {
    let elementAttributes = createAttributesFromString(match.groups.attributes)
    let newElement = new deactElement(match.groups.open, match.groups.any, elementAttributes, parentElement);
    if (parentElement) {
      newElement.parent = parentElement
      if(parentElement.props.children){
        parentElement.props.children.push(newElement);
      } else {
        parentElement.props.children = [newElement];
      }
      
    } 
    return newElement;
  }
  
  
  const closeCurrentElement = (closeTag, parentElement) => {
    if (parentElement == null){
      throw console.error(`opening tag is missing for ${closeTag}`);
    } 
    if(closeTag != parentElement.type) {
      throw console.error(`current tag ${closeTag} does not match parent tag ${parentElement.type}`);
    }
    parentElement.closed = true;
  }
  
  const createdReactBasedOnJsx = (jsxString) => {
    //const tagPattern = /<(?<open>[a-z]*)((?<attributes>(?<identifier>\w+)='(?<value>\w*)'))*>(?<any>[^<>]*)|<\/(?<close>[a-z]*)>/g;
    const tagPattern = /<(?<open>[a-z]*)(?<attributes>([^>]*))>(?<any>[^<>]*)|<\/(?<close>[a-z]*)>/g;
    jsxString = jsxString.replace(/(\r\n|\n|\r)/gm, "")
    let parentElement;
    let match;
    
    while ((match = tagPattern.exec(jsxString)) != null) {
      if (matchIsOpenTag(match)) {
        parentElement = createdDeactElementFromOpenTag(match, parentElement)
      } else if(matchIsCloseTag) {
        closeCurrentElement(match.groups.close, parentElement)
        // tree structure: only top element has no parent
        // if element has no parent, we reached the top  
        if(!parentElement.parent){
          break;
        }
        parentElement = parentElement.parent;
      }
    }
    return parentElement;
  }
  
  const matchIsOpenTag = (match) => {
    return match.groups.open != null;
  }
  
  const matchIsCloseTag = (match) => {
    return match.groups.close != null;
  }
  
  
  
  class deactElement{
    type;
    value;
    onChange;
    props = {};
    closed = false;
    parent;
  
    constructor(type, content, attributes, parent){
      this.type = type;
      if(typeof content == deactElement){
        this.props.children = new deactElement(content.type, content.content, content.parent);
      } else if(typeof content == 'string'){
        this.props.children = content;
        for(let attribute of attributes){
            this[attribute.key] = attribute.value
        }
      }
      this.parent = parent;
    }
  
    addChild = (child) =>{ this.children.push(child)};
  
  }