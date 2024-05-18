// Импорт необходимых библиотек и инструментов
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

// Переменная для отслеживания, была ли загружена категория
var categorySpawned = false;

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

// Компонент Add, представляющий форму добавления продукта
export default function Add() {
  // Состояние для хранения списка категорий
  const [getListCategory, setListCategory] = useState([]);

  // Создание экземпляра Cookies для работы с куки
  const cookies = new Cookies();
  var jwt_token = cookies.get('jwt_autorisation'); // Получение JWT-токена из куки

  // Перенаправление на страницу входа, если токен отсутствует
  if (jwt_token == null) {
    window.location.replace('/login');
  }

  // Объект для хранения данных формы добавления продукта
  let Addproduct = {
    "name": getset(useState('')), // Использование getset для создания состояния name
    'price': getset(useState('')), // Использование getset для создания состояния price
    'img': getset(useState('')), // Использование getset для создания состояния img
    'year': getset(useState('')), // Использование getset для создания состояния year
    'creator': getset(useState('')), // Использование getset для создания состояния creator
    'desc': getset(useState('')), // Использование getset для создания состояния desc
    'categoryid': getset(useState('')), // Использование getset для создания состояния categoryid
    'type': getset(useState('')), // Использование getset для создания состояния type
  };

  // Функция для отправки данных формы на сервер и добавления продукта
  function submitClick() {
    const formData = new FormData(); // Создание объекта FormData для отправки файлов

    for (const fields in Addproduct) { // Цикл по полям формы
      formData.append(fields, Addproduct[fields].get); // Добавление значений полей в formData
    }

    axios.post("http://localhost:5000/api/product/create", formData) // Отправка POST-запроса на сервер
   .then(response => {
        if (response.status === 200) { // Проверяем статус ответа
          // Обновление интерфейса с информацией об успешном добавлении продукта
          console.log(response);
          document.querySelector('.info').innerHTML = "Добавлен продукт " + response.data.name;
        }
      })
   .catch(error => {
        // Обработка ошибок добавления продукта
        console.error(error);
      });
  }

  // Эффект для загрузки списка категорий при монтировании компонента
  useEffect(() => {
    axios.get("http://localhost:5000/api/category/getall") // Отправка GET-запроса на сервер
   .then(response => {
        if (response.status == 200) {
          setListCategory(response.data); // Обновление состояния списком категорий
        }
      })
   .catch(error => {
        console.log(error); // Логирование ошибок
      });
    categorySpawned = true; // Установка флага загрузки в true
  }, []) // Пустой массив зависимостей указывает на выполнение эффекта один раз при монтировании


  return (
    <div>
      <div className="form_holder">

        <form className="form_flex">
          <input className="input" type='text' value={Addproduct.name.get} onChange={Addproduct.name.forEvent} placeholder="Название" required></input>
          <input className="input" type='number' value={Addproduct.price.get} onChange={Addproduct.price.forEvent} placeholder="Цена" required></input>
          <input
            className="input"
            type="file"
            onChange={(e) => {
              Addproduct.img.set(e.target.files[0]);
            }}
            accept=".png,.jpg,.jpeg,.bmp"
            placeholder="Изображение"
            required>
          </input>
          <input className="input" type='date' value={Addproduct.year.get} onChange={Addproduct.year.forEvent} placeholder="Год выпуска" required></input>
          <input className="input" type='text' value={Addproduct.creator.get} onChange={Addproduct.creator.forEvent} placeholder="Производитель" required></input>
          <input className="input" type='text' value={Addproduct.type.get} onChange={Addproduct.type.forEvent} placeholder="Тип" required></input>
          <textarea className="textarrea" cols={3} rows={5} value={Addproduct.desc.get} onChange={Addproduct.desc.forEvent} placeholder="Описание" required></textarea>
          <select className='select_cat' name="categoryid" id="categoryid" value={Addproduct.categoryid.get} onChange={Addproduct.categoryid.forEvent} placeholder="Выберите категорию">
            <option selected value="">Нет</option>
            {getListCategory.map((category, index) => {
              return (<option key={index} value={category.id}>{category.name}</option>)
            })}
          </select>
          <a className="hover_a_shadow button" onClick={submitClick}>Добавить</a>
          <div className='info'></div>
        </form>
      </div>
    </div>
  )
}