/**
 * FridgeWise Dashboard Logic
 */

let ingredients = [];

// --- Sidebar & UI Toggles ---
const sidebar = document.getElementById('sidebar');
const userSidebar = document.getElementById('userSidebar');
const overlay = document.getElementById('sidebarOverlay');

document.getElementById('sidebarToggle').onclick = () => toggleSidebar(sidebar);
document.getElementById('userMenuToggle').onclick = () => toggleSidebar(userSidebar);
document.getElementById('sidebarClose').onclick = closeAllSidebars;
document.getElementById('userSidebarClose').onclick = closeAllSidebars;
overlay.onclick = closeAllSidebars;

function toggleSidebar(el) {
    el.classList.toggle('-translate-x-full'); // Left sidebar
    el.classList.toggle('translate-x-full');  // Right sidebar (if it's the right one)
    overlay.classList.toggle('opacity-0');
    overlay.classList.toggle('pointer-events-none');
}

function closeAllSidebars() {
    sidebar.classList.add('-translate-x-full');
    userSidebar.classList.add('translate-x-full');
    overlay.classList.add('opacity-0', 'pointer-events-none');
}

// --- Ingredient Management ---
function addIng() {
    const input = document.getElementById('ingInput');
    const val = input.value.trim();
    if (val && !ingredients.includes(val)) {
        ingredients.push(val);
        renderIngredients();
    }
    input.value = "";
}

function handleKey(e) {
    if (e.key === 'Enter') addIng();
}

function removeIng(index) {
    ingredients.splice(index, 1);
    renderIngredients();
}

function renderIngredients() {
    const list = document.getElementById('ingList');
    list.innerHTML = ingredients.map((ing, i) => `
        <li class="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-100 animate-fade-in-down">
            <span class="font-medium text-green-800">${ing}</span>
            <button onclick="removeIng(${i})" class="text-red-400 hover:text-red-600 font-bold">×</button>
        </li>
    `).join('');
}

// --- Cooking Logic & Video Swapping ---
document.getElementById('cookBtn').onclick = async function() {
    if (ingredients.length === 0) {
        alert("Please add some ingredients first!");
        return;
    }

    // 1. Hide Initial State, Show Loading Video
    document.getElementById('initialVideoContainer').classList.add('hidden');
    document.getElementById('loadingScreen').classList.remove('hidden');
    document.getElementById('loadingVideo').play();

    try {
        // Replace this with your actual API call to Gemini or your backend
        // const meals = await fetchMealsFromAI(ingredients);
        
        // Simulating a delay for the video to play
        setTimeout(() => {
            showResults();
        }, 3000);

    } catch (error) {
        console.error("Cooking error:", error);
        resetToInitial();
    }
};

function showResults() {
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('resultsScreen').classList.remove('hidden');
    
    // Example meal injection
    const container = document.getElementById('mealsContainer');
    container.innerHTML = `
        <div class="meal-card p-6 rounded-2xl shadow-sm border border-green-100 bg-white" onclick="viewMeal('Omelette')">
            <h3 class="font-bold text-xl text-green-800">Garden Omelette</h3>
            <p class="text-gray-500 text-sm italic">Uses: ${ingredients.join(', ')}</p>
        </div>
    `;
}

// --- Accordion Logic ---
function toggleAccordion(btn, title) {
    const content = btn.nextElementSibling;
    const span = btn.querySelector('span');
    
    content.classList.toggle('open');
    span.textContent = content.classList.contains('open') ? '-' : '+';
}

// --- Navigation ---
function backToDashboard() {
    document.getElementById('mealOverview').classList.add('hidden');
    document.getElementById('mainDashboard').classList.remove('hidden');
}

function viewMeal(name) {
    document.getElementById('mainDashboard').classList.add('hidden');
    document.getElementById('mealOverview').classList.remove('hidden');
    document.getElementById('overviewMealName').textContent = name;
}
