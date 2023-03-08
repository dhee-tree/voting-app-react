import Head from 'next/head';
import { useEffect, useState } from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';

import {auth} from '../../utils/firebase';
import {useAuthState} from 'react-firebase-hooks/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export default function CastVote() {
    const [user, loading] = useAuthState(auth);
    const route = useRouter();
    const {vote} = route.query;
    const {code} = route.query;
    // const {key} = route.query;

    // Initializing firestore database
    const db = getFirestore();
    const colRef = collection(db, 'users');

    // For codes
    const [user_codes, setUserCodes] = useState([]);
    useEffect(() => {
        getDocs(colRef).then((snapshot) => {
            let got_code = [];
            snapshot.docs.forEach((doc) => {
                var code = doc.data().user_code;
                got_code.push(code)
            });
            setUserCodes(got_code);
        });    
    }, []);

    if(loading) {
        return (
            <div className='shadow-lg p-4 mb-4 bg-white rounded m-5'>
                <Head>
                    <title>Cast Vote</title>
                </Head>
                <h1>Loading...</h1>
                {/* refresh browser  */}
                <button onClick={() => window.location.reload()}>Refresh</button>
            </div>
        );
    }

    if(!user) {
        return (
            <div className='shadow-lg p-4 mb-4 bg-white rounded m-5'>
                <Head>
                    <title>Cast Vote</title>
                </Head>
                <h1>Access Denied</h1>
                <p>You must be signed in to view this page</p>
                <Link href="/auth/login">
                    <a className="btn btn-secondary mt-2">Login</a>
                </Link>
            </div>
        )
    } 
    
    if(user && user_codes.includes(code)) {
        return (
            <div className="shadow-lg p-4 mb-4 bg-white rounded m-5">
                <Head>
                    <title>Cast Vote</title>
                </Head>
                <h3>Voting for {vote} with {code}</h3>
                <h1>{vote}</h1>
                <h1>{code}</h1>
                {/* <h1>{key}</h1> */}
            </div>
        );
    } else {
        return (
            <div className="shadow-lg p-4 mb-4 bg-white rounded m-5">
                <Head>
                    <title>Access Denied</title>
                </Head>
                <h3>Access Denied</h3>
                <p>{code} is not valid</p>
                <Link href="/vote/voting">
                    <a className="btn btn-primary mt-2">Enter Code</a>
                </Link>
            </div>
        );
    }

};