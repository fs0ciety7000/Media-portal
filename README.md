# L’antre de Phant0mhex

Portail média statique pour le foyer, servi par Nginx. Le contenu n’appelle aucune API et n’affirme pas que les services sont en ligne : chaque raccourci ouvre le service correspondant dans un nouvel onglet.

## Services

- Jellyseerr — <https://scout.phantomhex.cc>
- Jellyfin — <https://jf.phantomhex.cc>
- Plex — <https://vision.phantomhex.cc>
- Invitations Wizarr — <https://lock.phantomhex.cc>

L’horloge suit le fuseau horaire du navigateur. La recherche filtre les trois plateformes visibles. Les polices Barlow Condensed et DM Sans sont intégrées au dépôt pour éviter un appel CDN au chargement.

## Déployer le portail dans Coolify

1. Connecter ce dépôt comme application Docker Compose.
2. Utiliser `compose.yaml` à la racine.
3. Définir le domaine public de `portal` sur `https://portal.phantomhex.cc`, port interne `80`.
4. Déployer. Le service Nginx ne publie pas directement de port sur l’hôte.

Pour le développement local : lancer `python3 -m http.server 8080` depuis la racine du dépôt et ouvrir `http://localhost:8080`.

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
