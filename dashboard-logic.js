/**
 * FridgeWise - Dashboard Logic
 * Handles: Firebase Auth, Ingredient List, AI Generation, and UI Swapping
 */

let ingredients = [];
let currentMeal = null;

// --- 1. INITIALIZATION & UI SETUP ---
document.addEventListener('DOMContentLoaded', () => {
    initVideoResize();
    setupSidebars();
});

function setupSidebars() {
    const sidebar = document.getElementById('sidebar');
    const userSidebar = document.getElementById('userSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const userMenuToggle = document.getElementById('userMenuToggle');

    const openSidebar = (el) => {
        el.classList.remove('-translate-x-full', 'translate-x-full');
        overlay.classList.remove('opacity-0', 'pointer-events-none');
    };

    const closeAll = () => {
        sidebar.classList.add('-translate-x-full');
        userSidebar.classList.add('translate-x-full');
        overlay.classList.add('opacity-0', 'pointer-events-none');
    };

    if(sidebarToggle) sidebarToggle.onclick = () => openSidebar(sidebar);
    if(userMenuToggle) userMenuToggle.onclick = () => openSidebar(userSidebar);
    document.getElementById('sidebarClose').onclick = closeAll;
    document.getElementById('userSidebarClose').onclick = closeAll;
    overlay.onclick = closeAll;
}

function initVideoResize() {
    const video = document.getElementById('initialVideo');
    const slider = document.getElementById('videoSizeSlider');
    const label = document.getElementById('sizeValue');

    if (slider && video) {
        slider.oninput = (e) => {
            const val = e.target.value;
            label.innerText = val + '%';
            const scale = val / 100;
            
            if (window.innerWidth <= 768) {
                video.style.transform = `scale(${scale})`;
            } else {
                video.style.transform = `translate(62px, -282px) scale(${2.73 * scale})`;
            }
        };
    }
}

// --- 2. INGREDIENT MANAGEMENT ---
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
            <button onclick="removeIng(${i})" class="text-red-400 hover:text-red-600 px-2">×</button>
        </li>
    `).join('');
}

// --- 3. AI GENERATION ---
document.getElementById('cookBtn').onclick = async function() {
    if (ingredients.length === 0) return alert("Add ingredients first!");

    // UI State: Show Loading
    document.getElementById('initialVideoContainer').classList.add('hidden');
    document.getElementById('loadingScreen').classList.remove('hidden');
    const loader = document.getElementById('loadingVideo');
    if(loader) loader.play();

    const prompt = `Act as a professional chef. Based on these ingredients: ${ingredients.join(', ')}, suggest 3 creative meals. 
    Return ONLY a JSON object: {"meals": [{"name": "...", "description": "...", "ingredients": [], "steps": [], "nutrition": "...", "analysis": "...", "addons": []}]}`;

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();

        // SAFETY CHECK: Ensure data.text exists before calling .replace()
        if (data.text) {
            const cleanJSON = data.text.replace(/```json|```/g, "").trim();
            const result = JSON.parse(cleanJSON);
            displayMeals(result.meals);
        } else {
            throw new Error("AI returned no content. Check your API key and package.json.");
        }

    } catch (err) {
        console.error("AI Error:", err);
        alert("Chef Gemini is out of the kitchen. Ensure you added package.json to your root folder!");
        resetUI();
    }
};

function resetUI() {
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('initialVideoContainer').classList.remove('hidden');
}

function displayMeals(meals) {
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('resultsScreen').classList.remove('hidden');

    const container = document.getElementById('mealsContainer');
    container.innerHTML = meals.map((meal, i) => `
        <div class="meal-card p-6 rounded-2xl shadow-sm border border-green-100 bg-white cursor-pointer hover:bg-green-50 transition-all" 
             onclick='openMealDetails(${JSON.stringify(meal).replace(/'/g, "&apos;")})'>
            <h3 class="font-bold text-xl text-green-800 uppercase">${meal.name}</h3>
            <p class="text-gray-500 text-sm italic mt-1">${meal.description}</p>
        </div>
    `).join('');
}

// --- 4. MEAL DETAILS & ACCORDIONS ---
function openMealDetails(meal) {
    currentMeal = meal;
    document.getElementById('mainDashboard').classList.add('hidden');
    document.getElementById('mealOverview').classList.remove('hidden');
    
    document.getElementById('overviewMealName').innerText = meal.name;
    document.getElementById('mealDesc').innerText = meal.description;

    const contents = document.querySelectorAll('.accordion-content');
    if (contents.length >= 5) {
        contents[0].innerHTML = `<ul class="ai-bullet-list">${meal.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>`;
        contents[1].innerHTML = `<p class="p-4 text-gray-700 font-medium">${meal.nutrition}</p>`;
        contents[2].innerHTML = `<ol class="list-decimal p-4 ml-4 space-y-2">${meal.steps.map(s => `<li>${s}</li>`).join('')}</ol>`;
        contents[3].innerHTML = `<p class="p-4 text-gray-700">${meal.analysis}</p>`;
        contents[4].innerHTML = `<ul class="ai-bullet-list">${meal.addons.map(a => `<li>${a}</li>`).join('')}</ul>`;
    }
}

function toggleAccordion(btn) {
    const content = btn.nextElementSibling;
    const span = btn.querySelector('span');
    content.classList.toggle('open');
    if (span) span.innerText = content.classList.contains('open') ? '−' : '+';
}

function backToDashboard() {
    document.getElementById('mealOverview').classList.add('hidden');
    document.getElementById('mainDashboard').classList.remove('hidden');
}

// --- 5. LOGOUT ---
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.onclick = () => {
        firebase.auth().signOut().then(() => window.location.href = "index.html");
    };
}
