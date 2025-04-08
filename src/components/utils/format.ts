const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    let videoId = '';
    const watchRegex = /youtube\.com\/watch\?v=([^&]+)/;
    const shortRegex = /youtu\.be\/([^?]+)/;
    const embedRegex = /youtube\.com\/embed\/([^?]+)/;

    const watchMatch = url.match(watchRegex);
    const shortMatch = url.match(shortRegex);
    const embedMatch = url.match(embedRegex);

    if (watchMatch && watchMatch[1]) {
        videoId = watchMatch[1];
    } else if (shortMatch && shortMatch[1]) {
        videoId = shortMatch[1];
    } else if (embedMatch && embedMatch[1]) {
        videoId = embedMatch[1];
    } else {
        return url;
    }
    return `https://www.youtube.com/embed/${videoId}`;
};
