// =============================================
//  Courier & Delivery - Shared JS Utilities
// =============================================

// Check authentication on protected pages
const protectedPaths = ['/dashboard', '/parcels', '/customers', '/staff', '/deliveries', '/payments', '/reports'];
const currentPath = window.location.pathname;

if (protectedPaths.some(p => currentPath === p || currentPath.startsWith(p))) {
  $.get('/api/auth/session')
    .fail(() => { window.location.href = '/'; });
}

// ---- Toast Notifications ----
function showToast(message, type = 'success') {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const $toast = $(`
    <div class="toast toast-${type}">
      <span>${icons[type]}</span>
      <span>${message}</span>
    </div>
  `);
  if (!$('.toast-container').length) {
    $('body').append('<div class="toast-container"></div>');
  }
  $('.toast-container').append($toast);
  setTimeout(() => { $toast.fadeOut(300, () => $toast.remove()); }, 3500);
}

// ---- Status Badge Helper ----
function statusBadge(status) {
  const map = {
    'Pending': 'badge-pending',
    'Picked Up': 'badge-assigned',
    'In Transit': 'badge-transit',
    'Out for Delivery': 'badge-transit',
    'Delivered': 'badge-delivered',
    'Failed': 'badge-failed',
    'Returned': 'badge-failed',
    'Active': 'badge-active',
    'Inactive': 'badge-inactive',
    'Assigned': 'badge-assigned',
    'Paid': 'badge-paid',
    'Unpaid': 'badge-unpaid',
    'Refunded': 'badge-assigned'
  };
  return `<span class="badge ${map[status] || ''}">${status}</span>`;
}

// ---- Format Date ----
function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ---- Format Currency ----
function formatCurrency(amount) {
  return 'LKR ' + parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// ---- Logout ----
function logout() {
  $.post('/api/auth/logout').always(() => { window.location.href = '/'; });
}

// ---- Sidebar Toggle (Mobile) ----
$('.menu-toggle').on('click', function () {
  $('.sidebar').toggleClass('open');
  $('.sidebar-overlay').toggleClass('active');
});

$('.sidebar-overlay').on('click', function () {
  $('.sidebar').removeClass('open');
  $(this).removeClass('active');
});

// ---- Active Nav Link ----
$(document).ready(function () {
  const path = window.location.pathname;
  $('.sidebar-nav a').each(function () {
    const href = $(this).attr('href');
    if (href && href !== '/' && path === href) {
      $(this).addClass('active');
    }
  });
});

// ---- Form Validation ----
function validateForm(formId) {
  let valid = true;
  $(`#${formId} [required]`).each(function () {
    const val = $(this).val().trim();
    if (!val) {
      $(this).addClass('error');
      $(this).next('.error-msg').show().text('This field is required');
      valid = false;
    } else {
      $(this).removeClass('error');
      $(this).next('.error-msg').hide();
    }
  });
  // Email validation
  $(`#${formId} input[type="email"]`).each(function () {
    const val = $(this).val().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val && !emailRegex.test(val)) {
      $(this).addClass('error');
      $(this).next('.error-msg').show().text('Invalid email format');
      valid = false;
    }
  });
  return valid;
}

// Clear form errors on input
$(document).on('input change', '.form-control', function () {
  $(this).removeClass('error');
  $(this).next('.error-msg').hide();
});
