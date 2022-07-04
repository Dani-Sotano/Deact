const page = "Service"
const consoleFunction = function(){console.log("hurray")}
 const App = ()  => {
    return ( `
        <div>
            <button id='demo' onclick='${consoleFunction}'>Click me.</button>
            <${page} />
        </div>` )
} 
