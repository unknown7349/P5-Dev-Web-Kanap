// Récupération des paramètres de l'URL de la page
const urlParams = new URLSearchParams(window.location.search);

// Récupération de la valeur de la clé "orderId" dans les paramètres de l'URL
const orderId = urlParams.get("orderId");

// Affichage de la valeur de la commande dans l'élément HTML avec l'id "orderId"
document.querySelector("#orderId").innerHTML = orderId;