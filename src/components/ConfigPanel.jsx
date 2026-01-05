import React, { useState, useEffect } from 'react';
import { formatWifi, formatVCard, formatEmail, formatSMS, formatUrl } from '../utils/formatters';

const ConfigPanel = ({ onChange }) => {
    const [type, setType] = useState('url');

    // State for all fields
    const [url, setUrl] = useState('https://example.com');
    const [text, setText] = useState('');
    const [wifi, setWifi] = useState({ ssid: '', password: '', encryption: 'WPA' });
    const [vcard, setVcard] = useState({ firstName: '', lastName: '', phone: '', email: '', org: '', title: '', url: '' });
    const [email, setEmail] = useState({ to: '', subject: '', body: '' });
    const [sms, setSms] = useState({ phone: '', message: '' });

    useEffect(() => {
        let result = '';
        switch (type) {
            case 'url':
                result = formatUrl(url);
                break;
            case 'text':
                result = text;
                break;
            case 'wifi':
                result = formatWifi(wifi.ssid, wifi.password, wifi.encryption);
                break;
            case 'vcard':
                result = formatVCard(vcard);
                break;
            case 'email':
                result = formatEmail(email.to, email.subject, email.body);
                break;
            case 'sms':
                result = formatSMS(sms.phone, sms.message);
                break;
            default:
                result = text;
        }
        onChange(result);
    }, [type, url, text, wifi, vcard, email, sms, onChange]);

    return (
        <div className="config-panel">
            <div className="type-selector">
                <label>Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="url">Website</option>
                    <option value="text">Plain Text</option>
                    <option value="wifi">WIFI</option>
                    <option value="vcard">vCard</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                </select>
            </div>

            <div className="dynamic-inputs">
                {type === 'url' && (
                    <div className="input-group">
                        <label>URL</label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                        />
                    </div>
                )}

                {type === 'text' && (
                    <div className="input-group">
                        <label>Text</label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter your text here..."
                        />
                    </div>
                )}

                {type === 'wifi' && (
                    <>
                        <div className="input-group">
                            <label>SSID (Network Name)</label>
                            <input
                                type="text"
                                value={wifi.ssid}
                                onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="text"
                                value={wifi.password}
                                onChange={(e) => setWifi({ ...wifi, password: e.target.value })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Rx</label>
                            <select
                                value={wifi.encryption}
                                onChange={(e) => setWifi({ ...wifi, encryption: e.target.value })}
                            >
                                <option value="WPA">WPA/WPA2</option>
                                <option value="WEP">WEP</option>
                                <option value="nopass">None</option>
                            </select>
                        </div>
                    </>
                )}

                {/* vCard Form */}
                {type === 'vcard' && (
                    <>
                        <div className="input-group">
                            <label>First Name</label>
                            <input type="text" value={vcard.firstName} onChange={e => setVcard({ ...vcard, firstName: e.target.value })} />
                        </div>
                        <div className="input-group">
                            <label>Last Name</label>
                            <input type="text" value={vcard.lastName} onChange={e => setVcard({ ...vcard, lastName: e.target.value })} />
                        </div>
                        <div className="input-group">
                            <label>Phone</label>
                            <input type="text" value={vcard.phone} onChange={e => setVcard({ ...vcard, phone: e.target.value })} />
                        </div>
                        <div className="input-group">
                            <label>Email</label>
                            <input type="text" value={vcard.email} onChange={e => setVcard({ ...vcard, email: e.target.value })} />
                        </div>
                        <div className="input-group">
                            <label>Organization</label>
                            <input type="text" value={vcard.org} onChange={e => setVcard({ ...vcard, org: e.target.value })} />
                        </div>
                        <div className="input-group">
                            <label>Job Title</label>
                            <input type="text" value={vcard.title} onChange={e => setVcard({ ...vcard, title: e.target.value })} />
                        </div>
                        <div className="input-group">
                            <label>Website</label>
                            <input type="text" value={vcard.url} onChange={e => setVcard({ ...vcard, url: e.target.value })} />
                        </div>
                    </>
                )}

                {/* Email Form */}
                {type === 'email' && (
                    <>
                        <div className="input-group">
                            <label>To</label>
                            <input type="text" value={email.to} onChange={e => setEmail({ ...email, to: e.target.value })} />
                        </div>
                        <div className="input-group">
                            <label>Subject</label>
                            <input type="text" value={email.subject} onChange={e => setEmail({ ...email, subject: e.target.value })} />
                        </div>
                        <div className="input-group">
                            <label>Body</label>
                            <textarea value={email.body} onChange={e => setEmail({ ...email, body: e.target.value })} rows={4} />
                        </div>
                    </>
                )}

                {/* SMS Form */}
                {type === 'sms' && (
                    <>
                        <div className="input-group">
                            <label>Phone</label>
                            <input type="text" value={sms.phone} onChange={e => setSms({ ...sms, phone: e.target.value })} />
                        </div>
                        <div className="input-group">
                            <label>Message</label>
                            <textarea value={sms.message} onChange={e => setSms({ ...sms, message: e.target.value })} rows={4} />
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default ConfigPanel;
