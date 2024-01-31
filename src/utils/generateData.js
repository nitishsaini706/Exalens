// src/utils/mockDataFetch.js
export const mockDataFetch = (startDate, endDate) => {
    const data = [];
    let date = new Date(startDate.getTime());

    while (date <= endDate) {
        data.push({
            date: new Date(date),
            value: Math.random() * 100 // Random value between 0 and 100
        });
        date.setDate(date.getDate() + 1);
    }

    return data;
};
