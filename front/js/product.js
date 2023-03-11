// Récupération de l'ID dans l'URL
const url = new URL(window.location.href);
const id = url.searchParams.get("id");

// Requête pour récupérer les informations du produit grâce à son ID
fetch("http://localhost:3000/api/products/" + id)
  .then(function (res) {
    // Vérification que la requête a fonctionné
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (value) {
    // Récupération des éléments du DOM pour afficher les informations du produit
    let title = document.querySelector("#title");
    let prix = document.querySelector("#price");
    let description = document.querySelector("#description");
    let picture = document.querySelector(".item__img");

    // Affichage des informations du produit
    title.innerHTML = value.name;
    prix.innerHTML = value.price;
    description.innerHTML = value.description;

    picture.innerHTML = `<img src="${value.imageUrl}" alt="${value.altTxt}">`;

    // Création des options pour le choix de la couleur
    let select = document.getElementById("colors");
    let colorscontainers = document.querySelector("#colors");
    for (let marqueur of value.colors) {
      colorscontainers.innerHTML += `
        <option value="${marqueur}">${marqueur}</option>
      `;
    }
  })
  .catch(function() {
    // En cas d'erreur, affichage d'un message d'alerte
    alert("Oops, API déconnectée");
  });

// Récupération des éléments du DOM pour ajouter l'article au panier
const btn = document.querySelector("#addToCart");
const couleur = document.querySelector("#colors");
const quantite = document.querySelector("#quantity");

// Ajout d'un événement au clic sur le bouton pour ajouter l'article au panier
btn.addEventListener("click", function () {
  let monArticle = creerArticle(couleur.value, quantite.value, id);
  if (monArticle.couleur == "" || monArticle.quantite < 1 || monArticle.quantite > 100) {
    alert("Veuillez choisir une couleur et une quantité entre 1 et 100.");
  } else {
    panier(monArticle);
  }
});

// Fonction pour créer l'article avec ses caractéristiques
function creerArticle(couleur, quantite, id) {
  let article = {
    couleur: couleur,
    quantite: parseInt(quantite),
    id: id,
  };
  return article;
}

// Fonction pour ajouter l'article au panier
function panier(article) {
  let panierstockage = JSON.parse(localStorage.getItem("panier")) || [];
  let articleExistant = panierstockage.find((panier) => panier.couleur == article.couleur && panier.id == article.id);
  if (articleExistant) {
    articleExistant.quantite = parseInt(articleExistant.quantite) + parseInt(article.quantite);
  } else {
    panierstockage.push(article);
  }
  let objet = JSON.stringify(panierstockage);
  localStorage.setItem("panier", objet);
  alert("Votre article a bien été ajouté au panier.");
}
