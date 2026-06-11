import '../styles/Contatos.scss'
import SnakeGame from './SnakeGame'
import ContactForm from './ContactForm'
import { RiGithubFill, RiLinkedinFill } from 'react-icons/ri'
import { CgMail } from 'react-icons/cg'
import { TbFileCv } from 'react-icons/tb'
import Perfil from '../img/perfil.jpg'

export default function Contatos() {
  return (
    <div className='Contatos'>
      <h1>Contatos</h1>

      <div className='contatos-topo'>
        <div className='contatos-container'>
          <div className='icons_contato icons_contato--topo'>
            <a
              href='https://linkedin.com/in/erick-vilhena/'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='LinkedIn'
              data-label='LinkedIn'
            >
              <RiLinkedinFill />
            </a>

            <a
              href='https://github.com/erick-s-vilhena'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='GitHub'
              data-label='GitHub'
            >
              <RiGithubFill />
            </a>

            <a
              href='mailto:esv.curriculo@gmail.com'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='E-mail'
              data-label='E-mail'
            >
              <CgMail />
            </a>

            <a
              href='https://drive.google.com/file/d/1xhVvvloqRBEdd-TPT4MBdAtXaMucA2ux/view?usp=sharing'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Curriculo'
              data-label='Curriculo'
            >
              <TbFileCv />
            </a>
          </div>

          <ContactForm />
        </div>

        <div className='contatos-perfil'>
          <div className='perfil-card'>
            <div className='perfil-visual'>
              <div className='giro'>
                <div className='quadrado um'>
                  <div className='linha um'></div>
                </div>

                <div className='quadrado dois'>
                  <div className='linha dois'></div>
                </div>
              </div>

              <img src={Perfil} alt='Foto de Erick Vilhena' />
            </div>

            <div className='icons_contato icons_contato--perfil'>
              <a
                href='https://linkedin.com/in/erick-vilhena/'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='LinkedIn'
                data-label='LinkedIn'
              >
                <RiLinkedinFill />
              </a>

              <a
                href='https://github.com/erick-s-vilhena'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='GitHub'
                data-label='GitHub'
              >
                <RiGithubFill />
              </a>

              <a
                href='mailto:esv.curriculo@gmail.com'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='E-mail'
                data-label='E-mail'
              >
                <CgMail />
              </a>

              <a
                href='https://drive.google.com/file/d/1xhVvvloqRBEdd-TPT4MBdAtXaMucA2ux/view?usp=sharing'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Curriculo'
                data-label='Curriculo'
              >
                <TbFileCv />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className='game'>
        <SnakeGame />
      </div>
    </div>
  )
}
