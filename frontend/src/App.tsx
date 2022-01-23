import Lent from './pages/Lent'
import Main from './pages/Main'
import Return from './pages/Return'
import Footer from './component/Footer'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
            <Switch>
              <Route exact path='/' component={Main}></Route>
              <Route path='/lent' component={Lent}></Route>
              <Route path='/return' component={Return}></Route>
              <Route component={Main}></Route>
            </Switch>
          <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
