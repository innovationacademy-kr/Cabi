import { useState } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Main from './pages/Main'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path='/'><Main></Main></Route>
          <Route path='/lent'>Lent</Route>
          <Route path='/return'>Return</Route>
          <Route>Main</Route>
        </Switch>
      </BrowserRouter>	    
    </div>
  )
}

export default App
