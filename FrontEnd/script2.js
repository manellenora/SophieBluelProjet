document.addEventListener("DOMContentLoaded", function () {
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
        .then(function (response) {
            if (!response.ok) {
                throw new Error("E-mail ou mot de passe incorrect.");
            }
            return response.json();
        })
        .then(function (data) {
            if (data.token) {
                sessionStorage.setItem("authToken", data.token);
                // Puis on redirige vers index.html
                window.location.href = "index.html";
            } else {
                throw new Error("Jeton de connexion non trouvé");
            }
        })
        .catch(function (error) {
            console.error("Erreur :", error);
            alert("Erreur de connexion : " + error.message);
        });
}
