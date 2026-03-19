import { useEffect, useRef } from 'react';
import '../styles/Projetos.scss';

import ImgProjetoTeste from '../img/pro-metas.png';
import ImgProMetas from '../img/pro-metas.png';
import ImgProNivelameto from '../img/pro-nivelamento.png';
import ImgProGeoPortaL from '../img/pro-geoportal.png';
import ImgProCrossRoad from '../img/pro-crossroad.png';
import ImgProProtejaTerra from '../img/pro-protejaterra.png';

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
      img: ImgProProtejaTerra,
      titulo: 'Protect the Earth',
      link: 'https://erick-s-vilhena.github.io/Protect-the-Earth/',
      recursos: ['js', 'html']
    },
    {
      img: ImgProCrossRoad,
      titulo: 'Cross the Chicken',
      link: 'https://erick-s-vilhena.github.io/cross-the-chicken/',
      recursos: ['js', 'html']
    },
    {
      img: ImgProGeoPortaL,
      titulo: 'Geo-Portal PPGDAM',
      link: 'https://geoportal-ppgedam.web.app/',
      recursos: ['JS', 'HTML', 'CSS', 'React', 'Sass', 'Firebase']
    },
    {
      img: ImgProNivelameto,
      titulo: 'Nivelamento UFPA',
      link: 'https://nivelamentoitec.ufpa.br/',
      recursos: ['JS', 'HTML', 'CSS', 'Figma']
    },
    {
      img: ImgProMetas,
      titulo: 'Metas SP',
      link: 'https://geoportal-ppgedam.web.app/',
      recursos: ['JS', 'HTML', 'CSS', 'React', 'Sass', 'Figma', 'Firebase']
    }
  ];

  return (
    <div className='Projetos' id='projetos' ref={sectionRef}>
      <h1 className='hidden bt'>A Jornada até aqui</h1>

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
                <h2>{elemento.titulo}</h2>

                <div className="habilidades">
                  {elemento.recursos.map((hab, index) => (
                    <div className={`${hab} hab`} key={index}>
                      <p>{hab}</p>
                    </div>
                  ))}
                </div>

                <div className="btn">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirProjeto(elemento.link);
                    }}
                  >
                    Ver Projeto
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