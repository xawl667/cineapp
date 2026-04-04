# 🎬 CinéApp — Projet React JS

Application web de catalogue de films développée avec React JS et Vite.

## 🚀 Lancer le projet

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer le serveur de développement
npm run dev
```

Ouvre ensuite [http://localhost:5173](http://localhost:5173) dans ton navigateur.

---

## ✅ Critères respectés

### Structure du projet
- ✅ Projet créé avec Vite (`npm create vite@latest`)
- ✅ Code en JavaScript (JSX)
- ✅ `src/components/` : `Navbar`, `FilmCard`, `SearchBar`, `Badge`
- ✅ `src/pages/` : `Home`, `Films`, `FilmDetail`, `Favoris`, `NotFound`

### Composants et Props
- ✅ Composants fonctionnels partout
- ✅ Props passées entre composants (`film`, `toggleFavori`, `isFavori`, `nbFavoris`…)
- ✅ `.map()` avec `key` dans la grille de films et les genres

### useState & useEffect
- ✅ `useState` : recherche, genre actif, films filtrés, favoris, animation d'entrée
- ✅ `useEffect` : filtrage réactif dans `Films`, animation dans `Home` et `NotFound`, chargement dans `FilmDetail`

### React Router
- ✅ Navigation avec `<Routes>` / `<Route>`
- ✅ `<NavLink>` dans la Navbar avec classe `active`
- ✅ Navbar présente sur toutes les pages
- ✅ Page 404 pour les routes inconnues (`path="*"`)
- ✅ `useParams` pour les routes dynamiques (`/films/:id`)

### Design
- ✅ CSS Modules (`.module.css`) pour chaque composant et page
- ✅ Thème cinématographique sombre et élégant
- ✅ Variables CSS globales dans `index.css`
- ✅ Responsive, animations d'entrée, micro-interactions

---

## 📁 Structure des fichiers

```
src/
├── components/
│   ├── Navbar/
│   │   ├── Navbar.jsx
│   │   └── Navbar.module.css
│   ├── FilmCard/
│   │   ├── FilmCard.jsx
│   │   └── FilmCard.module.css
│   ├── SearchBar/
│   │   ├── SearchBar.jsx
│   │   └── SearchBar.module.css
│   └── Badge/
│       ├── Badge.jsx
│       └── Badge.module.css
├── pages/
│   ├── Home/
│   ├── Films/
│   ├── FilmDetail/
│   ├── Favoris/
│   └── NotFound/
├── data/
│   └── films.js
├── App.jsx
├── main.jsx
└── index.css
```
