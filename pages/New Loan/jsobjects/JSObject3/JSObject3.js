export default {
	amountstartonTextChanged () {
		// Convert date fields to actual Date objects,
		// then calculate day difference as (end - start) / (1000*60*60*24).
		const start = new Date(startdate.selectedDate);
		const end = new Date(enddate.selectedDate);
		const dayDiff = (end - start) / (1000 * 60 * 60 * 24);
		amountend.setValue(
  parseFloat(amountstart.text) + parseFloat(amountstart.text) * (parseFloat(APR.text) / 100) * (parseFloat(dayDiff) / 365)
);

	}
}