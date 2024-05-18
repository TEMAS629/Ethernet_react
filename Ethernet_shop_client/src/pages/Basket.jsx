// Импорт необходимых библиотек и инструментов
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';

// Переменные для отслеживания загрузки данных и общей стоимости корзины
var loaded = false;
var outPrice = 0;

// Компонент Basket, который представляет собой корзину покупок
export default function Basket() {

  // Функция для получения URL файла изображения товара
  function getUrlFile(fileName) {
    return "/static/" + fileName;
  }

  // Обработчик удаления товара из корзины
  function onDelete(e) {
    console.log(e.target.value); // Логирование значения элемента, который был удален
    e.stopPropagation(); // Предотвращение всплытия события
    deleteFromBasket(); // Вызов функции удаления товара из корзины
    console.log('delete'); // Логирование подтверждения удаления
  }

  // Создание экземпляра Cookies для работы с куки
  const cookies = new Cookies();

  // Получение JWT-токена из куки
  var jwt_token = cookies.get('jwt_autorisation');

  // Перенаправление на страницу входа, если токен отсутствует
  if (jwt_token == null) {
    window.location.replace('/login');
  }

  // Декодирование JWT-токена для получения информации о пользователе
  const user = jwtDecode(jwt_token);

  // Состояние для хранения списка товаров в корзине
  const [arr, setArr] = useState([{}]);


  // Асинхронная функция для загрузки данных из корзины пользователя
  async function loadBasket() {

    var requestData = {
      'BasketId': user.id,
    }
    loaded = true; // Установка флага загрузки в true

    axios.get("http://localhost:5000/api/user/get_basket", { params: requestData })
      .then(response => {
        if (response.status == 200) {
          console.log(response.data); // Логирование полученных данных
          setArr(response.data); // Обновление состояния с полученными данными
          console.log(arr); // Логирование текущего состояния
        }
      })
      .catch(error => {
        console.error(error); // Логирование ошибок
      });

  }

  // Асинхронная функция для удаления товара из корзины
  async function deleteFromBasket(e) {
    e.stopPropagation(); // Предотвращение всплытия события

    var requestData = {
      'ProductId': e.target.value, // Получение ID товара из атрибута value элемента
      'BasketId': user.id, // Получение ID корзины из декодированного JWT-токена
    }

    axios.delete("/api/user/basket", { params: requestData }) // Отправка DELETE-запроса на сервер
      .then(response => {
        if (response.status == 200) {
          console.log(response.body); // Логирование ответа сервера
          loadBasket(); // Перезагрузка данных корзины после удаления товара
        }
      })
      .catch(error => {
        console.error(error); // Логирование ошибок
      });
  }

  // Асинхронная функция для отправки корзины на сервер
  async function submitBacket(e) {
    e.stopPropagation(); // Предотвращение всплытия события
    e.preventDefault(); // Предотвращение стандартного поведения формы


    var requestData = {
      'UserId': user.id, // Получение ID пользователя из декодированного JWT-токена
    }
    console.log(requestData); // Логирование отправляемых данных

    axios.post("/api/user/submitbasket", requestData) // Отправка POST-запроса на сервер
      .then(response => {
        if (response.status == 200) {
          // console.log(response.body)
          console.log("Добавленны в историю"); // Логирование подтверждения успешной отправки
          loadBasket(); // Перезагрузка данных корзины после отправки
        }
      })
      .catch(error => {
        console.error(error); // Логирование ошибок
      });
  }

  // Функция для расчета общей стоимости товаров в корзине
  function getAllPrice() {
    let price = 0;
    for (let product of arr) {
      price += Number(product.price); // Суммирование цен всех товаров
    }
    return price; // Возвращение общей суммы
  }

  // Загрузка данных корзины при первой загрузке компонента, если данные еще не были загружены
  if (!loaded) {
    loadBasket();

  }

  return (
    <div className="margin-top">
      <div className="margin_bottom_2vw">
        {/* <p className="main">Логин - <span className="product_name">{user.login}</span></p>
        <p className="main ">Почта - <span className="product_name">{user.email}</span></p>
        <p className="main">Телефон - <span className="product_name">{user.phone}</span></p> */}
      </div>
      <p className="title main_title">Корзина</p>
      <div className="busket_main">
        <div className="container">
          {arr.map(item => {
            if (item.price == "0") {
              outPrice = "бесплатно";
            } else {
              outPrice = item.price + " руб.";
            }

            return (
              <div className="busket_card">
                <a className="hover_a_black" href={"/product_card/" + item.id}>
                  <div className="busket_card">
                    <img src={getUrlFile(item.img)} alt={item.name} className='image_product_basket' />
                    <div className="text_holder">
                      <p className="name">Название <br/><span>{item.name}</span></p>
                      <p className="type">Тип <br/><span>{item.type}</span></p>
                      <p className="price">Цена <br/><span>{outPrice}</span></p>
                    </div>
                  </div>
                </a>
                <button className="cross" value={item.id} onClick={deleteFromBasket}>X</button>
              </div>
            )
          })}
        </div>
      </div>
      <div className="flex_content_space_between margin_top_2vw">
        {(() => {
          if (getAllPrice() > 0) {
            return (
              <>
                <p className="title">Общая стоимость - {getAllPrice()} ₽</p>
                <a className="hover_a_shadow button" onClick={submitBacket}>Оплатить</a>
              </>);
          } else {
            return (
              <p className="title">Корзина пуста!</p>
            );
          }
        })()}
      </div>
    </div>
  )
}