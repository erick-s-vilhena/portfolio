import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import '../styles/Luz_bg.scss';

const ROTACOES_LUZ = [-28, -16, -8, 8, 16, 28];

export default function Luz_bg({ trigger }){
    const [rotacaoLuz, setRotacaoLuz] = useState(ROTACOES_LUZ[0])
    const [entradaAtiva, setEntradaAtiva] = useState(false);
    const [certificadosOrbitaAtiva, setCertificadosOrbitaAtiva] = useState(false);
    const introFrame = useRef();
    const rectsFrame = useRef();
    const orbitTimeout = useRef();
    const luzRefs = useRef({});
    const ultimosRects = useRef({});
    const layoutAnterior = useRef(`${trigger}-base`);
    const sobreAtivo = trigger === '/sobre';
    const projetosAtivo = trigger === '/projetos';
    const certificadosAtivo = trigger === '/certificados';
    const chaveLayout = `${trigger}-${certificadosOrbitaAtiva ? 'orbita' : 'base'}`;

    function moverLuz() {
        setRotacaoLuz(prev => {
            const proximasRotacoes = ROTACOES_LUZ.filter((rotacao) => rotacao !== prev);
            const proximaRotacao =
                proximasRotacoes[Math.floor(Math.random() * proximasRotacoes.length)];

            return proximaRotacao;
        });
    }

    useEffect(()=>{
        introFrame.current = window.requestAnimationFrame(() => {
            setEntradaAtiva(true);
        });

        return () => {
            window.cancelAnimationFrame(introFrame.current);
        };
    }, [])

    useEffect(() => {
        function atualizarRects() {
            Object.entries(luzRefs.current).forEach(([chave, elemento]) => {
                if (!elemento) return;

                const rect = elemento.getBoundingClientRect();
                ultimosRects.current[chave] = rect;
            });

            rectsFrame.current = window.requestAnimationFrame(atualizarRects);
        }

        rectsFrame.current = window.requestAnimationFrame(atualizarRects);

        return () => {
            window.cancelAnimationFrame(rectsFrame.current);
        };
    }, []);

    useEffect(() => {
        clearTimeout(orbitTimeout.current);

        if (!certificadosAtivo) {
            setCertificadosOrbitaAtiva(false);
            return;
        }

        setCertificadosOrbitaAtiva(false);

        orbitTimeout.current = window.setTimeout(() => {
            setCertificadosOrbitaAtiva(true);
        }, 1400);

        return () => {
            clearTimeout(orbitTimeout.current);
        };
    }, [certificadosAtivo]);

    useEffect(() => {
        moverLuz();
    }, [trigger]);

    useLayoutEffect(() => {
        const mudouLayout = layoutAnterior.current !== chaveLayout;

        if (!mudouLayout) return;

        Object.entries(luzRefs.current).forEach(([chave, elemento]) => {
            if (!elemento) return;

            const rectAnterior = ultimosRects.current[chave];
            const rectAtual = elemento.getBoundingClientRect();

            if (!rectAnterior) return;

            const deltaX = rectAnterior.left - rectAtual.left;
            const deltaY = rectAnterior.top - rectAtual.top;

            if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;

            elemento.animate(
                [
                    { translate: `${deltaX}px ${deltaY}px` },
                    { translate: '0px 0px' },
                ],
                {
                    duration: 1100,
                    easing: 'cubic-bezier(0.22, 0.8, 0.2, 1)',
                    fill: 'both',
                }
            );
        });

        layoutAnterior.current = chaveLayout;
    }, [chaveLayout]);


    return(
        <div className={`Luz_bg ${entradaAtiva ? 'entrada-ativa' : ''} ${sobreAtivo ? 'sobre-ativa' : ''} ${projetosAtivo ? 'projetos-ativa' : ''} ${certificadosAtivo ? 'certificados-ativa' : ''} ${certificadosOrbitaAtiva ? 'certificados-orbita' : ''}`}>
            <span ref={(elemento) => { luzRefs.current.um = elemento; }} className='luz um' style={{ '--rotacao-luz': `${rotacaoLuz}deg` }}/>        
            <span ref={(elemento) => { luzRefs.current.dois = elemento; }} className='luz dois' style={{ '--rotacao-luz': `${rotacaoLuz * -1}deg` }}/>
            <span ref={(elemento) => { luzRefs.current.tres = elemento; }} className='luz tres menor' style={{ '--rotacao-luz': `${rotacaoLuz * -1}deg` }}/>
            <span ref={(elemento) => { luzRefs.current.quatro = elemento; }} className='luz quatro menor' style={{ '--rotacao-luz': `${rotacaoLuz}deg` }}/>                      
        </div>
    )
}
