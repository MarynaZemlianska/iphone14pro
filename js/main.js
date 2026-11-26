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


// Демо-форма: данные проверяются в браузере и НИКУДА не передаются и не сохраняются.
// Поля без атрибута name, у формы нет method — даже без JS отправлять нечего.
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form[data-form="demo"]');
    const lang = (document.documentElement.lang || 'uk').slice(0, 2);

    const TEXTS = {
        uk: {
            checking: 'Перевіряємо…',
            name: "Вкажіть, будь ласка, ім'я (можна вигадане)",
            phone: 'Перевірте формат номера (можна вигаданий)',
            color: 'Оберіть колір зі списку'
        },
        ru: {
            checking: 'Проверяем…',
            name: 'Укажите, пожалуйста, имя (можно вымышленное)',
            phone: 'Проверьте формат номера (можно вымышленный)',
            color: 'Выберите цвет из списка'
        },
        en: {
            checking: 'Checking…',
            name: 'Please enter a name (a made-up one is fine)',
            phone: 'Please check the number format (a made-up one is fine)',
            color: 'Please choose a colour'
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

    const field = (form, key) => {
        const node = form.querySelector(`[data-field="${key}"]`);
        return node ? String(node.value || '').trim() : '';
    };

    forms.forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();

            const button = form.querySelector('[type="submit"]');
            if (button.disabled) return;

            const name = field(form, 'name');
            const phone = field(form, 'phone');

            if (name.length < 2) return notify(t.name, true);
            if (!/^[0-9+\-\s()]{7,20}$/.test(phone) || phone.replace(/\D/g, '').length < 7) {
                return notify(t.phone, true);
            }
            if (!field(form, 'color')) return notify(t.color, true);

            const label = button.textContent;
            button.disabled = true;
            button.classList.add('is-loading');
            button.textContent = t.checking;

            // Короткая пауза только ради анимации кнопки; сетевых запросов нет
            setTimeout(() => {
                form.reset();
                notify(successText);

                const modal = document.getElementById('modal');
                if (modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                }

                button.disabled = false;
                button.classList.remove('is-loading');
                button.textContent = label;
            }, 600);
        });
    });
});

// Мобильное меню

document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-btn');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeBtn = mobileMenu && mobileMenu.querySelector('.close-btn');

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
