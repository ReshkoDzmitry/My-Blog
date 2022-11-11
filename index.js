import express from 'express';
//import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import {registerValidation} from './validations/auth.js';
import {validationResult} from "express-validator";
import UserModel from './models/User.js'; //импортируем модель User с названием UserModel
import bcrypt from 'bcrypt';


mongoose.connect('mongodb+srv://admin:qqqqqq@cluster0.0v9j9gg.mongodb.net/blog?retryWrites=true&w=majority') //подключаем с помощью mongoose базу данных mongoDB с логином и паролем указанными при создании БД
    .then(() => console.log('DB Ok')) // проверяем подключена ли база данных. Если да, что выводим DB Ok
    .catch((err) => console.log('DB error', err)); // если не подключена выводим DB error и ошибку err

const app = express(); //создание express приложения. Вся логика приложения хранится в переменной app
app.use(express.json()) //указываем, что с помощью use из express вытаскиваем json. Нужно чтобы приложение понимало json-формат


// app.get('/', (req, res) => {
//     res.send('Hi');
// }) //указываем route. Если на главный путь приходит get-запрос, выполняем функцию, которая вернёт 2 параметра req и res. Req - информация о том, что прислал клиент. Res - что передается клиенту (имеет методы и свойства).

// app.post('/auth/login', (req, res) => { //отлавливаем post-запрос по адресу /auth/login (auth - писать не обязательно). Вытаскиваем запрос req  и ответ res.
//     console.log(req.body) //обращаемся к телу запроса
//     if (req.body.email === 'test@test.ru') {
//         const token = jwt.sign({ //когда придёт запрос, мы генерируем токен и передаем информацию, которую будем шифровать
//                 email: req.body.email,
//                 fullName: 'Петя Чмонин',
//             },
//             'secret123' //шифруем объект при помощи специального ключа (название может быть любое)
//         );
//     }
//
//     res.json({ // объявляем, что вернём ответ в формате json
//         success: true, // любой текст
//         token, //возвращаем токен клиенту
//     });
// });


app.post('/auth/register', registerValidation, async (req, res) => { //отлавливаем post-запрос по адресу /auth/register (auth - писать не обязательно). Вытаскиваем запрос req  и ответ res. Проверяем тело запроса и если всё ок, выполняем код дальше. Объявляем что функция будет async
    const errors = validationResult(req); //получаем в переменную errors все ошибки. Передаём req из которого их и нужно вытащить
    if (!errors.isEmpty()) { //если ошибки есть
        return res.status(400).json(errors.array()); //возвращаем 400 статус (неверный запрос) со всеми ошибками
    }

    const password = req.body.password; //вытаскиваем из req.body пароль
    const salt = await bcrypt.genSalt(10); //генерируем соль. await будет ошибкой, пока в параметрах функции не указать, что она async(см.выше!)
    const passwordHash = await bcrypt.hash(password, salt) //в переменной passwordHash будет хранится зашифрованный пароль. Передаём пароль (password) и алгоритм пароля (salt)

    const doc = new UserModel({ //подготавливаем документ на создание пользователя с помощью mongoDB. Передаём все что есть в req.body
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash, //переменная с зашифрованным паролем (см. выше)
    })

    const user = await doc.save(); //создаём пользователя в mongoDB и сохраняем в БД. Результат передаётся в переменную user

    // res.json({ //если ошибок нет
    //     success: true, //возвращаем строку
    // });

    res.json(user);//возвращаем информацию о пользователе

});


app.listen(4444, (err) => { //запускаем веб-сервер. Указываем на какой порт (любой) прикрепить приложение node.js. Вторым параметром передаем функцию условия запуска.
    if (err) { //если сервер не смог запуститься
        return console.log(err); // возвращаем сообщение с ошибкой
    }
    console.log('Server OK'); // если сервер запустился - выводим ок
});

