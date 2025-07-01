// const {Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar, TransferTransaction } = require('@hashgraph/sdk');
const {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  Hbar,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenAssociateTransaction,
  TransferTransaction,
} = require("@hashgraph/sdk");
require("dotenv").config();
async function environmentSetup() {
  // Load environment variables from .env file
  const myAccountId = process.env.MY_ACCOUNT_ID;
  const myPrivateKey = process.env.MY_PRIVATE_KEY;

  // Check if the environment variables are set
  if (!myAccountId || !myPrivateKey) {
    throw new Error(
      "Environment variables MY_ACCOUNT_ID and MY_PRIVATE_KEY must be present."
    );
  }

  // // Create a new private key and account ID for the test account
  const client = Client.forTestnet();

  // Set the operator account ID and private key
  client.setOperator(myAccountId, myPrivateKey);

  // Set the default max transaction fee and max query payment
  client.setDefaultMaxTransactionFee(new Hbar(100));

  // Set the max query payment to 50 Hbar
  client.setMaxQueryPayment(new Hbar(50));

  // Create new keys
  const newAccountPrivateKey = PrivateKey.generateED25519();
  const newAccountPublicKey = newAccountPrivateKey.publicKey;

  // Create a new account with the generated keys
  const newAccount = await new AccountCreateTransaction()
    .setKey(newAccountPublicKey)
    .setInitialBalance(Hbar.fromTinybars(1000))
    .execute(client);

  // Get the new account ID
  const getReceipt = await newAccount.getReceipt(client);
  const newAccountId = getReceipt.accountId;

  // Log the new account ID
  console.log("The new account ID is:" + newAccountId);
  const supplyKey = PrivateKey.generate();

  // CREATE FUNGIBLE TOKEN (STABLECOIN)
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

  //SIGN WITH TREASURY KEY
  let tokenCreateSign = await tokenCreateTx.sign(
    PrivateKey.fromString(myPrivateKey)
  );

  //SUBMIT THE TRANSACTION
  let tokenCreateSubmit = await tokenCreateSign.execute(client);

  //GET THE TRANSACTION RECEIPT
  let tokenCreateRx = await tokenCreateSubmit.getReceipt(client);

  //GET THE TOKEN ID
  let tokenId = tokenCreateRx.tokenId;

  //LOG THE TOKEN ID TO THE CONSOLE
  console.log(`- Created token with ID: ${tokenId} \n`);

  const transaction = await new TokenAssociateTransaction()
    .setAccountId(newAccountId)
    .setTokenIds([tokenId])
    .freezeWith(client);

  const signTx = await transaction.sign(newAccountPrivateKey);
  const txResponse = await signTx.execute(client);
  const associationReceipt = await txResponse.getReceipt(client);
  const transactionStatus = associationReceipt.status;

  console.log("Transaction of association was: " + transactionStatus);

  const transferTransaction = await new TransferTransaction()
    .addTokenTransfer(tokenId, myAccountId, -10) // Deduct
    .addTokenTransfer(tokenId, newAccountId, 10) // Add to new account
    .freezeWith(client);

  const signTransferTx = await transferTransaction.sign(
    PrivateKey.fromString(myPrivateKey)
  );
  const transferTxResponse = await signTransferTx.execute(client);
  const transferReceipt = await transferTxResponse.getReceipt(client);
  const transferStatus = transferReceipt.status;
  console.log("Transfer transaction status: " + transferStatus);
}
environmentSetup();
