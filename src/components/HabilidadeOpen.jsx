import { IoClose } from 'react-icons/io5';
import { useContexto } from '../context/Contexto'
import '../styles/HabilidadeOpen.scss'

export default function HabilidadeOpen(){
    const { habilidadeOpen, setHabilidadeOpen } = useContexto(); 

   return (
       <div className='HabilidadeOpen'>
            <div className="single-habilidade">
                <IoClose onClick={()=>[setHabilidadeOpen(null)]}/>
                <div className="img">
                    <img src={habilidadeOpen.logo} alt='bd'/>
                </div>

                <div className="info">
                    <h1>{habilidadeOpen.habilidade}</h1>

                    <p>{habilidadeOpen.descricao}</p>
                </div>
            </div>
       </div>
)
}