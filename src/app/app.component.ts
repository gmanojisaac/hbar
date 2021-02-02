import { Component } from '@angular/core';
import { Client, PrivateKey,AccountId,TransferTransaction, AccountCreateTransaction, AccountBalanceQuery, Hbar } from '@hashgraph/sdk';
import { environment } from '../environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'HBAR';
  myAccountId = environment.accountId;
  myPrivateKey = environment.privateKey;
  newAccountTransactionId: any;
  client;
  getReceipt: any;
  constructor() {
    this.client = Client.forTestnet();
    this.client.setOperator(this.myAccountId, this.myPrivateKey);
    const newAccountPrivateKey = PrivateKey.generate();
    const newAccountPublicKey = newAccountPrivateKey.publicKey;

    this.newAccountTransactionId = new AccountCreateTransaction()
      .setKey(newAccountPublicKey)
      .setInitialBalance(Hbar.fromTinybars(1000))
      .execute(this.client).then(success => {

        this.getReceipt = success.getReceipt(this.client).then(successreceipt => {
          console.log('28', successreceipt);
          const newAccountId = <AccountId>successreceipt.accountId;
          console.log("The new account ID is: " + newAccountId);

          new AccountBalanceQuery().setAccountId(newAccountId)
     .execute(this.client).then(successaccount=>{
      console.log("The new account balance is: " +successaccount.hbars.toTinybars() +" tinybar.");

      new TransferTransaction()
     .addHbarTransfer(this.myAccountId, Hbar.fromTinybars(-1000)) //Sending account
     .addHbarTransfer(newAccountId, Hbar.fromTinybars(1000)) //Receiving account
     .execute(this.client).then(aftertransfer=>{
       console.log(aftertransfer);
       aftertransfer.getReceipt(this.client).then(getreceipt=>{
        console.log("The transfer transaction from my account to the new account was: " + getreceipt.status.toString(),getreceipt);
        new AccountBalanceQuery().setAccountId(this.myAccountId)
     .execute(this.client).then(successlatestaccount=>{
      console.log("The new account balance is: " +successlatestaccount.hbars.toTinybars() +" tinybar.");
     });
       });

     })
     })
        });
      });
  }
}
