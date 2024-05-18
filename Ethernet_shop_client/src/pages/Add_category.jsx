// Импорт необходимых библиотек и инструментов
import { useState } from 'react'; // Для использования состояния компонента
import Cookies from 'universal-cookie'; // Для работы с куки
import axios from 'axios'; // Для выполнения HTTP-запросов
import { jwtDecode } from 'jwt-decode'; // Для декодирования JWT

// Компонент для добавления категории
export default function Add_category() {
  // Использование куки для получения JWT-токена
  const cookies = new Cookies();
  var jwt_token = cookies.get('jwt_autorisation');

  // Если JWT-токен отсутствует, перенаправляем на страницу входа
  if (jwt_token == null) {
    window.location.replace('/login');
  }

  // Функция для создания объекта с методами get и set для управления состоянием
  function getset(useState) {
    return {
      get: useState[0], // Возвращаем текущее значение состояния
      set: useState[1], // Возвращаем функцию для изменения значения состояния
      forEvent: (e) => { // Функция для обработки событий изменения значения
        useState[1](e.target.value); // Изменяем состояние на основе значения элемента формы
      }
    };
  }

  // Объект для хранения данных категории
  let Addcategory = {
    "name": getset(useState('')), // Используем функцию getset для создания поля ввода
  };

  // Функция для добавления категории
  function addCategory() {
    // Создаем объект с данными для отправки на сервер
    let requestData = {};

    // Заполняем объект данными из состояния
    for (const nameField in Addcategory) {
      requestData[nameField] = Addcategory[nameField].get; // Получаем текущее значение поля
    }

    // Выполняем POST-запрос на сервер для создания категории
    axios.post("http://localhost:5000/api/category/create", requestData)
     .then(response => {
        // Проверяем статус ответа
        if (response.status === 200) {
          // Очищаем поле ввода и выводим сообщение об успехе
          document.querySelector('.input').value = '';
          document.querySelector('.info').innerHTML = "Добавлена категория " + response.data.name;
        }
      })
     .catch(error => {
        // Обрабатываем ошибки при добавлении категории
        console.error(error);
      });
  }


  return (
    <div>
      <div className="form_holder">
        <div className="form_flex">
          <input className="input" type='text' value={Addcategory.name.get} onChange={Addcategory.name.forEvent} placeholder="Название категории" required></input>
          <button className="hover_a_shadow button margin_top_3vw" onClick={addCategory}>Добавить</button>
          <div className='info'></div>
        </div>
      </div>
    </div>
  )
}