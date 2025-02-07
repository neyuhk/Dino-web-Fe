export const formatPhoneNumber = (phone: never) => {
    const cleaned = ('' + phone).replace(/\D/g, '')

    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
    } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
    } else {
        return phone
    }
}