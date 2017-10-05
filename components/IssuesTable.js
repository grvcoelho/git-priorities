export default ({ issues }) => (
  <table className="table is-bordered is-striped">
    <style jsx>{`
      table {
        margin-top: 40px;
      }

      a {
        color: #2f4094;
      }

      .highlight {
        font-weight: 900;
      }
    `}</style>
    <thead>
      <tr>
        <th>Issue</th>
        <th>Urgency</th>
        <th>Business</th>
        <th>Complexity</th>
        <th>Coefficient</th>
      </tr>
    </thead>

    <tbody>
      {issues.map(issue => (
        <tr key={issue.id}>
          <td><a href={issue.html_url} target="_blank">{issue.title}</a></td>
          <td>{issue.metadata.urgency}</td>
          <td>{issue.metadata.business}</td>
          <td>{issue.metadata.complexity}</td>
          <td className="highlight">{issue.coefficient}</td>
        </tr>
      ))}
    </tbody>
  </table>

)

