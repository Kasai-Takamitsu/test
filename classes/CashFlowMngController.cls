public with sharing class CashFlowMngController {
  @AuraEnabled(cacheable=true)
  // public static List<CashFlowMng__c> searchCashFlowMngs(String fundCode, String fundName, Date standardDate) {
  //   String fundCodeSearchKey = '%' + fundCode + '%';
  //   String fundNameSearchKey = '%' + fundName + '%';
  //   Date standardDateSearchKey = standardDate;
  //   return [SELECT Id, FundCode__c, FundName__c, InvestmentFundCode__c, InvestmentFundName__c,
  //           CommitmentLine__c, CapitalCallTransfer__c, DistributionIncome__c, DistributionCapital__c, 
  //           CommitmentLineRemains__c, NotDeliveryTransferAmount__c, NotBalanceAfterDeliveryReflection__c
  //           FROM CashFlowMng__c 
  //           WHERE (FundCodeText__c LIKE :fundCodeSearchKey) AND (FundName__c LIKE :fundNameSearchKey) AND (TransferDate__c <= :standardDateSearchKey)
  //           ];
  // }
  public static list<CashFlowMng__c> searchCashFlowMngs(String fundCode, String fundName, Date standardDate){
    String fundCodeSearchKey = '%' + fundCode + '%';
    String fundNameSearchKey = '%' + fundName + '%';
    Date standardDateSearchKey = standardDate;
    list<CashFlowMng__c> lstCashFlowMng = new list<CashFlowMng__c>();
    for(CashFlowMng__c con : [SELECT Id, FundCode__c, FundName__c, InvestmentFundCode__c, InvestmentFundName__c,
    CommitmentLine__c, CapitalCallTransfer__c, DistributionIncome__c, DistributionCapital__c, 
    CommitmentLineRemains__c, NotDeliveryTransferAmount__c, NotBalanceAfterDeliveryReflection__c
    FROM CashFlowMng__c 
    WHERE (FundCodeText__c LIKE :fundCodeSearchKey) AND (FundName__c LIKE :fundNameSearchKey) AND (TransferDate__c <= :standardDateSearchKey) LIMIT 5000]){
      lstCashFlowMng.add(con);
    } 
    return lstCashFlowMng;
  }
}
