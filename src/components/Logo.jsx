import { useEffect, useRef, useState } from 'react';
import '../styles/Logo.scss'

export default function Logo(){

    const [scroll, setScroll] = useState(0)
    const timeout = useRef();
    
    useEffect(()=>{
        function useScroll(){
          clearTimeout(timeout.current);
    
          timeout.current =  setTimeout(()=>{
            setScroll(window.scrollY);
          }, 100)
        }
    
        window.addEventListener('wheel', useScroll);
    
        return ()=>{
          window.removeEventListener('wheel', useScroll)
          clearTimeout(timeout.current);
        }
    },[])

    return(
        <div className='Logo'>
            <span>{'<'}</span>

            <p className={`${!scroll && 'ativo'}`}>ESV</p>

            <span>{'/>'}</span>
        </div>
    )
}