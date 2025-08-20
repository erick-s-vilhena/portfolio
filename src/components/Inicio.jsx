import { RiGithubFill, RiLinkedinFill } from 'react-icons/ri';
import '../styles/Inicio.scss';
import { CgMail } from 'react-icons/cg';
import { TbFileCv } from 'react-icons/tb';
import Img_Inicio from './Img_Inicio';

export default function Inicio(){
  return(
    <div className='Inicio'>
        <div className="texto">
            <div className="aux">
                <h3>Olá, sou</h3>
                <h1>Desenvolvedor <br/> Front-End</h1>
                <p>Tenho paixão por criar soluções escaláveis e <br/> responsivas, seja bem vindo</p>

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
          <div className="aux">
            <Img_Inicio/>
          </div>
        </div>
    </div>
  )
}