// Импорт необходимых библиотек и инструментов
import { useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';

// Переменная для отслеживания загрузки данных
var loaded = false;

// Функция для создания объекта состояния с методами get и set
function getset(useState) {
  return {
    get: useState[0], // Метод для получения текущего значения состояния
    set: useState[1], // Метод для установки нового значения состояния
    forEvent: (e) => { // Метод для обработки событий изменения значения
      useState[1](e.target.value);
    }
  }
}

// Функция выхода из системы
function logout() {
  const cookies = new Cookies(); // Создание экземпляра Cookies для работы с куки
  var jwt_token = cookies.get('jwt_autorisation'); // Получение JWT-токена из куки
  console.log("logout"); // Логирование начала процесса выхода
  if (cookies.get('jwt_autorisation') != null) { // Проверка наличия токена
    cookies.remove('jwt_autorisation') // Удаление токена из куки
    window.location.replace('/'); // Перенаправление на главную страницу
  }
  console.log(cookies.get('jwt_autorisation')); // Логирование оставшегося токена после удаления
}

// Функции перенаправления на различные страницы
function addProduct() {
  window.location.replace('/add'); // Перенаправление на страницу добавления продукта
}
function addCategory() {
  window.location.replace('/category'); // Перенаправление на страницу добавления категории
}
function addAdmin() {
  const cookies = new Cookies(); // Создание экземпляра Cookies для работы с куки
  var jwt_token = cookies.get('jwt_autorisation'); // Получение JWT-токена из куки
  const user = jwtDecode(jwt_token); // Декодирование токена для получения информации о пользователе
  if (user.role == "admin") { // Проверка роли пользователя
    return (
      <div className='button_holder_prof'> {/* Возвращение JSX для кнопок, доступных только администратору */}
        <button className='button hover_a_shadow' onClick={addProduct}>Добавить продукт</button>
        <button className='button hover_a_shadow' onClick={addCategory}>Добавить категорию</button>
      </div>
    );
  }
}

// Компонент Profile, представляющий профиль пользователя
export default function Profile() {
  // Функция для получения URL файла изображения товара
  function getUrlFile(fileName) {
    return "/static/" + fileName;
  }

  // Асинхронная функция для загрузки истории покупок пользователя
  async function loadBasket() {
    var requestData = {
      'HistoryId': user.id, // ID истории покупок, основанный на ID пользователя
    };
    loaded = true; // Установка флага загрузки в true

    axios.get("http://localhost:5000/api/user/get_history", { params: requestData }) // Отправка GET-запроса на сервер
      .then(response => {
        if (response.status == 200) {
          console.log(response.data); // Логирование полученных данных
          setArr(response.data); // Обновление состояния с полученными данными
        }
      })
      .catch(error => {
        console.error(error); // Логирование ошибок
      });
  }

  // Состояние для хранения истории покупок
  const [arr, setArr] = useState([]);

  // Создание экземпляра Cookies для работы с куки
  const cookies = new Cookies();
  var jwt_token = cookies.get('jwt_autorisation'); // Получение JWT-токена из куки
  if (jwt_token == null) { // Проверка на наличие токена
    window.location.replace('/login'); // Перенаправление на страницу входа, если токен отсутствует
  }
  const user = jwtDecode(jwt_token); // Декодирование токена для получения информации о пользователе

  // Загрузка истории покупок при первой загрузке компонента, если данные еще не были загружены
  if (!loaded) {
    loadBasket();
  }

  return (
    <div className="container">
      <div className="margin-top">
        <div className="margin_bottom_2vw">
          <p className="main">Добро пожаловать, <span className="product_name">{user.login}!</span></p>
          {/* <p className="p_text_first_screen ">Почта - <span className="product_name">{user.email}</span></p>
          <p className="p_text_first_screen">Телефон - <span className="product_name">{user.phone}</span></p> */}
        </div>
        <div className="button_holder">
          {/* <a className="hover_a_shadow button">Изменить данные</a> */}
          {addAdmin()}
          <button className='button hover_a_shadow' onClick={logout}>Выйти с аккаунта</button>
        </div>
        <p className="product_name margin_top_2vw">История покупки и получения</p>
        <div className="list margin_top_2vw">
          {arr.map(item => {
            let outPrice
            if (item.price == "0") {
              outPrice = "бесплатно";
            } else {
              outPrice = item.price + " руб.";
            }

            return (
              <div className="product_card">
                <a className="hover_a_black" href={"/product_card/" + item.id}>
                  <div className="product_card">
                    <img src={getUrlFile(item.img)} alt={item.name} className='image_product_profile' />
                    <div className="text_holder">
                      <p className="name">Название: <br /> <span>{item.name}</span></p>
                      <p className="type">Тип продукта: <br /> <span>{item.type}</span></p>
                      <p className="price">Стоимость: <br /> <span>{outPrice}</span></p>
                    </div>
                  </div>
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
