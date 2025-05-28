export default {
	async  getCurrentDate() {
   const currentDate = new Date().toISOString();
		return currentDate;
	},

	async  onMount() {
    const currentDate = await JSObject4.getCurrentDate(); // Run the query to get the current date
    startdate.setValue(currentDate); // Update the date field with the current date
		enddate.setValue(currentDate);
}
}