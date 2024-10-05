
const token = sessionStorage.getItem("authToken")
console.log("Token stocké :", token);

if (token) {
    document.body.classList.add("connecte");
    const boutonModifier = document.querySelector(".boutonModifier");
    boutonModifier.addEventListener("click", afficherModale);
}

function afficherModale() {
    // Création du fond de la popup
    const fondPopup = document.createElement("div");
    fondPopup.classList.add("fondPopup");
    document.body.append(fondPopup);

    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.innerHTML = `
        <div class="boutonFermerPopup">X</div>
        <div class="galleryPopup"></div>
    `;

    fondPopup.append(popup);
    document.body.append(fondPopup)

    const boutonFermer = popup.querySelector(".boutonFermerPopup");

    boutonFermer.addEventListener("click", function () {
        fondPopup.remove();
    });
    fondPopup.addEventListener("click", function (e) {
        if (e.target.classList.contains("fondPopup")) {
            fondPopup.remove();
        }
    });

    fondPopup.append(popup);

    if (tousLesProjets) {
        afficherProjetsDansPopup(tousLesProjets);
    }
}

function afficherProjetsDansPopup(projets) {

    const galleryPopup = document.querySelector(".galleryPopup");
    galleryPopup.innerHTML = "";


    projets.forEach(projet => {
        const projetElement = document.createElement("div");
        projetElement.classList.add("projet-item");

        projetElement.innerHTML = `
            <img src="${projet.imageUrl}" alt="Projet Image" />
            <div class="supprimerProjet"><i class="fa-solid fa-trash-can"></i></div>

        `;
        galleryPopup.append(projetElement);
        const boutonSupprimer = projetElement.querySelector(".supprimerProjet");
        boutonSupprimer.addEventListener("click", function() { 
        supprimerProjet(projet, projetElement)
        })

    });
    const boutonAjouter = document.createElement("button");
    boutonAjouter.innerText = "Ajouter une photo";
    boutonAjouter.classList.add("ajouterPhotoBtn");

    // Ajout du bouton à la galerie
    galleryPopup.append(boutonAjouter);

    // Gestionnaire d'événement pour ouvrir une modale d'ajout
    boutonAjouter.addEventListener("click", function() {
        ouvrirFormulaireAjoutProjet(); // Fonction qui ouvrira le formulaire d'ajout
    });
}

// Fonction pour ouvrir la modale/formulaire d'ajout de projet
function ouvrirFormulaireAjoutProjet() {
    // Ici tu peux créer et afficher un formulaire pour ajouter un projet
    console.log("Ouverture du formulaire pour ajouter un projet.");
}

function ouvrirFormulaireAjoutProjet() {
    // Création du fond de la popup
    const fondPopup = document.createElement("div");
    fondPopup.classList.add("fondPopup");
    document.body.append(fondPopup);

    // Création de la popup de formulaire
    const popup = document.createElement("div");
    popup.classList.add("popupForm");
    popup.innerHTML = `
        <div class="boutonFermerPopup">X</div>
        <h2>Ajout photo</h2>
        <form id="formAjoutProjet" enctype="multipart/form-data">
            <div class="zonePhoto">
                <label for="fileInput" class="labelAjoutPhoto">
                    <img src="path/to/your/image-icon.png" alt="Ajouter photo" />
                    <span>+ Ajouter photo</span>
                </label>
                <input type="file" id="fileInput" name="image" accept="image/jpeg, image/png" style="display: none;" />
                <p>jpg, png : 4mo max</p>
            </div>
            <div class="form-group">
                <label for="titre">Titre</label>
                <input type="text" id="titre" name="title" required />
            </div>
            <div class="form-group">
                <label for="categorie">Catégorie</label>
                <select id="categorie" name="category" required>
                    <option value="">Sélectionnez une catégorie</option> 
                </select>
            </div>
            <button type="submit" class="btnValider">Valider</button>
        </form>
    `;

    const select = popup.querySelector("select");
    toutesLesCategories.forEach(function (categorie) {
        const option = document.createElement("option");
        option.value = categorie.id;
        option.innerText = categorie.name;
        select.append(option);
    });

    fondPopup.append(popup);

    const inputFile = popup.querySelector("#fileInput");
    inputFile.addEventListener("change", function() {
        //Virer contenu de zonePhoto et afficher la photo à la place
    });

    // Fermer la popup en cliquant sur "X"
    const boutonFermer = popup.querySelector(".boutonFermerPopup");
    boutonFermer.addEventListener("click", function() {
        fondPopup.remove();
    });
    fondPopup.addEventListener("click", function (e) {
        if (e.target.classList.contains("fondPopup")) {
            fondPopup.remove();
        }
    });

    // Gestion de l'envoi du formulaire
    const formAjoutProjet = document.getElementById("formAjoutProjet");
    formAjoutProjet.addEventListener("submit", function(event) {
        event.preventDefault();
        envoyerProjet(); // Fonction qui gère l'envoi du formulaire au back-end
    });
}

// Fonction pour envoyer le projet au back-end
function envoyerProjet() {
    const formData = new FormData(document.getElementById("formAjoutProjet"));

    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("authToken")
        },
        body: formData
    })
    .then(response => {
        if (response.ok) {
            console.log("Projet ajouté avec succès !");
            response.json().then(function (projet) {
                tousLesProjets.push(projet);
                afficherProjets(tousLesProjets);
                document.querySelectorAll(".fondPopup").forEach(function (element) {
                    element.remove();
                });
            });
        } else {
            // Afficher plus de détails sur l'erreur
            response.json().then(data => {
                console.error("Erreur lors de l'ajout du projet:", data);
            });
        }
    })
    .catch(error => {
        console.error("Erreur:", error);
    });
}




function supprimerProjet(projet, projetElement) {
    fetch(`http://localhost:5678/api/works/${projet.id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("authToken")
        }
    })

.then(response => {
    if (response.ok) {
        projetElement.remove(); 
        tousLesProjets = tousLesProjets.filter(function (p) {
            return p.id !== projet.id;
        });
        afficherProjets(tousLesProjets);
        console.log(`Projet avec l'ID ${projetElement.id} supprimé.`);
    } else {
        console.error('Erreur lors de la suppression du projet');
    }
})
.catch(error => console.error('Erreur:', error));
}


const boutonAjouterProjet = fetch("http://localhost:5678/api/works");


