export const cleanHTML = (response) => {
    try {
        if (!response) {
            return '<html><body><p>No content available</p></body></html>';
        }

        const htmlContent = response.html || response;

        if (typeof htmlContent !== 'string') {
            return '<html><body><p>Invalid content format</p></body></html>';
        }

        return htmlContent
            .replace(/\\n/g, '\n')
            .replace(/\\/g, '')
            .replace(/" "/g, '"')
            .replace(/class=\s*"\s*([^"]+)\s*"/g, 'class="$1"')
            .replace(/\s+/g, ' ')
            .replace(/style=\s*"\s*([^"]+)\s*"/g, 'style="$1"')
            .replace(/<!--\s*-->/g, '')
            .replace(/>\s+</g, '><')
            .trim();
    } catch (error) {
        console.error('Error cleaning HTML:', error);
        return '<html><body><p>Error processing content</p></body></html>';
    }
};