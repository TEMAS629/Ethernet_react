// Импорт необходимых библиотек и инструментов
import axios from 'axios';
import React, { useRef, useState } from 'react';
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';

// Переменные для отслеживания загрузки данных и цены товара
var loaded = false;
let outPrice;

// if (!categorySpawned) {
//   axios.get("http://localhost:5000/api/category/getall")
//     .then(response => {
//       if (response.status == 200) {
//         document.querySelector(".select_cat").innerHTML = response.data
//       }
//     })
//     .catch(error => {
//       console.log(error)
//     });
//   categorySpawned = true;
// }

// Компонент Product_card, который представляет собой карточку товара
export default function Product_card() {

  // Разбор URL для определения последнего элемента
  var splittedURL = document.URL.split('/');
  var lastsym = splittedURL[splittedURL.length - 1];

  // Создание экземпляра Cookies для работы с куки
  const cookies = new Cookies();

  // Получение JWT-токена из куки
  var jwt_token = cookies.get('jwt_autorisation');

  // Перенаправление на страницу входа, если токен отсутствует
  if (jwt_token == null) {
    window.location.replace('/login');
  }

  // Функция для получения URL файла изображения товара
  function getUrlFile(fileName) {
    return "/static/" + fileName;
  }

  // Декодирование JWT-токена для получения информации о пользователе
  const user = jwtDecode(jwt_token);

  // Создание объекта BasketData для хранения данных о корзине
  let BasketData = {
    "BasketId": getset(useState(user.id)),
    "ProductId": getset(useState(Number(lastsym))),
  };

  // Функция добавления товара в корзину
  function addToBasket() {

    let requestData = {};

    for (const nameField in BasketData) {
      requestData[nameField] = BasketData[nameField].get;
    }

    console.log(requestData)

    axios.post("http://localhost:5000/api/user/basket", requestData)
      .then(response => {
        if (response.status === 200) {
          console.log(response);
        }
      })
      .catch(error => {
        // Обработка ошибок регистрации
        console.error(error);
      });
  }

  // Функция для создания объекта состояния с методами get и set
  function getset(useState) {
    return {
      get: useState[0],
      set: useState[1],
      forEvent: (e) => {
        useState[1](e.target.value);
      }
    }
  }

  // Состояние для хранения данных о товаре
  let [getProductData, setProductData] = useState({});

  // Асинхронная функция для загрузки данных о товаре
  async function load_products() {
    axios.get(`/api/product/${BasketData.ProductId.get}`)
      .then(response => {
        if (response.status == 200) {
          setProductData(response.data.product);
          // console.log(response.data.product);
        }
      })
      .catch(error => {
        console.error(error);
      });

    loaded = true;

  }

  // Вызов функции load_products при первой загрузке, если данные еще не были загружены
  if (!loaded) {
    load_products();
  }

  // Определение цены товара, если она равна "0" - устанавливается значение "бесплатно"
  if (getProductData.price == "0") {
    outPrice = "бесплатно";
  } else {
    outPrice = getProductData.price + " руб.";
  }

  return (
    <div className="mans_page flex_content_center">
      <div className="margin-top">
        <div className="card_p_flex">
          <div className="product_cart">
            <img src={getUrlFile(getProductData.img)} alt="" className='image_product' />
            {/* <p className="product_name_center">Название: {getProductData.name}</p>
                <p className="product_name">{getProductData.year}</p>
                <p className="p_text_first_screen_center">{outPrice} </p> */}
          </div>
          <div className='info_product'>
            <p className="name">Название: <span className='product_name'>{getProductData.name}</span></p>
            <p className="price">Цена - <span className="product_name">{outPrice}</span></p>
            <p className="date">Год производства - <span className="product_name">{getProductData.year}</span></p>
            <p className="creator">Производитель - <span className="product_name">{getProductData.creator}</span></p>
            {/* <p className="p_text_first_screen">Категория - <span className="product_name">{getProductData.categoryid}</span></p> */}
            <p className="desc">Описание:</p>
            <p className="desc_main">{getProductData.desc}</p>
            <a className="swiper_know_more" onClick={addToBasket}>Добавить в корзину</a>
          </div>
        </div>
          
      </div>
    </div>
  );
}


