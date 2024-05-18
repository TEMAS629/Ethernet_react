import vk from '../assets/vk.png';
import tg from '../assets/tg.png';
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';
import logo from "../assets/logo.png";

export default function Footer() {

    function not_authorisation() {
        const cookies = new Cookies();
        var jwt_token = cookies.get('jwt_autorisation');
        if (cookies.get('jwt_autorisation') == null) {
            return (
                <div className='a_footer_dynamic'>
                    <a href='/reg' className='a_dynamic a_top'>Регистрация</a>
                    <a href='/enter' className='a_dynamic a_bottom'>Вход</a>
                </div>
            )
        }
    }
    function authorisation() {
        const cookies = new Cookies();
        var jwt_token = cookies.get('jwt_autorisation');
        if (cookies.get('jwt_autorisation') != null) {
            return (
                <div className='a_footer_dynamic'>
                    <a href='/profile' className='a_dynamic a_top'>Профиль</a>
                    <a href='/basket' className='a_dynamic a_bottom'>Корзина</a>
                </div>
            )
        }
    }

    return (
        <div className="footer">
            <div className='flex_content_center'>
                <a href="/" className="logo_text"><img src={logo} alt="logo" className='logo' /></a>
                <div className='flex_column'>
                    <p className='title_footer'>Коллекции</p>
                    <a href="/list/man" className="a_top">Мужская одежда</a>
                    <a href="/list/woman" className="a_bottom">Женская одежда</a>
                    <a href="/list/shoes" className="a_top">Обувь</a>
                    <a href="/list/hat" className="a_bottom">Головные уборы</a>
                </div>
                <div className="">
                    <p className='title_footer'>Клиентам</p>
                    {not_authorisation()}
                    {authorisation()}
                </div>
                <div className='contact_holder'>
                    <p className='title_footer'>Контакты</p>
                    <div className='social_holder'>
                        <a href='#'><img src={vk} alt="vk" className='social' /></a>
                        <a href='#'><img src={tg} alt="tg" className='social' /></a>
                    </div>
                    <div>
                        <p>H&M@gmail.com</p>
                    </div>
                </div>
            </div>

        </div>
    );
}
