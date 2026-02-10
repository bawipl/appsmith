export default {
  // Format balance based on currency
  formatBalance(balance, currency) {
    if (balance === null || balance === undefined) return '0';
    const upperCurrency = (currency || '').toUpperCase();
    // 8 decimals for BTC and ETH, 2 for the rest
    const decimals = (upperCurrency === 'BTC' || upperCurrency === 'ETH') ? 8 : 2;
    return Number(balance).toFixed(decimals);
  },

  // Refresh Owner1 balance when owner or platform changes
  async refreshOwner1Balance() {
    if (Owner1Select.selectedOptionValue && Platform1Select.selectedOptionValue) {
      await Owner1BalanceQuery.run();
    }
  },

  // Refresh Owner2 balance when owner or platform changes
  async refreshOwner2Balance() {
    if (Owner2Select.selectedOptionValue && Platform2Select.selectedOptionValue) {
      await Owner2BalanceQuery.run();
    }
  },

  // Get formatted currency options for Owner1 with balances
  getCurrency1Options() {
    const balances = Owner1BalanceQuery.data || [];
    if (balances.length === 0) {
      return CurrenciesQuery.data?.map(obj => ({
        label: obj.shortcode + ' (' + obj.blockchain + ')',
        value: obj.ID
      })) || [];
    }
    return balances.map(b => {
      const decimals = (b.currency === 'BTC' || b.currency === 'ETH') ? 8 : 2;
      const formattedBalance = Number(b.balance).toFixed(decimals);
      return {
        label: formattedBalance + ' ' + b.currency + ' (' + (CurrenciesQuery.data?.find(c => c.ID === b.currency_id)?.blockchain || '') + ')',
        value: b.currency_id
      };
    });
  },

  // Get formatted currency options for Owner2 with balances
  getCurrency2Options() {
    const balances = Owner2BalanceQuery.data || [];
    if (balances.length === 0) {
      return CurrenciesQuery.data?.map(obj => ({
        label: obj.shortcode + ' (' + obj.blockchain + ')',
        value: obj.ID
      })) || [];
    }
    return balances.map(b => {
      const decimals = (b.currency === 'BTC' || b.currency === 'ETH') ? 8 : 2;
      const formattedBalance = Number(b.balance).toFixed(decimals);
      return {
        label: formattedBalance + ' ' + b.currency + ' (' + (CurrenciesQuery.data?.find(c => c.ID === b.currency_id)?.blockchain || '') + ')',
        value: b.currency_id
      };
    });
  },

  // Get swap summary text
  getSwapSummary() {
    const owner1 = Owner1Select.selectedOptionLabel || '?';
    const owner2 = Owner2Select.selectedOptionLabel || '?';
    const amount1 = Amount1Input.text || '0';
    const amount2 = Amount2Input.text || '0';
    const currency1 = Currency1Select.selectedOptionLabel || '?';
    const currency2 = Currency2Select.selectedOptionLabel || '?';
    
    if (!Owner1Select.selectedOptionValue || !Owner2Select.selectedOptionValue) {
      return 'Select both owners to see swap summary';
    }
    
    return `📤 ${owner1} sends ${amount1} ${currency1}\n📥 ${owner2} sends ${amount2} ${currency2}`;
  },

  // Validate and execute swap
  async executeSwapWithValidation() {
    // Validation
    if (!Owner1Select.selectedOptionValue) {
      showAlert('Please select Owner 1', 'error');
      return;
    }
    if (!Owner2Select.selectedOptionValue) {
      showAlert('Please select Owner 2', 'error');
      return;
    }
    if (Owner1Select.selectedOptionValue === Owner2Select.selectedOptionValue) {
      showAlert('Owner 1 and Owner 2 cannot be the same', 'error');
      return;
    }
    if (!Platform1Select.selectedOptionValue) {
      showAlert('Please select Platform for Leg 1', 'error');
      return;
    }
    if (!Platform2Select.selectedOptionValue) {
      showAlert('Please select Platform for Leg 2', 'error');
      return;
    }
    if (!Currency1Select.selectedOptionValue) {
      showAlert('Please select Currency for Leg 1', 'error');
      return;
    }
    if (!Currency2Select.selectedOptionValue) {
      showAlert('Please select Currency for Leg 2', 'error');
      return;
    }
    if (!Amount1Input.text || Number(Amount1Input.text) <= 0) {
      showAlert('Please enter a valid amount for Leg 1', 'error');
      return;
    }
    if (!Amount2Input.text || Number(Amount2Input.text) <= 0) {
      showAlert('Please enter a valid amount for Leg 2', 'error');
      return;
    }

    try {
      await ExecuteSwap.run();
      showAlert('Swap executed successfully!', 'success');
      // Refresh data
      await RecentSwapsQuery.run();
      await this.refreshOwner1Balance();
      await this.refreshOwner2Balance();
    } catch (error) {
      showAlert('Swap failed: ' + error.message, 'error');
    }
  }
}
