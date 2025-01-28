export const parseDate = (formattedDate) => {
    console.log({ formattedDate })
    // Replace '-' with '/' to handle both formats
    const standardizedDate = formattedDate.replace(/-/g, '/');

    return standardizedDate;
};
