import { Component } from '@angular/core';
import { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar }from '@hashgraph/sdk';
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
  constructor(){
    const client = Client.forTestnet();    
    client.setOperator(this.myAccountId, this.myPrivateKey);

    const newAccountTransactionId = new AccountCreateTransaction()
    .setKey(environment.publicKey)
    .setInitialBalance(Hbar.fromTinybars(1000))
    .execute(client);
    console.log(newAccountTransactionId);
  }
}
