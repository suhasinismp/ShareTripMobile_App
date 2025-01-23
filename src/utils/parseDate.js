export const parseDate = (formattedDate) => {

    // Replace '-' with '/' to handle both formats
    const standardizedDate = formattedDate.replace(/-/g, '/');

    return standardizedDate;
};
