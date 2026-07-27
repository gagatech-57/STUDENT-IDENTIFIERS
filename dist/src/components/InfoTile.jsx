/**
 * Reusable InfoTile Component for displaying Student Profile metrics
 */

export function InfoTile({ icon, label, value }) {
    return (
        <article className="info-tile">
            <i className={icon}></i>
            <div>
                <strong>{label}</strong>
                <span title={value}>{value || "N/A"}</span>
            </div>
        </article>
    );
}
