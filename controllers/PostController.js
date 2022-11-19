import PostModel from '../models/Post.js';
import {loginValidation} from "../validations.js";


export const create = async (req, res) => { //асинхронная функция
    try {
        const doc = new PostModel({ //объясняем, что нужно создать документ
            title: req.body.title, //указываем, что есть заголовок
            text: req.body.text, //указываем, что есть текст
            imageUrl: req.body.imageUrl, //указываем, что есть ссылка на картинку
            tags: req.body.tags, //указываем, что есть теги
            //кроме информации выше, указываем, что доверим бэку
            user: req.userId, //вытаскиваем юзера
        });

        const post = await doc.save();//когда документ подготовлен, создаём его
        res.json(post); //возвращаем ответ post
    }
    catch (err) { //если ошибка, то
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью',
        });
    }
}