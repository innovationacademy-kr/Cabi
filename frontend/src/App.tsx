import Main from './pages/Main'
import Return from './pages/Return'
import Lent from './pages/Lent'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path='/'><Main></Main></Route>
          <Route path='/lent'><Lent></Lent></Route>
          <Route path='/return'><Return></Return></Route>
          <Route><Main></Main></Route>
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default App
