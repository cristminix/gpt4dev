export const toLocaleDateString = (date) => {
    date = new Date(date);
    return date.toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short', monthStyle: 'short' }).replace("/" + date.getFullYear(), "");
};
