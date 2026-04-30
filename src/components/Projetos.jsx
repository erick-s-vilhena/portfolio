import { useEffect, useRef, useState } from 'react';
import '../styles/Projetos.scss';
import ImgProMetas from '../img/pro-metas.png';
import ImgProNivelameto from '../img/pro-nivelamento.png';
import ImgProGeoPortaL from '../img/pro-geoportal.png';
import ImgProCrossRoad from '../img/pro-crossroad.png';
import ImgProProtejaTerra from '../img/pro-protejaterra.png';
import ImgProLand1 from '../img/pro-land-1.png';
import ImgProLand2 from '../img/pro-land-2.png';
import ImgProLand3 from '../img/pro-land-3.png';
import ImgProLand4 from '../img/pro-land-4.png';
import ImgProLand5 from '../img/pro-land-5.png';
import ImgProLand10 from '../img/pro-land-10.png';
import ImgProLand11 from '../img/pro-land-11.png';
import ImgProLandStar from '../img/pro-land-star.png';
import ImgProNetflix from '../img/pro-netflix.png';
import { BsArrowRight } from 'react-icons/bs';

export default function Projetos() {
  const [projetoAtivo, setProjetoAtivo] = useState(12);
  const [hoverBloqueado, setHoverBloqueado] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const projetos = [
    {
      img: ImgProLand1,
      titulo: 'A 1ª Landing Page',
      link: 'https://erick-s-vilhena.github.io/galeria/',
      recursos: ['HTML', 'CSS'],
      descricao: 'A primeira landing page que fiz, foi um projeto de estudo para aprender a criar layouts responsivos e estilizados usando HTML e CSS.'
    },
    {
      img: ImgProLandStar,
      titulo: 'Landing Page Starbucks',
      link: 'https://erick-s-vilhena.github.io/galeria/starbucks/',
      recursos: ['HTML', 'CSS'],
      descricao: 'Uma landing page inspirada no design da Starbucks, focada em criar uma experiência visual agradável, moderna e simples.'
    },
    {
      img: ImgProLand2,
      titulo: 'Landing Page para Hotel',
      link: 'https://erick-s-vilhena.github.io/2-Landing-Page/',
      recursos: ['HTML', 'CSS'],
      descricao: 'A landing page para um hotel, projetada para destacar os serviços e comodidades oferecidos, com um design elegante e convidativo.'
    },
    {
      img: ImgProLand11,
      titulo: 'Landing Page de Jogo Mobile',
      link: 'https://erick-s-vilhena.github.io/galeria/projeto_11/',
      recursos: ['HTML', 'CSS'],
      descricao: 'Uma landing page para um jogo mobile, focada em criar uma experiência visual agradável e moderna e leve.'
    },
    {
      img: ImgProLand10,
      titulo: 'Vendas Online',
      link: 'https://erick-s-vilhena.github.io/galeria/projeto_10/',
      recursos: ['JS', 'HTML', 'CSS'],
      descricao: 'Uma landing page para vendas online, desenvolvida para praticar habilidades avançadas e indroduzir o JavaScript.'
    },
    {
      img: ImgProLand3,
      titulo: 'Landing Page para Sistemas',
      link: 'https://erick-s-vilhena.github.io/galeria/projeto_03/',
      recursos: ['JS', 'HTML', 'CSS'],
      descricao: 'Uma landing page para sistemas, projetada para destacar as funcionalidades e benefícios de um software, com um design moderno e interativo.'
    },
    {
      img: ImgProLand5,
      titulo: 'Vendas de Carros',
      link: 'https://erick-s-vilhena.github.io/galeria/projeto_05/',
      recursos: ['JS', 'HTML', 'CSS'],
      descricao: 'Uma landing page para vendas de carros, projetada para destacar os veículos disponíveis e facilitar o processo de compra.'
    },
    {
      img: ImgProLand4,
      titulo: 'Clinicas Odontológicas',
      link: 'https://erick-s-vilhena.github.io/galeria/projeto_04/',
      recursos: ['JS', 'HTML', 'CSS'],
      descricao: 'Uma landing page focada em criar uma experiência visual agradável e moderna, destacando os serviços oferecidos e facilitando o contato.'
    },
    {
      img: ImgProProtejaTerra,
      titulo: 'Protect the Earth',
      link: 'https://erick-s-vilhena.github.io/Protect-the-Earth/',
      recursos: ['JS', 'HTML', 'CSS'],
      descricao: 'Um jogo simples onde o jogador controla uma nave para proteger a Terra de meteoros, desenvolvido para praticar habilidades de JavaScript.'
    },
    {
      img: ImgProNetflix,
      titulo: 'Netflix Clone',
      link: 'https://erick-s-vilhena.github.io/galeria/Projeto_Netflix',
      recursos: ['JS', 'HTML', 'Tailwind'],
      descricao: 'Um clone da interface da Netflix, desenvolvido para praticar habilidades de Tailwind CSS e criar uma experiência visual agradável e moderna.'
    },
    {
      img: ImgProCrossRoad,
      titulo: 'Cross the Chicken',
      link: 'https://erick-s-vilhena.github.io/cross-the-chicken/',
      recursos: ['JS', 'HTML', 'Tailwind', 'Node'],
      descricao: 'O jogador controla uma galinha para atravessar a rua, evitando carros, desenvolvido para praticar habilidades de JavaScript em ambiente 3D.'
    },
    {
      img: ImgProGeoPortaL,
      titulo: 'Geo-Portal PPGDAM',
      link: 'https://geoportal-ppgedam.web.app/',
      recursos: ['JS', 'HTML', 'CSS', 'React', 'Sass', 'Firebase', 'Node'],
      descricao: 'Um portal geográfico para o Programa de Pós-Graduação em Desenvolvimento na Amazônia (PPGDAM/UFPA)'
    },
    {
      img: ImgProNivelameto,
      titulo: 'Nivelamento UFPA',
      link: 'https://nivelamentoitec.ufpa.br/',
      recursos: ['JS', 'HTML', 'CSS', 'Figma'],
      descricao: 'Um site de nivelamento para os calouros do Instituto de Tecnologia (ITEC/UFPA), desenvolvido para fornecer conhecimentos e recursos úteis para os novos estudantes.'
    },
    {
      img: ImgProMetas,
      titulo: 'Metas de Segurança do Paciente',
      link: 'https://metas-sp.web.app/',
      recursos: ['JS', 'HTML', 'CSS', 'React', 'Sass', 'Figma', 'Firebase'],
      descricao: 'Um projeto para ensinar e avaliar profissionais da saúde sobre metas de segurança do paciente em um ambiente hospitalar.'
    }
  ];

  function calcularOffset(index) {
    let diferenca = index - projetoAtivo;
    const metade = Math.floor(projetos.length / 2);

    if (diferenca > metade) diferenca -= projetos.length;
    if (diferenca < -metade) diferenca += projetos.length;

    return diferenca;
  }

  function projetoVisivel(offset) {
    return Math.abs(offset) <= 2;
  }

  function bloquearHoverTemporariamente() {
    setHoverBloqueado(true);

    if (hoverTimeoutRef.current) {
      window.clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = window.setTimeout(() => {
      setHoverBloqueado(false);
      hoverTimeoutRef.current = null;
    }, 380);
  }

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        window.clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`Projetos ${hoverBloqueado ? 'bloquear-hover' : ''}`} id="projetos">
      <h1 className="hidden bt">
        A Jornada até aqui
        <p>Algumas logotipos e imagens dos projetos desenvolvidos foram omitidos para proteção de direitos autorais.</p>
      </h1>

      <div className="carousel-shell">
        <div className="container">
          {projetos.map((elemento, index) => {
            const offset = calcularOffset(index);
            const cardNavegavel = Math.abs(offset) === 2;

            return (
              <div
                key={index}
                className={`sigle-projetos ${index === projetoAtivo ? 'ativo' : ''} ${projetoVisivel(offset) ? 'visivel' : 'oculto'} ${cardNavegavel ? 'navegavel' : ''}`}
                data-offset={offset}
                onClick={() => {
                  if (cardNavegavel) {
                    bloquearHoverTemporariamente();
                    setProjetoAtivo((prev) => {
                      if (offset < 0) {
                        return (prev - 1 + projetos.length) % projetos.length;
                      }

                      return (prev + 1) % projetos.length;
                    });
                  }
                }}
              >
                <div
                  className="img"
                  style={{ backgroundImage: `url(${elemento.img})` }}
                />

                <div className="capa">
                  <h2>{elemento.titulo}</h2>
                </div>

                <div className="info">
                  <div className="habilidades">
                    {elemento.recursos.map((hab, habIndex) => (
                      <div className={`${hab} hab`} key={habIndex}>
                        <p>{hab}</p>
                      </div>
                    ))}
                  </div>
                  <p>{elemento.descricao}</p>

                  <div className="btn">
                    <a
                      href={elemento.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Acessar projeto <BsArrowRight />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
