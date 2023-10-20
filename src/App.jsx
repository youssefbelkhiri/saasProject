// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

function App() {
  // const name=<h1>Lorem</h1>;
  // const age=<h2>00</h2>;
  // const mail=<h2>lorem@lorem.l</h2>;
  // const user=(<div>
  //   {name}
  //   {age}
  //   {mail}
  // </div>
  // );
  return (
    <div className='App'>
      
      <User name="Lorem" age={36.46} mail="lorem@lorem.com"/>
      <User name="test" age={40} mail="test@test.com"/>
    </div>
  )
}
const User=(props)=>{
  return (
    <div>
      <h1>{props.name}</h1>
      <h2>{props.age}</h2>
      <h2>{props.mail}</h2>
    </div>
  )
}
export default App
