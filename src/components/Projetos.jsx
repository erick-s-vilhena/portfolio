import { useEffect, useRef } from 'react';
import '../styles/Projetos.scss'

export default function Projetos(){
     const containerRef = useRef(null);
     const sectionRef = useRef(null);

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
          threshold: 0.5, // ativa quando 50% da seção estiver visível
          }
     );

     observer.observe(section);

     return () => observer.disconnect();
     }, []);

   return (
       <div className='Projetos' id='projetos' ref={sectionRef} >
            <h1 className='hidden bt'>A Jornada até aqui</h1>

            <div className="container" ref={containerRef}>
                    <div className="auxlixar">
                         <div className="sigle-projetos"></div>

                         <div className="sigle-projetos"></div>

                         <div className="sigle-projetos"></div>

                         <div className="sigle-projetos"></div>

                         <div className="sigle-projetos"></div>
                    </div>
            </div>

       </div>
)
}