const DeactDOM = {
    render: (child, parent) => {
        const deactElement = createdReactBasedOnJsx(child)
        const javaScriptElement = deactToJavaScript(deactElement)
        parent.appendChild(javaScriptElement)
    } 
}