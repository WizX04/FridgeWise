/**
 * FridgeWise - Integrated Dashboard Logic
 */

let ingredients = [];
let currentMeal = null;

// --- 1. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    setupSidebars();
    initVideoResize();
    
    // Listen for Enter key on ingredient input
    const ingInput = document.getElementById('ingInput');
    if (ingInput) {
        ingInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') window.addIng();
        });
    }

    // Firebase Auth State Listener
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            updateUserProfile(user);
        } else {
            window.location.href = "index.html"; // Redirect if not logged in
        }
    });
});

// --- 2. SIDEBAR & UI NAVIGATION ---
function setupSidebars() {
    const sidebar = document.getElementById('sidebar');
    const userSidebar = document.getElementById('userSidebar');
    const overlay = document.getElementById('sidebarOverlay');

    window.closeAll = () => {
        sidebar.classList.add('-translate-x-full');
        userSidebar.classList.add('translate-x-full');
        overlay.classList.add('opacity-0', 'pointer-events-none');
    };

    document.getElementById('sidebarToggle').onclick = () => {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('opacity-0', 'pointer-events-none');
    };

    document.getElementById('userMenuToggle').onclick = () => {
        userSidebar.classList.remove('translate-x-full');
        overlay.classList.remove('opacity-0', 'pointer-events-none');
    };

    document.getElementById('sidebarClose').onclick = window.closeAll;
    document.getElementById('userSidebarClose').onclick = window.closeAll;
    overlay.onclick = window.closeAll;
}

function updateUserProfile(user) {
    const nameDisp = document.getElementById('userNameDisplay');
    const emailDisp = document.getElementById('userEmailDisplay');
    const initialDisp = document.getElementById('userInitial');

    if (nameDisp) nameDisp.innerText = user.email.split('@')[0];
    if (emailDisp) emailDisp.innerText = user.email;
    if (initialDisp) initialDisp.innerText = user.email[0].toUpperCase();
}

// --- 3. INGREDIENT MANAGEMENT ---
window.addIng = function() {
    const input = document.getElementById('ingInput');
    const val = input.value.trim();
    if (val && !ingredients.includes(val)) {
        ingredients.push(val);
        renderIngredients();
    }
    input.value = "";
};

window.removeIng = function(index) {
    ingredients.splice(index, 1);
    renderIngredients();
};

function renderIngredients() {
    const list = document.getElementById('ingList');
    list.innerHTML = ingredients.map((ing, i) => `
        <li class="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-100 animate-fade-in-down">
            <span class="font-medium text-green-800">${ing}</span>
            <button onclick="window.removeIng(${i})" class="text-red-400 hover:text-red-600 px-2 font-bold">×</button>
        </li>
    `).join('');
}

// --- 4. AI GENERATION & MEAL DISPLAY ---
document.getElementById('cookBtn').onclick = async function() {
    if (ingredients.length === 0) return alert("Add some ingredients to your fridge first!");

    // Show Loading UI
    document.getElementById('initialVideoContainer').classList.add('hidden');
    document.getElementById('loadingScreen').classList.remove('hidden');
    const loader = document.getElementById('loadingVideo');
    if (loader) loader.play();

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ingredients })
        });

        if (!response.ok) throw new Error("API not found");

        const data = await response.json();
        const cleanJSON = data.text.replace(/```json|```/g, "").trim();
        const result = JSON.parse(cleanJSON);
        displayMeals(result.meals);

    } catch (err) {
        console.error("Using Mock Data (Demo Mode):", err);
        // Fallback so the app still "works" without the backend
        setTimeout(() => {
            const mockMeals = [
                {
                    name: "FridgeWise Stir Fry",
                    description: "A quick, high-heat toss of your favorite ingredients.",
                    ingredients: ingredients,
                    steps: ["Chop ingredients", "Heat pan with oil", "Sauté for 5-7 mins", "Season to taste"],
                    nutrition: "Healthy & Balanced",
                    analysis: "Great use of fresh produce.",
                    addons: ["Sesame seeds", "Red pepper flakes"]
                }
            ];
            displayMeals(mockMeals);
        }, 2000);
    }
};

function displayMeals(meals) {
    document.getElementById('loadingScreen').classList.add('hidden');
    document.getElementById('resultsScreen').classList.remove('hidden');

    const container = document.getElementById('mealsContainer');
    container.innerHTML = meals.map((meal) => `
        <div class="meal-card p-6 rounded-2xl shadow-sm border border-green-100 bg-white cursor-pointer hover:bg-green-50 transition-all" 
             onclick='window.openMealDetails(${JSON.stringify(meal).replace(/'/g, "&apos;")})'>
            <h3 class="font-bold text-xl text-green-800 uppercase">${meal.name}</h3>
            <p class="text-gray-500 text-sm italic mt-1">${meal.description}</p>
        </div>
    `).join('');
}

// --- 5. MEAL OVERVIEW & FAVORITES ---
window.openMealDetails = function(meal) {
    currentMeal = meal;
    document.getElementById('mainDashboard').classList.add('hidden');
    document.getElementById('mealOverview').classList.remove('hidden');
    
    document.getElementById('overviewMealName').innerText = meal.name;
    document.getElementById('mealDesc').innerText = meal.description;

    const contents = document.querySelectorAll('.accordion-content');
    if (contents.length >= 5) {
        contents[0].innerHTML = `<ul class="p-4 list-disc ml-5">${meal.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>`;
        contents[1].innerHTML = `<p class="p-4 text-gray-700 font-medium">${meal.nutrition}</p>`;
        contents[2].innerHTML = `<ol class="list-decimal p-4 ml-8 space-y-2">${meal.steps.map(s => `<li>${s}</li>`).join('')}</ol>`;
        contents[3].innerHTML = `<p class="p-4 text-gray-700">${meal.analysis}</p>`;
        contents[4].innerHTML = `<ul class="p-4 list-disc ml-5">${meal.addons.map(a => `<li>${a}</li>`).join('')}</ul>`;
    }
    
    checkIfFavorite(meal.name);
};

window.toggleFavorite = async function() {
    const user = firebase.auth().currentUser;
    if (!user || !currentMeal) return alert("Log in to save favorites!");

    const mealId = btoa(currentMeal.name).substring(0, 20); // Create simple ID
    const favRef = firebase.database().ref(`users/${user.uid}/favorites/${mealId}`);

    const snap = await favRef.get();
    if (snap.exists()) {
        await favRef.remove();
        showToast("Removed from favorites");
    } else {
        await favRef.set(currentMeal);
        showToast("Saved to favorites! ❤️");
    }
    checkIfFavorite(currentMeal.name);
};

async function checkIfFavorite(name) {
    const user = firebase.auth().currentUser;
    const mealId = btoa(name).substring(0, 20);
    const snap = await firebase.database().ref(`users/${user.uid}/favorites/${mealId}`).get();
    
    const isFav = snap.exists();
    document.getElementById('favStar').innerHTML = isFav ? '&#9733;' : '&#9734;';
    document.getElementById('favStar').style.color = isFav ? '#eab308' : '#9ca3af';
}

// --- 6. HELPERS ---
window.toggleAccordion = function(btn) {
    const content = btn.nextElementSibling;
    const span = btn.querySelector('span');
    content.classList.toggle('open');
    if (span) span.innerText = content.classList.contains('open') ? '−' : '+';
};

window.backToDashboard = function() {
    document.getElementById('mealOverview').classList.add('hidden');
    document.getElementById('mainDashboard').classList.remove('hidden');
};

function showToast(msg) {
    const toast = document.getElementById('toastMsg');
    if (toast) {
        toast.innerText = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }
}

function initVideoResize() {
    const video = document.getElementById('initialVideo');
    const slider = document.getElementById('videoSizeSlider');
    if (slider && video) {
        slider.oninput = (e) => {
            const scale = e.target.value / 100;
            video.style.transform = window.innerWidth <= 768 ? `scale(${scale})` : `translate(62px, -282px) scale(${2.73 * scale})`;
        };
    }
}

document.getElementById('logoutBtn').onclick = () => {
    firebase.auth().signOut().then(() => window.location.href = "index.html");
};
