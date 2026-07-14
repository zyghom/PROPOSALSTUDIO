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

## Identification d'une société par IA (optionnel)

Lors de la création d'une offre, vous pouvez saisir l'**URL du site web** du
prospect : une IA (Google Gemini) analyse le site et pré-remplit
automatiquement le client, le secteur, le contact et une description.

L'appel à l'IA se fait dans une **fonction Supabase Edge** (`enrich-company`),
côté serveur — la clé API n'est jamais exposée dans le navigateur. Sans cette
fonction, le champ URL reste utilisable mais ne fait qu'un pré-remplissage
basique (nom déduit du domaine).

### 1. Obtenir une clé Gemini (gratuit)

1. Allez sur [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
   (connexion avec un compte Google).
2. Cliquez sur **« Create API key »** et copiez la clé (`AIza…`).

> L'offre gratuite de Gemini suffit très largement : une analyse de site
> consomme une infime partie du quota quotidien gratuit.

### 2. Déployer la fonction Edge (depuis le dashboard Supabase, sans terminal)

1. Dans votre projet Supabase → menu **Edge Functions** → **Deploy a new
   function** (ou **Create a function**).
2. Nommez-la exactement **`enrich-company`**.
3. Collez le contenu de
   [`supabase/functions/enrich-company/index.ts`](supabase/functions/enrich-company/index.ts)
   dans l'éditeur, puis **Deploy**.

### 3. Renseigner la clé Gemini comme secret

Dans Supabase → **Edge Functions** → **Secrets** (ou *Project Settings → Edge
Functions*), ajoutez un secret :

```
GEMINI_API_KEY = AIza…votre clé…
```

C'est tout : rechargez l'app, ouvrez **Nouvelle offre**, collez l'URL d'un
site et cliquez **Analyser**. Les champs se remplissent tout seuls.

> **Modèle Gemini.** La fonction utilise `gemini-3.5-flash` par défaut. Si un
> jour Google le retire (erreur `404 … no longer available`), ajoutez un
> secret `GEMINI_MODEL` avec le nom d'un modèle Flash actuel (voir
> [ai.google.dev/gemini-api/docs/models](https://ai.google.dev/gemini-api/docs/models)) —
> aucun changement de code nécessaire.

> La fonction s'exécute sur les serveurs de Supabase et n'a besoin d'aucune
> installation de votre côté. Pour la déployer plutôt en ligne de commande :
> `supabase functions deploy enrich-company` puis
> `supabase secrets set GEMINI_API_KEY=…` (nécessite la CLI Supabase).

## Build de production

```bash
npm run build     # génère dist/
npm run preview   # sert le build en local
```
