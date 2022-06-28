const DeactDOM = {
    render: (child, parent) => {
        const deactElement = createdReactBasedOnJsx(child)
        const javaScriptElement = Deact.deactToJavaScript(deactElement)
        parent.appendChild(javaScriptElement)
    } 
}