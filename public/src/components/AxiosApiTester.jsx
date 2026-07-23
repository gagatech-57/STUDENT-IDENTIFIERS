/**
 * Axios Backend API Tester Component
 * Allows real-time testing of Express & MongoDB backend endpoints using Axios
 */

import { API_BASE_URL } from "../services/api.js";

export function AxiosApiTester() {
    const [method, setMethod] = React.useState("GET");
    const [endpoint, setEndpoint] = React.useState("/test");
    const [responseResult, setResponseResult] = React.useState(null);
    const [isTesting, setIsTesting] = React.useState(false);
    const [responseTime, setResponseTime] = React.useState(null);

    async function runAxiosTest(customMethod = method, customEndpoint = endpoint) {
        setIsTesting(true);
        setResponseResult(null);
        setResponseTime(null);

        const fullUrl = `${API_BASE_URL}${customEndpoint.startsWith("/") ? "" : "/"}${customEndpoint}`;
        const startTime = performance.now();

        try {
            const res = await window.axios({
                method: customMethod,
                url: fullUrl,
                timeout: 10000
            });

            const endTime = performance.now();
            setResponseTime(Math.round(endTime - startTime));
            setResponseResult({
                status: res.status,
                statusText: res.statusText || "OK",
                data: res.data,
                headers: res.headers
            });
        } catch (err) {
            const endTime = performance.now();
            setResponseTime(Math.round(endTime - startTime));
            if (err.response) {
                setResponseResult({
                    status: err.response.status,
                    statusText: err.response.statusText || "Error",
                    data: err.response.data
                });
            } else {
                setResponseResult({
                    status: 500,
                    statusText: "Network Error",
                    data: { message: err.message }
                });
            }
        } finally {
            setIsTesting(false);
        }
    }

    return (
        <div className="upload-box api-tester-box">
            <div className="upload-header">
                <h3><i className="fa-solid fa-code"></i> Backend API Tester (Axios)</h3>
                <span className="axios-badge"><i className="fa-solid fa-bolt"></i> Axios HTTP</span>
            </div>

            <div className="preset-test-buttons">
                <span className="preset-label">Quick Preset Tests:</span>
                <button
                    type="button"
                    className="preset-btn"
                    onClick={() => { setMethod("GET"); setEndpoint("/test"); runAxiosTest("GET", "/test"); }}
                >
                    GET /test
                </button>
                <button
                    type="button"
                    className="preset-btn"
                    onClick={() => { setMethod("GET"); setEndpoint("/upload/test"); runAxiosTest("GET", "/upload/test"); }}
                >
                    GET /upload/test
                </button>
                <button
                    type="button"
                    className="preset-btn"
                    onClick={() => { setMethod("GET"); setEndpoint("/upload/files"); runAxiosTest("GET", "/upload/files"); }}
                >
                    GET /upload/files
                </button>
            </div>

            <div className="custom-api-form">
                <div className="api-input-group">
                    <select
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                        className="method-select"
                    >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                    </select>
                    <input
                        type="text"
                        value={endpoint}
                        placeholder="/endpoint"
                        onChange={(e) => setEndpoint(e.target.value)}
                        className="endpoint-input"
                    />
                    <button
                        type="button"
                        onClick={() => runAxiosTest()}
                        disabled={isTesting}
                        className="run-test-btn"
                    >
                        {isTesting ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-paper-plane"></i>} Run Test
                    </button>
                </div>
            </div>

            {responseResult && (
                <div className="axios-response-container">
                    <div className="response-header">
                        <span className={`status-tag ${responseResult.status >= 200 && responseResult.status < 300 ? "status-200" : "status-400"}`}>
                            Status: {responseResult.status} {responseResult.statusText}
                        </span>
                        {responseTime !== null && (
                            <span className="time-tag">
                                <i className="fa-regular fa-stopwatch"></i> {responseTime} ms
                            </span>
                        )}
                    </div>
                    <pre className="json-response-code">
                        <code>{JSON.stringify(responseResult.data, null, 2)}</code>
                    </pre>
                </div>
            )}
        </div>
    );
}
