export const convertDateTime = (str: string | number | Date | null) => {
    if (str === null) {
        return ''
    } else {
        const dateObject = new Date(str)
        let dayString = ''
        let monthString = ''
        let hourString = ''
        let minuteString = ''
        let secondString = ''

        const year = dateObject.getFullYear()
        const month = dateObject.getMonth() + 1
        if (1 <= month && month <= 9) {
            monthString = `0${month}`
        } else {
            monthString = `${month}`
        }

        const day = dateObject.getDate()
        if (1 <= day && day <= 9) {
            dayString = `0${day}`
        } else {
            dayString = `${day}`
        }
        const hours = dateObject.getHours()

        if (0 <= hours && hours <= 9) {
            hourString = `0${hours}`
        } else {
            hourString = `${hours}`
        }
        const minutes = dateObject.getMinutes()
        if (0 <= minutes && minutes <= 9) {
            minuteString = `0${minutes}`
        } else {
            minuteString = `${minutes}`
        }
        const seconds = dateObject.getSeconds()
        if (0 <= seconds && seconds <= 9) {
            secondString = `0${seconds}`
        } else {
            secondString = `${seconds}`
        }

        return `${dayString}/${monthString}/${year} - ${hourString}:${minuteString}:${secondString}`
    }
}

export const convertDateTimeToDate = (str: string | number | Date | null) => {
    if (str === null) {
        return ''
    } else {
        const dateObject = new Date(str)
        let dayString = ''
        let monthString = ''

        const year = dateObject.getFullYear()
        const month = dateObject.getMonth() + 1
        if (1 <= month && month <= 9) {
            monthString = `0${month}`
        } else {
            monthString = `${month}`
        }

        const day = dateObject.getDate()
        if (1 <= day && day <= 9) {
            dayString = `0${day}`
        } else {
            dayString = `${day}`
        }
        const hours = dateObject.getHours()

        return `${dayString}/${monthString}/${year}`
    }
}
export const convertDateTimeToDate2 = (str: string | number | Date | null) => {
    if (str === null) {
        return ''
    } else {
        const dateObject = new Date(str)
        let dayString = ''
        let monthString = ''

        const year = dateObject.getFullYear()
        const month = dateObject.getMonth() + 1
        if (1 <= month && month <= 9) {
            monthString = `0${month}`
        } else {
            monthString = `${month}`
        }

        const day = dateObject.getDate()
        if (1 <= day && day <= 9) {
            dayString = `0${day}`
        } else {
            dayString = `${day}`
        }
        const hours = dateObject.getHours()

        return `${year}-${monthString}-${dayString}`
    }
}
