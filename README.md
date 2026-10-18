# L’antre de Phant0mhex

Portail média privé pour le foyer. Le serveur Node.js vérifie les connexions avec Jellyfin avant de servir le tableau de bord. Les raccourcis s’ouvrent dans un nouvel onglet.

## Connexion privée

- Les comptes et mots de passe sont ceux de Jellyfin. Le portail n’a pas de table d’utilisateurs à maintenir.
- Le navigateur transmet le mot de passe au portail sur HTTPS; le serveur le vérifie ensuite auprès de Jellyfin via `Users/AuthenticateByName`. Il n’est pas conservé.
- Le jeton de session Jellyfin reste en mémoire côté serveur, derrière un cookie `HttpOnly`, `Secure` et `SameSite=Lax`. Les sessions expirent après 12 heures et sont révoquées au redémarrage du conteneur.
- Huit tentatives de connexion maximum par adresse sur 15 minutes. Seuls les journaux de démarrage sont écrits; les identifiants et jetons ne sont pas journalisés.
- Aucun endpoint du portail ne renvoie l’API key Jellyfin au navigateur. L’API key Jellyfin n’est pas nécessaire pour vérifier un compte membre.

N’exposez aucune clé API dans le dépôt ou le navigateur; révoquez toute clé API divulguée.

## Services

- Jellyseerr — <https://scout.phantomhex.cc>
- Jellyfin — <https://jf.phantomhex.cc>
- Plex — <https://vision.phantomhex.cc>
- Invitations Wizarr — <https://lock.phantomhex.cc>

L’horloge suit le fuseau horaire du navigateur. La recherche filtre les trois plateformes visibles. Les polices Barlow Condensed et DM Sans sont intégrées au dépôt pour éviter un appel CDN au chargement.

## Déployer le portail dans Coolify

1. Connecter ce dépôt comme application Docker Compose.
2. Utiliser `compose.yaml` à la racine.
3. Définir le domaine public de `portal` sur `https://portal.phantomhex.cc`, port interne `3000`.
4. Conserver `JELLYFIN_URL=https://jf.phantomhex.cc` dans l’environnement de production.
5. Déployer. Coolify termine TLS; le conteneur n’expose qu’un port interne.

Pour développer localement, lancer `JELLYFIN_URL=https://jf.phantomhex.cc node server.mjs` puis ouvrir `http://localhost:3000`. Le cookie `Secure` est activé dans l’image de production HTTPS; en local, utilise un proxy HTTPS ou adapte le cookie à l’environnement de développement.

## Déployer Wizarr dans Coolify

Le service est séparé du portail dans `wizarr/compose.yaml`. Il reprend la pile multi-conteneurs publiée par Wizarr et expose uniquement le proxy Nginx sur le réseau interne de Coolify.

1. Créer une deuxième application Docker Compose depuis le même dépôt.
2. Définir le chemin Compose `wizarr/compose.yaml` et le domaine du service `wizarr-nginx` sur `https://lock.phantomhex.cc`, port interne `5690`.
3. Ajouter les variables de `wizarr.env.example` à Coolify. Générer un nouveau `DB_PASSWORD` aléatoire et le garder dans les variables privées de Coolify.
4. Configurer le stockage persistant de `DB_DIR` et `STORAGE_DIR` dans Coolify, puis déployer.
5. Vérifier les journaux et l’état de santé du backend, puis activer les invitations dans l’interface Wizarr.

Wizarr évolue rapidement ; vérifier les notes de version de la release avant les mises à jour. Le Compose officiel utilise les tags `latest` par défaut. Pour une version contrôlée, renseigner `WIZARR_IMAGE_VERSION` dans Coolify.

## Thème Jellyfin

Copier `jellyfin/phantomhex-theme.css`, puis le coller dans **Dashboard → Branding → Custom CSS** (ou les paramètres d’affichage d’un utilisateur). Il s’applique au client Jellyfin Web ; certaines applications natives et interfaces TV peuvent l’ignorer.

## Identité

Le symbole SVG autonome se trouve dans `assets/phantomhex-mark.svg` et sert de favicon, de marque et d’illustration dans la page.
