# Deact
My own React creation as a learning playground.

# What I have learned from implementing my own React

- JSX to React to Javascript
- classNames and their different wording
- element nesting
- Virtual DOM

I started to implement React by myself to generate a better understanding of how React works under the surface. There are two main principles that I focused on: The translation from JSX to JavaScript and the usage of a Virtual DOM to only render parts that were updated. 

<p float="left">
  <img src="https://user-images.githubusercontent.com/102987416/177684481-3bcbfaf3-86f4-45a7-9db0-5d7661a12845.png"
 width="100" />
  <img src="Screenshot_2022-07-06_at_09 16 05" src="https://user-images.githubusercontent.com/102987416/177684499-c6d33a49-b971-4083-b704-e7fbe02dc60e.png" width="100" /> 
</p>
<img width="122" alt="Screenshot_2022-07-06_at_09 16 05" src="https://user-images.githubusercontent.com/102987416/177684499-c6d33a49-b971-4083-b704-e7fbe02dc60e.png">

In this example, you can click on each of the buttons and another change is triggered, only updating the parts that have been changed. This simple functionality was created with Deact - my own React. During the process of implementing it, I did not only generate a better understanding of React, but I also was learning a lot about Javascript and how to manipulate the DOM. In the next lines, I want to share my learnings.

## From JSX to React to Javascript

To define components people and tutorials mainly use HTML like syntax to define what a component should look like. This syntax is called JSX. JSX is just another layer over React, to enable the programmer to work with familiar and often easier and shorter syntax. JSX is not a functionality of React, it is brought by babel, a compiler, which translates JSX code into React code.  When you write your code you could use both, React and JSX, but be sure, to use babel for transiplation if you decide to use JSX. 

```jsx
// JSX Syntax
const rootElement = document.getElementById('root')
const element = <div className='container'>Hello World</div>
ReactDOM.render(element, rootElement)

// React Syntax
const rootElement = document.getElementById('root')
const element = React.createElement('div', {
    children: 'Hello World',
    className: 'container'
})
ReactDOM.render(element, rootElement)

// the React element
{
	type: "div"
	className: "container",
	props.children: 'Hello World'
}
```

That is also why there might be differences. in the naming. In HTML the attribute to define the name of the class of an element is called `class`. JSX is an extension of javascript and javascript has certain keywords, that will lead to specific translations, like `class`. To still be able to define the name of the class, JSX and React use `className` instead.

Only after creating React elements, the DOM will be manipulated.

## The Virtual DOM

The virtual DOM is a representation of the real DOM - like a lightweight copy, without the functionality to actually manipulate the DOM. If there are any changes in your application, e.g. if someone clicks a button and a new element is rendered or a new input is provided, the changes will first be reflected on the virtual dom. The virtual DOM is then compared to the real DOM *(diffing)* and only the elements that have changed are updated. I have read, that even though every single virtual DOM object is updated, it is still more efficient than updating the whole DOM. 

## Why is everyone talking about components?

I was surprised, but creating components was one of the easiest parts of my own implementation. A component is just another JSX/React element, that is interpolated in the current JSX/React element. It feels like a variable, which is another JSX string, that can be easily updated, replaced, or deleted. Knowing that it is already bundled, it is easy to handle. I know that I use a component due to the capital letter at the beginning of the component name. I can interpolate it from a function, a new class, or a variable. 

```jsx
const Test = props =>. <div className="test">{props.test}</div>

const element = (
	<div className="container">
		<Test test="Hello" />
		<Test test="World" />
	</div>
)
```
