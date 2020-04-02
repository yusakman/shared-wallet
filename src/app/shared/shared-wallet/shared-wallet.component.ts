import { Component, OnInit } from "@angular/core";
import { Web3Service } from "../../util/web3.service";
import { MatSnackBar } from "@angular/material";

declare let require: any;
const sharedwallet_artifacts = require("../../../../build/contracts/SharedWallet.json");

@Component({
  selector: "app-shared-wallet",
  templateUrl: "./shared-wallet.component.html",
  styleUrls: ["./shared-wallet.component.css"]
})
export class SharedWalletComponent implements OnInit {
  accounts: string[];
  SharedWallet: any;

  model = {
    account: "",
    depositAmount: 0,
    balance: 0
  };

  status = "";

  constructor(
    private web3Service: Web3Service,
    private matSnackBar: MatSnackBar
  ) {
    console.log("Constructor: " + web3Service);
  }

  ngOnInit(): void {
    console.log("OnInit: " + this.web3Service);
    console.log(this);
    this.watchAccount();
    this.web3Service
      .artifactsToContract(sharedwallet_artifacts)
      .then(SharedWalletAbstraction => {
        this.SharedWallet = SharedWalletAbstraction;
        this.SharedWallet.deployed().then(deployed => {
          console.log(deployed);
        });
      });
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe(accounts => {
      this.accounts = accounts;
      this.model.account = accounts[0];
      this.refreshBalance();
    });
  }

  setStatus(status) {
    this.matSnackBar.open(status, null, { duration: 3000 });
  }

  async refreshBalance() {
    console.log("Refreshing balance");

    try {
      const deployedSharedWallet = await this.SharedWallet.deployed();
      console.log(deployedSharedWallet);
      console.log("Account", this.model.account);
      const sharedWalletBalance = await this.web3Service
        .getWeb3()
        .then(web3 => {
          return web3.eth.getBalance(deployedSharedWallet.address);
        });
      console.log("Balance (wei)", sharedWalletBalance);
      this.model.balance = this.SharedWallet.web3.utils.fromWei(
        sharedWalletBalance,
        "ether"
      );
    } catch (e) {
      console.log(e);
      this.setStatus("Erro getting balance; see log");
    }
  }

  setDepositAmount(e) {
    this.model.depositAmount = e.target.value;
  }

  async depositEther() {
    if (!this.SharedWallet) {
      this.setStatus("Shared Wallet is not loaded, unable to send transaction");
      return;
    }

    const amount = this.model.depositAmount;
    const sender = this.model.account;

    console.log("Sending Ether " + amount + "from" + sender);

    this.setStatus("Initiating transaction...(plesase wait)");
    try {
      const deployedSharedWallet = await this.SharedWallet.deployed();
      const transaction = await deployedSharedWallet.sendTransaction({
        from: this.model.account,
        value: this.SharedWallet.web3.utils.toWei(amount, "Ether")
      });

      if (!transaction) {
        this.setStatus("Transaction failed!");
      } else {
        this.setStatus("Transaction complete");
      }
    } catch (e) {
      console.log(e);
      this.setStatus("Error sending Ether; see log.");
    }
  }
}
