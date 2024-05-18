// Импорт необходимых библиотек и инструментов
import { useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { redirect } from 'react-router-dom'; // Комментарий: Этот импорт не используется в коде

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

// Компонент Registration, представляющий форму регистрации
export default function Registration() {
  // Создание экземпляра Cookies для работы с куки
  const cookies = new Cookies();

  // Функция для сохранения JWT-токена в куки после успешной регистрации
  const login_in = (jwt_token) => {
    cookies.set("jwt_autorisation", jwt_token); // Сохранение токена в куки
  };

  // Объект для хранения данных формы регистрации
  let signUpForm = {
    "login": getset(useState('')), // Использование getset для создания состояния login
    'password': getset(useState('')), // Использование getset для создания состояния password
    'password_repeat': getset(useState('')), // Использование getset для создания состояния password_repeat
    'email': getset(useState('')), // Использование getset для создания состояния email
    'phone': getset(useState('')), // Использование getset для создания состояния phone
  };

  // Функция для отправки данных формы на сервер и регистрации пользователя
  function submitClick() {
    let requestData = {}; // Объект для хранения запроса

    for (const nameField in signUpForm) { // Цикл по полям формы
      requestData[nameField] = signUpForm[nameField].get; // Добавление значений полей в запрос
    }

    axios.post("http://localhost:5000/api/user/registration", requestData) // Отправка POST-запроса на сервер
    .then(response => {
        if (response.status === 200) { // Проверяем статус ответа
          // Перенаправление на страницу профиля после успешной регистрации
          login_in(response.data.token);
          window.location.replace('/profile'); // Перенаправление на страницу профиля
        }
      })
    .catch(error => {
        // Обработка ошибок регистрации
        console.error(error);
      });
  }

  return (
    <div className="margin-top">
      <div className="title reg">РЕГИСТРАЦИЯ</div>
      <div className="form_flex">
        <input className="input" type='text' value={signUpForm.login.get} onChange={signUpForm.login.forEvent} placeholder="Логин" required></input>
        <input className="input" type='password' value={signUpForm.password.get} onChange={signUpForm.password.forEvent} placeholder="Пароль" required></input>
        <input className="input" type='password' value={signUpForm.password_repeat.get} onChange={signUpForm.password_repeat.forEvent} placeholder="Повторите пароль" required></input>
        <input className="input" type='email' value={signUpForm.email.get} onChange={signUpForm.email.forEvent} placeholder="Почта" required></input>
        <input className="input" type='text' value={signUpForm.phone.get} onChange={signUpForm.phone.forEvent} placeholder="Телефон" required></input>
        <p className="small_text">Нажимая на кнопку я принимаю соглашение <br/> <span>«Политики коденфициальности»</span></p>
        <p className="small_text">Нажимая на кнопку я принимаю соглашение <br/> <span>«Согласии на обработку персональных данных»</span></p>
        <button className="hover_a_shadow button margin_top_3vw" onClick={submitClick}>Зарегистрироваться</button>
      </div>
    </div>
  );
}
