import '../styles/Certificados.scss';
import { RiExternalLinkLine } from 'react-icons/ri';
import ImgWebDesigner from '../img/ImgWebDesigner.png'
import ImgBancoDeDados from '../img/ImgBancoDeDados.png'
import ImgFrontEndCompleto from '../img/ImgFrontEndComp.png'
import ImgFirebase from '../img/ImgFirebase.png'
import ImgFrontEnd2 from '../img/ImgFrontEnd2.png'
import ImgJavaScriptCompleto from '../img/ImgJavaScriptCompleto.png'
import ImgNodeJs from '../img/ImgNodeJs.png';
import ImgDesignerWeb from '../img/ImgDesignerWeb.png';
import ImgDesenvolvimentoWeb from '../img/ImgDesenvolvimentoWeb.png';
import ImgLogicaDePrograma from '../img/ImgLogicaDePrograma.png';
import { MdOutlineContentCopy } from 'react-icons/md';
import { FaExpand } from 'react-icons/fa';
import { useContexto } from '../context/Contexto';

export default function Certificados({ativo}){

    const { certificadoAberto, setCertificadoAberto, codigo, setCodigo } = useContexto();

    const infoCertificado = [
        {
            curso: 'Front-End Completo',
            img: ImgFrontEndCompleto,
            codigo: '8997dce5-ba2f-4a3a-acb2-7d87ee62acd4'
        },
        {
            curso: 'JavaScript Completo',
            img: ImgJavaScriptCompleto,
            codigo: '1813e74d-a870-466f-be85-17c9f82c081b'
        },
        {
            curso: 'Desenvolvimento Web',
            img: ImgDesenvolvimentoWeb,
            codigo: '1e43b62f-0707-47b7-be9f-5ad6ccc58270'
        },
        {
            curso: 'Web Designer Express',
            img: ImgWebDesigner,
            codigo: '2e767654-aafb-4a4c-a737-f53d8261d729'
        },
                {
            curso: 'Front-End Completo 2.0',
            img: ImgFrontEnd2,
            codigo: '9166379f-7ada-4151-ad80-dc551f66326d'
        },
        {
            curso: 'Banco de Dados',
            img: ImgBancoDeDados,
            codigo: '3de4da70-1bc2-434d-8539-72494d882253'
        },
        {
            curso: "Lógica de Programação",
            img: ImgLogicaDePrograma,
            codigo: 'dba0ff93-b0f5-459d-a280-47544ec91ccc'
        },
        {
            curso: 'Firebase',
            img: ImgFirebase,
            codigo: 'ae79fcc9-a06f-4792-81b8-1e4bab0924df'
        },
        {
            curso: 'Node js',
            img: ImgNodeJs,
            codigo: 'c1446dd3-11a2-42bc-ada1-500b94bae0bd'
        },
        {
            curso: 'Desinger para Web',
            img: ImgDesignerWeb,
            codigo: '966c2ca4-1417-4484-8417-4dc3be9641bf'
        }
    ];


   return (
       <div className={`Certificados slide ${ativo !== 1 && true}`} >  
       {console.log(certificadoAberto)}         
            <div className="container-certificados">
                {infoCertificado.map((item, index)=>{
                    return(
                        <div key={index} 
                            className={`sigle-certificado hidden ${index % 2 == 0 ? 'lbt' : 'rbt'}`}
                            onClick={()=> window.innerWidth < 768 &&  setCertificadoAberto(item)}>
                            <div className="img" onClick={()=> setCertificadoAberto(item)}>
                                <img src={item.img} alt={item.curso}/>
                                <FaExpand />
                            </div>
                             
                            <div className='texto'>
                                <h3>{item.curso}</h3>

                                <p title={item.codigo}>Credencial: <MdOutlineContentCopy 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation(); // 
                                                                            setCodigo(item.codigo);
                                                                            }} 
                                                                        style={{color: codigo == item.codigo && '#37c02d'}}/></p>
                                {/* <span>{item.codigo}</span> */}
                                <a href='https://cursos.dankicode.com/validate-certificate' target="_blank">Verificar credencial <RiExternalLinkLine /></a>
                            </div>
                        </div>
                    )
                })}
            </div>
       </div>
    )
}