import Btn_Tema from "./Btn_Tema";
import { NavLink } from "react-router-dom";
import '../styles/Menu.scss'

const itensMenu = [
  {
    to: '/',
    texto: 'Início',
    classe: 'Home',
  },
  {
    to: '/sobre',
    texto: 'Sobre mim',
    classe: 'Sobre-menu',
  },
  {
    to: '/projetos',
    texto: 'Meus projetos',
    classe: 'Meus-Projetos',
  },
  {
    to: '/contatos',
    texto: 'Entre em contato',
    classe: 'Contatos',
  },
];

export default function Menu({btnMenu}){
    return(
        <div className={`Menu ${btnMenu}`}>
            <nav>
              {itensMenu.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `${item.classe} ${isActive ? 'ativo' : ''}`}
                >
                  {item.texto}
                  <span className="square"></span>
                </NavLink>
              ))}
            </nav>

            <Btn_Tema/>
        </div>
  )
}
