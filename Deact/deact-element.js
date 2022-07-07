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
        if (attributes) {
            for (let attribute of attributes) {
                this[attribute.key] = attribute.value
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
        if (index == -1) {
            this.props.children.push(newElement)
        }
        this.props.children[index] = newElement
    }

    addContent = (content) => {
        if (this.content) {
            this.content = this.content + content
        } else {
            this.content = content
        }
    }

    sort() {
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

    addNewElementAsChild = (newElement, child) => {
        this.addChild(child)
        let oldJSElement = this.getJSElement(oldElement)
        if (typeof child === "string") {
            oldJSElement.textContent = child
        } else {
            this.replaceJSElement(newElement)
        }
    }


    replaceJSElement = (newElement) => {
        let newJSElement = deactToJavaScript(newElement)
        let oldJSElement = this.getJSElement()
        oldJSElement.replaceWith(newJSElement)
    }

    getJSElement = () => {
        let getQuerySelector = this.createQuerySelector(this)
        return document.querySelector(getQuerySelector)
    }

    createQuerySelector = (oldElement) => {
        let parentTypes = this.getAllParentTypes(oldElement)
        return `${parentTypes.join(" ")}`
    }

    createString = (element) => {
        return `${element.tag}${element.id ? "#" + element.id : ""}${element.class ? "." + element.class : ""}`

    }

    getAllParentTypes = (oldElement) => {
        let parentTypes = [{
            tag: oldElement.tag,
            id: oldElement.id,
            class: oldElement.class
        }]
        while (oldElement.parent) {
            parentTypes.unshift({
                tag: oldElement.parent.tag,
                id: oldElement.parent.id,
                class: oldElement.parent.class
            })
            oldElement = oldElement.parent
        }
        return parentTypes.map(parent => this.createString(parent))
    }



}

