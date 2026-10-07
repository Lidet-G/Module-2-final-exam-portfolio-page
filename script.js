
let projectsData = [];
let activeCategory = 'All';

// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('nav-links');
const skillsContainer = document.getElementById('skillsContainer');
const projectsGrid = document.getElementById('projectsGrid');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const errorMessage = document.getElementById('errorMessage');
const retryBtn = document.getElementById('retryBtn');
const filterBtns = document.querySelectorAll('.filter-button');

// Modal Elements
const projectModal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalBody = document.getElementById('modalBody');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalCloseSecondary = document.getElementById('modalCloseSecondary');

// Form Elements
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');
const formSuccess = document.getElementById('formSuccess');

// Skills Data (5 required)
const skillsData = [
//   { name: 'HTML5' },
//   { name: 'CSS3' },
//   { name: 'JavaScript' },
//   { name: 'Git & GitHub' },
//   { name: 'Responsive Design' }

{
      "id": 1,
      "name": "HTML",
      "category": "Frontend",
      "level": "Advanced",
      "language": "html5",
      "image": "https://i.pinimg.com/1200x/0b/6d/14/0b6d14f0e2ffd8a196ffb00902c688b8.jpg"
    },
    {
      "id": 2,
      "name": "CSS",
      "category":  "Frontend",
      "level": "Advanced",
      "language": "css3",
      "image": "https://i.pinimg.com/1200x/39/d8/97/39d897b25f0ec8cf71dbbdb50231171a.jpg"

    },
    {
      "id": 3,
      "name": "JavaScript",
      "category": "Frontend",
       "level": "Intermediate",
       "language": "javascript",
       "image" : "https://i.pinimg.com/1200x/b6/ab/52/b6ab52333dd3effe49adf85e8179155a.jpg"

    },
    {
      "id": 4,
      "name": "react",
      "category": "Web Design",
      "level": "Advanced",
      "language": "react",
      "image" : "https://i.pinimg.com/736x/82/40/ac/8240ac872c818d2a39ef20d819fdbf0d.jpg"
    },

    {
      "id": 5,
      "name": "Git",
      "category": "Version Control",
      "level": "Advanced",
      "language": "git",
      "image":"https://i.pinimg.com/1200x/a9/5a/ad/a95aadde4325065401dc6942ea5dad90.jpg"
    },
    {
      "id": 6,
      "name": "Responsive Design",
      "category": "Web Design",
      "level": "Advanced",
      "language": "respnsive",
      "image":"https://i.pinimg.com/736x/a7/56/24/a75624884f06f7754c0731b3cd88e4f4.jpg"

    }
];

document.addEventListener('DOMContentLoaded', () => {
  renderSkills();
  fetchProjects();
  setupEventListeners();
});


function renderSkills() {
  skillsContainer.innerHTML = skillsData.map(skill => `
    <article class="skill-card" data-skill-id="${skill.id}">
      <img class="skill-image" src="${skill.image}" alt="${skill.name} logo" loading="lazy">
      <h3>${skill.name}</h3>
      <p>${skill.category} &middot; ${skill.level}</p>
    </article>
  `).join('');
}

async function fetchProjects() {
  showLoading();
  try {
    const response = await fetch('./projects.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('The projects response must be an array.');
    }

    projectsData = data.map(project => ({
      id: project.id,
      title: project.title,
      description: project.body,
      category: project.category,
      image: project.image,
      technologies: Array.isArray(project.technologies) ? project.technologies : []
    }));

    hideLoading();
    displayProjects(projectsData);
  } catch (error) {
    hideLoading();
    showError(`Failed to load projects: ${error.message}`);
  }
}

function displayProjects(projects) {
  const visibleProjects = activeCategory === 'All'
    ? projects
    : projects.filter(project => project.category === activeCategory);

  if (visibleProjects.length === 0) {
    projectsGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No projects found.</p>';
    return;
  }

  projectsGrid.innerHTML = visibleProjects.map(project => `
    <article class="project-card">
      <img src="${project.image}" alt="${project.title}" loading="lazy">
      <span class="project-tag">${project.category}</span>
      <h3 class="project-title">${project.title.length > 25 ? `${project.title.substring(0, 25)}...` : project.title}</h3>
      <p class="project-desc">${project.description.length > 80 ? `${project.description.substring(0, 80)}...` : project.description}</p>
      <p class="project-technologies">${project.technologies.join(' · ')}</p>
      <button class="button-primary view-details-button" data-id="${project.id}">View Details</button>
    </article>
  `).join('');

  projectsGrid.querySelectorAll('.view-details-button').forEach(button => {
    button.addEventListener('click', event => {
      const projectId = Number(event.currentTarget.getAttribute('data-id'));
      openModal(projectId);
    });
  });
}

function filterProjects(category) {
  activeCategory = category;
  displayProjects(projectsData);
}

function showLoading() {
  loadingState.classList.remove('hidden');
  errorState.classList.add('hidden');
  projectsGrid.innerHTML = '';
}

function hideLoading() {
  loadingState.classList.add('hidden');
}

function showError(msg) {
  errorMessage.textContent = msg;
  errorState.classList.remove('hidden');
}

function openModal(id) {
  const project = projectsData.find(p => p.id === id);
  if (!project) return;

  modalTitle.textContent = project.title;
  modalCategory.textContent = project.category;
  modalBody.textContent = project.description;

  projectModal.classList.remove('hidden');
}

function closeModal() {
  projectModal.classList.add('hidden');
}


function validateForm(e) {
  e.preventDefault();

  let isValid = true;

  // Clear previous errors
  nameError.textContent = '';
  emailError.textContent = '';
  messageError.textContent = '';
  formSuccess.classList.add('hidden');

  // Input Values
  const nameVal = nameInput.value.trim();
  const emailVal = emailInput.value.trim();
  const messageVal = messageInput.value.trim();

  // Name Validation
  if (!nameVal) {
    nameError.textContent = 'Name is required.';
    isValid = false;
  }

  // Email Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailVal) {
    emailError.textContent = 'Email is required.';
    isValid = false;
  } else if (!emailRegex.test(emailVal)) {
    emailError.textContent = 'Please enter a valid email address.';
    isValid = false;
  }

  // Message Validation
  if (!messageVal) {
    messageError.textContent = 'Message is required.';
    isValid = false;
  }

  if (isValid) {
    formSuccess.classList.remove('hidden');
    contactForm.reset();
  }
}


function setupEventListeners() {

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });


  document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });


  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      filterProjects(e.target.getAttribute('data-category'));
    });
  });


  retryBtn.addEventListener('click', fetchProjects);


  modalCloseBtn.addEventListener('click', closeModal);
  modalCloseSecondary.addEventListener('click', closeModal);
  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) closeModal();
  });

  // Contact Form Submission
  contactForm.addEventListener('submit', validateForm);
}