
/* Main JavaScript entry point */
(function () {
  'use strict';

  // Arabic and English content live in separate HTML pages.
  document.documentElement.classList.add('js-enabled');

  const consultationForm = document.querySelector('[data-consultation-form]');

  if (consultationForm) {
    const formStatus = consultationForm.querySelector('[data-form-status]');
    const fields = Array.from(
      consultationForm.querySelectorAll('input, select, textarea')
    );

    const isArabicPage = document.documentElement.lang === 'ar';

    const messages = {
      success: isArabicPage
        ? 'تم التحقق من البيانات على مستوى الصفحة. الإرسال الفعلي سيُفعّل بعد ربط النموذج بخدمة معالجة.'
        : 'Your information has been validated on the page. Actual submission will be enabled after connecting a processing service.',
      error: isArabicPage
        ? 'يرجى مراجعة الحقول المطلوبة قبل المتابعة.'
        : 'Please review the required fields before continuing.',
      email: isArabicPage
        ? 'يرجى إدخال بريد إلكتروني صحيح.'
        : 'Please enter a valid email address.',
      minlength: isArabicPage
        ? 'يرجى كتابة 20 حرفًا على الأقل.'
        : 'Please enter at least 20 characters.'
    };

    const getFeedbackElement = (field) => {
      const wrapper = field.closest('.form-check') || field.parentElement;
      return wrapper.querySelector('.invalid-feedback');
    };

    const setFieldError = (field, message) => {
      const feedback = getFeedbackElement(field);

      field.classList.add('is-invalid');
      field.setAttribute('aria-invalid', 'true');

      if (feedback) {
        feedback.textContent = message;
      }
    };

    const clearFieldError = (field) => {
      const feedback = getFeedbackElement(field);

      field.classList.remove('is-invalid');
      field.removeAttribute('aria-invalid');

      if (feedback) {
        feedback.textContent = '';
      }
    };

    const validateField = (field) => {
      clearFieldError(field);

      if (field.type === 'checkbox' && !field.checked) {
        setFieldError(
          field,
          field.dataset.consentMessage || messages.error
        );
        return false;
      }

      if (field.required && !field.value.trim()) {
        setFieldError(
          field,
          field.dataset.requiredMessage || messages.error
        );
        return false;
      }

      if (field.type === 'email' && field.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(field.value.trim())) {
          setFieldError(
            field,
            field.dataset.emailMessage || messages.email
          );
          return false;
        }
      }

      if (
        field.minLength > 0 &&
        field.value.trim() &&
        field.value.trim().length < field.minLength
      ) {
        setFieldError(
          field,
          field.dataset.minlengthMessage || messages.minlength
        );
        return false;
      }

      return true;
    };

    fields.forEach((field) => {
      field.addEventListener('blur', () => {
        validateField(field);
      });

      field.addEventListener('change', () => {
        validateField(field);
      });

      field.addEventListener('input', () => {
        if (field.classList.contains('is-invalid')) {
          validateField(field);
        }
      });
    });

    consultationForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const isFormValid = fields.every((field) => validateField(field));

      formStatus.classList.remove('is-visible', 'is-error');

      if (!isFormValid) {
        formStatus.textContent = messages.error;
        formStatus.classList.add('is-visible', 'is-error');

        const firstInvalidField = consultationForm.querySelector('.is-invalid');

        if (firstInvalidField) {
          firstInvalidField.focus();
        }

        return;
      }

      formStatus.textContent = messages.success;
      formStatus.classList.add('is-visible');

      consultationForm.reset();
      fields.forEach(clearFieldError);
    });
  }


})();

