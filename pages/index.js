import { Component } from 'react'
import Promise from 'bluebird'
import {
  drop,
  dropLast,
  fromPairs,
  head,
  last,
  map,
  merge,
  mergeAll,
  objOf,
  pipe,
  prop,
  split,
  trim,
} from 'ramda'
import { getClient } from '../api'

export default class extends Component {
  static async getInitialProps ({ query }) {
    const { token, repo } = query

    const client = getClient({
      username: 'grvcoelho',
      token,
    })

    const getIssueId = pipe(
      prop('content_url'),
      split('/'),
      last
    )

    const fetchIssue = repo => pipe(
      objOf('id'),
      merge({ repo }),
      client.issues.get
    )

    const getFirstLine = pipe(
      split('\r\n'),
      head
    )

    const removeDelimiters = pipe(
      drop(1),
      dropLast(1)
    )

    const keysToObject = pipe(
      map(split(':')),
      fromPairs
    )

    const parseKeysToNumber = map(pipe(
      JSON.parse,
      Number
    ))

    const extractMetadata = pipe(
      prop('body'),
      getFirstLine,
      split('|'),
      map(trim),
      removeDelimiters,
      keysToObject,
      parseKeysToNumber
    )

    const calculateCoefficient = ({ urgency, complexity, business }) =>
      Math.round(((urgency * 0.25) + (business * 0.75)) * 10 / complexity)

    const column = { id: 1420864 }

    const cards = await Promise.resolve({ column_id: column.id })
      .then(client.cards.all)

    const issues = await Promise.resolve(cards)
      .map(getIssueId)
      .map(fetchIssue(repo))
      .map((issue) => {
        const metadata = extractMetadata(issue)
        const coefficient = calculateCoefficient(metadata)

        return mergeAll([
          issue,
          { metadata },
          { coefficient },
        ])
      })

    return { issues }
  }

  render () {
    return (
      <pre>
        Hello World {JSON.stringify(this.props, null, 2)}
      </pre>
    )
  }
}

