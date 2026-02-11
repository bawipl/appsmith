export default {
  // Generate options for duration select (1-24 months)
  getDurationOptions() {
    const options = [];
    for (let i = 1; i <= 24; i++) {
      options.push({
        label: i + ' month' + (i === 1 ? '' : 's'),
        value: i
      });
    }
    return options;
  },

  // Calculate end date based on start date and duration (in months)
  calculateEndDate(startDateStr, durationMonths) {
    if (!startDateStr || !durationMonths) {
      return null;
    }

    const startDate = new Date(startDateStr);
    if (isNaN(startDate.getTime())) {
      return null;
    }

    // Create new date to avoid modifying original
    const endDate = new Date(startDate);
    // Add months
    endDate.setMonth(endDate.getMonth() + parseInt(durationMonths));

    // Return ISO string format
    return endDate.toISOString();
  },

  // Calculate end date from widget values
  getCalculatedEndDate() {
    const startDate = startdate?.formattedValue || startdate?.selectedDate;
    const duration = duration_months?.selectedOptionValue;

    return this.calculateEndDate(startDate, duration);
  },

  // Format date for display
  formatDateDisplay(dateStr) {
    if (!dateStr) return 'Not calculated';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};
