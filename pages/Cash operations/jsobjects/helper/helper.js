export default {
  myVar1: [],
  myVar2: {},

  async setplaformname(name) {
     await storeValue('platformname', name);
		 CurrencyQuery.run();
		
		return 0;
    // this.myVar1 = [1, 2, 3]; // Example of setting variable
  },

  async fillwidthdrawalform() {
		
		result = "Widthdrawal to external account";
		WidthdrawalAmount.setValue(0);
		WidtdrawalFee.setValue(0);
    WidthdrawalDescription.setValue(result);
		return resultl
  }
}