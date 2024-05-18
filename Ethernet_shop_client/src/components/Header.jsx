import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';
import logo from "../assets/logo.png";
import user from "../assets/user.png";
import cart from "../assets/cart.png";

export default function Header() {
  function not_authorisation() {
    const cookies = new Cookies();
    var jwt_token = cookies.get('jwt_autorisation');
    if (cookies.get('jwt_autorisation') == null) {
      return (
        <div className="a_header">
          <a href="/reg" className="a_top a_dynamic">Регистрация</a>
          <a href="/login" className="a_bottom a_dynamic">Вход</a>
        </div>
      )
    }
  }
  function authorisation() {
    const cookies = new Cookies();
    var jwt_token = cookies.get('jwt_autorisation');
    if (cookies.get('jwt_autorisation') != null) {
      return (
        <div className="a_header right">
          <a href="/profile" className="a_top a_dynamic"><img src={user} alt="icon" className='icon'/></a>
          <a href="/basket" className="a_bottom a_dynamic"><img src={cart} alt="icon" className='icon'/></a>
        </div>
      )
    }
  }

  return (
    <div className="header_fixed">
        <a href="/" className="logo_text"><img src={logo} alt="logo" className='logo'/></a>
        <div className="a_header">
          <a href="/list/man" className="a_top">Мужская одежда</a>
          <a href="/list/woman" className="a_bottom">Женская одежда</a>
          <a href="/list/shoes" className="a_top">Обувь</a>
          <a href="/list/hat" className="a_bottom">Головные уборы</a>
        </div>
        {not_authorisation()}
        {authorisation()}
    </div>
  );
}