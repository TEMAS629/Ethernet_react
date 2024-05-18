// Импорт необходимых библиотек и инструментов
import { useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
// import { useHistory } from 'react-router-dom'; // Комментарий: Этот импорт не используется в коде
import * as jwt from 'jwt-decode'; // Используется для декодирования JWT-токена

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

// Компонент Login, представляющий форму входа в систему
export default function Login() {
  // Создание экземпляра Cookies для работы с куки
  const cookies = new Cookies();

  // Функция для сохранения JWT-токена в куки после успешного входа
  const login_in = (jwt_token) => {
    cookies.set("jwt_autorisation", jwt_token); // Сохранение токена в куки
  };

  // Объект для хранения данных формы входа
  let loginForm = {
    "email": getset(useState('')), // Использование getset для создания состояния email
    'password': getset(useState('')), // Использование getset для создания состояния password
  };

  // Функция для отправки данных формы на сервер и авторизации пользователя
  function submitClick() {
    let requestData = {}; // Объект для хранения запроса

    for (const nameField in loginForm) { // Цикл по полям формы
      requestData[nameField] = loginForm[nameField].get; // Добавление значений полей в запрос
    }

    axios.post("http://localhost:5000/api/user/login", requestData) // Отправка POST-запроса на сервер
      .then(response => {
        console.log(response.data.token); // Логирование полученного токена
        login_in(response.data.token); // Сохранение токена в куки
        window.location.replace('/profile'); // Перенаправление на страницу профиля после успешного входа
      })
      .catch(error => {
        console.log(error); // Логирование ошибок
      });
  }



  return (
    <div className="margin-top">
      <div className="title reg">ВХОД</div>
      <div className="form_flex">
        <input className="input" type='email' value={loginForm.email.get} onChange={loginForm.email.forEvent} placeholder="Email" required></input>
        <input className="input" type='password' value={loginForm.password.get} onChange={loginForm.password.forEvent} placeholder="Пароль" required></input>
        <p className="small_text">Нажимая кнопку "Войти", вы подтверждаете, что согласны с <br /> <span>"политикой коденфициальности"</span></p>
        <button className="hover_a_shadow button margin_top_3vw" onClick={submitClick}>Войти</button>
      </div>
    </div>
  );
}
