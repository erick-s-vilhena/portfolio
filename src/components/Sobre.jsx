import { useEffect, useState } from 'react'
import '../styles/Sobre.scss'
import SobreMim from './Sobre-Mim'
import Certificados from './Certificados';
import Habilidades from './Hablidades';
import { PiCertificateBold, PiUserCheckBold } from 'react-icons/pi';
import { BiCube } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';
import { MdOutlineContentCopy } from 'react-icons/md';
import { RiExternalLinkLine } from 'react-icons/ri';
import CertificadoAberto from './CertificadoAberto';
import { useContexto } from '../context/Contexto';

export default function Sobre(){
    const [ativo, setAtivo] = useState(0);

    const { codigo } = useContexto();

    useEffect(()=>{
        navigator.clipboard.writeText(codigo)
        .then(() => console.log("Copiado!"))
        .catch(err => console.log("Erro:", err)); 
    },[codigo])

    const botoes = [
        {
            sobre: "Sobre",
            icone: <PiUserCheckBold />
        },{
            sobre: "Certificados",
            icone: <PiCertificateBold />
        },{
            sobre: "Habilidades",
            icone: <BiCube />
        }];

    return (
        <div className='Sobre' id='sobre'>
                <h1 className='hidden tp'>Sobre mim</h1>

                <div className="menu-sobre">
                    <nav>
                        {botoes.map((texto, index) => (
                            <button key={index} onClick={() => setAtivo(index)} className={`${ativo === index ? "true" : ""}`}>
                                {texto.icone}{texto.sobre} 
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="container-slides">
                    <div className="aux-slides" style={{transform: `translateX(calc((-100% / 3) * ${ativo}))`}}>
                        <SobreMim ativo={ativo}/>

                        <Certificados ativo={ativo}/>

                        <Habilidades ativo={ativo}/>
                    </div>
                </div>
        </div>
    )
}