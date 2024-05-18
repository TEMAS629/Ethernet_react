import cap from "../assets/cap.png"
import trousers from "../assets/trousers.jpg"
import shirt from "../assets/shirt.jpg"
import company from "../assets/company.jpg"
import HM from "../assets/HM.jpg"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';

let loaded = false;

export default function Homepage() {
    // Состояние для хранения списка продуктов
    const [arr, setArr] = useState([]);

    // Асинхронная функция для загрузки продуктов из API
    async function load_products(type) {
        // Устанавливаем флаг загрузки в true
        loaded = true;

        // Формируем объект запроса с типом продукта
        let requestData = {
            'type': type,
        };

        // Отправляем GET-запрос к API
        axios.get("http://localhost:5000/api/product/getall", { params: requestData })
            .then(response => {
                // Если запрос успешен, сохраняем данные в состояние
                if (response.status == 200) {
                    setArr(response.data);
                }
            })
            .catch(error => {
                // Выводим ошибку в консоль
                console.error(error);
            });
    }

    // Функция для получения последнего продукта из массива
    function getLastProduct() {
        return arr[arr.length - 1];
    }

    // Функция для получения последнего продукта заданного типа
    function getTypedProduct(type) {
        let typedProduct = [];
        for (let product of arr) {
            if (product.type == type) {
                typedProduct.push(product);
            }
        }
        return typedProduct[typedProduct.length - 1];
    }

    // Функция для получения URL-файла из статической директории
    function getUrlFile(fileName) {
        return "/static/" + fileName;
    }

    // Условный рендеринг для загрузки продуктов при монтировании компонента
    useEffect(() => {
        load_products(); // Здесь предполагается, что функция load_products должна вызываться без параметров
    }, []);


    return (
        <div className="">
            <img src={HM} alt="vk" className='image_offer' />
            <div className="container">
                <div className="offer_block">
                    <div className="text_holder">
                        <div className="title">НОВАЯ ЛЕТНЯЯ КОЛЛЕКЦИЯ</div>
                        <hr />
                        <div className="subtitle">Скидка на первый заказ 15%</div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="block_product">
                    <div className="summer_wear">
                        <p className="title">ПОПУЛЯРНЫЕ ТОВАРЫ</p>
                        <div className="products_holder">
                            {(() => {

                                let result = [];

                                let count = 0;
                                for (let product of arr) {
                                    if (count > 2) {
                                        break;
                                    }

                                    count++;
                                    // let product = getLastProduct();

                                    let outPrice;


                                    outPrice = product.price + " руб.";

                                    result.push(

                                        <div className="product_holder">
                                            <div className="flex_column">
                                                <p className="product_name">{product.name}</p>
                                                <p className="text_card">Летняя одежда:</p>
                                                <p className="price_card">{outPrice}</p>
                                            </div>
                                            <a href={"/product_card/" + product.id} className="info_product_holder"><div className="bg_card">
                                                <img src={getUrlFile(product.img)} alt="vk" className='image_product' />
                                            </div></a>
                                        </div>

                                    )

                                }
                                return result;

                            })()}
                        </div>
                    </div>

                    <div className="swiper_block">
                        <p className="title">НОВИНКИ</p>
                        <Swiper
                            slidesPerView={1}
                            spaceBetween={30}
                            loop={true}
                            pagination={{
                                clickable: true,
                            }}
                            navigation={true}
                            modules={[Pagination, Navigation]}
                            className="mySwiper"
                        >
                            {(() => {

                                let result = [];
                                // console.log(arr);

                                let count = 0;
                                for (let product of arr) {
                                    if (count > 5) {
                                        break;

                                    }

                                    count++;


                                    let outPrice;

                                    if (product.price == "0") {
                                        outPrice = "бесплатно";
                                    } else {
                                        outPrice = product.price + " руб.";
                                    }
                                    result.push(
                                        <SwiperSlide>
                                            <div className="slide_main">
                                                <a className="product_holder_slide">
                                                    <div className="bg_card_slide">
                                                        <img src={getUrlFile(product.img)} alt="" className='image_product' />
                                                        <div className="flex_column">
                                                            <p className="product_name">{product.name}</p>
                                                            <p className="desc">{product.desc}</p>
                                                            <p className="price_card">{outPrice}</p>
                                                            <a href="/list/man" className="info_product_holder">
                                                                <p className="swiper_know_more">Перейти в каталог</p>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                        </SwiperSlide>

                                    )

                                }
                                console.log(result);
                                return result;

                            })()}
                        </Swiper>
                    </div>
                    <div className="container">
                        <div className="about_us">
                            <p className="title">О КОМПАНИИ</p>
                            <div className="side_holder">
                                <div className="left-side"><img src={company} alt="vk" className='image_product' /></div>
                                <div className="right-side"><p className="about_us_text">Мы <span className="first_screen_logo">H&M</span> - шведская компания, основанная в 1947 году Эрлингом Перссоном. Базируется в Стокгольме. Является крупнейшей в Европе розничной сетью по торговле одеждой и вторым по величине, после испанской корпорации Inditex, глобальным ретейлером одежды. На апрель 2021 года компания имела 4372 магазина по всему миру. </p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div>
    );
}
