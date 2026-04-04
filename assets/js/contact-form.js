(function() {
  'use strict';

  function showToast(message, type = 'info') {
    const toast = document.getElementById('globalToast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `global-toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form || form.dataset.initialized) return;

    form.dataset.initialized = 'true';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const nombre = formData.get('nombre')?.trim();
      const email = formData.get('email')?.trim();
      const mensaje = formData.get('mensaje')?.trim();

      if (!nombre || !email || !mensaje) {
        showToast('Completa todos los campos.', 'info');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Correo inválido.', 'info');
        return;
      }

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          form.reset();
          showToast('¡Mensaje enviado correctamente!', 'success');
          
          const sound = document.getElementById('messageSound');
          if (sound) {
            sound.currentTime = 0;
            sound.play().catch(() => {});
          }
          return;
        }

        const data = await response.json().catch(() => ({}));
        showToast(data?.errors?.[0]?.message || 'Error al enviar.', 'error');

      } catch (err) {
        console.error('Error:', err);
        showToast('Error de conexión.', 'error');
      }
    });
  }

  initContactForm();
  
  const observer = new MutationObserver(() => {
    initContactForm();
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
})();