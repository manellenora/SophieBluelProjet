document.addEventListener("DOMContentLoaded", function() {
    //Écouter l'évènement click sur le bouton Se connecter
    const bouton = document.querySelector("#submit");
    bouton.addEventListener("click", clickBoutonSubmit);
})

function clickBoutonSubmit(e) {
    e.preventDefault();

    //Récupérer email et mot de passe depuis le formulaire
    const champEmail = document.querySelector("#email");
    const champPassword = document.querySelector("#password");

    const email = champEmail.value;
    const password = champPassword.value;

    //Vérifier que j'ai bien les deux
    if (!email || !password) {
        console.error("Email ou password absent");
        return;
    }
    
    //Envoyer les données au serveur
    const promesseFetch = fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password,
        })
      
    });

    promesseFetch
    .then(function(response) {
        if (!response.ok) {
            throw new Error("Erreur lors de la connexion");
        }
        return response.json();
    })
    .then(function(data) {
        // Si tout va bien, on enregistre le jeton de connexion dans le sessionStorage
        if (data.token) {
            sessionStorage.setItem("authToken", data.token);
            // Puis on redirige vers index.html
            window.location.href = "index.html";
        } else {
            throw new Error("Jeton de connexion non trouvé");
        }
    })
    .catch(function(error) {
        // Sinon on affiche l'erreur
        console.error("Erreur :", error);
        alert("Erreur de connexion : " + error.message);
    });
}

    //Vérifier la réponse
    //Si tout va bien on enregistre le jeton de connexion dans le sessionStorage, puis on redirige vers index.html
    //Sinon on affiche l'erreur

//Je dois vérifier si l'utilisateur est connecté
//J'essaye de récupérer "authToken" dans sessionStorage
const token = sessionStorage.getItem("authToken");
console.log("Token", token);
if (token) {
//Si je l'ai -> Je suis connecté
    //Je vais adapter ma page
    //Créer le bandeau "mode édition"
    //Ajouter le bouton "Modifier"
    //Cacher les boutons filtres
    document.body.classList.add("connecte");
} else {
//Sinon -> Je ne suis pas connecté
    //je ne suis pas connecté, je m'arrête ici
}