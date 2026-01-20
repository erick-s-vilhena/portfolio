import { IoClose } from 'react-icons/io5';
import '../styles/CertificadoAberto.scss'
import { MdOutlineContentCopy } from 'react-icons/md';
import { RiExternalLinkLine } from 'react-icons/ri';
import { useContexto } from '../context/Contexto';

export default function CertificadoAberto(){

    const { certificadoAberto, setCertificadoAberto, codigo, setCodigo } = useContexto();

    return (
        <div className="CertificadoAberto">
            <div className="sigle-aberto">
                <div className="img">
                    <IoClose onClick={()=>[setCertificadoAberto(null)]}/>

                    <img src={certificadoAberto.img} alt='bd'/>
                </div>

                
                <div className="info">
                    <p>Credencial: {certificadoAberto.codigo} <MdOutlineContentCopy
                                                                    onClick={(e) => {
                                                                        e.stopPropagation(); // 
                                                                        setCodigo(certificadoAberto.codigo);
                                                                        }} 
                                                                    style={{color: codigo == certificadoAberto.codigo && '#37c02d'}}/></p>

                    <a href='https://cursos.dankicode.com/validate-certificate' target="_blank">Verificar credencial <RiExternalLinkLine /></a>
                </div>
            </div>
        </div>
    )
}