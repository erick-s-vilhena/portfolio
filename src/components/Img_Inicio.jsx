import '../styles/Img_Inicio.scss';
import { FaGear } from "react-icons/fa6";
import  Computador  from '../img/computador.svg';
import  Notebook  from '../img/notebook.svg';
import  Tablet  from '../img/tablet.svg';
import  Celular  from '../img/celular.svg';

export default function Img_Inicio(){

    return(
        <div className='Img_Inicio'>
            <FaGear className='gear' style={{left: 0, top:0, fontSize: 100}}/>
            <FaGear className='gear' style={{right: 0, top: 40, fontSize: 80}}/>
            <FaGear className='gear' style={{left: '40%', bottom:0, fontSize: 120}}/>

            <div className="computador">
                <img src={Computador} alt="" />
                
                <div className='tela'>
                    <span style={{left: 10, top: 10, width: '20px', backgroundColor: 'var(--cor-prima)'}}/>

                    <span style={{left: 10, top: 50, width: '60px', backgroundColor: 'var(--cor-titulo)'}}/>

                    <span style={{left: 10, top: 64, width: '50px', backgroundColor: 'var(--cor-texto)'}}/>

                    <div className='aux'>
                        <span/>

                        <span/>

                        <span/>

                        <span/>
                    </div>

                    <span style={{left: '60%', top: '25%', width: '50px', height: '50px', backgroundColor: 'var(--cor-secun)'}}></span>
                </div>
            </div>

            <div className='notebook'>
                <img src={Notebook}/>

                <div className='tela'>
                    <span style={{left: 10, top: 10, width: '20px', backgroundColor: 'var(--cor-prima)'}}/>

                    <span style={{left: 10, top: 50, width: '60px', backgroundColor: 'var(--cor-titulo)'}}/>

                    <span style={{left: 10, top: 64, width: '50px', backgroundColor: 'var(--cor-texto)'}}/>

                    <div className='aux'>
                        <span/>

                        <span/>

                        <span/>

                        <span/>
                    </div>

                    <span style={{left: '60%', top: '25%', width: '50px', height: '50px', backgroundColor: 'var(--cor-secun)'}}></span>
                </div>
            </div>

            <div className='tablet'>
                <img src={Tablet}/>

                <div className='tela'>
                    <span style={{left: 10, top: 10, width: '20px', backgroundColor: 'var(--cor-prima)'}}/>

                    <span style={{left: 10, top: 30, width: '60px', backgroundColor: 'var(--cor-titulo)'}}/>

                    <span style={{left: 10, top: 50, width: '50px', backgroundColor: 'var(--cor-texto)'}}/>

                    <div className='aux'>
                        <span/>

                        <span/>

                        <span/>

                        <span/>
                    </div>

                    <span style={{left: '60%', top: '25%', width: '40px', height: '40px', backgroundColor: 'var(--cor-secun)'}}></span>
                </div>
            </div>


            <div className='celular'>
                <img src={Celular}/>

                <div className='tela'>
                    <span style={{left: 5, top: 4, width: '20px', backgroundColor: 'var(--cor-prima)'}}/>

                    <span style={{left: 5, top: 25, width: '40px', backgroundColor: 'var(--cor-titulo)'}}/>

                    <span style={{left: 5, top: 40, width: '30px', backgroundColor: 'var(--cor-texto)'}}/>

                    <div className='aux'>
                        <span/>

                        <span/>

                        <span/>

                        <span/>
                    </div>

                    <span style={{left: '8px', bottom: '-30%', width: '40px', height: '40px', backgroundColor: 'var(--cor-secun)'}}></span>
                </div>
            </div>
        </div>
    )
}