// Импорт библиотеки axios для выполнения HTTP-запросов
import axios from 'axios';
import React, { useEffect, useState } from 'react';

// Инициализация переменных
let loaded = false;
let categorySpawned = false;
let outPrice;

// Компонент List_products, который отображает список продуктов
export default function List_products() {
  // Хуки состояния для управления списком категорий, массивом продуктов, отфильтрованным массивом и текстом поиска
  const [getListCategory, setListCategory] = useState([]);
  const [arr, setArr] = useState([]);
  const [getFilteredArr, SetFilteredArr] = useState([]);
  const [getSearchText, setSearchText] = useState('');


// Используется для загрузки списка всех категорий при монтировании компонента
  useEffect(() => {
    axios.get("http://localhost:5000/api/category/getall")
      .then(response => {
        if (response.status == 200) {
          setListCategory(response.data)
          // console.log(getListCategory);
        }
      })
      .catch(error => {
        console.log(error)
      });
    categorySpawned = true;
    load_products('')
  }, [])

  
// Обработчик выбора категории, который вызывает функцию load_products с выбранной категорией
  function onSelectedCategory(e) {
    console.log(e.target.value);
    load_products(e.target.value)
  }

  // Функция сортировки списка продуктов по различным критериям
  function onHandleSort(e) {
    let typeSort = e.target.value;
    // console.log(e.target.value);

    let sortListProduct = structuredClone(getFilteredArr);

    if (typeSort == 'price_to_title') {
      sortListProduct.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1;
        }
        if (a.name.toLowerCase() == b.name.toLowerCase()) {
          return 0;
        }

      });
    } else if (typeSort == 'price_to_high') {
      sortListProduct.sort((a, b) => {
        if (a.price < b.price) {
          return -1;
        }
        if (a.price > b.price) {
          return 1;
        }
        if (a.price == b.price) {
          return 0;
        }

      });
    } else if (typeSort == 'price_to_low') {
      sortListProduct.sort((a, b) => {
        if (a.price > b.price) {
          return -1;
        }
        if (a.price < b.price) {
          return 1;
        }
        if (a.price == b.price) {
          return 0;
        }

      });

    }
    console.log(sortListProduct);
    SetFilteredArr(sortListProduct);
  }

  // Обработчик изменения текста поиска, который обновляет состояние getSearchText
  function onChangeText(e) {
    // console.log(e.currentTarget.value);
    setSearchText(e.currentTarget.value);
  }

  // Обработчик нажатия клавиши Enter, который фильтрует список продуктов по тексту поиска
  function onPressEnter(e) {
    if (e.key !== 'Enter') {
      return;
    }
    console.log('pressEnter');

    let listProduct = [];

    

    for(let product of getFilteredArr) {
      console.log(product.name);
      if (product.name.toLowerCase().includes(getSearchText.toLowerCase())) {
        listProduct.push(product);
      }
    }
    console.log(listProduct);
    SetFilteredArr(listProduct);
    
  }
// Функция для получения URL файла изображения продукта
  function getUrlFile(fileName) {
    return "/static/" + fileName;
  }

// Асинхронная функция для загрузки списка продуктов по категории
  async function load_products(cat) {
    var splittedURL = document.URL.split('/');
    var lastsym = splittedURL[splittedURL.length - 1];
    var requestData = {
      'categoryid': cat,
      'type': lastsym,
    }

    loaded = true;
    axios.get("http://localhost:5000/api/product/getall", { params: requestData })
      .then(response => {
        if (response.status == 200) {
          var temp_data = []
          for (var key in response.data) {
            temp_data.push({
              name: response.data[key].name,
              price: response.data[key].price,
              img: response.data[key].img,
              type: response.data[key].type,
              id: response.data[key].id,
            })
          }
          setArr(temp_data);
          SetFilteredArr(temp_data);

        }
      })
      .catch(error => {
        // Обработка ошибок регистрации
        console.error(error);
      });
  }


// Загрузка списка продуктов при первом рендеринге, если данные еще не были загружены
  if (!loaded) {
    load_products('');

  }

  return (
    <div className="mans_page margin-top">
      <div className="helperdata"></div>
      <div className="flex_content_space_between_list">
        <div className="input_holder">
          <a className='text_filter hover_a_black_no_shadow margin_left_3vw'>Поиск</a>
          <input 
            className="search_input" 
            placeholder="Поиск"
            onChange={onChangeText}
            onKeyDown={onPressEnter}></input>
        </div>
        <div className='input_holder'>
          <p className='text_filter'>Сортировка</p>
          <select className="select" onChange={onHandleSort}>
            <option value="price_to_low">Сначала дорогие</option>
            <option value="price_to_high">Сначала недорогие</option>
          </select>
        </div>
        <div className='input_holder'>
          <p className='text_filter'>Фильтр</p>
          <select onChange={onSelectedCategory} className="select select_cat" placeholder="Выберите фильтр">
            <option selected value="">Нет</option>
            {getListCategory.map((category, index) => {
              return (<option key={index} value={category.id}>{category.name}</option>)
            })}
          </select>
        </div>
      </div>
      <div className="container catalog">
        {getFilteredArr.map(item => {
          if (item.price == "0") {
            outPrice = "бесплатно";
          } else {
            outPrice = item.price + " руб.";
          }
          return (
            <div>
              <div className="product_holder list">
                <div className="bg_card list_card">
                  <p className="p_text_first_screen_center">{item.type} wear</p>
                  <p className="product_name margin_top_3vw">{item.name}</p>
                </div>
                <a className="hover_a_black" href={"/product_card/" + item.id}><div className="bg_card">
                  <img src={getUrlFile(item.img)} alt="vk" className='image_product' />
                  <p className="p_text_first_screen_center">{item.price} руб.</p>
                </div></a>
              </div>
              {/* <Link to={"/product_card/" + item.id}>Ссылка</Link> */}
            </div>
          )
        })}

      </div>
    </div>
  );
}



