const ru = {
  header: {
    title: "Hexlet Chat",
    logout: "Выйти",
  },

  login: {
    title: "Войти",
    username: "Ваш ник",
    password: "Пароль",
    submit: "Войти",
    noAccount: "Нет аккаунта?",
    signup: "Регистрация",
    errors: {
      invalidCredentials: "Неверные имя пользователя или пароль",
      network: "Ошибка соединения",
    },
  },

  signup: {
    title: "Регистрация",
    username: "Имя пользователя",
    password: "Пароль",
    confirmPassword: "Подтвердите пароль",
    submit: "Зарегистрироваться",
    errors: {
      required: "Обязательное поле",
      usernameLength: "От 3 до 20 символов",
      passwordLength: "Не менее 6 символов",
      passwordsMatch: "Пароли должны совпадать",
      userExists: "Такой пользователь уже существует",
      network: "Не удалось зарегистрироваться",
    },
  },

  chat: {
    channels: "Каналы",
    messagesCount_one: "{{count}} сообщение",
    messagesCount_few: "{{count}} сообщения",
    messagesCount_many: "{{count}} сообщений",
    messagesCount_other: "{{count}} сообщения",
    messagePlaceholder: "Введите сообщение...",
    send: "Отправить",
    online: "В сети",
    offline: "Нет соединения",
    loadError: "Не удалось загрузить данные чата",
    sendError: "Не удалось отправить сообщение",

    notifications: {
      networkError: "Ошибка соединения",
      loadError: "Не удалось загрузить данные чата",
    },
  },

  channels: {
    add: {
      title: "Добавить канал",
      placeholder: "Имя канала",
      submit: "Добавить",
    },

    rename: {
      title: "Переименовать канал",
      submit: "Переименовать",
    },

    remove: {
      title: "Удалить канал",
      question: "Уверены, что хотите удалить канал # {{name}}?",
      submit: "Удалить",
      error: "Не удалось удалить канал",
    },

    addAction: "+",
    cancel: "Отмена",
    manage: "Управление каналом",
    renameAction: "Переименовать",
    removeAction: "Удалить",

    errors: {
      required: "Введите имя канала",
      length: "От 3 до 20 символов",
      duplicate: "Канал с таким именем уже существует",
      add: "Не удалось создать канал",
      rename: "Не удалось переименовать канал",
    },

    notifications: {
      created: "Канал создан",
      renamed: "Канал переименован",
      removed: "Канал удалён",
    },
  },

  notFound: {
    title: "404",
    text: "Страница не найдена",
    home: "На главную",
  },
};

export default ru;
