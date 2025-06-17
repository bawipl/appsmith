export default {
  toggleCounterpartyFilter: () => {
    const rowIndex = Contracts.triggeredRowIndex;
    const selectedRow = LendAll.data[rowIndex];
    const selectedCounterparty = selectedRow.counterparty;

    // If already filtered by this counterparty, clear the filter
    if (appsmith.store.activeFilter ) {
      storeValue("filteredContracts", undefined);
      storeValue("activeFilter", undefined);
    } else {
      const filtered = LendAll.data.filter(
        (row) => row.counterparty === selectedCounterparty
      );
      storeValue("filteredContracts", filtered);
      storeValue("activeFilter", selectedCounterparty);
    }
  }
}
