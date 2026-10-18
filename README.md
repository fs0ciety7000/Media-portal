# L’antre de Phant0mhex

Portail média statique pour le foyer, servi par Nginx. Le contenu n’appelle aucune API et n’affirme pas que les services sont en ligne : chaque raccourci ouvre le service correspondant dans un nouvel onglet.

## Services

- Jellyseerr — https://scout.phantomhex.cc
- Jellyfin — https://jf.phantomhex.cc
- Plex — https://vision.phantomhex.cc
- Invitations Wizarr — https://lock.phantomhex.cc

L’horloge suit le fuseau horaire du navigateur. La recherche filtre les trois plateformes visibles. Les polices Barlow Condensed et DM Sans sont intégrées au dépôt pour éviter un appel CDN au chargement.

## Déployer le portail dans Coolify

1. Connecter ce dépôt comme application Docker Compose.
2. Utiliser `compose.yaml` à la racine.
3. Définir le domaine public de `portal` sur `https://portal.phantomhex.cc`, port interne `80`.
4. Déployer.

## Déployer Wizarr dans Coolify

Le service est séparé du portail dans `wizarr/compose.yaml`. Il reprend la pile multi-conteneurs publiée par Wizarr et expose uniquement le proxy Nginx sur le réseau interne de Coolify.

## Thème Jellyfin

Copier `jellyfin/phantomhex-theme.css`, puis le coller dans **Dashboard → Branding → Custom CSS**.
