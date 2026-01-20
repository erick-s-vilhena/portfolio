import '../styles/Sobre-mim.scss';
import { BsArrowRight } from "react-icons/bs";
import  Perfil  from '../img/perfil.jpg';


export default function SobreMim({ativo}){

   return (
       <div className={`Sobre-mim slide ${ativo !== 0 && true}`} >
            <div className="texto">
                <div className="aux hidden lf">
                    <h3>Eu me chamo,</h3>
                    <h2>Erick Vilhena</h2>
                    <p>Crio experiências digitais fluidas e modernas, unindo tecnologia, design e desempenho. Do front-end à escalabilidade, aplico soluções criativas e resilientes, sempre atento a detalhes visuais e funcionais para entregar projetos otimizados e voltados à melhor experiência do usuário.</p>

                    <div className='contianer-btn'>
                        <button><span>Baixar CV <BsArrowRight /></span></button>
                        <button><span>Meus projetos <BsArrowRight /></span></button>
                    </div>
                </div>
            </div>

            <div className="perfil">
                <div className='aux hidden rt'>
                        <div className='giro'>
                            <div className='quadrado um'>
                                <div className='linha um'></div>
                            </div>

                            <div className='quadrado dois'>
                                <div className='linha dois'></div>
                            </div>
                        </div>

                    <img src={Perfil} alt="" />
                </div>
            </div>


       </div>
)
}