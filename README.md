# Création d’un Token Fongible sur Hedera avec JavaScript SDK 🚀

Ce projet vous guide pas à pas pour créer un token fongible (ex : stablecoin) sur le réseau Hedera grâce au SDK JavaScript. Idéal pour découvrir la tokenisation sur Hedera ou démarrer un projet Web3 !

## Prérequis 🛠️
- Node.js ≥ 14
- Un compte Hedera Testnet ([créez-en un ici](https://portal.hedera.com/register))
- Vos identifiants Hedera (Account ID et Private Key)

## Installation 📦
1. Clonez ce dépôt ou copiez les fichiers dans un dossier local.
2. Installez les dépendances :
```bash
npm install
```

## Configuration ⚙️
Créez un fichier `.env` à la racine du projet avec vos identifiants :
```
MY_ACCOUNT_ID=VotreAccountId
MY_PRIVATE_KEY=VotrePrivateKey
```

## Exécution ▶️
Lancez le script principal :
```bash
node index.js
```

## Fonctionnalités principales ✨
- **Création d’un nouveau compte Hedera** pour recevoir des tokens (génération de clés, création et récupération de l’ID)
- **Création d’un token fongible** (ex : USD Bar, symbole USDB) avec choix du nom, symbole, décimales, supply initiale, type de supply (illimitée), et clé de supply
- **Association du token** au nouveau compte (obligatoire pour recevoir des tokens sur Hedera)
- **Transfert de tokens** du compte trésorier vers le nouveau compte (simulation d’un paiement ou d’une distribution)

## Détail du processus 📝
1. **Initialisation du client** : connexion à Hedera Testnet avec vos identifiants
2. **Création d’un compte destinataire** : génération de clés, création du compte, récupération de l’ID
3. **Création du token** : configuration complète (nom, symbole, décimales, supply, etc.), signature et soumission de la transaction
4. **Association du token** : le nouveau compte doit accepter le token pour pouvoir en recevoir
5. **Transfert de tokens** : envoi d’un montant du token du trésorier vers le nouveau compte
6. **Affichage des résultats** : chaque étape affiche l’ID du compte, l’ID du token, et le statut des transactions

## Extrait de code clé 💡
```js
let tokenCreateTx = await new TokenCreateTransaction()
  .setTokenName("USD Bar")
  .setTokenSymbol("USDB")
  .setTokenType(TokenType.FungibleCommon)
  .setDecimals(2)
  .setInitialSupply(10000)
  .setTreasuryAccountId(myAccountId)
  .setSupplyType(TokenSupplyType.Infinite)
  .setSupplyKey(supplyKey)
  .freezeWith(client);
// Signature, soumission et récupération de l’ID du token
```

## Liens utiles 🔗
- [Documentation officielle Hedera JS SDK](https://hedera.com/docs/sdks)
- [Créer un compte testnet](https://portal.hedera.com/register)

---
*Dernière mise à jour : juin 2025*
