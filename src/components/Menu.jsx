import Btn_Tema from "./Btn_Tema";
import '../styles/Menu.scss'

export default function Menu({btnMenu}){
    return(
        <div className={`Menu ${btnMenu}`}>
            <nav>
              <div className="Home ativo">Início
                <span className="square"></span>
              </div>

              <div className="Sobre">Sobre mim
                <span className="square"></span>
              </div>
              <div className="Projetos">Meus projetos
                <span className="square"></span>
              </div>
              <div className="Contatos">Entre em contato
                <span className="square"></span>  
              </div>
            </nav>

            <Btn_Tema/>
        </div>
  )
}