import { useEffect, useRef } from 'react';
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
import { BsArrowRight } from "react-icons/bs";

export default function Projetos() {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;

    if (!section || !container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          container.scrollTo({
            left: container.scrollWidth,
            behavior: 'smooth',
          });
        } else {
          container.scrollTo({
            left: 0,
            behavior: 'auto',
          });
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handlePointerDown = (e) => {
    const container = containerRef.current;
    if (!container) return;

    isDragging.current = true;
    startX.current = e.clientX;
    startScrollLeft.current = container.scrollLeft;
    container.style.cursor = 'grabbing';
  };

  const handlePointerMove = (e) => {
    const container = containerRef.current;
    if (!container || !isDragging.current) return;

    const deltaX = e.clientX - startX.current;
    container.scrollLeft = startScrollLeft.current - deltaX;
  };

  const handlePointerUp = () => {
    const container = containerRef.current;
    if (!container) return;

    isDragging.current = false;
    container.style.cursor = 'grab';
  };

  const abrirProjeto = (link) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

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
      titulo: 'Landing Page para Vendas Online',
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
      titulo: 'Landing Page para Vendas de Carros',
      link: 'https://erick-s-vilhena.github.io/galeria/projeto_05/',
      recursos: ['JS', 'HTML', 'CSS'],
      descricao: 'Uma landing page para vendas de carros, projetada para destacar os veículos disponíveis e facilitar o processo de compra.'
    },

    {
      img: ImgProLand4,
      titulo: 'Landing Page para Clinicas Odontológicas',
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
      link: 'https://erick-s-vilhena.github.io/netflix-clone/',
      recursos: ['JS', 'HTML', 'Tailwind'],
      descricao: 'Um clone da interface da Netflix, desenvolvido para praticar habilidades de Tailwind CSS e criar uma experiência visual agradável e moderna.'
    },
    {
      img: ImgProCrossRoad,
      titulo: 'Cross the Chicken',
      link: 'https://erick-s-vilhena.github.io/cross-the-chicken/',
      recursos: ['JS', 'HTML', 'Node', 'Tailwind'],
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

  return (
    <div className='Projetos' id='projetos' ref={sectionRef}>
      <h1 className='hidden bt'>A Jornada até aqui

        <p>Algumas logotipos e imagens dos projetos desenvolvidos foram omitidos para proteção de direitos autorais.</p>
      </h1>

      <div
        className="container"
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ cursor: 'grab', touchAction: 'pan-y' }}
      >
        <div className="auxlixar" style={{ minWidth: `calc(${projetos.length} * 320px)` }}>
          {projetos.map((elemento, index) => (
            <div key={index} className="sigle-projetos">
              <div
                className="img"
                style={{ backgroundImage: `url(${elemento.img})` }}
              />

              <div className="info">
                <div className="habilidades">
                  {elemento.recursos.map((hab, index) => (
                    <div className={`${hab} hab`} key={index}>
                      <p>{hab}</p>
                    </div>
                  ))}
                </div>

                <h2>{elemento.titulo}</h2>

                <p>{elemento.descricao}</p>

                <div className="btn">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirProjeto(elemento.link);
                    }}
                  >
                    Acessar projeto <BsArrowRight />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
