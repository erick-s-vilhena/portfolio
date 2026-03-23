import './styles/App.scss'
import { useEffect } from 'react'
import Header from './components/Header'
import Inicio from './components/Inicio'
import Luz_bg from './components/Luz_bg'
import Sobre from './components/Sobre'
import CertificadoAberto from './components/CertificadoAberto'
import HabilidadeOpen from './components/HabilidadeOpen'
import { useContexto } from './context/Contexto'
import Projetos from './components/Projetos'
import MenuLateral from './components/MenuLateral'
import SnakeGame from './components/SnakeGame'
import Contatos from './components/Contatos'

function App() {

  const { certificadoAberto, habilidadeOpen } = useContexto();

  useEffect(()=>{
      const elementos = document.querySelectorAll('.hidden')

      const myObserver = new IntersectionObserver( (entries) => {
          entries.forEach((ent)=>{
            if(ent.isIntersecting){
              ent.target.classList.add('show')
            }else{
              ent.target.classList.remove('show')
            }
          })
      })

      elementos.forEach((ele)=>{
        myObserver.observe(ele)
      })
  },[])

  return (
    <div className="app">

        {certificadoAberto &&(
            <CertificadoAberto/>
        )}

        {
          habilidadeOpen &&(
            <HabilidadeOpen/>
          )
        }
        <Luz_bg/>

        <Header/>

        <Inicio/>
        
        <Sobre/>

        <Projetos/>

        <MenuLateral/>

        <Contatos/>
    </div>
  )
}

export default App
