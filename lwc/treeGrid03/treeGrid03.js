import { LightningElement, track, wire } from 'lwc';
import fetchRecords from '@salesforce/apex/TreeGridController03.fetchRecords';
// import { CurrentPageReference } from "lightning/navigation";
// import { NavigationMixin } from "lightning/navigation";

const FILTER_ALL = 'All';
const headerFilter = [
    {label: FILTER_ALL, checked: true, name: FILTER_ALL},
     ...Array.from(
        {length: 100},
            (_, index) => (
                {label: (index + 1).toString().padStart(3, '0'),
                 checked: false,
                 name: (index + 1).toString().padStart(3, '0')
                }
            )
    )
];

export default class TreeGrid extends LightningElement {

    @track gridColumns = [
        {label: 'ファンドコード', fieldName: 'TransitionToCashFlowDelC' , type: 'url',
         typeAttributes: {label: {fieldName: 'fundTreeName'}, target: "_blank"},
         actions: headerFilter
        },
        {label: 'ファンド名', fieldName: 'fundNameC', type: 'text'},
        {label: '投資ファンドコード', fieldName: 'TransitionToPortfolioDelC', type: 'url', typeAttributes: { label: { fieldName: 'invFundTreeName'}, target: "_blank"}},
        {label: '投資ファンド名', fieldName: 'investmentFundNameC', type: 'text'},
        {label: '銘柄コード', fieldName: 'brdTreeName', type: 'text'},
        {label: '銘柄名', fieldName: 'brandNameC', type: 'text'}
    ];

    @track gridData;
    fundFilter = FILTER_ALL;
    @track allRows; 
    @track error;

    @wire(fetchRecords)
    TreeGridData({ error, data }) {
        if ( data ) {
            let tempData = JSON.parse( JSON.stringify(data) );

            tempData.forEach((o) => {
                let invFndList = o.invFndList;
                if(invFndList && invFndList.length != 0 ){
                    o._children = invFndList;
                    delete o.invFndList;

                    invFndList.forEach((p) => {
                        let brdList = p.brdList;
                        if(brdList && brdList.length != 0 ){
                            p._children = brdList;
                            delete p.brdList;
                        }
                    });
                }

                // 相対パスURLに、パラメータを渡す
                // o.TransitionToCashFlowDelC = o.TransitionToCashFlowDelC + '?c__viewType=world';
                // o.TransitionToCashFlowDelC = o.TransitionToCashFlowDelC +  '?c__fundCodeDefault=' + o.fundTreeName;
                o.TransitionToCashFlowDelC = o.TransitionToCashFlowDelC +  '?c__fundDefault=' + o.Id;
            });
            
            this.gridData = tempData;
            this.allRows = tempData;

        } else if( error ){
            console.log('error:'+error);
            this.error = error;
        }
    }

    handleHeaderAction( event ) {
        const actionName = event.detail.action.name;
        let columns = [...this.gridColumns];
        if (actionName !== this.fundFilter) {
            columns[0].actions.forEach( (action) => {
                action.checked = (action.name === actionName);
            });
            this.fundFilter = actionName;
            this.gridColumns = columns;
            this.updateRows();
        }
    }

    updateRows() {
        const rows = this.allRows;
        // this.fundFilter === FILTER_ALL が true の場合、? の右隣 rows のまま代入、
        // this.fundFilter === FILTER_ALL が false の場合、: の右隣の結果を代入
        // [...rows] を使用することで、rowsの中身を変更せず、filterの結果を返す(rowsはconstなので変更できない)
        this.gridData = this.fundFilter === FILTER_ALL ? rows : [...rows].filter( (row) => this.fundFilter === row.fundTreeName );
    }

    // // CurrentPageReference を利用してパラメータを取得する。
    // currentPageReference;

    // @wire(CurrentPageReference)
    // setCurrentPageReference(currentPageReference) {
    //     this.currentPageReference = currentPageReference;
    // }

    // // .state.c__viewType とすることで、URLパラメータから値を受け取れる
    // get viewType() {
    //     return this.currentPageReference ? this.currentPageReference.state.c__viewType : undefined;
    // }

}