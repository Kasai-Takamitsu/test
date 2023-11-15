import { LightningElement, api, wire, track } from 'lwc';
import searchCashFlowMngs from '@salesforce/apex/CashFlowMngController.searchCashFlowMngs';
import { CurrentPageReference } from "lightning/navigation";

export default class CashFlowMngSearch extends LightningElement {
    @track fundCode = '';
    @track fundName = '';
    @track standardDate = '';
    @track dateval;
    @track cashFlowMngs = [];
    records = []; //All records available in the data table
    columns = []; //columns information available in the data table
    totalRecords = 0; //Total no.of records
    pageSize; //No.of records to be displayed per page
    totalPages; //Total no.of pages
    pageNumber = 1; //Page number    
    recordsToDisplay = []; //Records to be displayed on the page


    columns = [
      { label: 'ファンドコード', fieldName: 'FundCode__c', type: 'text' },
      { label: 'ファンド名', fieldName: 'FundName__c', type: 'text' },
      { label: '投資ファンドコード', fieldName: 'InvestmentFundCode__c', type: 'text' },
      { label: '投資ファンド名', fieldName: 'InvestmentFundName__c', type: 'text' },
      { label: 'コミットメントライン', fieldName: 'CommitmentLine__c', type: 'currency' },
      { label: '累積キャピタルコール', fieldName: 'CapitalCallTransfer__c', type: 'currency' },
      { label: '累積分配（income）', fieldName: 'DistributionIncome__c', type: 'currency' },
      { label: '累積分配（capital）', fieldName: 'DistributionCapital__c', type: 'currency' },
      { label: 'コミットメントライン残額', fieldName: 'CommitmentLineRemains__c', type: 'currency' },
      { label: '未受渡異動額', fieldName: 'NotDeliveryTransferAmount__c', type: 'currency' },
      { label: '未受渡反映後残高', fieldName: 'NotBalanceAfterDeliveryReflection__c', type: 'currency' }
    ];

    handleFundCodeChange(event) {
        this.fundCode = event.target.value;
    }

    handleFundNameChange(event) {
        this.fundName = event.target.value;
    }

    get dateValue(){
        if(this.dateval == undefined){
            this.dateval = new Date().toISOString().substring(0, 10);
        }
        return this.dateval;
    }
    handleStandardDateChange(event) {
        this.dateval = event.target.value;
    }

    /**
     * 最初のページか判定
     */
    get bDisableFirst() {
        return this.pageNumber == 1;
    }

    /**
     * 最後のページか判定
     */
    get bDisableLast() {
        return this.pageNumber == this.totalPages;
    }

    searchCashFlowMngs() {
        // fetch contact records from apex method 
        searchCashFlowMngs({ fundCode: this.fundCode, fundName: this.fundName, standardDate: this.dateval })
            .then((result) => {
                if (result != null) {
                    console.log('RESULT--> ' + JSON.stringify(result));
                    this.records = result;
                    this.totalRecords = result.length; // update total records count                 
                    this.pageSize = 20; //set pageSize with default value as first option
                    this.paginationHelper(); // call helper menthod to update pagination logic 
                }
            })
            .catch((error) => {
                console.log('error while search CashFlowMngs--> ' + JSON.stringify(error));
            });
    }

    // searchCashFlowMngs() {
    //     // Apexコントローラのメソッドを呼び出し、検索条件を渡す
    //     searchCashFlowMngs({ fundCode: this.fundCode, fundName: this.fundName, standardDate: this.dateval })
    //     .then(result => {
    //             this.allItems = result;
    //             this.totalRecount = this.allItems.length;
    //             // 総ページ数を取得
    //             this.totalPage = Math.ceil(this.totalRecount / this.showSize);
    //             // 最初のページに表示するレコードを取得
    //             this.cashFlowMngs = this.allItems.slice(0, this.showSize);
    //             this.endRecord = this.showSize;
    //             this.startRecord += 1;
    //             this.page += 1;
    //         // }
    //     })
    //     .catch(error => {
    //         console.error(error);
    //     });
    // }

    previousPage() {
        this.pageNumber = this.pageNumber - 1;
        this.paginationHelper();
    }

    nextPage() {
        this.pageNumber = this.pageNumber + 1;
        this.paginationHelper();
    }

    firstPage() {
        this.pageNumber = 1;
        this.paginationHelper();
    }

    lastPage() {
        this.pageNumber = this.totalPages;
        this.paginationHelper();
    }

    /**
     * ページ変更時の処理
     */
    // JS function to handel pagination logic 
    paginationHelper() {
        this.recordsToDisplay = [];
        // calculate total pages
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        // set page number 
        if (this.pageNumber <= 1) {
            this.pageNumber = 1;
        } else if (this.pageNumber >= this.totalPages) {
            this.pageNumber = this.totalPages;
        }

        // set records to display on current page 
        for (let i = (this.pageNumber - 1) * this.pageSize; i < this.pageNumber * this.pageSize; i++) {
            if (i === this.totalRecords) {
                break;
            }
            this.recordsToDisplay.push(this.records[i]);
        }
    }

    // CurrentPageReference を利用してパラメータを取得する。
    currentPageReference;

    @wire(CurrentPageReference)
    setCurrentPageReference(currentPageReference) {
        this.currentPageReference = currentPageReference;
    }

    // .state.c__fundCodeDefault とすることで、URLパラメータから値を受け取れる
    get fundCodeDefault() {
        return this.currentPageReference ? this.currentPageReference.state.c__fundCodeDefault : undefined;
    }
    get fundNameDefault() {
        return this.currentPageReference ? this.currentPageReference.state.c__fundNameDefault : undefined;
    }

}
