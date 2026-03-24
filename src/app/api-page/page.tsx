"use client";
import { useState } from "react";
import "./api-page.css";

type Student = {
  id: number;
  name: string;
  major: string;
  year: number;
  gpa: number;
};

type FormData = {
  name: string;
  major: string;
  year: string;
  gpa: string;
};

const BASE = "/api/students";

export default function StudentsPlayground() {
  const [students, setStudents] = useState<Student[]>([]);
  const [response, setResponse] = useState<string>("");
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [filterName, setFilterName] = useState("");
  const [filterMajor, setFilterMajor] = useState("");
  const [filterYear, setFilterYear] = useState("");

  const [form, setForm] = useState<FormData>({ name: "", major: "", year: "", gpa: "" });
  const [patchId, setPatchId] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [getId, setGetId] = useState("");

  const req = async (url: string, options?: RequestInit) => {
    setLoading(true);
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
      setStatus(res.status);
      return { data, ok: res.ok };
    } catch (e) {
      setResponse(JSON.stringify({ error: String(e) }, null, 2));
      setStatus(0);
      return { data: null, ok: false };
    } finally {
      setLoading(false);
    }
  };

  const handleGetAll = async () => {
    const params = new URLSearchParams();
    if (filterName) params.set("name", filterName);
    if (filterMajor) params.set("major", filterMajor);
    if (filterYear) params.set("year", filterYear);
    const { data, ok } = await req(`${BASE}?${params}`);
    if (ok) setStudents(data);
  };

  const handleGetOne = () => req(`${BASE}/${getId}`);

  const handlePost = () =>
    req(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        major: form.major,
        year: Number(form.year),
        gpa: Number(form.gpa),
      }),
    });

  const handlePatch = () =>
    req(`${BASE}/${patchId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(form.name && { name: form.name }),
        ...(form.major && { major: form.major }),
        ...(form.year && { year: Number(form.year) }),
        ...(form.gpa && { gpa: Number(form.gpa) }),
      }),
    });

  const handleDelete = () => req(`${BASE}?id=${deleteId}`, { method: "DELETE" });

  const statusClass = status === null ? "" : status >= 200 && status < 300 ? "status-ok" : "status-err";

  return (
    <div className="playground-wrapper">
      <h1>Students API</h1>
      <p className="subtitle">/api/students — interactive playground</p>

      <div className="playground-grid">

        {/* LEFT COLUMN */}
        <div>

          {/* GET ALL */}
          <div className="card">
            <span className="method-badge badge-get">GET</span>
            <p className="endpoint">/api/students — optional filters</p>
            <div className="field-row">
              <div className="field"><label>name</label><input placeholder="ava" value={filterName} onChange={e => setFilterName(e.target.value)} /></div>
              <div className="field"><label>major</label><input placeholder="CS" value={filterMajor} onChange={e => setFilterMajor(e.target.value)} /></div>
              <div className="field"><label>year</label><input placeholder="2" value={filterYear} onChange={e => setFilterYear(e.target.value)} /></div>
            </div>
            <button className="btn btn-get" onClick={handleGetAll}>{loading ? "..." : "GET all"}</button>
          </div>

          {/* GET ONE */}
          <div className="card">
            <span className="method-badge badge-get">GET</span>
            <p className="endpoint">/api/students/:id</p>
            <div className="field-row">
              <div className="field"><label>id</label><input placeholder="1" value={getId} onChange={e => setGetId(e.target.value)} /></div>
              <button className="btn btn-get" onClick={handleGetOne}>GET one</button>
            </div>
          </div>

          {/* POST */}
          <div className="card">
            <span className="method-badge badge-post">POST</span>
            <p className="endpoint">/api/students — create student</p>
            <div className="field-row">
              <div className="field"><label>name</label><input placeholder="Ava Lee" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="field"><label>major</label><input placeholder="CS" value={form.major} onChange={e => setForm(f => ({ ...f, major: e.target.value }))} /></div>
            </div>
            <div className="field-row">
              <div className="field"><label>year (1–4)</label><input placeholder="2" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} /></div>
              <div className="field"><label>gpa (0–4)</label><input placeholder="3.6" value={form.gpa} onChange={e => setForm(f => ({ ...f, gpa: e.target.value }))} /></div>
            </div>
            <button className="btn btn-post" onClick={handlePost}>POST</button>
          </div>

          {/* PATCH */}
          <div className="card">
            <span className="method-badge badge-patch">PATCH</span>
            <p className="endpoint">/api/students/:id — partial update</p>
            <div className="field-row">
              <div className="field" style={{ maxWidth: "80px" }}><label>id</label><input placeholder="1" value={patchId} onChange={e => setPatchId(e.target.value)} /></div>
              <div className="field"><label>name</label><input placeholder="leave blank to skip" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="field"><label>major</label><input placeholder="leave blank to skip" value={form.major} onChange={e => setForm(f => ({ ...f, major: e.target.value }))} /></div>
            </div>
            <div className="field-row">
              <div className="field"><label>year</label><input placeholder="leave blank to skip" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} /></div>
              <div className="field"><label>gpa</label><input placeholder="leave blank to skip" value={form.gpa} onChange={e => setForm(f => ({ ...f, gpa: e.target.value }))} /></div>
            </div>
            <button className="btn btn-patch" onClick={handlePatch}>PATCH</button>
          </div>

          {/* DELETE */}
          <div className="card">
            <span className="method-badge badge-delete">DELETE</span>
            <p className="endpoint">/api/students?id= — remove student</p>
            <div className="field-row">
              <div className="field"><label>id</label><input placeholder="1" value={deleteId} onChange={e => setDeleteId(e.target.value)} /></div>
              <button className="btn btn-delete" onClick={handleDelete}>DELETE</button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div>
          <div className="response-panel">
            <div className="response-header">
              <span>Response</span>
              {status !== null && (
                <span className={`status-code ${statusClass}`}>{status}</span>
              )}
            </div>
            <pre className="response-pre">
              {response || "// response will appear here"}
            </pre>
          </div>

          {students.length > 0 && (
            <div className="student-list">
              <div className="student-list-header">
                <span>Students</span>
                <span className="result-count">{students.length} results</span>
              </div>
              {students.map(s => (
                <div className="student-row" key={s.id}>
                  <span className="student-name">{s.name} <span style={{ fontWeight: 400, color: "#555" }}>— {s.major}</span></span>
                  <span className="student-meta">yr {s.year} · {s.gpa} GPA · #{s.id}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}