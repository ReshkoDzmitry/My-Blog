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
};


export const remove = async (req, res) => { //получение всех статей
    try {
        const postId = req.params.id; //достаем динамический id

        PostModel.findOneAndDelete({ //находим пост из модели и удаляем
            _id: postId,
        }, (err, doc) => { //узнаём, была ли ошибка
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Не удалось удалить статью',
                })
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'Статья не найдена',
                })
            }

            res.json({ //если статья нашлась и удалилась, возвращаем ответ
                success: true,
            });
        })

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

export const update = async (req, res) => {
    try {
        const postId = req.params.id; //достаем динамический id

        await PostModel.updateOne({
                _id: postId,
            }, {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: req.body.tags,
            },
        );

        res.json({
            success: true,
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить статью статью',
        });
    }
};