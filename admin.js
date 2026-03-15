// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');
const sectionTitle = document.getElementById('sectionTitle');
const addNewBtn = document.getElementById('addNewBtn');

// Modals
const modal = document.getElementById('modal');
const serviceModal = document.getElementById('serviceModal');
const testimonialModal = document.getElementById('testimonialModal');
const modalClose = document.querySelectorAll('.close');

// Forms
const portfolioForm = document.getElementById('portfolioForm');
const serviceForm = document.getElementById('serviceForm');
const testimonialForm = document.getElementById('testimonialForm');
const aboutForm = document.getElementById('aboutForm');
const contactForm = document.getElementById('contactForm');

// Lists
const portfolioList = document.getElementById('portfolioList');
const servicesList = document.getElementById('servicesList');
const testimonialsList = document.getElementById('testimonialsList');

// State
let authToken = localStorage.getItem('adminToken');
let currentSection = 'portfolio';
let editingItem = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (authToken) {
        showDashboard();
    }
    
    initializeEventListeners();
});

// Event Listeners
function initializeEventListeners() {
    // Login Form
    loginForm.addEventListener('submit', handleLogin);
    
    // Logout
    logoutBtn.addEventListener('click', handleLogout);
    
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.id === 'logoutBtn') return;
            
            e.preventDefault();
            const section = link.dataset.section;
            if (section) {
                switchSection(section);
            }
        });
    });
    
    // Add New Button
    addNewBtn.addEventListener('click', () => {
        switch (currentSection) {
            case 'portfolio':
                openPortfolioModal();
                break;
            case 'services':
                openServiceModal();
                break;
            case 'testimonials':
                openTestimonialModal();
                break;
            default:
                break;
        }
    });
    
    // Modal Close
    modalClose.forEach(close => {
        close.addEventListener('click', () => {
            close.parentElement.parentElement.style.display = 'none';
        });
    });
    
    // Modal Background Click
    [modal, serviceModal, testimonialModal].forEach(modalElement => {
        modalElement.addEventListener('click', (e) => {
            if (e.target === modalElement) {
                modalElement.style.display = 'none';
            }
        });
    });
    
    // Forms
    portfolioForm.addEventListener('submit', handlePortfolioSubmit);
    serviceForm.addEventListener('submit', handleServiceSubmit);
    testimonialForm.addEventListener('submit', handleTestimonialSubmit);
    aboutForm.addEventListener('submit', handleAboutSubmit);
    contactForm.addEventListener('submit', handleContactSubmit);
    
    // Cancel Buttons
    document.getElementById('cancelBtn').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    document.getElementById('cancelServiceBtn').addEventListener('click', () => {
        serviceModal.style.display = 'none';
    });
    
    document.getElementById('cancelTestimonialBtn').addEventListener('click', () => {
        testimonialModal.style.display = 'none';
    });
}

// Authentication
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            authToken = result.token;
            localStorage.setItem('adminToken', authToken);
            showDashboard();
        } else {
            loginError.textContent = result.message || 'Invalid credentials';
        }
    } catch (error) {
        console.error('Login error:', error);
        loginError.textContent = 'Login failed. Please try again.';
    }
}

function handleLogout() {
    authToken = null;
    localStorage.removeItem('adminToken');
    showLogin();
}

function showDashboard() {
    loginScreen.style.display = 'none';
    dashboard.style.display = 'flex';
    loadDashboardData();
}

function showLogin() {
    dashboard.style.display = 'none';
    loginScreen.style.display = 'flex';
    loginForm.reset();
    loginError.textContent = '';
}

// Navigation
function switchSection(section) {
    currentSection = section;
    
    // Update Navigation
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === section) {
            link.classList.add('active');
        }
    });
    
    // Update Content Sections
    contentSections.forEach(contentSection => {
        contentSection.classList.remove('active');
    });
    
    const targetSection = document.getElementById(section + 'Section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update Section Title and Add Button
    switch (section) {
        case 'portfolio':
            sectionTitle.textContent = 'Portfolio Management';
            addNewBtn.style.display = 'block';
            break;
        case 'about':
            sectionTitle.textContent = 'About Management';
            addNewBtn.style.display = 'none';
            break;
        case 'services':
            sectionTitle.textContent = 'Services Management';
            addNewBtn.style.display = 'block';
            break;
        case 'testimonials':
            sectionTitle.textContent = 'Testimonials Management';
            addNewBtn.style.display = 'block';
            break;
        case 'contact':
            sectionTitle.textContent = 'Contact Management';
            addNewBtn.style.display = 'none';
            break;
    }
}

// Load Dashboard Data
async function loadDashboardData() {
    try {
        // Load Portfolio
        const portfolioResponse = await fetch('/api/portfolio');
        const portfolioData = await portfolioResponse.json();
        renderPortfolioList(portfolioData);
        
        // Load About
        const aboutResponse = await fetch('/api/about');
        const aboutData = await aboutResponse.json();
        loadAboutForm(aboutData);
        
        // Load Services
        const servicesResponse = await fetch('/api/services');
        const servicesData = await servicesResponse.json();
        renderServicesList(servicesData);
        
        // Load Testimonials
        const testimonialsResponse = await fetch('/api/testimonials');
        const testimonialsData = await testimonialsResponse.json();
        renderTestimonialsList(testimonialsData);
        
        // Load Contact
        const contactResponse = await fetch('/api/contact');
        const contactData = await contactResponse.json();
        loadContactForm(contactData);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Portfolio Management
function renderPortfolioList(portfolioItems) {
    if (portfolioItems.length === 0) {
        portfolioList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-images"></i>
                <h3>No Portfolio Items</h3>
                <p>Start by adding your first portfolio item.</p>
                <button class="btn btn-primary" onclick="openPortfolioModal()">Add Portfolio Item</button>
            </div>
        `;
        return;
    }
    
    portfolioList.innerHTML = portfolioItems.map(item => `
        <div class="portfolio-item">
            <img src="${item.image}" alt="${item.title}" class="portfolio-image">
            <div class="portfolio-content">
                <h3>${item.title}</h3>
                <span class="portfolio-category">${item.category}</span>
                <p class="portfolio-description">${item.description}</p>
                <div class="portfolio-actions">
                    <button class="btn btn-secondary" onclick="editPortfolioItem(${item.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deletePortfolioItem(${item.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function openPortfolioModal(item = null) {
    editingItem = item;
    
    if (item) {
        document.getElementById('modalTitle').textContent = 'Edit Portfolio Item';
        document.getElementById('portfolioId').value = item.id;
        document.getElementById('portfolioTitle').value = item.title;
        document.getElementById('portfolioCategory').value = item.category;
        document.getElementById('portfolioImage').value = item.image;
        document.getElementById('portfolioDescription').value = item.description;
    } else {
        document.getElementById('modalTitle').textContent = 'Add New Portfolio Item';
        portfolioForm.reset();
        document.getElementById('portfolioId').value = '';
    }
    
    modal.style.display = 'block';
}

async function handlePortfolioSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(portfolioForm);
    const data = Object.fromEntries(formData);
    
    try {
        const url = data.id ? `/api/portfolio/${data.id}` : '/api/portfolio';
        const method = data.id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            modal.style.display = 'none';
            showMessage('Portfolio item saved successfully!', 'success');
            loadDashboardData();
        } else {
            showMessage('Error saving portfolio item', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error saving portfolio item', 'error');
    }
}

async function editPortfolioItem(id) {
    try {
        const response = await fetch(`/api/portfolio/${id}`);
        const item = await response.json();
        openPortfolioModal(item);
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error loading portfolio item', 'error');
    }
}

async function deletePortfolioItem(id) {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;
    
    try {
        const response = await fetch(`/api/portfolio/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            showMessage('Portfolio item deleted successfully!', 'success');
            loadDashboardData();
        } else {
            showMessage('Error deleting portfolio item', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error deleting portfolio item', 'error');
    }
}

// Services Management
function renderServicesList(services) {
    if (services.length === 0) {
        servicesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-cogs"></i>
                <h3>No Services</h3>
                <p>Add services that you offer to clients.</p>
                <button class="btn btn-primary" onclick="openServiceModal()">Add Service</button>
            </div>
        `;
        return;
    }
    
    servicesList.innerHTML = services.map(service => `
        <div class="service-item">
            <div class="service-icon">
                <i class="${service.icon}"></i>
            </div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <div class="service-actions">
                <button class="btn btn-secondary" onclick="editService(${service.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger" onclick="deleteService(${service.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function openServiceModal(service = null) {
    editingItem = service;
    
    if (service) {
        document.getElementById('serviceModalTitle').textContent = 'Edit Service';
        document.getElementById('serviceId').value = service.id;
        document.getElementById('serviceTitle').value = service.title;
        document.getElementById('serviceIcon').value = service.icon;
        document.getElementById('serviceDescription').value = service.description;
    } else {
        document.getElementById('serviceModalTitle').textContent = 'Add New Service';
        serviceForm.reset();
        document.getElementById('serviceId').value = '';
    }
    
    serviceModal.style.display = 'block';
}

async function handleServiceSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(serviceForm);
    const data = Object.fromEntries(formData);
    
    try {
        const url = data.id ? `/api/services/${data.id}` : '/api/services';
        const method = data.id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            serviceModal.style.display = 'none';
            showMessage('Service saved successfully!', 'success');
            loadDashboardData();
        } else {
            showMessage('Error saving service', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error saving service', 'error');
    }
}

async function editService(id) {
    try {
        const response = await fetch(`/api/services/${id}`);
        const service = await response.json();
        openServiceModal(service);
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error loading service', 'error');
    }
}

async function deleteService(id) {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
        const response = await fetch(`/api/services/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            showMessage('Service deleted successfully!', 'success');
            loadDashboardData();
        } else {
            showMessage('Error deleting service', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error deleting service', 'error');
    }
}

// Testimonials Management
function renderTestimonialsList(testimonials) {
    if (testimonials.length === 0) {
        testimonialsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-comments"></i>
                <h3>No Testimonials</h3>
                <p>Add client testimonials to build trust.</p>
                <button class="btn btn-primary" onclick="openTestimonialModal()">Add Testimonial</button>
            </div>
        `;
        return;
    }
    
    testimonialsList.innerHTML = testimonials.map(testimonial => `
        <div class="testimonial-item">
            <div class="testimonial-rating">
                ${generateStars(testimonial.rating)}
            </div>
            <p class="testimonial-text">${testimonial.text}</p>
            <div class="testimonial-client">
                <div>
                    <h4>${testimonial.clientName}</h4>
                    <p>${testimonial.clientTitle}</p>
                </div>
            </div>
            <div class="testimonial-actions">
                <button class="btn btn-secondary" onclick="editTestimonial(${testimonial.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger" onclick="deleteTestimonial(${testimonial.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function generateStars(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        stars += `<i class="fas fa-star${i < rating ? '' : '-o'}"></i>`;
    }
    return stars;
}

function openTestimonialModal(testimonial = null) {
    editingItem = testimonial;
    
    if (testimonial) {
        document.getElementById('testimonialModalTitle').textContent = 'Edit Testimonial';
        document.getElementById('testimonialId').value = testimonial.id;
        document.getElementById('testimonialClientName').value = testimonial.clientName;
        document.getElementById('testimonialClientTitle').value = testimonial.clientTitle;
        document.getElementById('testimonialText').value = testimonial.text;
        document.getElementById('testimonialRating').value = testimonial.rating;
    } else {
        document.getElementById('testimonialModalTitle').textContent = 'Add New Testimonial';
        testimonialForm.reset();
        document.getElementById('testimonialId').value = '';
    }
    
    testimonialModal.style.display = 'block';
}

async function handleTestimonialSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(testimonialForm);
    const data = Object.fromEntries(formData);
    
    try {
        const url = data.id ? `/api/testimonials/${data.id}` : '/api/testimonials';
        const method = data.id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            testimonialModal.style.display = 'none';
            showMessage('Testimonial saved successfully!', 'success');
            loadDashboardData();
        } else {
            showMessage('Error saving testimonial', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error saving testimonial', 'error');
    }
}

async function editTestimonial(id) {
    try {
        const response = await fetch(`/api/testimonials/${id}`);
        const testimonial = await response.json();
        openTestimonialModal(testimonial);
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error loading testimonial', 'error');
    }
}

async function deleteTestimonial(id) {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
        const response = await fetch(`/api/testimonials/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            showMessage('Testimonial deleted successfully!', 'success');
            loadDashboardData();
        } else {
            showMessage('Error deleting testimonial', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error deleting testimonial', 'error');
    }
}

// About Management
function loadAboutForm(aboutData) {
    if (aboutData) {
        document.getElementById('aboutTitle').value = aboutData.title || '';
        document.getElementById('aboutBio').value = aboutData.bio || '';
        document.getElementById('aboutExperience').value = aboutData.experience || '';
    }
}

async function handleAboutSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(aboutForm);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await fetch('/api/about', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showMessage('About section updated successfully!', 'success');
        } else {
            showMessage('Error updating about section', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error updating about section', 'error');
    }
}

// Contact Management
function loadContactForm(contactData) {
    if (contactData) {
        document.getElementById('contactEmail').value = contactData.email || '';
        document.getElementById('contactPhone').value = contactData.phone || '';
        document.getElementById('contactLocation').value = contactData.location || '';
        document.getElementById('contactWhatsApp').value = contactData.whatsapp || '';
    }
}

async function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    try {
        const response = await fetch('/api/contact', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showMessage('Contact information updated successfully!', 'success');
        } else {
            showMessage('Error updating contact information', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error updating contact information', 'error');
    }
}

// Utility Functions
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(messageDiv, mainContent.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Check authentication on API calls
async function authenticatedFetch(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    mergedOptions.headers = { ...defaultOptions.headers, ...options.headers };
    
    const response = await fetch(url, mergedOptions);
    
    if (response.status === 401) {
        handleLogout();
        return null;
    }
    
    return response;
}
