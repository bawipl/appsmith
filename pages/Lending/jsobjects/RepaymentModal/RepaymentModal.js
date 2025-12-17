export default {
	FullRepaimentBtnClick () {
		//	write code here
		PaybackAmount.setValue( Contracts.selectedRow.amountend- TotalPayout.data[0].total_payout);
	},
		ClearAmount () {
		//	write code here
		PaybackAmount.setValue( '');
	}
}