import { RiGithubFill, RiLinkedinFill, RiArrowDownDoubleFill } from 'react-icons/ri';
import '../styles/Inicio.scss';
import { CgMail } from 'react-icons/cg';
import { TbFileCv } from 'react-icons/tb';
import Img_Inicio from './Img_Inicio';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Inicio(){

  const [displaySeta, setDisplaySeta] = useState(true)
  const timeout = useRef();
  const navigate = useNavigate();

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
    navigate('/sobre');
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
                      rel="noopener noreferrer"
                      aria-label='LinkedIn'
                      data-label='LinkedIn'>
                      <RiLinkedinFill/>
                  </a>
                  
                  <a href='https://github.com/erick-s-vilhena' 
                      target='_blank'
                      rel="noopener noreferrer"
                      aria-label='GitHub'
                      data-label='GitHub'><RiGithubFill/>
                  </a>

                  <a href='mailto:erick.s.vilhena@gmail.com' 
                      target='_blank'
                      rel="noopener noreferrer"
                      aria-label='E-mail'
                      data-label='E-mail'><CgMail/></a>

                  <a href='https://drive.google.com/file/d/1DL-zjk_awGWAzrbJPufkkp4gFuxPGZOQ/view?usp=sharing' 
                      target='_blank'
                      rel="noopener noreferrer"
                      aria-label='Curriculo'
                      data-label='Curriculo'><TbFileCv/></a>
                  
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

        <div
          className={`seta_continue ${displaySeta}`}
          data-label='Vamos la!'
          aria-label='Ir para sobre'
        >
            <RiArrowDownDoubleFill className='seta' onClick={()=> rolarScroll()}/>
        </div>
    </div>
  )
}
