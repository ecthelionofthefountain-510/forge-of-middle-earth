let cartItems = [];

function showImage(imageFile) {
    const modal = document.getElementById("swordModal");
    const imageElement = document.getElementById("modal-sword-image");
    const descriptionElement = document.getElementById("modal-sword-description");
    const priceDisplay = document.getElementById("modal-price"); // New price display
    const addToCartButton = document.getElementById("add-to-cart-btn"); // Define add-to-cart button

    // Extract item name from imageFile
    const itemName = Object.keys(itemsCatalog).find(name => imageFile.toLowerCase().includes(name.toLowerCase().replace(/ /g, '-')));
    if (!itemName || !itemsCatalog[itemName]) {
        console.error("Item not found in catalog for:", imageFile);
        return;
    }

    // Set the modal content based on the item details
    const item = itemsCatalog[itemName];
    imageElement.src = 'img/' + imageFile;
    descriptionElement.textContent = `${itemName}: ${item.description}`; // Use the description property

    // Display the item price directly from itemsCatalog
    priceDisplay.textContent = `Price: ${item.price} kr`; // Set the initial price here

    // Update add-to-cart button's function to add this specific item
    addToCartButton.onclick = function() {
        const inscription = document.getElementById("inscription").value;
        const material = document.getElementById("material").value;
        addToCart(itemName, inscription, material);
    };

    // Show the modal
    modal.style.display = "flex";
}


// Function to display a custom error message
function showError(message) {
    const errorMessageBox = document.getElementById("error-message");
    errorMessageBox.querySelector("p").textContent = message;
    errorMessageBox.style.display = "block";
}

// Close the error message when clicking the "Okay" button
function closeErrorMessage() {
    document.getElementById("error-message").style.display = "none";
}


// Close modal when user clicks outside or on close button
document.querySelector(".close").onclick = function() {
    document.getElementById("swordModal").style.display = "none";
}
window.onclick = function(event) {
    const modal = document.getElementById("swordModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

let activeCombos = new Set(); // Håller reda på aktiva combos

function applyComboDiscount(cartItems) {
    let totalDiscount = 0;
    const cartCategories = new Set(cartItems.map(item => item.category));
    let discountMessages = [];
    let newComboTriggered = false;

    // Loopa igenom comboDiscounts och kontrollera om varukorgen uppfyller kriterierna för varje combo
    for (const combo in comboDiscounts) {
        const {
            categories: comboCategories,
            discount: comboDiscount,
            message,
            soundId
        } = comboDiscounts[combo];

        if (comboCategories.every(category => cartCategories.has(category))) {
            totalDiscount += comboDiscount;

            // Kolla om denna combo redan har aktiverats
            if (!activeCombos.has(combo)) {
                activeCombos.add(combo); // Lägg till kombon som aktiv
                discountMessages.push(message);

                // Spela upp ljud endast när en ny combo triggas
                document.getElementById(soundId).play();
                newComboTriggered = true;
            }
        } else {
            // Ta bort combo från aktiva om den inte längre uppfylls
            activeCombos.delete(combo);
        }
    }

    // Visa rabattnotifikationen om en ny combo har triggat
    if (newComboTriggered) {
        showDiscountNotification(discountMessages.join("<br>"));
    }

    return totalDiscount;
}

function updateDiscountDisplay(discountPercentage) {
    const discountElement = document.getElementById('discount-amount');
    if (discountPercentage > 0) {
        discountElement.textContent = `Discount: -${discountPercentage.toFixed(2)}%`;
        discountElement.style.display = 'block';
    } else {
        discountElement.style.display = 'none';
    }
}


const itemsCatalog = {
    "Anglachel": {
        category: "Elven Sword",
        description: "A dark, sentient blade forged from meteoric iron by Eöl the Dark Elf. Wielded by Túrin Turambar, it brings both power and tragedy to its bearer.",
        price: 1000
    },

    "Glamdring": {
        category: "Elven Sword",
        description: "Known as the “Foe-hammer,” this elven sword was wielded by Turgon and later by Gandalf. Forged in Gondolin, it shines with a deadly brilliance against orcs.",
        price: 950
    },

    "Herugrim": {
        category: "Mannish Sword",
        description: "The sword of King Théoden of Rohan, symbolizing the valor of the Rohirrim. Beautifully crafted, it saw use in the battles against Saruman’s forces.",
        price: 800
    },

    "Narsil": {
        category: "Numenorean Sword",
        description: "The legendary sword of Elendil, shattered in battle with Sauron. Later reforged into Andúril for Aragorn, it stands as a symbol of hope and unity.",
        price: 1200
    },

    "Orcrist": {
        category: "Elven Sword",
        description: "Known as the “Goblin-cleaver,” this elven sword was crafted in Gondolin. Wielded by Thorin Oakenshield, it glows in the presence of orcs.",
        price: 1100
    },

    "Ringil": {
        category: "Elven Sword",
        description: "The icy, fearsome sword of Fingolfin, High King of the Noldor. Glittering like ice, it struck fear into the forces of Morgoth.",
        price: 2950
    },

    "Gurthang": {
        category: "Special Sword",
        description: "Once Anglachel, this reforged black blade was wielded by Túrin Turambar, who renamed it Gurthang, meaning “Iron of Death.” It carries a dark, tragic fate.",
        price: 89950
    },

    "Aeglos": {
        category: "Elven Blade",
        description: "The spear of Gil-galad, last High King of the Elves. Its name means “Snow Point,” and it proved powerful in the Last Alliance against Sauron.",
        price: 4950
    },

    "Angrist": {
        category: "Mannish Blade",
        description: "A dagger forged by Dwarven smith Telchar. Used by Beren to cut a Silmaril from Morgoth’s crown, demonstrating its sharpness and strength.",
        price: 800
    },

    "Barrow-blades": {
        category: "Mannish Blade",
        description: "Enchanted swords found by the Hobbits in the Barrow-downs. Forged to combat dark forces, they’re particularly effective against wraiths.",
        price: 1200
    },

    "Dains Axe": {
        category: "Dwarven Axe",
        description: "Wielded by Dáin Ironfoot, this red-tinted axe was famed in the Battle of Azanulbizar, symbolizing the unbreakable spirit of the Dwarves.",
        price: 1500
    },

    "Dramborleg": {
        category: "Human Axe",
        description: "Tuor’s legendary axe, named “Thudder-Sharp” for its powerful blows. It could cleave armor like cloth and echoed like thunder on the battlefield.",
        price: 1300
    },

    "Grond": {
        category: "Dark Axe",
        description: "Morgoth’s immense mace, the “Hammer of the Underworld,” used in his duel with Fingolfin. Its name later inspired Sauron’s battering ram in Gondor’s siege.",
        price: 1300
    },

    "Battle Axe": {
        category: "Mannish Axe",
        description: "The mighty axe wielded by Húrin in the Battle of Unnumbered Tears, symbolizing his bravery. Húrin’s strength made him legendary among Elves and Men.",
        price: 1300
    },

    "Elven Armour": {
        category: "Elven Armour",
        description: " is often characterized by its elegance, lightness, and superior craftsmanship. The Elves are master artisans, and their armor reflects their close connection to nature and magic.",
        price: 1500
    },

    "Dwarven Armour": {
        category: "Dwarven Armour",
        description: " is renowned for its durability and robustness, mirroring the Dwarves’ tenacious and resilient nature. Known as master blacksmiths and miners, the Dwarves craft armor that is both practical and highly protective.",
        price: 1300
    },

    "Men Armour": {
        category: "Men Armour",
        description: "Armor worn by the Men of Middle-earth varies widely between realms, with distinctive designs depending on the culture. Their craftsmanship is strong, though generally less refined than Elven or Dwarven work. However, some realms produce high-quality, ornate armor.",
        price: 1000
    },

    "Elven Helmet": {
        category: "Elven Helmet",
        description: " are crafted with elegance and lightness in mind, complementing the Elves’ overall armor style. Elves are skilled in creating protective gear that is as beautiful as it is functional.",
        price: 1500
    },

    "Dwarven Helmet": {
        category: "Dwarven Helmet",
        description: " reflect the Dwarves’ culture of resilience and their affinity for strong, enduring designs. These helmets are made to withstand heavy blows and protect the wearer during close-quarters combat.",
        price: 1300
    },

    "Men Helmet": {
        category: "Mannish Helmet",
        description: "Helmets worn by the Men of Middle-earth vary between the different realms and reflect the diversity of their cultures, from the martial, high-quality helms of Gondor to the practical, horse-friendly designs of Rohan.",
        price: 800
    },

    "Dragon helm": {
        category: "Special Helmet",
        description: "The Dragon-helm of Dor-Lomin was originally forged by Telchar of Nogrod, a renowned Dwarven smith from the First Age, known for crafting some of the greatest weapons and armor in Middle-earth. It was made for the House of Hador, one of the three noble houses of the Edain (Men) in Beleriand. The helm was eventually passed down as a family heirloom, belonging to the Lords of Dor-lómin.",
        price: 1000000
    },

    "Horn of Gondor": {
        category: "Mannish Artifact",
        description: "The Horn is a symbol of Gondorian heritage and duty, passed down through the generations of the Stewards of Gondor. Made of white ivory from the great wild oxen that once roamed the far north, the horn is bound in silver.",
        price: 1500
    },

    "Phial of Galadriel": {
        category: "Elvish Artifact",
        description: "The Phial is a small crystal vial filled with water from the enchanted fountain in Lothlórien, capturing the light of the star Eärendil, which shines from a Silmaril in the heavens. It is a gift from Galadriel to Frodo.",
        price: 130000
    },

    "Ring of Barahir": {
        category: "Numenorean Artifact",
        description: " is an ancient heirloom of the House of Bëor, originally given by the Elven king Finrod Felagund to Barahir, a Man who saved his life during the First Age.",
        price: 8000
    },

    "The One Ring": {
        category: "Special Artifact",
        description: " is the most infamous and powerful artifact in Middle-earth, created by the Dark Lord Sauron to control all other Rings of Power.",
        price: 1200000
    },
};

console.log(itemsCatalog["Gurthang"].category); // Borde visa "Special Sword"
console.log(itemsCatalog["Dragon helm"].category); // Borde visa "Special Helmet"

const inscriptionCosts = {
    "Elvish": 100,
    "Dwarvish": 80,
    "Ancient": 50
};

function addToCart(itemName, inscription = "None", material = "Standard") {
    const item = itemsCatalog[itemName];
    const incompatible = (item.category.includes("Elven") && (inscription === "Dwarvish" || inscription === "Ancient")) ||
        (item.category.includes("Dwarven") && (inscription === "Elvish" || inscription === "Ancient")) ||
        (item.category.includes("Mannish") && (inscription === "Dwarvish" || inscription === "Elvish"));

    if (incompatible) {
        showError("Do not follow the folly of Sauron; choose wisely! This inscription is not suitable for this item.");
        return;
    }

    const inscriptionCost = inscription !== "None" ? inscriptionCosts[inscription] : 0;
    const materialCost = material !== "Standard" ? materialCosts[material] : 0;
    const totalPrice = item.price + inscriptionCost + materialCost;

    const existingItem = cartItems.find(cartItem => cartItem.name === itemName && cartItem.inscription === inscription && cartItem.material === material);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            name: itemName,
            category: item.category,
            price: totalPrice,
            quantity: 1,
            inscription: inscription,
            material: material
        });
    }

    updateCartCount();

    // Anropa applyComboDiscount och visa rabatten om den finns
    const totalDiscount = applyComboDiscount(cartItems);
    console.log("Total discount applied:", totalDiscount);

    triggerCartIconPulse();
}

const materialCosts = {
    "Mithril": 500,
    "Steel": 0,
    "Silmarili": 2000
};

function updateMaterialPrice() {
    const material = document.getElementById("material").value;
    const materialCost = materialCosts[material];
}


function updatePreview() {
    const itemName = document.getElementById("modal-sword-description").textContent.split(":")[0].trim();
    const item = itemsCatalog[itemName];
    const inscription = document.getElementById("inscription").value;
    const material = document.getElementById("material").value;

    // Calculate additional costs
    const inscriptionCost = inscription !== "None" ? inscriptionCosts[inscription] : 0;
    const materialCost = material !== "Standard" ? materialCosts[material] : 0;

    // Total price starts from the base price and adds any selected options
    const totalPrice = item.price + inscriptionCost + materialCost;

    // Update the modal price display
    document.getElementById("modal-price").textContent = `Price: ${totalPrice} kr`;
}

const comboDiscounts = {
    elvishCombo: {
        categories: ["Elven Sword", "Elven Armour", "Elven Helmet"],
        discount: 0.15,
        message: "Elven Warrior's Blessing Activated! 🌿",
        soundId: "elven-sound"
    },
    dwarvishCombo: {
        categories: ["Dwarven Axe", "Dwarven Armour", "Dwarven Helmet"],
        discount: 0.15,
        message: "Durin, son of Durin Activated! 🔨",
        soundId: "dwarvish-sound"
    },
    specialCombo: {
        categories: ["Special Sword", "Special Helmet"],
        discount: 0.99,
        message: "Turin Turambar Activated!",
        soundId: "special-sound"
    },
    numenoreanCombo: {
        categories: ["Numenorean Sword", "Numenorean Artifact"],
        discount: 0.50,
        message: "Heir of Numenor Activated!",
        soundId: "numenorean-sound"
    },
    hurinCombo: {
        categories: ["Mannish Axe"],
        discount: 0.20,
        message: "Aurë Entuluva!",
        soundId: "mannish-sound"
    },
    darkCombo: {
        categories: ["Dark Axe", "Special Artifact"],
        discount: 0,
        message: "Morgoths Apprentice Activated!",
        soundId: "dark-sound"
    }
};


function showDiscountNotification(message) {

    let notification = document.querySelector(".discount-notification");
    if (notification) {
        notification.remove(); // Ta bort existerande för att visa nya
    }

    notification = document.createElement("div");
    notification.className = "discount-notification";
    notification.innerHTML = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add("show"); // Trigga visning
    }, 10);

    // Skapa en timer för att ta bort meddelandet efter 3 sekunder
    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}




function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    const cartItemsList = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price-cart');
    const discountElement = document.getElementById('discount-amount');

    if (!cartCountElement || !cartItemsList || !totalPriceElement || !discountElement) {
        console.error("Element saknas i DOM.");
        return;
    }

    cartItemsList.innerHTML = '';
    let totalPrice = 0;

    cartItems.forEach((item, index) => {
        const itemElement = document.createElement('li');
        itemElement.className = 'cart-item';

        itemElement.innerHTML = `
      <img class="cart-item-image" src="img/${item.name.toLowerCase().replace(/ /g, '-')}.jpg" alt="${item.name}">
      <div class="cart-item-details">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">${item.price} kr</p>
      </div>
      <div class="quantity-control">
        <button onclick="decreaseQuantity(${index})">-</button>
        <span>${item.quantity}</span>
        <button onclick="increaseQuantity(${index})">+</button>
      </div>
    `;

        cartItemsList.appendChild(itemElement);
        totalPrice += item.price * item.quantity;
    });

    const totalDiscount = applyComboDiscount(cartItems) * totalPrice;
    const discountedPrice = totalPrice - totalDiscount;

    cartCountElement.textContent = cartItems.reduce((total, item) => total + item.quantity, 0);
    discountElement.textContent = `Discount: -${totalDiscount.toFixed(2)} kr`;
    discountElement.style.display = totalDiscount > 0 ? 'block' : 'none'; // Visa bara om det finns rabatt
    totalPriceElement.textContent = `Total price: ${discountedPrice.toFixed(2)} kr`;
}

function increaseQuantity(index) {
    cartItems[index].quantity++;
    updateCartCount();
}

function decreaseQuantity(index) {
    if (cartItems[index].quantity > 1) {
        cartItems[index].quantity--;
    } else {
        cartItems.splice(index, 1);
    }
    updateCartCount();
}



const navItems = document.querySelectorAll('nav ul li');
const introText = document.querySelector('.intro-text');
const featuredItems = document.querySelector('.featured-items');

navItems.forEach((item) => {
    item.addEventListener('mouseover', () => {
        if (item.querySelector('.dropdown')) {
            introText.classList.add('blur');
            featuredItems.classList.add('blur');
            item.querySelector('.dropdown').style.opacity = "1";
            item.querySelector('.dropdown').style.visibility = "visible";
        }
    });

    item.addEventListener('mouseout', () => {
        if (item.querySelector('.dropdown')) {
            introText.classList.remove('blur');
            featuredItems.classList.remove('blur');
            item.querySelector('.dropdown').style.opacity = "0";
            item.querySelector('.dropdown').style.visibility = "hidden";
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Hitta alla dropdown-länkar
    const dropdownLinks = document.querySelectorAll('.dropdown li a');

    dropdownLinks.forEach(link => {
        // Lyssna på 'mouseenter' för att förstärka effekten
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'scale(1.1)'; // Öka storleken lite
            link.style.transition = 'transform 0.3s ease'; // Jämn animation
        });

        // Återställ storlek när användaren lämnar länken
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'scale(1)'; // Återställ storleken
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const fadeInElements = document.querySelectorAll('.fade-in');

    const scrollHandler = () => {
        fadeInElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0;

            if (isVisible) {
                element.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', scrollHandler);
    scrollHandler(); // Första körningen direkt för att visa element vid sidladdning
});


document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('h1');

    const createSmoke = () => {
        const smoke = document.createElement('div');
        smoke.className = 'smoke';

        // Slumpmässig position och storlek för mer variation
        smoke.style.left = `${Math.random() * 80 + 10}%`;
        smoke.style.width = `${Math.random() * 60 + 40}px`;
        smoke.style.height = smoke.style.width; // Gör höjd och bredd lika för cirkel

        // Slumpmässig startpunkt ovanför rubriken
        smoke.style.top = `${Math.random() * -10 - 10}px`;

        // Lägg till rökmolnet till rubriken
        header.appendChild(smoke);

        // Ta bort rök-elementet när animationen är klar
        setTimeout(() => {
            smoke.remove();
        }, 3000); // Matcha med animationstiden i CSS
    };

    // Skapa ett nytt rökmoln var 600 ms
    setInterval(createSmoke, 600);
});

document.addEventListener('DOMContentLoaded', () => {
    const soundToggle = document.getElementById('sound-toggle');
    const backgroundSound = document.getElementById('background-sound');
    
    if (soundToggle && backgroundSound) {
        soundToggle.addEventListener('click', () => {
            if (backgroundSound.paused) {
                backgroundSound.play();
                soundToggle.textContent = '🔊';
            } else {
                backgroundSound.pause();
                soundToggle.textContent = '🔇';
            }
        });
    } else {
        console.error("Sound toggle or background sound element not found.");
    }
});


function searchProducts() {
    const query = document.getElementById('search-input').value.toLowerCase();
    if (!query) return;

    const itemFound = Object.keys(itemsCatalog).find(item => item.toLowerCase().includes(query));
    if (itemFound) {
        showImage(itemFound.toLowerCase().replace(/ /g, '-') + '.jpg');
    } else {
        alert('Produkten kunde inte hittas.');
    }
}

function showSuggestions() {
    const query = document.getElementById("search-input").value.toLowerCase();
    const suggestionsBox = document.getElementById("suggestions");
    const navBar = document.querySelector("nav");
    const introText = document.querySelector(".intro-text"); // Lägg till introText-elementet

    suggestionsBox.innerHTML = ''; // Rensa tidigare förslag
    suggestionsBox.style.display = 'none'; // Dölj förslagsboxen som standard

    if (query.length === 0) {
        navBar.classList.remove("blur");
        introText.classList.remove("blur"); // Ta bort blur från introText när inga förslag finns
        return;
    }

    const suggestions = Object.keys(itemsCatalog).filter(item => item.toLowerCase().startsWith(query));

    if (suggestions.length > 0) {
        suggestions.forEach(item => {
            const suggestionDiv = document.createElement("div");
            suggestionDiv.textContent = item;
            suggestionDiv.onclick = () => selectSuggestion(item);
            suggestionsBox.appendChild(suggestionDiv);
        });
        suggestionsBox.style.display = 'block'; // Visa förslagsboxen om det finns matchande förslag
        navBar.classList.add("blur"); // Lägg till blur på nav-baren
        introText.classList.add("blur"); // Lägg till blur på intro-texten
    } else {
        navBar.classList.remove("blur");
        introText.classList.remove("blur"); // Ta bort blur om det inte finns några förslag
    }
}

// Funktion för att stänga suggestions och ta bort blur när man klickar utanför
document.addEventListener('click', function(event) {
    const searchInput = document.getElementById('search-input');
    const suggestionsBox = document.getElementById('suggestions');
    const navBar = document.querySelector('nav');
    const introText = document.querySelector('.intro-text'); // Lägg till introText-elementet

    if (!searchInput.contains(event.target) && !suggestionsBox.contains(event.target)) {
        searchInput.value = '';
        suggestionsBox.style.display = 'none';
        navBar.classList.remove('blur'); // Ta bort blur från nav-baren
        introText.classList.remove('blur'); // Ta bort blur från intro-texten
    }
});

function selectSuggestion(item) {
    document.getElementById('search-input').value = item;
    document.getElementById('suggestions').style.display = 'none'; // Dölj förslagsboxen när ett förslag valts
    document.querySelector("nav").classList.remove("blur"); // Ta bort blur från nav-baren
    document.querySelector('.intro-text').classList.remove("blur"); // Tar bort blur från intro-texten
    showImage(item.toLowerCase().replace(/ /g, '-') + '.jpg'); // Visa bilden för det valda objektet
}


function toggleCart() {
    const cartContainer = document.getElementById('cart-container');
    if (cartContainer) {
        cartContainer.classList.toggle('open');
    } else {
        console.error("cart-container hittades inte.");
    }
}

let currentSuggestionIndex = -1;

document.getElementById("search-input").addEventListener("keydown", function(event) {
    const suggestionsBox = document.getElementById("suggestions");
    const suggestions = Array.from(suggestionsBox.getElementsByTagName("div"));

    // Om det inte finns några förslag, avbryt
    if (suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
        // Gå nedåt i listan
        event.preventDefault();
        currentSuggestionIndex = (currentSuggestionIndex + 1) % suggestions.length;
        updateSuggestionHighlight(suggestions);
    } else if (event.key === "ArrowUp") {
        // Gå uppåt i listan
        event.preventDefault();
        currentSuggestionIndex = (currentSuggestionIndex - 1 + suggestions.length) % suggestions.length;
        updateSuggestionHighlight(suggestions);
    } else if (event.key === "Enter") {
        // Om Enter trycks, välj det aktuella förslaget om det finns ett markerat förslag
        event.preventDefault();
        if (currentSuggestionIndex >= 0 && currentSuggestionIndex < suggestions.length) {
            selectSuggestion(suggestions[currentSuggestionIndex].textContent);
        } else {
            searchProducts();
        }
    }
});

function updateSuggestionHighlight(suggestions) {
    // Ta bort markeringsklassen från alla förslag
    suggestions.forEach(suggestion => suggestion.classList.remove("highlight"));

    // Lägg till markeringsklassen på det aktuella förslaget
    if (currentSuggestionIndex >= 0) {
        suggestions[currentSuggestionIndex].classList.add("highlight");
    }
}

function showSuggestions() {
    const query = document.getElementById("search-input").value.toLowerCase();
    const suggestionsBox = document.getElementById("suggestions");
    const navBar = document.querySelector("nav");
    const introText = document.querySelector(".intro-text"); // Lägg till introText-elementet

    suggestionsBox.innerHTML = ''; // Rensa tidigare förslag
    suggestionsBox.style.display = 'none'; // Dölj förslagsboxen som standard

    if (query.length === 0) {
        navBar.classList.remove("blur");
        introText.classList.remove("blur"); // Ta bort blur från introText när inga förslag finns
        return;
    }

    const suggestions = Object.keys(itemsCatalog).filter(item => item.toLowerCase().startsWith(query));

    if (suggestions.length > 0) {
        suggestions.forEach(item => {
            const suggestionDiv = document.createElement("div");
            suggestionDiv.textContent = item;
            suggestionDiv.onclick = () => selectSuggestion(item);
            suggestionsBox.appendChild(suggestionDiv);
        });
        suggestionsBox.style.display = 'block'; // Visa förslagsboxen om det finns matchande förslag
        navBar.classList.add("blur"); // Lägg till blur på nav-baren
        introText.classList.add("blur"); // Lägg till blur på intro-texten
    } else {
        navBar.classList.remove("blur");
        introText.classList.remove("blur"); // Ta bort blur om det inte finns några förslag
    }
}

function selectSuggestion(item) {
    document.getElementById("search-input").value = item;
    document.getElementById("suggestions").style.display = "none"; // Dölj förslagsboxen när ett förslag valts
    showImage(item.toLowerCase().replace(/ /g, '-') + '.jpg'); // Visa bilden för det valda objektet
}

document.addEventListener('click', function(event) {
    const searchInput = document.getElementById('search-input');
    const suggestionsBox = document.getElementById('suggestions');
    const navBar = document.querySelector('nav');

    // Kontrollera om klicket är utanför sökfältet eller förslagsboxen
    if (!searchInput.contains(event.target) && !suggestionsBox.contains(event.target)) {
        // Återställ sökfältet och dölja förslagsboxen
        searchInput.value = '';
        suggestionsBox.style.display = 'none';

        // Ta bort blurr från navbar
        navBar.classList.remove('blur');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const cartContainer = document.getElementById('cart-container');
    const cartLink = document.querySelector('.cart-link');


    if (cartContainer && cartLink) {
        // Toggla varukorgen när man klickar på varukorgsikonen
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            cartContainer.classList.toggle('open'); // Toggla klassen "open" för att visa/dölja varukorgen
        });

        // Stäng varukorgen när man klickar utanför den, om den är öppen
        document.addEventListener('click', function(event) {
            // Kontrollera om klicket är utanför varukorgen och varukorgsikonen och inte på kvantitetsknapparna
            if (!cartContainer.contains(event.target) && !cartLink.contains(event.target) && !event.target.closest('.quantity-control')) {
                cartContainer.classList.remove('open'); // Dölj varukorgen om klicket är utanför
            }
        });
    } else {
        console.error("cart-container eller cart-link kunde inte hittas i DOM.");
    }
});

function triggerCartIconPulse() {
    const cartIcon = document.querySelector('.cart-link img');
    if (!cartIcon) return;

    // Lägg till pulsanimationen
    cartIcon.classList.add('pulse-animation');

    // Vänta på att animationen slutförs och ta bort klassen
    cartIcon.addEventListener('animationend', function handleAnimationEnd() {
        cartIcon.classList.remove('pulse-animation');
        cartIcon.removeEventListener('animationend', handleAnimationEnd);
    });
}