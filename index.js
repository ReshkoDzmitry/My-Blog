import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";;

mongoose.connect('mongodb+srv://admin:qqqqqq@cluster0.0v9j9gg.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('DB Ok'))
    .catch((err) => console.log('DB error', err));

const app = express(); //создание express приложения. Вся логика приложения хранится в переменной app
app.use(express.json()) //указываем, что с помощью use из express вытаскиваем json. Нужно чтобы приложение понимало json-формат

app.get('/', (req, res) => {
    res.send('Hi');
}) //указываем route. Если на главный путь приходит get-запрос, выполняем функцию, которая вернёт 2 параметра req и res. Req - информация о том, что прислал клиент. Res - что передается клиенту (имеет методы и свойства).


app.post('/auth/login', (req, res) => { //отлавливаем post-запрос по адресу /auth/login (auth - писать не обязательно). Вытаскиваем запрос req  и ответ res.
    console.log(req.body) //обращаемся к телу запроса


    if (req.body.email === 'test@test.ru') {
        const token = jwt.sign({ //когда придёт запрос, мы генерируем токен и передаем информацию, которую будем шифровать
                email: req.body.email,
                fullName: 'Петя Чмонин',
            },
            'secret123' //шифруем объект при помощи специального ключа (название может быть любое)
        );
    }


    res.json ({ // объявляем, что вернём ответ в формате json
        success: true, // любой текст
        token, //возвращаем токен клиенту
    });
});


app.listen(4444, (err)=> { //запускаем веб-сервер. Указываем на какой порт (любой) прикрепить приложение node.js. Вторым параметром передаем функцию условия запуска.
    if (err) { //если сервер не смог запуститься
        return console.log(err); // возвращаем сообщение с ошибкой
    }
    console.log('Server OK'); // если сервер запустился - выводим ок
});

