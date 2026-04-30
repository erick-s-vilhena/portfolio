import { NavLink, useLocation } from 'react-router-dom';
import '../styles/Logo.scss'

export default function Logo(){
    const location = useLocation();

    const logoExpandida = location.pathname === '/';

    return(
        <NavLink className='Logo' to='/'>
            <span>{'<'}</span>

            <p className={`${logoExpandida}`}>ESV</p>

            <span>{'/>'}</span>
        </NavLink>
    )
}
