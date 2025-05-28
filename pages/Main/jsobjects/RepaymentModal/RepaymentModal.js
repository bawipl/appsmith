export default {
	FullRepaimentBtnClick () {
		//	write code here
		PaybackAmount.setValue( Contracts.selectedRow.amountend);
	},
		ClearAmount () {
		//	write code here
		PaybackAmount.setValue( '');
	}
}