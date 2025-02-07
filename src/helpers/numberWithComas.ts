export const numberWithComas = (number: any, comas: any) => {
    return number
        .toString()
        .replace(
            /\B(?=(\d{3})+(?!\d))/g,
            comas,
        )
}