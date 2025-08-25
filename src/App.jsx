import Header from './components/Header'
import Inicio from './components/Inicio'
import Luz_bg from './components/Luz_bg'
import './styles/App.scss'

function App() {
  return (
    <div className="app">
      <Luz_bg/>

      <Header/>

      <Inicio/>
    </div>
  )
}

export default App
