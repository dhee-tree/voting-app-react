import Head from 'next/head';
import {useRouter} from 'next/router';

export default function Result() {
    const route = useRouter();
    return (
        <div className="shadow-lg p-4 mb-4 bg-white rounded m-5">
            <Head>
                <title>Result</title>
            </Head>
            <h1>Result</h1>
            <br/>
            <button className='btn btn-primary vote-now-btn' onClick={() => route.push('/vote/voting')}>
                    Vote Now
            </button>
        </div>
    );
}