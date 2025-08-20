import '../styles/Btn_Menu.scss';

export default function Btn_Menu({btnMenu, setBtnMenu}){

    return(
        <>
            <div className={`Btn_Menu ${btnMenu}`} onClick={()=> {setBtnMenu(!btnMenu)}}>
                <div className='um'></div>
                <div className='dois'></div>
            </div>

            <span className={`${btnMenu}`} onClick={()=> {setBtnMenu(!btnMenu)}}></span>
        </>
    )
}