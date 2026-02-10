export default {
  // Format balance based on currency
  formatBalance(balance, currency) {
    if (balance === null || balance === undefined) return '0';
    const upperCurrency = (currency || '').toUpperCase();
    // 8 decimals for BTC and ETH, 2 for the rest
    const decimals = (upperCurrency === 'BTC' || upperCurrency === 'ETH') ? 8 : 2;
    return Number(balance).toFixed(decimals);
  },

  // Extract just the currency shortcode from a label like "100.00 USDT (ETH)" or "USDT (ETH)"
  extractCurrencyShortcode(label) {
    if (!label) return '?';
    // If label contains a number at the start (balance format), extract currency after it
    // Format: "100.00 USDT (ETH)" -> "USDT"
    // Format: "USDT (ETH)" -> "USDT"
    const parts = label.trim().split(' ');
    if (parts.length >= 2) {
      // Check if first part is a number (balance)
      if (!isNaN(parseFloat(parts[0]))) {
        // Balance format: "100.00 USDT (ETH)"
        return parts[1];
      } else {
        // Simple format: "USDT (ETH)" or just "USDT"
        return parts[0].replace(/\(.*\)/, '').trim();
      }
    }
    return label.split('(')[0].trim();
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
    // Also refresh Owner2's all balances
    if (Owner2Select.selectedOptionValue) {
      await Owner2AllBalances.run();
    }
  },

  // Refresh Owner2's all balances when owner2 changes
  async refreshOwner2AllBalances() {
    if (Owner2Select.selectedOptionValue) {
      await Owner2AllBalances.run();
    }
  },

  // Get formatted currency options for Owner1 with balances
  getCurrency1Options() {
    const balances = Owner1BalanceQuery.data;
    // Handle case where data is not an array or is empty
    if (!Array.isArray(balances) || balances.length === 0) {
      const currencies = CurrenciesQuery.data;
      if (!Array.isArray(currencies)) return [];
      return currencies.map(obj => ({
        label: obj.shortcode + ' (' + (obj.blockchain || '') + ')',
        value: obj.ID
      }));
    }
    return balances.map(b => {
      const decimals = (b.currency === 'BTC' || b.currency === 'ETH') ? 8 : 2;
      const formattedBalance = Number(b.balance).toFixed(decimals);
      return {
        label: b.currency + ' ' + formattedBalance +   ' (' + (b.blockchain || '') + ')',
        value: b.currency_id
      };
    });
  },

  // Get formatted currency options for Owner2 with balances
  getCurrency2Options() {
    const balances = Owner2BalanceQuery.data;
    // Handle case where data is not an array or is empty
    if (!Array.isArray(balances) || balances.length === 0) {
      const currencies = CurrenciesQuery.data;
      if (!Array.isArray(currencies)) return [];
      return currencies.map(obj => ({
        label: obj.shortcode + ' (' + (obj.blockchain || '') + ')',
        value: obj.ID
      }));
    }
    return balances.map(b => {
      const decimals = (b.currency === 'BTC' || b.currency === 'ETH') ? 8 : 2;
      const formattedBalance = Number(b.balance).toFixed(decimals);
      return {
        label: formattedBalance + ' ' + b.currency + ' (' + (b.blockchain || '') + ')',
        value: b.currency_id
      };
    });
  },

  // Get Owner2's all balances grouped by platform for table display
  // Format: Platform | Currencies (clickable)
  // binance | USD(100),USDT(2000),BTC(0.134)
  getOwner2AllBalancesGrouped() {
    const data = Owner2AllBalances.data;
    if (!Array.isArray(data) || data.length === 0) return [];
    
    // Group by platform
    const grouped = {};
    data.forEach(row => {
      const platformKey = row.platform_id + '|' + row.platform;
      if (!grouped[platformKey]) {
        grouped[platformKey] = {
          platform_id: row.platform_id,
          platform: row.platform,
          currencies: []
        };
      }
      const decimals = (row.currency === 'BTC' || row.currency === 'ETH') ? 8 : 2;
      const formattedBalance = Number(row.balance).toFixed(decimals);
      grouped[platformKey].currencies.push({
        currency_id: row.currency_id,
        currency: row.currency,
        balance: formattedBalance,
        display: row.currency + '(' + formattedBalance + ')'
      });
    });
    
    // Convert to array format for table
    return Object.values(grouped).map(g => ({
      platform_id: g.platform_id,
      platform: g.platform,
      currencies: g.currencies.map(c => c.display).join(', '),
      currencyData: JSON.stringify(g.currencies) // Store raw data for click handling
    }));
  },

  // Handle click on a currency in the balances table
  async onBalanceClick(platformId, platformName, currencyId) {
    // Set Platform2Select value using storeValue
    await storeValue('platform2Selection', platformId);
    // Refresh currency options for the new platform
    await Owner2BalanceQuery.run();
    // Set Currency2Select value using storeValue
    await storeValue('currency2Selection', currencyId);
  },

  // Get swap summary text - now using just currency shortcodes
  getSwapSummary() {
    const owner1 = Owner1Select.selectedOptionLabel || '?';
    const owner2 = Owner2Select.selectedOptionLabel || '?';
    const amount1 = Amount1Input.text || '0';
    const amount2 = Amount2Input.text || '0';
		const platform1 = Platform1Select.selectedOptionLabel || '?';
    const platform2 = Platform2Select.selectedOptionLabel || '?';

    // Extract just the currency shortcode from the full label
    const currency1Full = Currency1Select.selectedOptionLabel || '?';
    const currency2Full = Currency2Select.selectedOptionLabel || '?';
    const currency1 = this.extractCurrencyShortcode(currency1Full);
    const currency2 = this.extractCurrencyShortcode(currency2Full);
    
    if (!Owner1Select.selectedOptionValue || !Owner2Select.selectedOptionValue) {
      return 'Select both owners to see swap summary';
    }
    
    // Calculate exchange rate
    let rateInfo = '';
    const amt1 = parseFloat(amount1) || 0;
    const amt2 = parseFloat(amount2) || 0;
    if (amt1 > 0 && amt2 > 0) {
      const rate = (amt2 / amt1).toFixed(8);
      rateInfo = '\n📊 Rate: 1 ' + currency1 + ' = ' + rate + ' ' + currency2;
    }
    
    return '📤 ' + owner1 + ' sends ' + amount1 + ' ' + currency1 +' on '+ platform1+ ' ' + '\n📥 ' + owner2 + ' sends ' + amount2 + ' ' + currency2 +' on '+ platform2+ ' '+ rateInfo;
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
