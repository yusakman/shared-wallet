import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedWalletComponent } from "./shared-wallet/shared-wallet.component";
import { UtilModule } from "../util/util.module";
import { RouterModule } from "@angular/router";
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatSnackBarModule
} from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatSnackBarModule,
    RouterModule,
    UtilModule
  ],
  declarations: [SharedWalletComponent],
  exports: [SharedWalletComponent]
})
export class SharedModule {}
