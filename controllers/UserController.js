import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";
//import User from "../models/User.js";


//передаём функцию регистрации
export const register = async (req, res) => { //отлавливаем post-запрос по адресу /auth/register (auth - писать не обязательно). Вытаскиваем запрос req  и ответ res. Проверяем тело запроса и если всё ок, выполняем код дальше. Объявляем что функция будет async
    // const errors = validationResult(req); //получаем в переменную errors все ошибки. Передаём req из которого их и нужно вытащить
    // if (!errors.isEmpty()) { //если ошибки есть
    //     return res.status(400).json(errors.array()); //возвращаем 400 статус (неверный запрос) со всеми ошибками
    // }
    //
    // const password = req.body.password; //вытаскиваем из req.body пароль
    // const salt = await bcrypt.genSalt(10); //генерируем соль. await будет ошибкой, пока в параметрах функции не указать, что она async(см.выше!)
    // const passwordHash = await bcrypt.hash(password, salt) //в переменной passwordHash будет хранится зашифрованный пароль. Передаём пароль (password) и алгоритм пароля (salt)
    //
    // const doc = new UserModel({ //подготавливаем документ на создание пользователя с помощью mongoDB. Передаём все что есть в req.body
    //     email: req.body.email,
    //     fullName: req.body.fullName,
    //     avatarUrl: req.body.avatarUrl,
    //     passwordHash, //переменная с зашифрованным паролем (см. выше)
    // })
    //
    // const user = await doc.save(); //создаём пользователя в mongoDB и сохраняем в БД. Результат передаётся в переменную user
    //
    // // res.json({ //если ошибок нет
    // //     success: true, //возвращаем строку
    // // });
    //
    // res.json(user);//возвращаем информацию о пользователе

    try { //если ошибок нет, то отрабатывает код:
        const errors = validationResult(req); //получаем в переменную errors все ошибки. Передаём req из которого их и нужно вытащить
        if (!errors.isEmpty()) { //если ошибки есть
            return res.status(400).json(errors.array()); //возвращаем 400 статус (неверный запрос) со всеми ошибками
        }

        const password = req.body.password; //вытаскиваем из req.body пароль
        const salt = await bcrypt.genSalt(10); //генерируем соль. await будет ошибкой, пока в параметрах функции не указать, что она async(см.выше!)
        const hash = await bcrypt.hash(password, salt) //в переменной passwordHash будет хранится зашифрованный пароль. Передаём пароль (password) и алгоритм пароля (salt)

        const doc = new UserModel({ //подготавливаем документ на создание пользователя с помощью mongoDB. Передаём все что есть в req.body
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash, //переменная с зашифрованным паролем (см. выше)
        });

        const user = await doc.save(); //создаём пользователя в mongoDB и сохраняем в БД. Результат передаётся в переменную user

        const token = jwt.sign( //создаём токен с зашифрованной информацией
            {
                _id: user._id, //шифруем именно id, т.к. id самая важная информация
            },
            'secret123', //ключ, по которому будет шифроваться токен (любой)
            {
                expiresIn: '30d', //время жизни токена (30 дней)
            }
        );

        // res.json({ //если ошибок нет
        //     success: true, //возвращаем строку
        // });

        const {passwordHash, ...userData} = user._doc; //чтобы не показывать hash. Его использовать не будем. Ниже выводим только userData

        res.json({ //возвращаем информацию о пользователе и токен
            ...userData,
            token,
        });
    } catch (err) { //если ошибка, то
        console.log(err) //выводим ошибку в консоль
        res.status(500).json({ //выводим сообщение и код ошибки 500
            message: 'Не удалось зарегистрироваться',
        });
    }
};


//передаём функцию логинизации
export const login = async (req, res) => { //авторизация
    try {
        const user = await UserModel.findOne({email: req.body.email}); //указываем, что нужно найти пользователя если он есть в БД
        if (!user) { //если такой почты нет, то
            return res.status(404).json({ //останавливаем код, выводим строку и ошибку 404
                message: 'Пользователь не найден'
            });
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash); //если пользователь нашёлся в БД, то сравнить его пароль в БД с тем, что он прислал
        if (!isValidPass) { //если пароли не сходятся, то
            return res.status(400).json({ //выводим строку и ошибку. Явно уточнять причину нельзя!
                message: 'Неверный логин или пароль',
            });
        }
        const token = jwt.sign( //если авторизовался, то создаём токен
            {
                _id: user._id, //шифруем именно id, т.к. id самая важная информация
            },
            'secret123', //ключ, по которому будет шифроваться токен (любой)
            {
                expiresIn: '30d', //время жизни токена (30 дней)
            }
        );

        const {passwordHash, ...userData} = user._doc; //чтобы не показывать hash. Его использовать не будем. Ниже выводим только userData

        res.json({ //возвращаем информацию о пользователе и токен
            ...userData,
            token,
        });
    }
    catch (err) {
        console.log(err) //выводим ошибку в консоль
        res.status(500).json({ //выводим сообщение и код ошибки 500
            message: 'Не удалось авторизоваться',
        });
    }
};


//передаём функцию получения юзера
export const getMe = async (req, res) => { //запрос на получения информации о себе. Перед выполнением основной функции try/catch отрабатывает функция checkAuth, и по итогам ёё работы решается, переходить к try/catch или нет
    try {
        const user = await User.findById(req.userId); //находим пользователя с помощью UserModel. В метод findById передаём из req userId информацию об id.

        if (!user) { //если такого пользователя нет, то ошибка
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }

        const {passwordHash, ...userData} = user._doc; //если пользователь нашёлся, возвращаем информацию. Чтобы не показывать hash. Его использовать не будем. Ниже выводим только userData

        res.json(userData); //возвращаем информацию о пользователе
    }

    catch (err) {
        return res.status(500).json({
            message: 'Нет доступа',
        });
    }
};