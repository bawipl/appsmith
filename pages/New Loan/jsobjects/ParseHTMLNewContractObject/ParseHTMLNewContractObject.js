export default {
/**
 * Takes an HTML string containing the JSON (under "{"contract":{...}}"),
 * extracts the JSON data, and builds an INSERT statement for "hodlhodllend".
 */
generateHodlHodlInsert() {
  // 1. Extract JSON substring. For simplicity, assume the JSON starts at '{"contract":'
  //    and ends at the matching '}}' near the end. You may need to refine this regex
  //    if the HTML structure changes.
	const htmlString = WEBPAGEINPUT.text;
  const jsonMatch = htmlString.match(/\{\"contract\"\:.*\}\}/s);
  if (!jsonMatch) {
    throw new Error("Could not find JSON in the provided HTML.");
  }

  // 2. Parse extracted JSON
  let parsed;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch (err) {
    throw new Error("Error parsing JSON: " + err.message);
  }

  const contract = parsed.contract;
  // Grab the fields we need
	
  const _Counterparty = contract.counterparty_login || contract.borrower_login || "";
  const contractValue = contract.contract_value || "0";
	const _currency = contract.currency_code + contract.blockchain[0];
  const toBeRepaid = contract.to_be_repaid || "0";
  const hashedId = contract.hashed_id || "";
  const createdAt = contract.created_at ? contract.created_at.slice(0, 10) : "2025-01-01";
  const expiresAt = contract.expires_at ? contract.expires_at.slice(0, 10) : "2026-01-01";
  const interestRate = contract.interest_rate ? Number(contract.interest_rate) * 100 : 0; // 0.2 => 20
  const borrowerRefundAddress = contract.borrower_refund_address || "";
  const status = contract.status || "in_progress";
  const isFinished = (status.toLowerCase() === "completed" || status.toLowerCase() === "canceled");
  const owner = contract.lender_login || ""; // might need to truncate to fit character(4)
  
	counterparty.setValue(_Counterparty);
	
  const record = counterparties.data.find(row => row.counterparty === _Counterparty);
  const _contact = record ? record.contact : null;


	contact.setValue(_contact);
	currency.setSelectedOption(_currency);
	amountstart.setValue(contractValue);
	amountend.setValue(toBeRepaid);
	lendcontractID.setValue(hashedId);
	startdate.setValue(createdAt);
	enddate.setValue(expiresAt);
	APR.setValue(interestRate);
	plaform.setSelectedOption('hodlhodl');
	contractdata.setValue('');
	

}
}