import Head from 'next/head';
import {auth} from '../utils/firebase';
import {useAuthState} from 'react-firebase-hooks/auth';
import { getFirestore, collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';

import { IoCopyOutline } from 'react-icons/io5';

import {useRouter} from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
    const [user, loading] = useAuthState(auth);
    const route = useRouter();

    // Initializing firestore database
    const db = getFirestore();
    const colRef = collection(db, 'users');

    // query database for user and get their code
    try {
        const q = query(colRef, where("email", "==", user.email));

        onSnapshot(q, (snapshot) => {
            snapshot.docs.forEach((doc) => {
                let user_code = doc.data().user_code;
                // console.log(user_code);
                document.getElementById("code").value = user_code;
            });
        });
    } catch (error) {
        console.log(error);
    }

    // Copy user code to clipboard
    const copyCode = () => {
        var code = document.getElementById("code");
        code.select();
        code.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(code.value);

    }

    
    if(loading) return <div className="shadow-lg p-4 mb-4 bg-white rounded m-5"> <h1 className='d-flex justify-content-center'>Loading...</h1> </div>
    if(!user) route.push('/auth/login');
    if(user) {
        return (
            <div className="shadow-lg p-4 mb-4 bg-white rounded m-5">
                <Head>
                    <title>{user.displayName} Dashboard</title>
                </Head>
                <h3>Welcome to your dashboard; <br/> {user.displayName}</h3>
                <br/>
                <p>Here is your voting code</p>
                <input id='code' className='border border-success rounded p-1'></input> <br/><br/>
                {/* <span role="button" onclick={copyCode}>{<IoCopyOutline />} Copy</span> */}
                <button className='btn btn-primary vote-now-btn' onClick={() => route.push('/vote/voting')}>
                    Vote Now
                </button>
                <button className='btn btn-danger' onClick={() => auth.signOut()}>
                    Sign Out
                </button>
            </div>
        );
    }
}