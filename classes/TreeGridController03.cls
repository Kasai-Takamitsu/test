public with sharing class TreeGridController03 {
    @AuraEnabled(cacheable=true)
    public static List<FundTreeWrapper> fetchRecords() {

        List<FundTree__c> fndTrList = [SELECT Id, Name, FundName__c, TransitionToCashFlow_del__c, (SELECT Id, Name, InvestmentFundName__c, TransitionToPortfolio_del__c FROM InvestmentFundTrees__r ORDER BY  Name) FROM FundTree__c ORDER BY  Name];
        Map<Id, InvestmentFundTree__c> InvFndTrMap = new Map<Id, InvestmentFundTree__c>([SELECT Id, Name, InvestmentFundName__c, TransitionToPortfolio_del__c, (SELECT Id, Name, BrandName__c FROM BrandTrees__r ORDER BY  Name) FROM InvestmentFundTree__c ORDER BY  Name]);
        Map<Id, BrandTree__c> brdMap = new Map<Id, BrandTree__c>([SELECT Id, Name, BrandName__c, InvestmentFundTree__c FROM BrandTree__c ORDER BY  Name]);

        List<FundTreeWrapper> fndTrWpList = new List<FundTreeWrapper>();
        for(FundTree__c ft : fndTrList){
            FundTreeWrapper ftWp = new FundTreeWrapper();
            ftWp.Id = ft.Id;
            ftWp.fundTreeName = ft.Name;
            ftWp.fundNameC = ft.FundName__c;
            ftWp.TransitionToCashFlowDelC = ft.TransitionToCashFlow_del__c;
            
            List<InvestmentFundTreeWrapper> invFtWpList = new List<InvestmentFundTreeWrapper>();
            for(InvestmentFundTree__c invFt : ft.InvestmentFundTrees__r){
                InvestmentFundTreeWrapper invFtWp = new InvestmentFundTreeWrapper();
                invFtWp.Id = invFt.Id;
                invFtWp.invFundTreeName = invFt.Name;
                invFtWp.investmentFundNameC = invFt.InvestmentFundName__c;
                invFtWp.TransitionToPortfolioDelC = invFt.TransitionToPortfolio_del__c;

                List<BrandTreeWrapper> brTWpList = new List<BrandTreeWrapper>();
                for(BrandTree__c brT : InvFndTrMap.get(invFt.Id).BrandTrees__r){
                    BrandTreeWrapper brTWp = new BrandTreeWrapper();
                    brTWp.Id = brT.Id;
                    brTWp.brdTreeName = brT.Name;
                    brTWp.brandNameC = brT.BrandName__c;
                    brTWpList.add(brTWp);
                }

                invFtWp.brdList = brTWpList;
                invFtWpList.add(invFtWp);
            }

            ftWp.invFndList = invFtWpList;
            fndTrWpList.add(ftWp);
        }

        return fndTrWpList;
    }

    public Class FundTreeWrapper {
        @AuraEnabled
        public Id Id {get;set;}

        @AuraEnabled
        public String fundTreeName {get;set;}

        @AuraEnabled
        public String fundNameC {get;set;}

        @AuraEnabled
        public String TransitionToCashFlowDelC {get;set;}

        @AuraEnabled
        public List<InvestmentFundTreeWrapper> invFndList {get;set;}
    }

    public Class InvestmentFundTreeWrapper {
        @AuraEnabled
        public Id Id {get;set;}

        @AuraEnabled
        public String invFundTreeName {get;set;}

        @AuraEnabled
        public String investmentFundNameC {get;set;}

        @AuraEnabled
        public String TransitionToPortfolioDelC {get;set;}

        @AuraEnabled
        public List<BrandTreeWrapper> brdList {get;set;}
    }

    public Class BrandTreeWrapper{
        @AuraEnabled
        public Id Id {get;set;}

        @AuraEnabled
        public String brdTreeName {get;set;}

        @AuraEnabled
        public String brandNameC {get;set;}
    }

}
