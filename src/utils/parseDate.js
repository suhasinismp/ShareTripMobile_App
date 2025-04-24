export const parseDate = (formattedDate) => {

    if (formattedDate) {
        const standardizedDate = formattedDate.replace(/-/g, '/');

        return standardizedDate;
    }
    else {
        const date = new Date();
        const formattedDate = date.toLocaleDateString('en-CA');
        const standardizedDate = formattedDate.replace(/-/g, '/');
        return standardizedDate;

    }
    // Replace '-' with '/' to handle both formats
};


