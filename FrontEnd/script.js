let tousLesProjets = null;
let toutesLesCategories = null;

const promesseFetchProjet = fetch("http://localhost:5678/api/works");
//.then permet de dire à la promesse quel code exécuter une fois la réponse reçue
promesseFetchProjet.then(function (response) {
    //On obtient l'objet Response fourni par la promesse
    //Pour obtenir les données finales, on doit appeler la fonction "json" de l'objet Response,
    //qui nous donne une nouvelle promesse.
    const promiseJson = response.json();
    //On utilise à nouveau .then sur cette nouvelle promesse.
    promiseJson.then(function (projets) {
        //On obtient finalement la liste des projets, un tableau contenant les objets décrivant les projets.
        //On peut appeler la fonction "afficherProjets" en lui fournissant la liste des projets.
        tousLesProjets = projets;
        afficherProjets(projets);
        //Dans le .then qui récupère le tableau de projets, juste avant la ligne "afficherProjets(projets)" :

    });
});




function afficherProjets(projets) {
    //On affiche les projets dans la console pour voir à quoi ressemble les données
    console.log("Fonction afficherProjets");
    console.log(projets);




    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";




    projets.forEach(projet => {

        const figure = document.createElement("figure");

        const img = document.createElement("img");
        img.src = projet.imageUrl;

        const figcaption = document.createElement("figcaption");
        figcaption.innerText = projet.title;

        figure.append(img);
        figure.append(figcaption);
        gallery.append(figure);
    });
}




const promesseFetchCategories = fetch("http://localhost:5678/api/categories");
//.then permet de dire à la promesse quel code exécuter une fois la réponse reçue
promesseFetchCategories.then(function (response) {
    //On obtient l'objet Response fourni par la promesse
    //Pour obtenir les données finales, on doit appeler la fonction "json" de l'objet Response,
    //qui nous donne une nouvelle promesse.
    const promiseJson = response.json();
    //On utilise à nouveau .then sur cette nouvelle promesse.
    promiseJson.then(function (categories) {
        creerBoutonsFiltres(categories);
        toutesLesCategories = categories;
        //On obtient finalement la liste des projets, un tableau contenant les objets décrivant les projets.
        //On peut appeler la fonction "afficherProjets" en lui fournissant la liste des projets.


    });
});



function creerBoutonsFiltres(categories) {
    const divfiltres = document.querySelector(".filtres");

    categories.forEach(categorie => {
        const div = document.createElement("div");
        div.classList.add("filtre");
        div.innerText = categorie.name;

        div.addEventListener("click", function () {
            // Appeler la fonction pour filtrer les projets par catégorie
            const projetsFiltres = tousLesProjets.filter(function (projet) {
                return projet.category.name === categorie.name;
            });
            document.querySelector(".filtre.selection").classList.remove("selection");
            div.classList.add("selection");
            afficherProjets(projetsFiltres);
        });

        divfiltres.append(div);
    });

    const boutonTous = document.querySelector(".filtre");
    boutonTous.addEventListener("click", function () {
        document.querySelector(".filtre.selection").classList.remove("selection");
        boutonTous.classList.add("selection");
        afficherProjets(tousLesProjets);
    });
}


const token = sessionStorage.getItem("authToken")
console.log("Token stocké :", token);

if (token) {
    document.body.classList.add("connecte");
    const boutonModifier = document.querySelector(".boutonModifier");
    boutonModifier.addEventListener("click", afficherModale);
    document.querySelector(".logoutBtn").addEventListener("click", function (e) {
        e.preventDefault();
        sessionStorage.removeItem("authToken");
        location.reload();
    });
}