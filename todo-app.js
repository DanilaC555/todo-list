(function() {
  // Массив для хранения дел
  let arrObgectId = [];
  // Функция для генерации уникального ID
  function generateUniqueId(todoId) {
      let maxId = 0;
      for (let todo of todoId) {
          if (todo.id > maxId) {
              maxId = todo.id;
          }
      }
      return maxId + 1;
  }

  // Создаём и возвращаем заголовок приложения
  function createAppTitle(title) {
      let appTitle = document.createElement('h2');
      appTitle.innerHTML = title;
      return appTitle;
  }

  // Создаём и возвращаем форму для создания дела
  function createTodoItemForm() {
      let form = document.createElement('form');
      let input = document.createElement('input');
      let buttonWrapper = document.createElement('div');
      let button = document.createElement('button');

      form.classList.add('input-group', 'mb-3');
      input.classList.add('form-control');
      input.placeholder = 'Введите название нового дела';
      buttonWrapper.classList.add('input-group-append');
      button.classList.add('btn', 'btn-primary');
      button.textContent = 'Добавить дело';

      buttonWrapper.append(button);
      form.append(input);
      form.append(buttonWrapper);

      // Состояние кнопки, если инпут пустой
      button.disabled = true;
      // Событие проверки trim() проверяет наличие пустого места
      input.addEventListener('input', function() {
          button.disabled = !input.value.trim();
      });

      return {
          form,
          input,
          button,
      };
  }

  // Создаём и возвращаем список элементов
  function createTodoList() {
      let list = document.createElement('ul');
      list.classList.add('list-group');
      return list;
  }

  // Функция для создания DOM-элемента с делом
  function createTodoItem(todoObject, listName) {
      let item = document.createElement('li');
      // Кнопки помещаем в элемент, который красиво покажет их в одной группе
      let buttonGroup = document.createElement('div');
      let doneButton = document.createElement('button');
      let deleteButton = document.createElement('button');

      // Устанавливаем стили для элементов списка,
      // а также для размещения кнопок в его правой части с помощью flex
      item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
      // Устанавливает текст элемента списка на значение свойства name из переданного объекта
      item.textContent = todoObject.name;
      // Установка состояния элемента
      if (todoObject.done) {
          item.classList.add('list-group-item-success');
      }

      // Внутри функции createTodoItem todoObject ссылается на тот же объект,
      // что и todoObjectItem вне функции. Поэтому, присваивая item.id = todoObject.id,
      // устанавливаем атрибут id элемента списка в соответствие с id объекта дела
      item.id = todoObject.id;

      buttonGroup.classList.add('btn-group', 'btn-group-sm');
      doneButton.classList.add('btn', 'btn-success');
      doneButton.textContent = 'Готово';
      deleteButton.classList.add('btn', 'btn-danger');
      deleteButton.textContent = 'Удалить';

      // Вкладываем кнопки в отдельный элемент, чтобы они объединялись в один блок
      buttonGroup.append(doneButton);
      buttonGroup.append(deleteButton);
      item.append(buttonGroup);

      // Добавляем обработчики на кнопки
      doneButton.addEventListener('click', function() {
        // Изменение статуса в массиве
        for (let i = 0; i < arrObgectId.length; i++) {
          if (arrObgectId[i].id === todoObject.id) {
            arrObgectId[i].done = !arrObgectId[i].done;
            break;
          }
        }
        // Класс list-group-item-success переключается на элементе DOM item,
        // что отражает изменение статуса задачи (готово/не готово).
        item.classList.toggle('list-group-item-success');
        // сохранение нового массива
        saveLocalStorage(listName, arrObgectId);
      });

      deleteButton.addEventListener('click', function() {
        if (confirm('Вы уверены?')) {
          // фильтрация массива дел
        //делаем arrObgectId = arrObgectId потому что нам не надо хранить отфильтрованный массив
        // мы просто его ообновляем
          arrObgectId = arrObgectId.filter(function(objectFromArray) {
            // проверяет, равен ли его id идентификатору удаляемого дела (todoObject.id).

            // objectFromArray.id: Идентификатор текущего объекта из массива arrObgectId.
            // todoObject.id: Идентификатор объекта дела, который мы хотим удалить.

            // возвращает true, если id текущего объекта из массива не равен id объекта, который мы хотим удалить.
            // Если условие true, то текущий объект включается в новый массив, false нет
              return objectFromArray.id !== todoObject.id;
            });
            // удаление из dom
            item.remove();
            // сохранение нового массива
            saveLocalStorage(listName, arrObgectId);
        }
    });

      return {
          item,
          doneButton,
          deleteButton,
      };
  }

  // функуция сохранения даных
  function saveLocalStorage(key, data) {
    // Метод JSON.stringify используется для преобразования объекта JavaScript (или массива)
    // в строку JSON.
    // Данные в LocalStorage хранятся в виде строк, поэтому нам нужно преобразовать объект
    // или массив в строку, чтобы сохранить их.
    // localStorage — это объект, предоставляемый браузером для хранения данных в виде пар
    // "ключ-значение".
    // Метод setItem сохраняет значение (в данном случае строку JSON), связанное с
    // указанным ключом.(записывает данные в LS)
    // key — это строка, которая используется для идентификации данных в LocalStorage.
    // JSON.stringify(data) — это строка, представляющая данные, которые мы хотим сохранить.
    localStorage.setItem(key, JSON.stringify(data));
  }

  // функция звгрузка данных
  function loadLocalStorage(key) {
    // получаем текущие состояние данных lS
    // Метод getItem извлекает значение, связанное с указанным ключом.(вернёт данные из LS)
    // В данном случае, ключ передаётся как параметр key.
    // Если данных под этим ключом нет, метод getItem вернёт null.
    let data = localStorage.getItem(key);
    // "Если data не равно null или undefined (то есть данные существуют),
    // то выполнить JSON.parse(data), иначе вернуть пустой массив []."
    return data ? JSON.parse(data) : [];
    // Метод JSON.parse используется для преобразования строки в объект JavaScript.
    // Данные в LocalStorage хранятся в виде строк, поэтому мы должны преобразовать их
    // обратно в объект (или массив) для дальнейшего использования.
  }

  // Параметр listName позволяет создавать и управлять несколькими списками дел,
  // хранящимися в LS, каждый из которых имеет свой уникальный ключ
  function createTodoApp(container, title = 'Список дел', listName) {
      let todoAppTitle = createAppTitle(title);
      let todoItemForm = createTodoItemForm();
      let todoList = createTodoList();

      container.append(todoAppTitle);
      container.append(todoItemForm.form);
      container.append(todoList);

      // загуржаем данне из lS
      arrObgectId = loadLocalStorage(listName);

    // Создаём элементы списка на основе загруженных данных
    for (let i = 0; i < arrObgectId.length; i++) {
      let todoObject = arrObgectId[i];
      let todoItem = createTodoItem(todoObject, listName);
      todoList.append(todoItem.item);
  }


      // Обработчик события submit на форме
      todoItemForm.form.addEventListener('submit', function(e) {
          // Предотвращаем стандартное действие браузера
          e.preventDefault();

          // Игнорируем создание элемента, если пользователь ничего не ввёл в поле
          if (!todoItemForm.input.value) {
              return;
          }

          // После добавления элемента отключаем кнопку
          todoItemForm.button.disabled = true;

          // Создание объекта
          let todoObjectItem = {
              id: generateUniqueId(arrObgectId),
              name: todoItemForm.input.value,
              done: false,
          };

          arrObgectId.push(todoObjectItem);

          // Здесь todoObjectItem передается в функцию createTodoItem,
          // и внутри этой функции он доступен под именем todoObject.
          let todoItem = createTodoItem(todoObjectItem, listName);

          // Создаём и добавляем в список новое дело с названием из поля для ввода
          todoList.append(todoItem.item);

          // Обнуляем значение в поле, чтобы не пришлось стирать его вручную
          todoItemForm.input.value = '';

          // Сохраняем список в LocalStorage
          saveLocalStorage(listName, arrObgectId);
      });

  }

//   Эта строка предназначена для экспорта функции createTodoApp из текущего модуля.
//   После выполнения этой строки функция createTodoApp становится доступной глобально
//   через объект window. То есть, любой код, который импортирует этот модуль или просто
//   имеет доступ к объекту window, сможет использовать функцию createTodoApp
  window.createTodoApp = createTodoApp;

})();
