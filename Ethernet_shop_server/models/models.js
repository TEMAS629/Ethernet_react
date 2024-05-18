const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('Users', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    login: { type: DataTypes.STRING, unique: true },
    email: { type: DataTypes.STRING, unique: true },
    phone: { type: DataTypes.STRING},
    password: { type: DataTypes.STRING},
    role: { type: DataTypes.STRING, defaultValue: 'user' },
})

const Basket = sequelize.define('Basket', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const Basket_product = sequelize.define('Basket_product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const History = sequelize.define('History', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const History_product = sequelize.define('History_product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    year: { type: DataTypes.STRING, allowNull: false },
    creator: { type: DataTypes.STRING, allowNull: false },
    desc: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.STRING, allowNull: false },
    img: { type: DataTypes.STRING, allowNull: false },
    categoryid: { type: DataTypes.INTEGER, allowNull: false },
    type: {type: DataTypes.STRING, allowNull: false }
})

const Category = sequelize.define('Category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
})

Category.hasMany(Product);
Product.belongsTo(Category);

User.hasOne(Basket);
Basket.belongsTo(User);

Basket.hasMany(Basket_product);
Basket_product.belongsTo(Basket);

Product.hasMany(Basket_product);
Basket_product.belongsTo(Product);

User.hasOne(History);
History.belongsTo(User);

History.hasMany(History_product);
History_product.belongsTo(History);

Product.hasMany(History_product);
History_product.belongsTo(Product);


module.exports = { User, Product, Basket, Basket_product, Category, History, History_product };