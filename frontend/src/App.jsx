import './App.css'

const summaryCards = [
  { label: 'Total Workers', value: '0', tone: 'blue' },
  { label: 'New Registration', value: '0', tone: 'blue' },
  { label: 'Renewal', value: '0', tone: 'blue' },
  { label: 'Benefit Forms', value: '0', tone: 'blue' },
  { label: 'Pending', value: '0', tone: 'amber' },
  { label: 'Registered', value: '0', tone: 'green' },
  { label: 'Approved', value: '0', tone: 'green' },
  { label: 'Rejected', value: '0', tone: 'red' },
  { label: 'Absent', value: '0', tone: 'red' },
]

function App() {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark" aria-label="Government portal symbol">⌂</div>
        <p className="brand-name">Bandhkam Kamgar</p>
        <nav aria-label="Main navigation">
          <a className="active" href="#dashboard">Dashboard</a>
          <a href="#master-data">Master Data</a>
          <a href="#applications">Applications</a>
          <a href="#import-excel">Import Excel</a>
          <a href="#reports">Reports</a>
          <a href="#users">Users</a>
          <a href="#settings">Settings</a>
          <a href="#logout">Logout</a>
        </nav>
        <div className="sidebar-footer">Government of Maharashtra</div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">MANAGEMENT INFORMATION SYSTEM</p>
            <h1>Dashboard</h1>
          </div>
          <button className="profile-button" type="button">Administrator</button>
        </header>

        <section className="welcome" aria-labelledby="welcome-title">
          <div>
            <p className="eyebrow">WELCOME</p>
            <h2 id="welcome-title">Bandhkam Kamgar AI MIS Portal</h2>
            <p>Manage scheme applications, master data, and reports from one secure place.</p>
          </div>
          <button type="button">Add Application</button>
        </section>

        <section className="summary-grid" aria-label="Application summary">
          {summaryCards.map((card) => (
            <article className={`summary-card ${card.tone}`} key={card.label}>
              <p>{card.label}</p>
              <strong>{card.value}</strong>
              <span>Data will appear after applications are added.</span>
            </article>
          ))}
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Getting started</h2>
              <p>Your foundation is ready. The next module will connect application records to MySQL.</p>
            </div>
            <span className="status">Setup complete</span>
          </div>
          <ol className="checklist">
            <li><span>1</span> Frontend application created</li>
            <li><span>2</span> Backend API health check created</li>
            <li><span>3</span> Applications database is next</li>
          </ol>
        </section>
      </section>
    </main>
  )
}

export default App
