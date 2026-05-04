import '../styles/Sobre.scss';
import { BsArrowRight } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import Perfil from '../img/perfil.jpg';
import Habilidades from './Hablidades';

export default function Sobre() {
  return (
    <div className="Sobre" id="sobre">
      <h1 className="hidden tp">Sobre mim</h1>

      <div className="Sobre-mim">
        <div className="topo">
          <div className="texto hidden lf">
            <div className="aux">
              <h3>Eu me chamo,</h3>
              <h2>Erick Vilhena</h2>
              <p>
                Crio experiências digitais fluidas e modernas, unindo tecnologia,
                design e desempenho. Do front-end à escalabilidade, aplico
                soluções criativas e resilientes, sempre atento a detalhes
                visuais e funcionais para entregar projetos otimizados e voltados
                à melhor experiência do usuário.
              </p>

              <div className="contianer-btn">
                <a
                  href="https://drive.google.com/file/d/1DL-zjk_awGWAzrbJPufkkp4gFuxPGZOQ/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button>
                    <span>
                      Conferir CV <BsArrowRight />
                    </span>
                  </button>
                </a>

                <NavLink to="/projetos">
                  <button>
                    <span>
                      Meus projetos <BsArrowRight />
                    </span>
                  </button>
                </NavLink>
              </div>
            </div>
          </div>

          <div className="perfil hidden rt">
            <div className="aux">
              <div className="giro">
                <div className="quadrado um">
                  <div className="linha um"></div>
                </div>

                <div className="quadrado dois">
                  <div className="linha dois"></div>
                </div>
              </div>

              <img src={Perfil} alt="" />
            </div>
          </div>
        </div>

        <div className="habilidades-inline hidden bt">
          <Habilidades compacto />
        </div>
      </div>
    </div>
  );
}
