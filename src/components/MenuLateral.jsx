import '../styles/MenuLateral.scss';

export default function MenuLateral(){ 

    const sessoes = ['Início', 'Sobre mim', 'Projetos', 'Contatos'];


    function Ponto({texto, sessao}){
        return(
            <div className='ponto'>
                <div  className={`quadrado`}></div>
                {/* <p>{texto}</p> */}
            </div>
        )
    }

    return(
        <div className="menu_lateral">

            <section className='container'>
                {sessoes.map((sessao, index)=>{
                    return(
                        <Ponto key={index} texto={sessao} sessao={sessao}/>
                    )
                })}
            </section>
        </div>
    )
}