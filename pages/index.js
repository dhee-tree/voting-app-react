import Head from 'next/head'
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Best Teacher | Peterborough College</title>
        <meta name="description" content="A website created by the second year Lv 3 IT students of Peterborough College (Grad. 2022)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

          <div>
            <section className='index-page'>
              <p>Welcome to Inspire Education Group Student Voting Site,</p>
              <p>Here we vote for the best teacher for the academic year.</p>
              <Link href="/auth/login">
                <a className="vote btn btn-secondary" onClick="voteEnd()">Get Code</a>
              </Link>

              <Link href="/vote/voting">
                <a className="vote btn btn-primary">Cast A Vote</a>
              </Link>

              <Link href="/vote/result">
                <a className="vote btn btn-success">See Results</a>
              </Link>

              <p>
                For any help and enquiry, email: <u>admin@iegstudentvote.tech</u>
              </p>
            </section>
          </div>

      <footer>

      </footer>
    </div>
  )
}
