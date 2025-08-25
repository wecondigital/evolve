import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

console.log('Supabase URL carregada:', supabaseUrl);
console.log('Supabase Anon Key carregada:', supabaseAnonKey);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Submit lead function
async function submitLead(lead) {
  const { data, error } = await supabase
    .from('leads')
    .insert([lead]);
  
  if (error) {
    throw error;
  }
  
  return data;
}

// Phone formatting function
function formatPhone(value) {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 2) {
    return `+${numbers}`;
  } else if (numbers.length <= 4) {
    return `+${numbers.slice(0, 2)} (${numbers.slice(2)})`;
  } else if (numbers.length <= 9) {
    return `+${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4)}`;
  } else if (numbers.length <= 10) {
    return `+${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4, 8)}-${numbers.slice(8)}`;
  } else {
    return `+${numbers.slice(0, 2)} (${numbers.slice(2, 4)}) ${numbers.slice(4, 9)}-${numbers.slice(9, 13)}`;
  }
}

// Get URL parameters
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    gclid: params.get('gclid') || '',
    gbraid: params.get('gbraid') || '',
    fbclid: params.get('fbclid') || '',
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || '',
    utm_term: params.get('utm_term') || '',
  };
}

// Get Facebook parameters from cookies
function getFacebookParams() {
  const cookies = document.cookie.split(';');
  let fbc = '';
  let fbp = '';
  
  cookies.forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name === '_fbc') fbc = value;
    if (name === '_fbp') fbp = value;
  });
  
  return { fbc, fbp };
}

// Initialize hidden fields
function initializeHiddenFields() {
  const urlParams = getUrlParams();
  const fbParams = getFacebookParams();
  
  // Set URL parameters
  Object.entries(urlParams).forEach(([key, value]) => {
    const element = document.getElementById(key);
    if (element) element.value = value;
  });
  
  // Set Facebook parameters
  Object.entries(fbParams).forEach(([key, value]) => {
    const element = document.getElementById(key);
    if (element) element.value = value;
  });
  
  // Set other parameters
  const pageUrlElement = document.getElementById('page_url');
  if (pageUrlElement) pageUrlElement.value = window.location.href;
  
  const userAgentElement = document.getElementById('user_agent');
  if (userAgentElement) userAgentElement.value = navigator.userAgent;
}

// Modal functionality
function initializeModal() {
  const modal = document.getElementById('lead-modal');
  const closeBtn = document.getElementById('close-modal');
  
  // Close modal
  closeBtn?.addEventListener('click', () => {
    modal?.classList.add('hidden');
    document.body.style.overflow = 'auto';
  });
  
  // Close on overlay click
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  });
}

// Function to open modal (will be called from main page)
function openModal() {
  const modal = document.getElementById('lead-modal');
  modal?.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

// Make openModal available globally
window.openLeadModal = openModal;

// Form submission function
function initializeForm() {
  const form = document.getElementById('lead-form');
  const phoneInput = document.getElementById('phone');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn?.querySelector('.btn-text');
  const btnLoading = submitBtn?.querySelector('.btn-loading');
  const successMessage = document.getElementById('success-message');
  
  // Phone formatting
  phoneInput?.addEventListener('input', (e) => {
    const target = e.target;
    const cursorPosition = target.selectionStart;
    const oldValue = target.value;
    const newValue = formatPhone(target.value);
    
    target.value = newValue;
    
    // Maintain cursor position
    if (cursorPosition !== null) {
      const diff = newValue.length - oldValue.length;
      target.setSelectionRange(cursorPosition + diff, cursorPosition + diff);
    }
  });
  
  // Form submission
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show loading state
    if (submitBtn) submitBtn.disabled = true;
    btnText?.classList.add('hidden');
    btnLoading?.classList.remove('hidden');
    
    try {
      const formData = new FormData(form);
      const lead = {
        phone: formData.get('phone'),
        email: formData.get('email') || undefined,
        gclid: formData.get('gclid') || undefined,
        gbraid: formData.get('gbraid') || undefined,
        fbclid: formData.get('fbclid') || undefined,
        utm_source: formData.get('utm_source') || undefined,
        utm_medium: formData.get('utm_medium') || undefined,
        utm_campaign: formData.get('utm_campaign') || undefined,
        utm_content: formData.get('utm_content') || undefined,
        utm_term: formData.get('utm_term') || undefined,
        page_url: formData.get('page_url') || undefined,
        fbc: formData.get('fbc') || undefined,
        fbp: formData.get('fbp') || undefined,
        user_agent: formData.get('user_agent') || undefined,
        user_ip: formData.get('user_ip') || undefined,
        google_session_attribute: formData.get('google_session_attribute') || undefined,
      };
      
      await submitLead(lead);
      
      // Redirect to WhatsApp
      window.location.href = 'https://api.whatsapp.com/send?phone=5511959774208&text=Ol%C3%A1!%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20Osteopatia%20Infantil.';
      
    } catch (error) {
      console.error('Error submitting form:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      
      // Show more specific error message to user
      let errorMessage = 'Erro ao enviar formulário. Tente novamente.';
      if (error.message) {
        errorMessage = `Erro: ${error.message}`;
      }
      
      alert('Erro ao enviar formulário. Tente novamente.');
    } finally {
      // Reset button state
      if (submitBtn) submitBtn.disabled = false;
      btnText?.classList.remove('hidden');
      btnLoading?.classList.add('hidden');
    }
  });
}

// Initialize everything immediately when script loads
document.addEventListener('DOMContentLoaded', () => {
  initializeHiddenFields();
  initializeModal();
  initializeForm();
});