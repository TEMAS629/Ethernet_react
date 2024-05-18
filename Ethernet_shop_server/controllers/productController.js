// Импорт необходимых модулей и инструментов
const { resolve } = require("node:path"); // Для разрешения путей
const uuid = require("uuid"); // Для генерации уникальных идентификаторов
const { Product } = require("../models/models"); // Модель продукта
const ApiError = require("../error/ApiError"); // Кастомный класс ошибок API

// Класс ProductController для управления операциями с продуктами
class ProductController {
    // Асинхронная функция для создания нового продукта
    async create(req, res, next) {
        try {
            // Деструктуризация тела запроса для получения данных продукта
            const { name, year, creator, desc, price, categoryid, type} = req.body;

            // Извлечение файла изображения из запроса
            const { img } = req.files;
            // Определение расширения файла изображения
            let extImg = img.name.split('.').reverse()[0];
            // Генерация имени файла с использованием UUID и расширения
            let imgName = uuid.v4() + "." + extImg;
            // Перемещение файла изображения в директорию static с новым именем
            await img.mv(resolve(__dirname, "..", "static", imgName));

            // Создание нового продукта в базе данных с переданными данными
            const product = await Product.create({
                name,
                price,
                img: imgName,
                year,
                creator,
                desc,
                categoryid,
                type,
            });

            // Отправка ответа клиенту с телом запроса
            res.send(req.body);
        } catch (error) {
            // Логирование ошибки и передача ее дальше в стек вызовов
            console.log(error);
            next(ApiError.badRequest(error.message));
        }
    }

    // Асинхронная функция для получения всех продуктов
    async getAll(req, res) {
        // Деструктуризация параметров запроса для фильтрации продуктов
        const { categoryid, type } = req.query;
        let products;

        // Логика выбора продуктов в зависимости от предоставленных параметров
        if (categoryid && type) {
            products = await Product.findAll({ where: { categoryid, type } });
        } else if (categoryid) {
            products = await Product.findAll({ where: { categoryid } });
        } else if (type) {
            products = await Product.findAll({ where: { type } });
        } else {
            products = await Product.findAll();
        }

        // Отправка списка продуктов в ответе
        console.log(products);
        return res.json(products);
    }

    // Асинхронная функция для получения одного продукта по ID
    async getOne(req, res) {
        // Извлечение ID продукта из параметров запроса
        const { id } = req.params;
        // Поиск продукта в базе данных по ID
        const product = await Product.findOne({ where: { id } });
        // Отправка найденного продукта в ответе
        return res.json({product});
    }
}

// Экспорт экземпляра класса ProductController
module.exports = new ProductController()
