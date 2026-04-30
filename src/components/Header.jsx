import { useEffect, useRef, useState } from 'react'
import '../styles/Header.scss'
import Logo from './Logo';
import Btn_Tema from './Btn_Tema';

export default function Header(){

  const [blurHeader, setBlurHeader] = useState(false)
  const timeout = useRef();

  useEffect(()=>{
    function useScroll(){
      clearTimeout(timeout.current);
      
      timeout.current =  setTimeout(()=>{
        setBlurHeader(window.scrollY >=  50 ? true : false);
      }, 100)
    }

    window.addEventListener('scroll', useScroll);

    return ()=>{
      window.removeEventListener('scroll', useScroll)
      clearTimeout(timeout.current);
    }
  },[])

  
  return(
    <div className={`Header ${blurHeader}`}>
        <div className="center">
          <Logo/>
          <Btn_Tema />
        </div>
    </div>
  )
}
