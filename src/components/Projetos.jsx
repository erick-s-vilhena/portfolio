import { useEffect, useRef } from 'react';
import '../styles/Projetos.scss';

import ImgProjetoTeste from '../img/pro-metas.png';
import ImgProNivelameto from '../img/pro-nivelamento.png';

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
            behavior: "smooth",
          });
        } else {
          container.scrollTo({
            left: 0,
            behavior: "auto",
          });
        }
      },
      {
        threshold: 0.5,
      }
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

    container.setPointerCapture?.(e.pointerId);
    container.style.cursor = 'grabbing';
  };

  const handlePointerMove = (e) => {
    const container = containerRef.current;
    if (!container || !isDragging.current) return;

    const deltaX = e.clientX - startX.current;

    container.scrollLeft = startScrollLeft.current - deltaX;
  };

  const handlePointerUp = (e) => {
    const container = containerRef.current;
    if (!container) return;

    isDragging.current = false;
    container.releasePointerCapture?.(e.pointerId);
    container.style.cursor = 'grab';
  };

  const projetos = [
     {
          img: ImgProjetoTeste,
          titulo: 'Projeto Teste',
          recursos: ['js', 'html'] 
     },
          {
          img: ImgProjetoTeste,
          titulo: 'Projeto Teste',
          recursos: ['js', 'html'] 
     },
          {
          img: ImgProjetoTeste,
          titulo: 'Projeto Teste',
          recursos: ['js', 'html'] 
     },
          {
          img: ImgProjetoTeste,
          titulo: 'Projeto Teste',
          recursos: ['js', 'html'] 
     },
          {
          img: ImgProjetoTeste,
          titulo: 'Projeto Teste',
          recursos: ['js', 'html'] 
     },
          {
          img: ImgProjetoTeste,
          titulo: 'Projeto Teste',
          recursos: ['JS', 'HTML', 'CSS', 'React', 'Sass', 'Figma'] 
     },
               {
          img: ImgProjetoTeste,
          titulo: 'Projeto Teste',
          recursos: ['js', 'html'] 
     },
               {
          img: ImgProjetoTeste,
          titulo: 'Projeto Teste',
          recursos: ['js', 'html'] 
     },
               {
          img: ImgProjetoTeste,
          titulo: 'Projeto Teste',
          recursos: ['js', 'html'] 
     },
               {
          img: ImgProjetoTeste,
          titulo: 'Projeto Teste',
          recursos: ['js', 'html'] 
     },
               {
          img: ImgProNivelameto,
          titulo: 'Projeto Nivelamento',
          recursos: ['js', 'html'] 
     },
               {
          img: ImgProjetoTeste,
          titulo: 'Projeto Teste',
          recursos: ['JS', 'HTML', 'CSS', 'React', 'Sass', 'Figma'] 
               }
  ]

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
        <div className="auxlixar" style={{minWidth: `calc(${projetos.length} * 320px)`}}>
          
          {projetos.map((elemento, index)=>{
               return(
                    <div key={index} className="sigle-projetos">
                      <div className="img"
                        style={{ backgroundImage: `url(${elemento.img})` }} 
                      ></div>

                      <div className="info">
                        <h2>{elemento.titulo}</h2>

                        <div className="habilidades">
                          {elemento.recursos.map((hab, index) => {
                            return(
                              <div className={`${hab} hab`} key={index}><p>{hab}</p></div>
                            )
                          })}
                        </div>

                        {/* <div className="btn">
                          <button>Ver Projeto</button>
                        </div> */}
                      </div>
                    </div>
               )
          })}
        </div>
      </div>
    </div>
  );
}