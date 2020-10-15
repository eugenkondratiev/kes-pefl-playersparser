module.exports = (arr, key) => {
    const _initObj = {}
    return arr.reduce((result, element, index) => {
        result[element[key]] = element;
        return result
    }, _initObj);
}
