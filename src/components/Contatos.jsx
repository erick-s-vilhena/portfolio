import '../styles/Contatos.scss'
import SnakeGame from './SnakeGame'
import ContactForm from './ContactForm'
import { RiGithubFill, RiLinkedinFill } from 'react-icons/ri'
import { CgMail } from 'react-icons/cg'
import { TbFileCv } from 'react-icons/tb'

export default function Contatos(){
   return (
       <div className='Contatos'>
            <h1>Contatos</h1>

            <div className='contatos-container'>
                <div className='icons_contato'>
                                    <a  
                      href='https://linkedin.com/in/erick-vilhena/' 
                      target='_blank'
                      rel="noopener noreferrer">
                      <RiLinkedinFill/>
                  </a>
                  
                  <a href='https://github.com/erick-s-vilhena' 
                      target='_blank'
                      rel="noopener noreferrer"><RiGithubFill/>
                  </a>

                  <a href='mailto:erick.s.vilhena@gmail.com' 
                      target='_blank'
                      rel="noopener noreferrer"><CgMail/></a>

                  <a href='https://drive.google.com/file/d/1DL-zjk_awGWAzrbJPufkkp4gFuxPGZOQ/view?usp=sharing' 
                      target='_blank'
                      rel="noopener noreferrer"><TbFileCv/></a>

                </div>

                <ContactForm/>
            </div>
            

            <div className="game">
                <SnakeGame/>
            </div>
       </div>
)
}