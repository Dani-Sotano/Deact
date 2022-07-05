const page = "Service"
let state = 2
const consoleFunction = () => {
    state = state+1;
    console.log(state);
}
 const App = ()  => {
    return ( `
        <div>
            <div>${state}</div>
            <button id='demo' onClick='${consoleFunction}'>Click me.</button>
            <${page} />
        </div>` )
} 
