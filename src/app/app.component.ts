import { Component } from '@angular/core';
import { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar } from '@hashgraph/sdk';
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
          const newAccountId = successreceipt.accountId;
          console.log("The new account ID is: " + newAccountId);
        });
      });
  }
}
