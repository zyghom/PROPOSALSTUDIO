# ProposalStudio

Constructeur de propositions commerciales — React + Vite.

## Lancer en local

```bash
npm install
npm run dev
```

L'app fonctionne sans configuration : sans base de données, elle démarre en
**mode démo** avec des données d'exemple (aucune modification n'est persistée).

## Brancher la base de données Supabase

1. **Créer les tables.** Dans votre projet Supabase, ouvrez le *SQL Editor* et
   exécutez le contenu de [`supabase/schema.sql`](supabase/schema.sql). Cela crée
   les tables `offers` et `templates`, les politiques d'accès (RLS) et quelques
   données de départ.

2. **Configurer les clés.** Copiez `.env.local.example` en `.env.local` :

   ```bash
   cp .env.local.example .env.local
   ```

   Puis renseignez les deux valeurs depuis *Supabase → Settings → API* :

   ```
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=votre-cle-anon-publique
   ```

3. **Relancer** `npm run dev`. L'app charge désormais les offres et templates
   depuis Supabase, et y enregistre :
   - la sauvegarde d'une offre (bouton **Sauvegarder** du constructeur) ;
   - l'envoi au client (statut passé à *Envoyée*) ;
   - la signature électronique (statut passé à *Signée*) ;
   - la création, duplication et suppression de templates.

> `.env.local` contient vos clés et n'est pas versionné (ignoré par git).
> La clé « anon » est publique et destinée au navigateur ; les tables sont
> protégées par RLS. L'app étant mono-utilisateur, les politiques donnent un
> accès complet via cette clé — voir le commentaire dans `schema.sql` pour
> passer à un accès par utilisateur si vous ajoutez l'authentification.

## Build de production

```bash
npm run build     # génère dist/
npm run preview   # sert le build en local
```
