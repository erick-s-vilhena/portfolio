import '../styles/Habilidades.scss';
import Javascript from '../img/js.png';
import Html from '../img/html.png';
import Css from '../img/css.png';
import React from '../img/react.png';
import Sass from '../img/sass.png';
import Figma from '../img/figma.png';
import Node from '../img/node.png';
import Firebase from '../img/firebase.png';
import { useContexto } from '../context/Contexto';

export default function Habilidades({ativo}){

    const { habilidadeOpen, setHabilidadeOpen} = useContexto();

const infoHablidades = [
    {
        habilidade: 'JavaScript',
        logo: Javascript,
        descricao: "JavaScript é uma linguagem de programação usada principalmente para criar interatividade em páginas da web. Com ela, é possível fazer animações, validar formulários, atualizar conteúdos e muito mais. Funciona dentro do navegador e é essencial para o desenvolvimento front-end, junto com HTML e CSS."
    },
    {
        habilidade: 'HTML',
        logo: Html,
        descricao: "HTML é a linguagem usada para estruturar o conteúdo de páginas da web. Ele organiza os elementos da página, como títulos, parágrafos, imagens, links e listas, usando tags. Por exemplo, um título é definido com <h1> e um parágrafo com <p>."
    },
    {
        habilidade: 'CSS',
        logo: Css,
        descricao: "CSS é a linguagem usada para definir o estilo de uma página web. Com o CSS, você pode mudar cores, fontes, tamanhos, espaçamentos, posicionamento dos elementos e deixar o site mais bonito e agradável visualmente. Ele trabalha junto com o HTML, que fornece a estrutura da página."
    },
    {
        habilidade: 'React',
        logo: React,
        descricao: "React é uma biblioteca JavaScript usada para construir interfaces de usuário, especialmente em aplicações web dinâmicas. Ele permite criar componentes reutilizáveis que atualizam a tela de forma eficiente conforme os dados mudam. Isso facilita o desenvolvimento de sites interativos, rápidos e bem organizados."
    },
    {
    habilidade: 'Firebase',
    logo: Firebase,
    descricao: "Firebase é uma plataforma do Google que fornece diversos serviços para desenvolvimento de aplicações, como banco de dados em tempo real, autenticação de usuários, hospedagem e armazenamento. Ele facilita a criação de apps modernos sem a necessidade de gerenciar servidores, permitindo que você foque na lógica da aplicação."
    },
    {
        habilidade: 'Sass',
        logo: Sass,
        descricao: "Sass é uma extensão do CSS que adiciona recursos como variáveis, funções, aninhamento de regras e reutilização de código. Ele facilita a organização e manutenção de estilos em projetos grandes, gerando um CSS mais limpo e eficiente."
    },
    {
        habilidade: 'Figma',
        logo: Figma,
        descricao: "Figma é uma ferramenta de design usada para criar interfaces de usuário, protótipos e layouts de sites e aplicativos. Ele permite que várias pessoas colaborem em tempo real, como se estivessem usando o mesmo arquivo ao mesmo tempo. É muito popular entre designers e equipes de desenvolvimento."
    },
    {
        habilidade: 'Node',
        logo: Node,
        descricao: "Node é uma plataforma que permite executar código JavaScript fora do navegador, geralmente no servidor. Com ele, é possível criar aplicações web completas, APIs, automações e muito mais, usando a mesma linguagem que o front-end. É leve, rápido e muito usado em projetos modernos."
    }
];


   return (
       <div className={`Habilidades slide ${ativo !== 2 && true}`}>
            <div className="container-habilidades">
                {infoHablidades.map((item, index)=>{
                    return(
                        <div key={index} 
                        className='sigle-habilidades hidden bt'
                        onClick={()=> setHabilidadeOpen(item)}>
                            <div className="img">
                                <img src={item.logo} alt="logo" />
                            </div>
                            
                            <h3>{item.habilidade}</h3>
                        </div>
                    )
                })}
            </div>
       </div>
)
}