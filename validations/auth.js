import {body} from "express-validator"; //валидация информации в теле запроса


export const registerValidation = [ //переменная массива с проверками
    body('email').isEmail(), //если email корректный, то пропускаем
    body('password').isLength({min: 5}), //если длина пароля меньше 5, то ошибка
    body('fullName').isLength({min: 3}), //если длина Имени меньше 3, то ошибка
    body('avatarUrl').optional().isURL(), //опциональный параметр. Если не пришло ничего, то ок. Если пришёл не url, то ошибка
]