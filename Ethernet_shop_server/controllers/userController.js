// Импорт необходимых модулей и инструментов
const ApiError = require("../error/ApiError")
const bcrypt = require('bcrypt') // Для хеширования паролей
const jwt = require('jsonwebtoken') // Для генерации JSON Web Tokens
const { User, Basket, Basket_product, History, History_product, Product } = require('../models/models')

// Функция для генерации JWT токена
const generateJwt = (id, login, email, phone, role) => {
    return jwt.sign({ id, login, email, phone, role }, process.env.SECRET_KEY, { expiresIn: '24h' }) // Генерация токена с указанными данными и сроком действия
}

// Класс UserController для управления операциями с пользователем
class UserController {
    // Асинхронная функция для регистрации нового пользователя
    async register(req, res, next) {
        console.log("register!");

        // Деструктуризация тела запроса для получения данных пользователя
        const { login, email, phone, password, password_repeat } = req.body
        let role = 'user'

        // Проверка наличия всех обязательных полей
        let requiredVars = ['login', 'email', 'phone', 'password', 'password_repeat']
        for (let name of requiredVars) {
            if (req.body[name] == null) {
                console.log('INVALID LOGIN OR EMAIL OR PHONE OR PASSWORD');
                return next(ApiError.badRequest('INVALID LOGIN OR EMAIL OR PHONE OR PASSWORD'))
            }
        }

        // Проверка на существование логина или электронной почты
        const candidate = await User.findOne({ where: { login, email } })
        if (candidate) {
            console.log('LOGIN OR EMAIL ALREADY EXISTS');
            return next(ApiError.badRequest('LOGIN OR EMAIL ALREADY EXISTS'))
        }

        // Проверка совпадения паролей
        if (password_repeat!== password) {
            console.log('Password mismatch');
            return next(ApiError.badRequest('Password mismatch'))
        }

        // Хеширование пароля
        const hashPassword = await bcrypt.hash(password, 5)
        // Создание нового пользователя в базе данных
        const user = await User.create({
            login,
            email,
            phone,
            password: hashPassword,
            role,
        })

        // Создание корзины и истории покупок для нового пользователя
        await Basket.create({ UserId: user.id })
        await History.create({ UserId: user.id })

        // Генерация и отправка JWT токена
        const token = generateJwt(user.id, user.login, user.email, user.phone, user.role)
        return res.json({ token })
    }

    // Асинхронная функция для авторизации пользователя
    async login(req, res, next) {
        console.log("login!");

        // Деструктуризация тела запроса для получения данных пользователя
        const { email, password } = req.body
        // Поиск пользователя по электронной почте
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return next(ApiError.badRequest('INVALID LOGIN'))
        }

        // Сравнение введенного пароля с хешированным
        let comparePassword = await bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.badRequest('INVALID PASSWORD'))
        }

        // Генерация и отправка JWT токена
        const token = generateJwt(user.id, user.login, user.email, user.phone, user.role)
        return res.json({ token })
    }

    // Асинхронная функция для проверки JWT токена
    async check(req, res) {
        const token = generateJwt(req.userId, req.login, req.email, req.phone, req.role)
        return res.json({ token })
    }

    // Асинхронная функция для получения списка товаров в корзине пользователя
    async getBasket(req, res, next) {
        try {
            const { BasketId } = req.query

            // Получение списка товаров в корзине
            let basket_products = await Basket_product.findAll({ where: { BasketId } })

            let products = []

            // Заполнение списка товарами
            for (let itemBascket of basket_products) {
                let product = await Product.findOne({ where: itemBascket.ProductId })
                products.push(product);
            }

            return res.json(products)
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    // Асинхронная функция для добавления товара в корзину пользователя
    async addToBasket(req, res, next) {
        try {
            const { BasketId, ProductId } = req.body

            // Проверка на наличие товара в истории покупок
            // const history_product = await History_product.findAll({ where: { HistoryId: BasketId, ProductId } })
            // if (history_product.length >= 1) {
            //     throw new Error("the product has already been added to the history");
            // }

            // Проверка на наличие товара в корзине
            // const basketProduct = await Basket_product.findAll({ where: { BasketId, ProductId } })
            // if (basketProduct.length >= 1) {
            //     throw new Error("the product has already been added to the cart");
            // }

            // Добавление товара в корзину
            await Basket_product.create({ BasketId, ProductId })

            return res.json({ message: "PRODUCT ADDED TO BASKET" })
        } catch (error) {
            console.log(error.message);
            return next(ApiError.badRequest(error.message))
        }
    }

    // Асинхронная функция для удаления товара из корзины пользователя
    async deleteFromBasket(req, res, next) {
        try {
            const { BasketId, ProductId } = req.query

            // Поиск товара в корзине
            const basketProduct = await Basket_product.findOne({ where: { BasketId, ProductId } })
            if (!basketProduct) {
                throw new Error("PRODUCT NOT IN BASKET")
            }

            // Удаление товара из корзины
            await basketProduct.destroy();

            return res.json({ message: "PRODUCT DELETED FROM BASKET" })
        } catch (e) {
            return next(ApiError.badRequest(e.message));
        }
    }

    // Асинхронная функция для подтверждения заказа в корзине пользователя
    async submitBacket(req, res, next) {
        try {
            const { UserId } = req.body;

            // Получение списка товаров в корзине
            const basketProducts = await Basket_product.findAll({ where: { BasketId: UserId } });

            let products = []

            // Заполнение списка товарами
            for (let basketProduct of basketProducts) {
                products.push(basketProduct.ProductId);
            }

            // Добавление товаров в историю покупок
            for (let ProductId of products) {
                await History_product.create({ HistoryId: UserId, ProductId })
            }

            return res.json(products);
        } catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }

    // Асинхронная функция для получения истории покупок пользователя
    async getHistory(req, res, next) {
        try {
            const { HistoryId } = req.query

            // Получение списка товаров в истории покупок
            let historyProducts = await History_product.findAll({ where: { HistoryId } })

            let products = []

            // Заполнение списка товарами
            for (let itemBascket of historyProducts) {
                let product = await Product.findOne({ where: itemBascket.ProductId })
                products.push(product);
            }

            return res.json(products);
        } catch (error) {
            return next(ApiError.badRequest("HISTORY NOT FOUND"))
        }
    }

    // Асинхронная функция для добавления товара в историю покупок пользователя
    async addToHistory(req, res, next) {
        try {
            const { HistoryId, ProductId } = req.body

            // Проверка на наличие товара в истории покупок
            const history_product = await History_product.findAll({ where: { HistoryId, ProductId } })
            if (history_product.length >= 1) {
                throw new Error("the product has already been added to the history");
            }

            // Добавление товара в историю покупок
            await History_product.create({ HistoryId, ProductId })

            return res.json({ message: "PRODUCT ADDED TO HISTORY" })
        } catch (error) {
            console.log(error.message);
            return next(ApiError.badRequest(error.message))
        }
    }
}

// Экспорт экземпляра класса UserController
module.exports = new UserController()
