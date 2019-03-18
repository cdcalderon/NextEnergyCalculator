import { Component } from '@angular/core';
import { BankLoan } from './shared/models/bank-loan-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'next-solar-calculator';
  kWhSize = 6.365;
  isLeadSetter: boolean = false;
  isFederalCredit: boolean = true;
  isNVRebate: boolean = false;
  setter: number = 350;
  bankLoan: BankLoan[] = [
    {
      loanType: 'SF 6059',
      payment: 0,
      cms: 0,
      perKw: 0,
      dealerFeePercent: 19.50 / 100,
      interest: 3.79 / 100,
      term: 240,
      kWhSize: 6.365,
      ppw: 4.80,
      base: 2.50,
      priceBeforeRoof: 0,
      netSystemPrice: 0,
      FederalTaxCredit: 0,
      nvRebate: 0,
      totalAfterCredits: 0,
      dealerFee: 0,
      dealerCost: 936,
      audit: 0,
      roofCost: 0,
      leadSetter: 0,
      wishedPpw: 0
    }
  ];

  calculatePayment(rate: number, nperiod: number, pv: number, fv: number, type: number) {
    if (!fv) { fv = 0; }
    if (!type) { type = 0; }

    if (rate === 0) { return -(pv + fv) / nperiod; }

    const pvif = Math.pow(1 + rate, nperiod);
    let pmt = rate / (pvif - 1) * -(pv * pvif + fv);

    if (type === 1) {
      pmt /= (1 + rate);
    }

    return pmt;
  }

  calculatePerKW(cms: number): number {
    return cms / this.kWhSize;
  }

  calculateCms(
    kWhSize: number,
    ppw: number,
    base: number,
    dealerFeeAmount: number,
    audit: number,
    leadSetter: number) {
    if (!this.isLeadSetter) {
      return ((kWhSize * 1000) * (ppw - base)) -
        dealerFeeAmount - audit;
    }

    return ((kWhSize * 1000) * (ppw - base)) -
      dealerFeeAmount - audit - leadSetter;
  }

  calculateDealerFeeAmount(priceBeforeRoof: number, dealerFeePercent: number) {
    return priceBeforeRoof * dealerFeePercent;
  }

  calculateLeadSetter() {
    return this.kWhSize * this.setter;
  }

  calculatePriceBeforeRoof(kWhSize: number, ppw: number) {
    return kWhSize * ppw * 1000;
  }

  calculateNetSystemPrice(
    kWhSize: number,
    ppw: number,
    dealerFeePercent: number,
    roofCost: number) {
    return ((kWhSize * ppw * 1000) +
      ((roofCost * dealerFeePercent) + roofCost));
  }

  calculateFederalTaxCredit(netSystemPrice: number) {
    return netSystemPrice * (30 / 100);
  }

  calculateNvRebate() {
    return this.kWhSize * 200;
  }

  calculateTotalAfterCredit(
    nvRebate: number,
    federalTaxCredit: number,
    netSystemPrice: number
  ) {
    if (this.isNVRebate && this.isFederalCredit) {
      return netSystemPrice - federalTaxCredit - nvRebate;
    } else if (!this.isNVRebate && this.isFederalCredit) {
      return netSystemPrice - federalTaxCredit;
    } else if (!this.isFederalCredit && this.isNVRebate) {
      return netSystemPrice - nvRebate;
    } else {
      return netSystemPrice;
    }
  }
}
