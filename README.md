## 🌐 Portfolio Web & CV Interactif - Leterme Florent (Dreyka-Oas) ✨

Ce projet représente le code source du **portfolio personnel** de Leterme Florent, un développeur Web & Logiciel. Il vise à présenter son profil, ses compétences, ses projets et ses informations de contact de manière moderne et interactive. Il inclut également une **page CV HTML distincte** avec des fonctionnalités spécifiques.

---

### 🚀 Site en Ligne / Live Demo

Vous pouvez visiter la version déployée de ce portfolio à l'adresse suivante :
**➡️ [https://portfolio-k0e.pages.dev/](https://portfolio-k0e.pages.dev/) ⬅️**

---

### 🛠️ Fonctionnalités Clés du Portfolio Principal (`index.html`)

*   **Présentation Dynamique :** Section d'accueil ("hero") avec photo de profil, titre animé (`Typed.js`), et calcul dynamique de l'âge.
*   **Navigation Fluide :** Header fixe qui change d'apparence au défilement, menu hamburger responsive pour mobile, et bouton "Retour en haut".
*   **Sections Claires :** À propos, Compétences (organisées en onglets interactifs), Projets (chargés dynamiquement depuis l'API GitHub), et Contact.
*   **Chargement Dynamique des Projets :** Récupère et affiche les dépôts épinglés (ou les plus récents en fallback) de GitHub via des appels API asynchrones (`fetch`).
*   **Thème Clair/Sombre 🌓:** Bouton de bascule permettant de changer le thème visuel (clair/sombre), avec persistance du choix via `localStorage` et respect des préférences système initiales.
*   **Animations et Effets Visuels ✨:**
    *   Animations subtiles au défilement (`IntersectionObserver`).
    *   Arrière-plan animé avec effet paysage, étoiles et particules (`particles.js`).
    *   Effets de survol interactifs sur les boutons, cartes et liens.
    *   Préchargeur (`preloader`) pour une meilleure expérience initiale.
*   **Responsive Design 📱:** Layout adaptatif pour une consultation optimale sur différentes tailles d'écrans (desktop, tablette, mobile) géré via des Media Queries CSS.
*   **Architecture CSS Modulaire :** Fichiers CSS séparés (`base.css`, `layout.css`, `components.css`, etc.) utilisant des variables CSS (`:root`) pour une maintenance et un theming facilités.

---

### 📄 Fonctionnalités Clés de la Page CV (`cv.html`)

*   **CV HTML Dédié :** Une page séparée optimisée pour la présentation d'un CV détaillé.
*   **Mise en Page Moderne :** Structure en deux colonnes (barre latérale et contenu principal) avec un design propre et professionnel (`cv-style.css`).
*   **Contenu Complet :** Inclut Contact, Profil, Qualités, Formation, Expériences (projets spécifiques), Compétences techniques catégorisées, et information sur la recherche d'alternance.
*   **Calcul d'Âge Dynamique :** Affiche l'âge actuel calculé via JavaScript.
*   **Téléchargement PDF 💾:** Bouton permettant de générer et télécharger une version PDF du CV HTML en utilisant les librairies `html2canvas` et `jsPDF`.
*   **Styles Optimisés pour Impression 🖨️:** Règles `@media print` spécifiques dans `cv-style.css` pour formater le contenu de manière appropriée pour une impression A4.
*   **(Optionnel) Thème Indépendant :** Peut forcer un thème clair (ou respecter le thème système) indépendamment du choix fait sur le site principal.

---

### 🚀 Technologies et Librairies Utilisées

*   **Frontend:** HTML5, CSS3, JavaScript (ES6+)
*   **Librairies JS:**
    *   `particles.js` (Effets d'arrière-plan)
    *   `Typed.js` (Animation de texte)
    *   `html2canvas` (Capture d'écran HTML pour PDF - page CV)
    *   `jsPDF` (Génération de PDF - page CV)
*   **Icônes:** Font Awesome
*   **Polices:** Google Fonts (Outfit, Space Grotesk)
*   **API Externe:** GitHub API (pour les projets)

---

Ce portfolio web sert de vitrine complète, combinant une présentation interactive sur le site principal et un CV détaillé et téléchargeable sur une page dédiée.
