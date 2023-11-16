import { LightningElement, api, wire, track } from 'lwc';
import searchCashFlowMngs from '@salesforce/apex/CashFlowMngController1.searchCashFlowMngs';
import { CurrentPageReference } from "lightning/navigation";

const PAGE_SIZE = 200;

export default class CashFlowMngSearch extends LightningElement {
    @track data = [];
    // @track columns = columns;
    @track pageNumber = 1;
    @track isLoading = false;
    @track fundCode = '';
    @track fundName = '';
    @track standardDate = '';
    @track dateval;

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
        if(this.dateval === undefined){
            this.dateval = new Date().toISOString().substring(0, 10);
        }
        return this.dateval;
    }
    handleStandardDateChange(event) {
        this.dateval = event.target.value;
    }

    connectedCallback() {
        this.loadData();
    }

    search() {
        this.isLoading = true;
        searchCashFlowMngs({ fundCode: this.fundCode, fundName: this.fundName, standardDate: this.dateval, pageSize: PAGE_SIZE, pageNumber: this.pageNumber })
            .then(result => {
                this.data = [...this.data, ...result];
                this.isLoading = false;
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
                this.isLoading = false;
            });
    }

    loadData() {
        this.isLoading = true;
        searchCashFlowMngs({ fundCode: this.fundCode, fundName: this.fundName, standardDate: this.dateval, pageSize: PAGE_SIZE, pageNumber: this.pageNumber })
            .then(result => {
                this.data = [...this.data, ...result];
                this.isLoading = false;
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
                this.isLoading = false;
            });
    }

    handleLoadMore() {
        this.pageNumber++;
        this.loadData();
    }
    // CurrentPageReference を利用してパラメータを取得する。
    currentPageReference;

    @wire(CurrentPageReference)
    setCurrentPageReference(currentPageReference) {
        this.currentPageReference = currentPageReference;
        if (currentPageReference.state.c__fundCodeDefault === undefined) {
            this.fundCode = '';
        } else {
            this.fundCode = currentPageReference.state.c__fundCodeDefault;
        }
        if (currentPageReference.state.c__fundNameDefault === undefined) {
            this.fundName = '';
        } else {
            this.fundName = currentPageReference.state.c__fundNameDefault;
        }
    }

    // .state.c__fundCodeDefault とすることで、URLパラメータから値を受け取れる
    get fundCodeDefault() {
        return this.currentPageReference ? this.currentPageReference.state.c__fundCodeDefault : undefined;
    }
    get fundNameDefault() {
        return this.currentPageReference ? this.currentPageReference.state.c__fundNameDefault : undefined;
    }

}
