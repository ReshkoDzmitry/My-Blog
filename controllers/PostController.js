import PostModel from '../models/Post.js';


export const getAll = async (req, res) => { //получение всех статей
    try {
        const posts = await PostModel.find().populate('user').exec(); //находим все статьи и передаём в переменную массив с ними. Передаём одну связь user и выполняем запрос

        res.json(posts); //возращаем массив статей
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
}


export const getOne = async (req, res) => { //получение всех статей
    try {
        const postId = req.params.id //достаем динамический id
        PostModel.findOneAndUpdate({ //найди одну статью и обнови
                _id: postId, //первый параметр id
            },
            {
                $inc: {viewsCount: 1}, //обновление параметра. Увеличиваем кол-во просмотров на 1. Второй параметр
            },
            {
               returnDocument: 'after', //возвращаем обновленный документ. Третий параметр
            },
            (err, doc) => { //Или пришла ошибка, или документ. Четвертый параметр
                if (err) { //если ошибка то
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удалось вернуть статью'
                    });
                }
                if (!doc) { //если indefined, то
                    return res.status(404).json({
                        message: 'Статья не найдена',
                    });
                }
                res.json(doc); //если статья нашлась, то возвращаем документ
            },
        )
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
}


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
    } catch (err) { //если ошибка, то
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью',
        });
    }
}