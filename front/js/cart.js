// On récupère le panier stocké dans le localStorage
let panierstockage = JSON.parse(localStorage.getItem("panier")) || [];

// On crée une fonction asynchrone qui récupère les informations d'un produit à partir de son ID en appelant une API
async function recuperationPanier(id) {
  let response = await fetch(`http://localhost:3000/api/products/${id}`);
  return await response.json();
}

// On récupère l'élément HTML qui contiendra les articles du panier
let cartItemsContainer = document.querySelector("#cart__items");

// On crée une fonction asynchrone qui affiche les articles du panier
async function affichageDuPanier() {
  if (localStorage.getItem("panier")) {
    if (panierstockage.length > 0) {
      panierstockage.forEach(async function (panier) {
        const produitapi = await recuperationPanier(panier.id);
        // On crée un élément HTML pour chaque article du panier et on l'ajoute à la page
        cartItemsContainer.innerHTML += `<article class="cart__item" data-id=${panier.id} data-color="${panier.couleur}">
          <div class="cart__item__img">
            <img src=${produitapi.imageUrl} alt="${produitapi.altTxt}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${produitapi.name}</h2>
              <p>${panier.couleur}</p>
              <p>${produitapi.price} €</p>
            </div>
            <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p>Qté :</p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${panier.quantite}>
              </div>
              <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
              </div>
            </div>
          </div>
        </article>`;
        // On ajoute un écouteur d'événement de clic pour chaque bouton de suppression d'article
        supprimerArticleDuPanier();
      });
    } else {
      panierstockage = [];
      alert("Votre panier est vide, Veuillez ajouter des articles");
    }
  }
}

// Cette fonction calcule la quantité totale de produits dans le panier
function calculQuantiteTotal() {
  let quantiteTotal = 0;
  // Parcours tous les éléments du panierstockage et ajoute leur quantité
  panierstockage.forEach(function (panier) {
    quantiteTotal += panier.quantite;
  });
  return quantiteTotal;
}

// Cette fonction met à jour la quantité d'un produit dans le panier
function updateCartItemQuantity(article, newQuantity) {
  // Vérifie si la quantité est supérieure à zéro
  if (newQuantity < 1) {
    alert("La quantité doit être supérieure à zéro.");
    return;
  }
  
  // Vérifie si la quantité est inférieure ou égale à 100
  if (newQuantity > 100) {
    alert("La quantité maximale autorisée est de 100.");
    return;
  }
  // Récupère l'id et la couleur du produit à mettre à jour
  let id = article.dataset.id;
  let couleur = article.dataset.color;
  // Récupère le panier dans le localStorage et le modifie en mettant à jour la quantité du produit
  let panier = JSON.parse(localStorage.getItem("panier"));
  panier = panier.map(function (panier) {
    if (panier.id === id && panier.couleur === couleur) {
      panier.quantite = newQuantity;
    }
    return panier;
  });
  localStorage.setItem("panier", JSON.stringify(panier));
  // Met à jour le nombre d'articles dans le panier
  updateCartItemsNumber();
  // Met à jour le prix total
  updateTotalPrice();
  // Recharge la page
  location.reload();
}

// Récupère tous les boutons de suppression dans le panier
let deleteButtons = document.querySelectorAll(".deleteItem");
console.log("delete", deleteButtons);
// Pour chaque bouton, ajoute un écouteur d'événement de clic
deleteButtons.forEach(function (deleteButton) {
  deleteButton.addEventListener("click", function (e) {
    e.preventDefault();
    // Récupère l'article parent du bouton de suppression
    let article = e.target.parentElement.parentElement.parentElement.parentElement;
    // Récupère l'id et la couleur du produit à supprimer
    let id = article.dataset.id;
    let couleur = article.dataset.color;
    // Récupère le panier dans le localStorage et le modifie en supprimant le produit
    let panier = JSON.parse(localStorage.getItem("panier"));
    panier = panier.filter(function (panier) {
      return panier.id !== id || panier.couleur !== couleur;
    });
    localStorage.setItem("panier", JSON.stringify(panier));
    // Supprime l'article du panier dans le HTML
    article.remove();
    // Met à jour le nombre d'articles dans le panier
    updateCartItemsNumber();
    // Met à jour le prix total
    let prixTotalContainer = document.querySelector("#totalPrice");
    prixTotalContainer.innerHTML = "0";
    // Recharge la page
    location.reload();
  });
});


// Ajoute un écouteur d'événement pour les saisies d'entrée dans le conteneur d'articles du panier
cartItemsContainer.addEventListener("input", function (e) {
  // Vérifie si la cible de l'événement a la classe CSS "itemQuantity"
  if (e.target.classList.contains("itemQuantity")) {
    // Convertit la nouvelle quantité saisie en nombre entier
    let newQuantity = parseInt(e.target.value);
    // Récupère l'article parent de l'élément de saisie
    let article = e.target.parentElement.parentElement.parentElement.parentElement;
    // Met à jour la quantité de l'article dans le panier
    updateCartItemQuantity(article, newQuantity);
  }
});z

// Récupère l'élément HTML avec l'id "totalQuantity" et met à jour son contenu avec la quantité totale d'articles dans le panier
let cartItemsNumber = document.querySelector("#totalQuantity");
cartItemsNumber.innerHTML = calculQuantiteTotal();

// Définit une fonction qui met à jour l'élément HTML avec l'id "totalQuantity" avec la quantité totale d'articles dans le panier
function updateCartItemsNumber() {
  let cartItemsNumber = document.querySelector("#totalQuantity");
  cartItemsNumber.innerHTML = calculQuantiteTotal();
}

// Définit une fonction asynchrone qui calcule le prix total des articles dans le panier
async function calculPrixTotal() {
  let prixTotal = 0;
  let prixTotalContainer = document.querySelector("#totalPrice");
  // Itère à travers chaque article dans le panier
  panierstockage.forEach(async function (panier) {
    // Récupère les informations sur le produit à partir de l'API en utilisant son ID
    const produitapi = await recuperationPanier(panier.id);
    // Multiplie le prix du produit par la quantité dans le panier et ajoute le résultat au prix total
    prixTotal += produitapi.price * panier.quantite;
    // Met à jour le contenu de l'élément HTML avec l'id "totalPrice" avec le nouveau prix total
    prixTotalContainer.innerHTML = prixTotal;
  });
}


// Définit une fonction qui met à jour le contenu de l'élément HTML avec l'id "totalPrice" avec le prix total des articles dans le panier
function updateTotalPrice() {
  let prixTotal = 0;
  let prixTotalContainer = document.querySelector("#totalPrice");
  // Itère à travers chaque article dans le panier
  panierstockage.forEach(async function (panier) {
    // Récupère les informations sur le produit à partir de l'API en utilisant son ID
    const produitapi = await recuperationPanier(panier.id);
    // Multiplie le prix du produit par la quantité dans le panier et ajoute le résultat au prix total
    prixTotal += produitapi.price * panier.quantite;
  });
  // Met à jour le contenu de l'élément HTML avec l'id "totalPrice" avec le nouveau prix total
  prixTotalContainer.innerHTML = prixTotal;
}

// Définit une fonction asynchrone qui exécute les fonctions pour afficher le panier et calculer le prix total
async function execute() {
  await affichageDuPanier();
  await calculPrixTotal();
}

// Appelle la fonction execute() pour afficher le panier et calculer le prix total
execute();


// Récupère le formulaire de commande
let form = document.querySelector(".cart__order__form");

// Ajoute un écouteur d'événement pour la soumission du formulaire
form.addEventListener("submit", function (e) {
  // Empêche la soumission par défaut du formulaire
  e.preventDefault();

  // Récupère les valeurs saisies dans le formulaire
  let firstName = form.elements.firstName.value;
  let lastName = form.elements.lastName.value;
  let address = form.elements.address.value;
  let city = form.elements.city.value;
  let email = form.elements.email.value;

  // Définit les expressions régulières pour valider les données saisies
  let nameRegex = /^[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+)?$/;
  let emailRegex = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/;
  let addressRegex = /^[a-zA-Z0-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ\s,'-]*$/;
  let cityRegex = /^[a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ\s,'-]*$/;

  // Définit une variable pour indiquer si les données sont valides ou non
  let isValid = true;

  // Vérifie la validité du prénom et affiche un message d'erreur si nécessaire
  if (!nameRegex.test(firstName)) {
    isValid = false;
    document.getElementById("firstNameErrorMsg").innerHTML = "Veuillez entrer un prénom valide";
  }

  // Vérifie la validité du nom de famille et affiche un message d'erreur si nécessaire
  if (!nameRegex.test(lastName)) {
    isValid = false;
    document.getElementById("lastNameErrorMsg").textContent = "Veuillez entrer un nom valide";
  }

  // Vérifie la validité de l'adresse et affiche un message d'erreur si nécessaire
  if (!addressRegex.test(address)) {
    isValid = false;
    document.getElementById("addressErrorMsg").textContent = "Veuillez entrer une adresse valide";
  }

  // Vérifie la validité de la ville et affiche un message d'erreur si nécessaire
  if (!cityRegex.test(city)) {
    isValid = false;
    document.getElementById("cityErrorMsg").textContent = "Veuillez entrer une ville valide";
  }
    // Vérifie la validité de l'adresse email et affiche un message d'erreur si nécessaire
  if (!emailRegex.test(email)) {
    isValid = false;
    document.getElementById("emailErrorMsg").textContent = "Veuillez entrer un email valide";
  }

  if (isValid) { // Vérifie si toutes les informations entrées dans le formulaire sont valides
    let contact = { // Crée un objet "contact" qui contient les informations de contact de l'utilisateur
      firstName: form.elements.firstName.value,
      lastName: form.elements.lastName.value,
      address: form.elements.address.value,
      city: form.elements.city.value,
      email: form.elements.email.value,
    };
    
    let products = []; // Crée un tableau "products" qui contient les IDs des produits commandés
    panierstockage.forEach(function (panier) {
      products.push(panier.id);
    });
  
    let order = { // Crée un objet "order" qui combine l'objet "contact" et le tableau "products"
      contact,
      products,
    };
    console.log(order); // Affiche l'objet "order" dans la console
  
    let envoyer = { // Crée un objet "envoyer" qui contient les informations de la requête POST
      method: "POST",
      body: JSON.stringify(order), // Convertit l'objet "order" en JSON
      headers: {
        "Content-Type": "application/json",
      },
    };
    
    fetch("http://localhost:3000/api/products/order", envoyer) // Envoie la requête POST à l'API
      .then(function (res) {
        if (res.ok) {
          return res.json(); // Convertit la réponse en JSON si la requête a réussi
        }
      })
      .then(function (data) { // Affiche le JSON dans la console si la requête a réussi
        console.log(data);
        alert("Votre commande a bien été prise en compte"); // Affiche un message d'alerte indiquant que la commande a été prise en compte
        localStorage.clear(); // Supprime le panier de l'utilisateur de la mémoire locale
        window.location.href = "confirmation.html?orderId=" + data.orderId; // Redirige l'utilisateur vers la page de confirmation de commande avec l'ID de commande dans l'URL
      });
  }
});