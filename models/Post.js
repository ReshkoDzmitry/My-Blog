import mongoose from "mongoose";


const PostSchema = new mongoose.Schema({ //Создаём схему поста
        title: { //fullName передаём объект с настройками
            type: String, //у title будет тип String
            required: true, // обязательный: да
        },
        text: { //text передаём объект с настройками
            type: String, //у text будет тип String
            required: true, // обязательный: да
            unique: true, // уникальная: да
        },
        tags: { //tags передаём объект с настройками
            type: Array, //у tags будет тип массив
            default: [], //если ничего не приходит, то пустой массив
        },
        viewsCount: { //количество просмотров
            type: Number, //тип числовой
            default: 0, //по умолчанию просмотров 0
        },
        user: { //user передаём объект с настройками создателя статьи
            type: mongoose.Schema.Types.ObjectId, //храним в user id пользователя. В БД это не просто строка, а ObjectId
            ref: 'User', //свойство ссылается на модель User. Если нужен пользователь, то по ObjectId ссылаться на модель User и вытаскивать пользователя. Связь между двумя таблицами (RelationShip)
            required: true, //свойство обязательно при создании документа
        },
        ImageUrl: String, //ImageUrl тип String
    },
    {
        timestamps: true, //свойство создания и обновления даты.
    }
);

export default mongoose.model('Post', PostSchema); //экспортируем модель. Указываем её название и фактическое название