export default {
	
	async repaymentstring () {
  const total = TotalPayout.data[0]?.total_payout || 0;
  const expected = Contracts.selectedRow?.amountend || 0;
  const diff = expected - total;

  return diff === 0
    ? "Contract fully repaid"
    : `Remaining to be repaid: ${diff}`;
   },
	
	async setClosedate () {
		CloseDatePicker.setValue(moment())
	}
}