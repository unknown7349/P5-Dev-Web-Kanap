// Sélectionner l'élément HTML avec l'ID "items"
const itemsContainer = document.querySelector('#items');

// Effectuer une requête GET sur l'API locale avec l'URL "http://localhost:3000/api/products"
fetch('http://localhost:3000/api/products')
  .then(function(res) {
    // Si la réponse est OK, retourner le résultat au format JSON
    if (res.ok) {
      return res.json();
    }
  })
  // Une fois les données récupérées, exécuter la fonction suivante
  .then(function(value) {
    // Boucler sur chaque produit retourné par l'API
    for (const produit of value) {
      // Insérer un article HTML dans la page pour chaque produit
      // en y incluant son image, son nom, sa description et son ID
      itemsContainer.innerHTML += `
        <a href="./product.html?id=${produit._id}">
          <article>
            <img src="${produit.imageUrl}" alt="${produit.name}">
            <h3 class="productName">${produit.name}</h3>
            <p class="productDescription">${produit.description}</p>
          </article>
        </a>
      `;
    }
  })
  // Si une erreur se produit lors de la récupération des données, afficher une alerte
  .catch(function() {
    alert('Oops, API déconnectée');
  });
