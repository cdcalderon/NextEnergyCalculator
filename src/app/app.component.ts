import { Component, OnInit } from '@angular/core';
import { BankLoan } from './shared/models/bank-loan-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'next-solar-calculator';
  kWhSize = 6.365;
  isLeadSetter: boolean = false;
  isFederalCredit: boolean = true;
  isNVRebate: boolean = false;
  isOverrideBasePriceActive: boolean = false;
  isOverridekWhSizeActive: boolean = false;
  setter: number = 350;
  desiredKcms: number = 700;
  basePrice: number = 2.5;
  bankLoans: BankLoan[] = [
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
      federalTaxCredit: 0,
      nvRebate: 0,
      totalAfterCredits: 0,
      dealerFee: 0,
      dealerCost: 936,
      audit: 0,
      roofCost: 0,
      leadSetter: 0,
      wishedPpw: 0
    },
    {
      loanType: 'SUNF 2039',
      payment: 0,
      cms: 0,
      perKw: 0,
      dealerFeePercent: 16.50 / 100,
      interest: 3.99 / 100,
      term: 240,
      kWhSize: 6.365,
      ppw: 4.80,
      base: 2.50,
      priceBeforeRoof: 0,
      netSystemPrice: 0,
      federalTaxCredit: 0,
      nvRebate: 0,
      totalAfterCredits: 0,
      dealerFee: 0,
      dealerCost: 792,
      audit: 0,
      roofCost: 0,
      leadSetter: 0,
      wishedPpw: 0
    }
  ];

  ngOnInit(): void {
    this.calculateLoans();
    // let completeLoans: BankLoan[] = [];
    // this.bankLoans = this.bankLoans.map(bl => {
    //   const netSystemPrice = this.calculateNetSystemPrice(bl.kWhSize, bl.ppw, bl.dealerFeePercent, bl.roofCost);
    //   const nvRebate = this.calculateNvRebate();
    //   const federalTaxCredit = this.calculateFederalTaxCredit(netSystemPrice);
    //   const priceBeforeRoof = this.calculatePriceBeforeRoof(bl.kWhSize, bl.ppw);
    //   const dealerFee = this.calculateDealerFeeAmount(priceBeforeRoof, bl.dealerFeePercent);
    //   const totalAfterCredits = this.calculateTotalAfterCredit(nvRebate, federalTaxCredit, netSystemPrice);
    //   const cms = this.calculateCms(bl.kWhSize, bl.ppw, bl.base, dealerFee, bl.audit, bl.leadSetter);
    //   return <BankLoan>{
    //     loanType: bl.loanType,
    //     dealerFeePercent: bl.dealerFeePercent,
    //     interest: bl.interest,
    //     term: bl.term,
    //     kWhSize: bl.kWhSize,
    //     ppw: bl.ppw,
    //     base: bl.base,
    //     dealerCost: bl.dealerCost,
    //     audit: bl.audit,
    //     roofCost: bl.roofCost,
    //     leadSetter: this.calculateLeadSetter(),
    //     priceBeforeRoof: this.calculatePriceBeforeRoof(bl.kWhSize, bl.ppw),
    //     netSystemPrice,
    //     federalTaxCredit,
    //     nvRebate,
    //     totalAfterCredits,
    //     dealerFee,
    //     wishedPpw: this.calculateWishedPpw(bl.audit, bl.dealerFeePercent),
    //     payment: this.calculatePayment2(bl.interest / 12, bl.term, totalAfterCredits, 0, 0),
    //     cms: cms,
    //     perKw: this.calculatePerKW(cms)
    //   };
    // });
  }

  // =-(PMT(3.79%/12,240,21386))*1.035
  calculatePayment(rate: number, nperiod: number, pv: number, fv: number, type?: number) {
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

  calculatePayment2(ratePerPeriod: number, numberOfPayments: number, presentValue: number, futureValue: number, type: number) {
    if (ratePerPeriod != 0.0) {
      // Interest rate exists
      const q = Math.pow(1 + ratePerPeriod, numberOfPayments);
      return -(ratePerPeriod * (futureValue + (q * presentValue))) / ((-1 + q) * (1 + ratePerPeriod * (type)));

    } else if (numberOfPayments != 0.0) {
      // No interest rate, but number of payments exists
      return -(futureValue + presentValue) / numberOfPayments;
    }

    return 0;
  }

  calculatePerKW(cms: number, kWhSize: number): number {
    return cms / kWhSize;
  }
  // =((6.365*1000)*(4.8-8))-5958-0
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

  calculateLeadSetter(kWhSize: number) {
    return kWhSize * this.setter;
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

  calculateNvRebate(kWhSize: number) {
    return kWhSize * 200;
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

  calculateWishedPpw(audit: number, dealerFeePercent: number, kWhSize: number) {
    return ((this.desiredKcms / 1000) + this.basePrice + (audit / (kWhSize * 1000))) / (1 - dealerFeePercent);
  }

  onIsLeadSetterChange(event: any) {
    console.log('onIsLeadSetterChange ', event);
    this.calculateLoans();
  }

  onIsFederalCreditChange(event: any) {
    console.log('onIsFederalCreditChange ', event);
    this.calculateLoans();
  }

  onIsNvRebateChange(event: any) {
    console.log('onIsNvRebateChange ', event);
    this.calculateLoans();
  }

  onBasePriceChange(event: any) {
    console.log('onBasePriceChange ', event);
    if (this.isOverrideBasePriceActive) {
      this.calculateLoans();
    }
  }

  onisOverrideBasePriceActiveChange(event: any) {
    console.log('onisOverrideBasePriceActiveChange ', event);
    this.calculateLoans();
  }

  onisOverridekWhSizeActiveChange(event: any) {
    console.log('onisOverridekWhSizeActiveChange ', event);
    this.calculateLoans();
  }

  onkWhSizeChange(event: any) {
    console.log('onkWhSizeChangeChange ', event);
    if (this.isOverridekWhSizeActive) {
      this.calculateLoans();
    }
  }

  calculateLoans() {
    this.bankLoans = this.bankLoans.map(bl => {
      bl.kWhSize = this.isOverridekWhSizeActive ? this.kWhSize : bl.kWhSize;
      bl.base = this.isOverrideBasePriceActive ? this.basePrice : bl.base;
      const netSystemPrice = this.calculateNetSystemPrice(bl.kWhSize, bl.ppw, bl.dealerFeePercent, bl.roofCost);
      const nvRebate = this.calculateNvRebate(bl.kWhSize);
      const federalTaxCredit = this.calculateFederalTaxCredit(netSystemPrice);
      const priceBeforeRoof = this.calculatePriceBeforeRoof(bl.kWhSize, bl.ppw);
      const dealerFee = this.calculateDealerFeeAmount(priceBeforeRoof, bl.dealerFeePercent);
      const totalAfterCredits = this.calculateTotalAfterCredit(nvRebate, federalTaxCredit, netSystemPrice);
      const cms = this.calculateCms(bl.kWhSize, bl.ppw, bl.base, dealerFee, bl.audit, bl.leadSetter);

      return <BankLoan>{
        loanType: bl.loanType,
        dealerFeePercent: bl.dealerFeePercent,
        interest: bl.interest,
        term: bl.term,
        kWhSize: bl.kWhSize,
        ppw: bl.ppw,
        base: bl.base,
        dealerCost: bl.dealerCost,
        audit: bl.audit,
        roofCost: bl.roofCost,
        leadSetter: this.calculateLeadSetter(bl.kWhSize),
        priceBeforeRoof: this.calculatePriceBeforeRoof(bl.kWhSize, bl.ppw),
        netSystemPrice,
        federalTaxCredit,
        nvRebate,
        totalAfterCredits,
        dealerFee,
        wishedPpw: this.calculateWishedPpw(bl.audit, bl.dealerFeePercent, bl.kWhSize),
        payment: this.calculatePayment2(bl.interest / 12, bl.term, totalAfterCredits, 0, 0),
        cms: cms,
        perKw: this.calculatePerKW(cms, bl.kWhSize)
      };
    });
  }
}
