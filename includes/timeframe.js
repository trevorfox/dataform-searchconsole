function timeframer(defaultOffset){
    return function(duration, delay, offset){
        offset = offset || defaultOffset;
        return {
            start: `current_date() - interval ${duration} day - interval ${delay} day - interval ${offset} day`,
            end: `current_date() -1 + - interval ${delay} day - interval ${offset} day`,
        }
    }
}

module.exports = { timeframer }