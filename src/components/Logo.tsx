import logo from '../assets/logo.png'

export function Logo() {
    const home = () => {
      window.location.replace('/')
    }
    return (
        <img width='90px' className='cursor-pointer' src={logo} alt="Logo ABC Supermercados" onClick={home}/>
      );
}
