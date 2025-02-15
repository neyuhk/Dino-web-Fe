export const compactNumber = (number: never) => {
    const suffixes = ['', 'nghìn', 'triêu', 'tỷ', 't']

    const suffixMax = Math.floor(('' + number).length / 3)

    let shortValue = parseFloat(
        (suffixMax != 0 ? (number / Math.pow(1000, suffixMax)) : number).toPrecision(2),
    )

    if (shortValue % 1 != 0) {
        // @ts-ignore
        shortValue = shortValue.toFixed(1)
    }

    return shortValue + ' ' + suffixes[suffixMax]
}