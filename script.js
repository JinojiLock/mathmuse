/*Навигация*/
document.querySelectorAll('.menu a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});
/*Бургер-меню*/
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  menu.classList.toggle('show');
});
/*Кнопка "Наверх"*/
const scrollBtn = document.getElementById("scrollToTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollBtn.style.display = "block";
  } else {
    scrollBtn.style.display = "none";
  }
});
scrollBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
/*Оповещения при отправке формы*/
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('#myForm');
  form.addEventListener('submit', function (e) {
    const errorMessage = document.querySelector('.form-error-message');
    const successMessage = document.querySelector('.form-success-message');
    e.preventDefault();
    // Скрываем прошлые сообщения
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    // очищаем прошлые ошибки
    form.querySelectorAll('.error-message').forEach(el => el.remove());
    // Удаляем классы ошибок с инпутов и селектов
    form.querySelectorAll('.input, select, .checkbox').forEach(input => {
      input.classList.remove('error');
    });
    let isValid = true;
    // имя
    const nameInput = form.querySelector('input[name="name"]');
    if (!nameInput.value.trim()) {
      showError(nameInput, '* Введите имя');
      isValid = false;
    }
    // телефон
    const phoneInput = form.querySelector('input[name="phone"]');
    if (!iti.isValidNumber()) {
      showError(phoneInput, '* Введите корректный номер');
      isValid = false;
    }
    // класс
    const classInput = form.querySelector('input[name="class"]');
    const classVal = parseInt(classInput.value.trim());
    if (isNaN(classVal) || classVal < 5 || classVal > 11) {
      showError(classInput, '* Введите класс от 5 до 11');
      isValid = false;
    }
    // предмет
    const objectSelect = form.querySelector('select[name="object"]');
    if (objectSelect.value === 'start-obj') {
      showError(objectSelect, '* Выберите предмет');
      isValid = false;
    }
    // направление
    const courseSelect = form.querySelector('select[name="course"]');
    if (courseSelect.value === 'start-course') {
      showError(courseSelect, '* Выберите направление');
      isValid = false;
    }
    // согласие
    const privacyCheckbox = form.querySelector('input[name="privacy"]');
    if (!privacyCheckbox.checked) {
      showError(privacyCheckbox, '* Необходимо согласиться');
      isValid = false;
    }
    if (isValid) {
      successMessage.style.display = 'block';
      setTimeout(() => {
        successMessage.style.display = 'none';
      }, 10000);
    } else {
      errorMessage.style.display = 'block';
      setTimeout(() => {
        errorMessage.style.display = 'none';
      }, 10000);
    }
  });
  function showError(input, message) {
    const error = document.createElement('div');
    error.className = 'error-message';
    error.innerText = message;
    if (input.type === 'checkbox') {
      const wrapper = input.closest('.wrapper-checkbox');
      if (wrapper) {
        wrapper.insertAdjacentElement('afterend', error);
      } else {
        input.insertAdjacentElement('afterend', error);
      }
    } else if (input.tagName.toLowerCase() === 'select') {
      input.classList.add('error');
      input.insertAdjacentElement('afterend', error);
    } else {
      input.classList.add('error');
      input.insertAdjacentElement('afterend', error);
    }
  }  
});
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('myForm');
  const successMessage = document.querySelector('.form-success-message');
  const errorMessage = document.querySelector('.form-error-message');
  const phoneInput = document.getElementById('phone');
  // Инициализация intl-tel-input
  const iti = window.intlTelInput(phoneInput, {
    preferredCountries: ["ru", "kz", "by"],
    initialCountry: "auto",
    separateDialCode: false, // Код страны сливается с полем
    geoIpLookup: function(success) {
      success('ru');
    },
    utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js", // Сценарий для валидации
    nationalMode: false, // Отключаем национальный режим для всех стран
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Отменяем стандартную отправку формы
    const name = document.querySelector('input[name="name"]').value;
    const role = document.querySelector('input[name="role"]:checked').value; // Радио-кнопки для роли
    const countryCode = '+' + iti.getSelectedCountryData().dialCode; // Получаем код страны
    const phone = iti.getNumber(); // Получаем номер с кодом страны, например: +375 (029) 491-19-11
    const classValue = document.querySelector('input[name="class"]').value;
    const object = document.querySelector('select[name="object"]').value;
    const course = document.querySelector('select[name="course"]').value;
    const addit = document.querySelector('input[name="addit"]').value;
    const privacy = document.querySelector('input[name="privacy"]:checked') !== null;
    // Проверяем, что все обязательные поля заполнены
    if (!name || !phone || !classValue || object === "start-obj" || course === "start-course" || !privacy) {
      errorMessage.style.display = 'block'; // Показываем сообщение об ошибке
      successMessage.style.display = 'none'; // Скрываем успешное сообщение
      return;
    }
    // Создаем сообщение для отправки в Telegram
    const message = `
      Новый запрос:
      Имя: ${name}
      Роль: ${role}
      Код страны: ${countryCode}
      Номер телефона: ${phone}
      Класс: ${classValue}
      Предмет: ${object}
      Направление подготовки: ${course}
      Доп. информация: ${addit}
    `;
    // Отправляем сообщение в Telegram
    sendMessageToTelegram(message);
  });

  function sendMessageToTelegram(message) {
    const url = 'https://eozpmhfbm02oqr7.m.pipedream.net';

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    })
    .then(response => {
      console.log('RAW response:', response);
      return response.text(); // ← заменили на text()
    })
    .then(data => {
      console.log('Ответ от Pipedream/Telegram:', data);
      successMessage.style.display = 'block';
      errorMessage.style.display = 'none';
      form.reset();
      if (typeof iti !== 'undefined') iti.setNumber('');
    })
    .catch(error => {
      console.error('Ошибка:', error);
      alert('Что-то пошло не так. Пожалуйста, проверьте настройки.');
      errorMessage.style.display = 'block';
      successMessage.style.display = 'none';
    });
  }
});

