// This is just an example,
// so you can safely delete all default props below

export default {
  general: {
    back: "Retour",
    inDevelopment: "En cours de développement",
    input: "Recherche",
    close: "Close"
  },
  filter: {
    resultsfilterSelected: "Filtre sélectionnés",
    reset: "Remove all filters",
    positive: "Positive",
    neutral: "Neutru",
    negative: "Negativ"
  },
  routes: {
    territory: "My territory",
    project: "Mon Projet",
    community: "My project",
    indicators: "Indicatheque",
    search: "Search"
  },
  loginPage: {
    weAre: "We Are",
    nameOfCompany: "SGEvT",
    subText: "Welcome back, please login to your account",
    form: {
      username: "Username",
      password: "Password",
      remember: "Remember me",
      forget: "Forget Password"
    },
    gdpr: {
      text: "By signing up, you agree to SGEvT",
      terms: "Terms and Conditions",
      privacy: "Privacy Policy"
    }
  },
  mainPage: {
    nameGraph: "Etat de la collecte",
    inputSearch: {
      all: "All",
      projects: "Projects",
      territories: "Territories"
    },
    description: {
      firstParagraph:
        "Bienvenue dans Tereval, une initiative visant à vous donner accès à toute l'information relative aux territoires (données statistiques, indicateurs, évolutions) et aux programmes mis en oeuvre (SCOT, PLU, PLUI, SAGE...) réunis en un point unique pour la première fois.",
      secondParagraph:
        "Notre ambition est de vous permettre de partager votre expérience, de bénéficier de celle de vos pairs et de pouvoir mutualiser les meilleures pratiques pour accroitre l'efficacité des politiques territoriales.",
      thirdParagraph:
        "Recherchez de l'information comme vous en avez l'habitude, utilisez les critères de ciblage pour affiner votre recherche et parcourez l'information que vous aurez sélectionnée."
    },
    link: "Accéder au tutoriel"
  },
  territoryPage: {
    profil: "Profil de territoire",
    comparer: "Me comparer à: Ma sélection, Un territoire",
    affichage: "Affichage initial : mon territoire",
    projets: "Les meilleurs projets/territoires",
    themes: "Thématiques",
    themesTerritory: "Thématiques du territoire",
    neighbouring: "Neighbouring",
    similar: "Similar territories",
    subterritories: "Subterritories",
    viewAllSubterritories: "View all sub-territories",
    viewAllTerritories: "View all territories",
    viewAllSimilarTerritories: "View all similar territories",
    noResult: "Aucun résultats",
    card: {
      communes: "Communes",
      department: "Département",
      scot: "SCOT",
      epci: "EPCI",
      region: "Région",
      people: "Habitants",
      area: "Superficie",
      density: "Densité",
      artificialization: "Artificialisation",
      distance: "Distance"
    }
  },
  searchPage: {
    results: "Résultats",
    sortBy: "trier par",
    selectAll: "tout sélectionner",
    status: "Status",
    date: "Date",
    noResult: "Aucun résultats",
    card: {
      communes: "Communes",
      departement: "Département",
      epci: "EPCI",
      region: "Région",
      people: "Habitants",
      area: "Superficie",
      density: "Densité",
      artificialization: "Artificialisation",
      distance: "Distance"
    }
  },
  projectPage: {
    project: "Mon Projet",
    extractedConcepts: "Les concepts extraits",
    issues: "enjeux",
    foundInDocument: "Trouvés dans le document",
    meansOfImplementation: "Moyens de mise en oeuvre",
    objectifs: "objectifs",
    concepts: "Concepts orphelins",
    treaty: "traité",
    orphans: "Orphelins",
    qev: "QEV",
    mmo: "MMO"
  },
  error: {
    message: "Sorry, nothing here...",
    goBack: "Go back",
    failed: "Action failed"
  },
  success: "Action was successful"
};

//  {{ $t('translation.path') }} template code or this.$t('translation.path') in script code
