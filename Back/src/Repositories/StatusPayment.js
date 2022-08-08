module.exports = (status) => {
    if (status == 'paid') {
        return 101
    } else if (status == 'waiting_payment') {
        return 102;
    } else if (status == 'expired') {
        return 103;
    } else if (status == 'canceled') {
        return 104
    } else if (status == 'reversed') {
        return 105
    } else {
        return 400
    }
}