import { useEffect, useRef, useState } from 'react'
import '../styles/Header.scss'
import Logo from './Logo';
import Btn_Tema from './Btn_Tema';

export default function Header(){

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
    <div className={`Header ${scroll && 'ativo'}`}>
        <div className="center">
          <Logo/>

          <Btn_Tema/>
        </div>
    </div>
  )
}