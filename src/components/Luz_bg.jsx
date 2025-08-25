import { useEffect, useRef, useState } from 'react';
import '../styles/Luz_bg.scss';

export default function Luz_bg(){
    const [posLuz, setPosLuz] = useState(0)
    const sentido = useRef(1);
    const timeout = useRef();

    useEffect(()=>{

        function useScroll() {
            clearTimeout(timeout.current);

            timeout.current = setTimeout(() => {
                setPosLuz(prev => {
                    if (prev <= 0) {
                        sentido.current = 1;   // muda pra somar
                    } else if (prev >= 100) {
                        sentido.current = -1;  // muda pra subtrair
                    }

                    return prev + (sentido.current * (Math.floor(Math.random() * (50 - 25 + 1)) + 25));
                });
            }, 100);
        }

        window.addEventListener('scroll', useScroll);

        return ()=>{
            window.removeEventListener('scroll', useScroll)
            clearTimeout(timeout.current);
        }
    },[])


    return(
        <div className='Luz_bg'>
            <span className='luz um' style={{transform: `translateX(${posLuz}%)` }}/>        
            <span className='luz dois' style={{transform: `translateX(-${posLuz}%)` }}/>                      
        </div>
    )
}