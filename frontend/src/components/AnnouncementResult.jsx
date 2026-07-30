function AnnouncementResult({ announcement }) {
    const copyText = () => {
        navigator.clipboard.writeText(announcement);
        alert("Copied Successfully");
    };

    return (
        <div className="result-card">
            <h3>Generated Announcement</h3>

            <textarea
                value={announcement}
                readOnly
                rows={8}
            />

            <button
                className="copy-btn"
                onClick={copyText}
            >
                Copy Announcement
            </button>
        </div>
    );
}

export default AnnouncementResult;