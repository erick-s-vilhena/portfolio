import { NavLink } from "react-router-dom";
import "../styles/MenuLateral.scss"

const itensMenuLateral = [
    {
        to: '/',
        classe: 'inicio',
        titulo: 'Ir para o início',
        label: 'Inicio',
    },
    {
        to: '/sobre',
        classe: 'sobre',
        titulo: 'Ir para sobre mim',
        label: 'Sobre mim',
    },
    {
        to: '/certificados',
        classe: 'certificados',
        titulo: 'Ir para certificados',
        label: 'Certificados',
    },
    {
        to: '/projetos',
        classe: 'portfolio',
        titulo: 'Ir para meus projetos',
        label: 'Meus projetos',
    },
    {
        to: '/contatos',
        classe: 'contato',
        titulo: 'Ir para contato',
        label: 'Entre em contato',
    }

];

export default function MenuLateral(){
    return (
        <div className="MenuLateral">
            <div className="container">
                {itensMenuLateral.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/'}
                        className={({ isActive }) => `${item.classe} ${isActive ? 'ativo' : ''}`}
                        aria-label={item.titulo}
                        data-label={item.label}
                    >
                        <span className="marcador" />
                    </NavLink>
                ))}
            </div>
        </div>
    )
}
