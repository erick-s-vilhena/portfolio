import { useEffect, useState } from 'react';
import '../styles/Btn_Tema.scss'
import { FaSun, FaMoon } from "react-icons/fa6";

export default function Btn_Tema(){
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
      document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const mudarTema = () => {
      setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return(
      <div className='Btn_Tema'>
          <div className='box' onClick={mudarTema}>
              <span><FaSun/></span>
              <span><FaMoon/></span>
              
              <div className={`interruptor ${theme}`}></div>
          </div>
      </div>
  )
}