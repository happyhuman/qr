export const formatWifi = (ssid, password, encryption = 'WPA', hidden = false) => {
    // WIFI:S:MySSID;T:WPA;P:MyPass;;
    const safeSSID = ssid.replace(/([\\;,:"])/g, '\\$1');
    const safePassword = password.replace(/([\\;,:"])/g, '\\$1');
    return `WIFI:S:${safeSSID};T:${encryption};P:${safePassword};H:${hidden};;`;
};

export const formatVCard = ({ firstName, lastName, phone, email, org, title, url }) => {
    return `BEGIN:VCARD
VERSION:3.0
N:${lastName};${firstName};;;
FN:${firstName} ${lastName}
ORG:${org}
TITLE:${title}
TEL:${phone}
EMAIL:${email}
URL:${url}
END:VCARD`;
};

export const formatEmail = (email, subject, body) => {
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export const formatSMS = (phone, message) => {
    return `smsto:${phone}:${message}`;
};

export const formatUrl = (url) => {
    if (!url) return '';
    if (!url.startsWith('http')) return `https://${url}`;
    return url;
};
