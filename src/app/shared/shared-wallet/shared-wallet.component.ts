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
    balance: 0,
    whitelistAddress: "",
    sendAmount: 0,
    receiver: ""
  };

  status = "";

  constructor(
    private web3Service: Web3Service,
    private matSnackBar: MatSnackBar
  ) {
    // console.log("Constructor: " + web3Service);
  }

  ngOnInit(): void {
    // console.log("OnInit: " + this.web3Service);
    this.watchAccount();
    this.web3Service
      .artifactsToContract(sharedwallet_artifacts)
      .then(SharedWalletAbstraction => {
        this.SharedWallet = SharedWalletAbstraction;
        this.SharedWallet.deployed().then(deployed => {
          // console.log(deployed);
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
    try {
      const deployedSharedWallet = await this.SharedWallet.deployed();
      const sharedWalletBalance = await this.web3Service
        .getWeb3()
        .then(web3 => {
          return web3.eth.getBalance(deployedSharedWallet.address);
        });

      this.model.balance = this.SharedWallet.web3.utils.fromWei(
        sharedWalletBalance,
        "ether"
      );
    } catch (e) {
      console.log(e);
      this.setStatus("Error getting balance; see log");
    }
  }

  setDepositAmount(e) {
    this.model.depositAmount = e.target.value;
  }

  setWhitelist(e) {
    this.model.whitelistAddress = e.target.value;
  }

  setSendAmount(e) {
    this.model.sendAmount = e.target.value;
  }

  setReceiver(e) {
    this.model.receiver = e.target.value;
  }

  async depositEther() {
    if (!this.SharedWallet) {
      this.setStatus("Shared Wallet is not loaded, unable to send transaction");
      return;
    }

    const amount = this.model.depositAmount;

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

  async addWhitelist() {
    if (!this.SharedWallet) {
      this.setStatus("Shared Wallet is not loaded, unable to send transaction");
      return;
    }

    const whitelistAddress = this.model.whitelistAddress;

    this.setStatus("Initiating transaction...");
    try {
      const deployedSharedWallet = await this.SharedWallet.deployed();
      const transaction = await deployedSharedWallet.authorizedAddress(
        whitelistAddress,
        { from: this.model.account }
      );

      if (!transaction) {
        this.setStatus("Failed, adding address to whitelist");
      } else {
        this.setStatus("Succeed, address added to the whitelist");
      }
    } catch (e) {
      console.log(e);
      this.setStatus("Error adding wallet; see log.");
    }
  }

  async removeWhitelist() {
    if (!this.SharedWallet) {
      this.setStatus("Shared Wallet is not loaded, unable to send transaction");
      return;
    }

    const whitelistAddress = this.model.whitelistAddress;

    this.setStatus("Initiating transaction...");
    try {
      const deployedSharedWallet = await this.SharedWallet.deployed();
      const transaction = await deployedSharedWallet.unauthorizeAddress(
        whitelistAddress,
        { from: this.model.account }
      );

      if (!transaction) {
        this.setStatus("Failed, removing address to whitelist");
      } else {
        this.setStatus("Succeed, address is removed from the whitelist");
      }
    } catch (e) {
      console.log(e);
      this.setStatus("Error removing wallet; see log.");
    }
  }

  async sendEther() {
    if (!this.SharedWallet) {
      this.setStatus("Shared Wallet is not loaded, unable to send transaction");
      return;
    }

    const amount = this.model.sendAmount;
    const receiver = this.model.receiver;

    this.setStatus("Initiating transaction...(plesase wait)");
    try {
      const deployedSharedWallet = await this.SharedWallet.deployed();
      const web3 = await this.web3Service.getWeb3();
      console.log("web3", web3);
      const transaction = await deployedSharedWallet.sendFunds(
        web3.utils.toWei(amount, "Ether"),
        receiver,
        {
          from: this.model.account,
          gas: 450000
        }
      );

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
