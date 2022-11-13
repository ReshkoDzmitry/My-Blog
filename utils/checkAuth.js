//middle work функция посредник. Она решает можно ли возвращать секретную информацию или нельзя.

import jwt from "jsonwebtoken";


export default (req, res, next) => { //по умолчанию возвращаем функцию
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, ''); //из запроса из хедера вытащить authorization и поместить в переменную token. Токен пришёл или нет, в любом случае передаём пустую строку. Если токен пришёл, с помощью регулярного выражения удаляем слово Bearer

    if (token) { //если токен есть, то выполняется
        try {
            const decoded = jwt.verify(token, 'secret123'); //расшифровываем токен с помощью jwt(передаём ему токен и ключ шифрования)
            req.userId = decoded._id; //если токен расшифрован, то в req userId передаём то, что расшифровали

            next(); //если всё нормально, выполняй следующую функцию next
        }
        catch (e) { //если токен не расшифровался, ошибка
            return res.status(403).json({
                message: 'Нет доступа'
            })
        }
    } else { //если токена нет, ошибка
        return res.status(403).json({
            message: 'Нет доступа'
        })
    }
}