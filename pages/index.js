import { Component } from 'react'
import Promise from 'bluebird'
import firebase from 'firebase'
import {
  drop,
  dropLast,
  fromPairs,
  head,
  last,
  map,
  merge,
  mergeAll,
  negate,
  objOf,
  pipe,
  prop,
  sortBy,
  split,
  trim,
} from 'ramda'
import { getClient } from '../api'
import IssuesTable from '../components/IssuesTable'

export default class extends Component {
  constructor (props) {
    super(props)

    this.signInWithGithub = this.signInWithGithub.bind(this)
    this.fetchData = this.fetchData.bind(this)

    this.state = {
      user: null,
      auth: {},
      data: {},
    }
  }

  signInWithGithub () {
    const provider = new firebase.auth.GithubAuthProvider()
    provider.addScope('repo')

    firebase.auth().signInWithPopup(provider)
      .then(({ user, credential }) => {
        const { accessToken } = credential
        const auth = { accessToken }

        window.sessionStorage.setItem('accessToken', accessToken)

        this.setState(() => ({
          user,
          auth,
        }))
      })
      .catch((err) => {
        console.error('Error signing in with Github', err)
      })
  }

  async fetchData ({ repo }) {
    const client = getClient({
      username: this.state.user.email,
      token: this.state.auth.accessToken,
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

    const sortByCoefficient = sortBy(
      pipe(
        prop('coefficient'),
        negate
      )
    )

    const column = { id: 1424327 }

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
      .then(sortByCoefficient)

    this.setState(() => ({
      data: {
        issues,
      },
    }))
  }

  componentDidMount () {
    const config = {
      apiKey: 'AIzaSyC_Y173SpmWV4k_05s_vAIJKXl7_Ei2ywE',
      authDomain: 'venkman-48f3e.firebaseapp.com',
      databaseURL: 'https://venkman-48f3e.firebaseio.com',
      projectId: 'venkman-48f3e',
      storageBucket: 'venkman-48f3e.appspot.com',
      messagingSenderId: '387103342349',
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(config)
    }

    firebase.auth().onAuthStateChanged((data) => {
      const accessToken = window.sessionStorage.getItem('accessToken')
      const user = accessToken ? data : null

      this.setState(() => ({
        user,
        auth: { accessToken },
      }))
    })
  }

  render () {
    const { data } = this.state

    return (
      <div className="container">
        <style jsx>{`
          .container {
            max-width: 980px;
          }
        `}</style>

        {!this.state.user && (
          <button onClick={this.signInWithGithub}>Sign in with Github</button>
        )}

        {this.state.user && (
          <div>
            <button onClick={() => this.fetchData({ repo: 'pagarme/ghostbusters' })}>Fetch data!</button>

            {data.issues && data.issues.length && (
              <IssuesTable issues={data.issues} />
            )}
          </div>
        )}
      </div>
    )
  }
}
