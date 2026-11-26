document.documentElement.classList.remove('no-js');



 // Анимация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    
    const fadeInElements = document.querySelectorAll('.fade-in');
    fadeInElements.forEach(el => {
        el.classList.add('visible');
    });

// Анимация при скролле
    const fadeScrollElements = document.querySelectorAll('.fade-in-scroll');

    const showOnScroll = () => {
        const windowHeight = window.innerHeight;
        fadeScrollElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < windowHeight - 100) {
                el.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', showOnScroll);
    showOnScroll(); 
});

//Модальное окно

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const openModalBtn = document.getElementById('openModal');
    const closeModalBtn = document.getElementById('closeModal');

    if (openModalBtn && modal && closeModalBtn) {
        
        openModalBtn.addEventListener('click', e => {
            e.preventDefault();
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });

       
        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });

 
        window.addEventListener('click', e => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
});


// Отправка заявки (Netlify Forms)
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form[data-form="tg"]');
    const lang = (document.documentElement.lang || 'uk').slice(0, 2);

    const TEXTS = {
        uk: {
            sending: 'Надсилаємо…',
            name: "Вкажіть, будь ласка, ваше ім'я",
            phone: 'Перевірте номер телефону',
            color: 'Оберіть колір зі списку',
            error: 'Не вдалося надіслати. Спробуйте ще раз або зателефонуйте нам.'
        },
        ru: {
            sending: 'Отправляем…',
            name: 'Укажите, пожалуйста, ваше имя',
            phone: 'Проверьте номер телефона',
            color: 'Выберите цвет из списка',
            error: 'Не удалось отправить. Попробуйте ещё раз или позвоните нам.'
        },
        en: {
            sending: 'Sending…',
            name: 'Please enter your name',
            phone: 'Please check your phone number',
            color: 'Please choose a colour',
            error: 'Could not send your request. Please try again or call us.'
        }
    };
    const t = TEXTS[lang] || TEXTS.uk;

    const popup = document.getElementById('success-popup');
    const popupText = popup && popup.querySelector('p');
    const successText = popupText ? popupText.textContent : 'OK';
    let popupTimer;

    const notify = (message, isError = false) => {
        if (!popup || !popupText) return;
        popupText.textContent = message;
        popup.classList.toggle('is-error', isError);
        popup.classList.add('show');
        clearTimeout(popupTimer);
        popupTimer = setTimeout(() => popup.classList.remove('show'), isError ? 5000 : 4000);
    };

    forms.forEach(form => {
        form.addEventListener('submit', async e => {
            e.preventDefault();

            const button = form.querySelector('[type="submit"]');
            if (button.disabled) return;

            const formData = new FormData(form);
            const name = String(formData.get('name') || '').trim();
            const phone = String(formData.get('phone') || '').trim();

            if (name.length < 2) return notify(t.name, true);
            if (!/^[0-9+\-\s()]{7,20}$/.test(phone) || phone.replace(/\D/g, '').length < 7) {
                return notify(t.phone, true);
            }
            if (!formData.get('color')) return notify(t.color, true);

            const label = button.textContent;
            button.disabled = true;
            button.classList.add('is-loading');
            button.textContent = t.sending;

            try {
                const res = await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formData).toString()
                });

                if (res.ok) {
                    notify(successText);
                    form.reset();

                    const modal = document.getElementById('modal');
                    if (modal) {
                        modal.style.display = 'none';
                        document.body.style.overflow = '';
                    }
                } else {
                    notify(t.error, true);
                }
            } catch (err) {
                console.error(err);
                notify(t.error, true);
            } finally {
                button.disabled = false;
                button.classList.remove('is-loading');
                button.textContent = label;
            }
        });
    });
});

// Мобильное меню

document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-btn');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeBtn = mobileMenu.querySelector('.close-btn'); 

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
  }

  if (closeBtn && mobileMenu) {
    closeBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  }
});

 //Scroll

 const modal = document.getElementById('modal');
const successPopup = document.getElementById('successPopup');

function openModal() {
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

function openPopup() {
  successPopup.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePopup() {
  successPopup.classList.remove('open');
  document.body.style.overflow = '';
}



