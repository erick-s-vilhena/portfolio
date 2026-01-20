import { RiGithubFill, RiLinkedinFill, RiArrowDownDoubleFill } from 'react-icons/ri';
import '../styles/Inicio.scss';
import { CgMail } from 'react-icons/cg';
import { TbFileCv } from 'react-icons/tb';
import Img_Inicio from './Img_Inicio';
import { useEffect, useRef, useState } from 'react';

export default function Inicio(){

  const [displaySeta, setDisplaySeta] = useState(true)
  const timeout = useRef();

  useEffect(()=>{
    function useScroll(){
      clearTimeout(timeout.current);
      
      timeout.current =  setTimeout(()=>{
        setDisplaySeta(window.scrollY >=  50 ? false : true);
      }, 100)
    }

    window.addEventListener('scroll', useScroll);

    return ()=>{
      window.removeEventListener('scroll', useScroll)
      clearTimeout(timeout.current);
    }
  },[]);

  function rolarScroll(){
    document.getElementById("sobre")?.scrollIntoView({ behavior: "smooth" });
  }

  return(
    <div className='Inicio'>
        <div className="texto">
            <div className="aux hidden lf">
                <h3>Olá, sou</h3>
                <h1>Desenvolvedor <br/> Front-End</h1>
                <p>Tenho paixão por criar soluções escaláveis e <br/> para todos os tipos de dispositivos.</p>

                <div className='icons_contato'>
                  <a  
                      href='https://linkedin.com/in/erick-vilhena/' 
                      target='_blank'
                      rel="noopener noreferrer">
                      <RiLinkedinFill/>
                  </a>
                  
                  <a href='./'><RiGithubFill/></a>

                  <a href='./'><CgMail/></a>

                  <a href='./'><TbFileCv/></a>
                  
                  <div className='line'>
                      <div className='line_roxa'></div>
                  </div>

                </div>
            </div>
        </div>

        <div className="imagem">
          <div className="aux hidden rt">
            <Img_Inicio/>
          </div>
        </div>

        <div className={`seta_continue ${displaySeta}`}>
            <RiArrowDownDoubleFill className='seta' onClick={()=> rolarScroll()}/>
        </div>
    </div>
  )
}