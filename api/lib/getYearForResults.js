const getYearForResults = () => {
    // get the current year and add a 1 to it if the month is october or later
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    return currentMonth >= 9 ? currentYear + 1 : currentYear;
};

export { getYearForResults };
