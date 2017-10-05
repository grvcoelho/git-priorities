export default ({ issues }) => (
  <table>
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
          <td>{issue.coefficient}</td>
        </tr>
      ))}
    </tbody>
  </table>

)

