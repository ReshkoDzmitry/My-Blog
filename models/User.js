import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({ //Создаём схему юзера
        fullName: { //fullName передаём объект с настройками
            type: String, //у fullName будет тип String
            required: true, // обязательный: да
        },
        email: { //email передаём объект с настройками
            type: String, //у email будет тип String
            required: true, // обязательный: да
            unique: true, // уникальная: да
        },
        passwordHash: { //passwordHash передаём объект с настройками
            type: String, //у passwordHash будет тип String
            required: true, // обязательный: да
        },
        avatarUrl: String, //avatarUrl тип String. Не обязательный. Если передаём сразу тип, а не объект, значит свойство необязательно
    },
    {
        timestamps: true, //свойство создания и обновления даты.
    }
);

export default mongoose.model('User', UserSchema); //экспортируем модель. Указываем её название и фактическое название