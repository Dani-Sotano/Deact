class deactElement {
    tag
    value
    onChange
    props = {}
    closed = false
    parent

    constructor(tag, content, attributes, parent) {
        this.tag = tag
        if (typeof content == deactElement) {
            // attributes are missing
            this.props.children = new deactElement(content.tag, content.content, content.parent);
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

    sort(){
        this.props.children.sort((first, second) => {
            let lowerValue = this.getLowerValue(first.tag, second.tag);
            if (lowerValue != 0) {
                return lowerValue
            }
            lowerValue = this.getLowerValue(first.name, second.name);
            if (lowerValue != 0) {
                return lowerValue
            }
            lowerValue = this.getLowerValue(first.id, second.id);
            if (lowerValue != 0) {
                return lowerValue
            }
            return 0
        });
    }

    getLowerValue = (first, second) => {
        if (first < second) {
            return -1
        } else if (first > second) {
            return 1;
        } else {
            return 0
        }
    }
    
}

