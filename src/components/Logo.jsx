import { useEffect, useRef, useState } from 'react';
import '../styles/Logo.scss'

export default function Logo(){

    const [logoAtiva, setLogoAtiva] = useState(true)
    const timeout = useRef();
    
    useEffect(()=>{
        function useScroll(){
          clearTimeout(timeout.current);
    
          timeout.current =  setTimeout(()=>{
            setLogoAtiva(window.scrollY >= 50 ? true : false);
          }, 100)
        }
    
        window.addEventListener('scroll', useScroll);
    
        return ()=>{
          window.removeEventListener('scroll', useScroll)
          clearTimeout(timeout.current);
        }
    },[])

    return(
        <a className='Logo' href='./'>
            <span>{'<'}</span>

            <p className={`${!logoAtiva}`}>ESV</p>

            <span>{'/>'}</span>
        </a>
    )
}