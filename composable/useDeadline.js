
export function useDeadline() {
  const formatDate = (date) => {
    if (!date) return "";
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return date.toLocaleDateString("nl-NL", options);
  };

  const deadline = computed(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    let nextMonth = currentMonth + 1;
    let year = today.getFullYear();

    // Reset naar januari en + als het december is
    if (nextMonth === 12) {
      nextMonth = 0; // Reset naar Januari
      year++;
    }

    // The deadline is the 25th of the next month
    return new Date(year, nextMonth, 25); // Set the date to the 25th
  });

  const isDeadlinePassed = computed(() => {
    const today = new Date();
    // Set the deadline to the 25th of the current month
    const currentDeadline = new Date(today.getFullYear(), today.getMonth(), 25);
    return today > currentDeadline;
  });

  return {
    isDeadlinePassed,
    formattedDeadline: computed(() => formatDate(deadline.value)),
}}
