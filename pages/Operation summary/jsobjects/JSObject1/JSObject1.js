export default {
	myVar1: [],
	myVar2: {},
	async myFun1 () {
		//	write code here
		//	this.myVar1 = [1,2,3]

		await Owner.setSelectedOption(appsmith.store.owner);
		await OperationsQuery.run();

		return Owner.selectedOptionValue + 'dup3a' + appsmith.store.owner

	},
	async myFun2 () {
		//	use async-await or promises
		//	await storeValue('varName', 'hello world')
	}
}