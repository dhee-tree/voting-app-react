// importing react icons
import { FcGoogle } from 'react-icons/fc';
import { AiFillCheckCircle } from 'react-icons/ai';
import { BsFillXCircleFill } from 'react-icons/bs';

// importing react modules
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';

// Google and firebase imports
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getFirestore, collection, doc, getDocs, addDoc, onSnapshot, query, where, serverTimestamp } from 'firebase/firestore';


export default function Login() {
    const [user, loading] = useAuthState(auth);
    const route = useRouter();

    // Initializing firestore database
    const db = getFirestore();
    const colRef = collection(db, 'users');

    // Sign in with Google
    const googleProvider = new GoogleAuthProvider();

    // Enable google button when user selects a level
    const levelSelect = () => {
        var level = document.getElementById('level').value;
        if (level == '0') {
            alert('Please select a level');
        } else {
            // change btnX and btnGoogle from disabled to enabled
            document.getElementById('btnX').disabled = false;
            document.getElementById('btnGoogle').disabled = false;

            // change level and btnC from enabled to disabled
            document.getElementById('level').disabled = true;
            document.getElementById('btnC').disabled = true;
        }
    }

    // Enable text input when user clicks on X button
    const levelReselect = () => {
        // change btnX and btnGoogle from enabled to disabled
        document.getElementById('btnX').disabled = true;
        document.getElementById('btnGoogle').disabled = true;

        // change level and btnC from disabled to enabled
        document.getElementById('level').disabled = false;
        document.getElementById('btnC').disabled = false;
    }

    // Generate user code
    const genCode = () => {
        let userLevel = document.getElementById('level');
        if (userLevel.value == 'level 1') {
            var number = 100000;
            var codePrefix = 'On';
        } else if (userLevel.value == 'level 2') {
            var number = 200000;
            var codePrefix = 'Tw';
        } else if (userLevel.value == 'level 3') {
            var number = 300000;
            var codePrefix = 'Th';
        } else if (userLevel.value == 'level 4') { // if else is used code would be generted when nothing is selected
            var number = 400000;
            var codePrefix = 'Fo';
        }

        let code = Math.floor(number + Math.random() * 90000);
        return `${codePrefix}-${code}`;
    }

    const existUser = () => {
        route.push('/dashboard'); // redirect to dashboard if user already exists
    }

    const newUser = (email) => {
        addDoc(colRef, { // add user to database if they don't exist
            email: email,
            user_code: genCode(),
            vote_count: 0,
            createdAt: serverTimestamp(),
        });
        route.push('/dashboard'); // redirect to dashboard after adding user to database
    }

    const useRef = collection(db, 'users'); // get all emails from database
    let users = []; // create an empty array to store emails
    getDocs(useRef).then((snapshot) => {
        snapshot.docs.forEach((doc) => {
            var email = doc.data().email;
            users.push(email); // push emails to users array
        });
    });

    const GoogleLogin = async () => {
        const result = await signInWithPopup(auth, googleProvider);

        var user_email = result.user.email;
        var position = result.user.email.indexOf('@');
        var verify_student = result.user.email.slice(position, user_email.length);

        if (verify_student == '@student') {
            auth.signOut(); // logout user
            alert('Sorry, you are not a student.'); // display not a student error
        } else {
            if (users.includes(user_email)) {  // then user exists because email is in the database
                existUser(); // call existUser function and redirect to dashboard
            } else {
                newUser(user_email); // then user does not exist because email is not in the database
            }
        }
    };

    useEffect(() => {
        levelReselect(); // call levelReselect function to disable btnX and btnGoogle
        if (auth.currentUser) route.push('/dashboard'); // redirect to dashboard if user is already logged in, prevents user from seeing login page when they are already logged in
    }, [user]);
    
    return (
        <div className="shadow-lg p-4 mb-4 bg-white rounded m-5">
             <Head>
                <title>Login</title>
            </Head>
            <div>
                <h3>Select your Level</h3>
                <select id="level" name="level">
                    <option value="0">Select level</option>
                    <option value="level 1">Level 1</option>
                    <option value="level 2">Level 2</option>
                    <option value="level 3">Level 3 Year 1</option>
                    <option value="level 4">Level 3 Year 2</option>
                </select>
                <button className='btn' id='btnC' onClick={levelSelect}>
                    <AiFillCheckCircle />
                </button>
                <button className='btn' id='btnX' onClick={levelReselect}>
                    <BsFillXCircleFill />
                </button>
                <br />
            </div>
            <br />
            <div className=''>
                <button className="btn btn-dark" id='btnGoogle' onClick={GoogleLogin}>
                    <FcGoogle className='me-2' />Sign in with Google
                </button>
            </div>
        </div>
    );
}


// queries
// const q = query(colRef, where("email", "==", "ighoodes@gmal.com"));
// console.log(q);

// get data from the database
// useEffect(() => {
//     onSnapshot(q, (snapshot) => {
//         snapshot.docs.forEach((doc) => {
//             console.log(doc.data().user_code);
//         });
//     });
// }, []);


// useEffect(() => {
//     getDocs(q).then((snapshot) => {
//         let users = []
//         snapshot.docs.forEach((doc) => {
//             var email = doc.data().email;
//             users.push(email)
//         });
//         console.log(users);
//     });
// }, []);


// const q = query(colRef, where('email', '==', result.user.email));
// Get all the emails from the database
// let users = [];
            
// getDocs(colRef).then((snapshot) => {
                
//     snapshot.docs.forEach((doc) => {
//         var email = doc.data().email;
//         users.push(email)
//     });
// });

// try {


// console.log(check_code);
// if (check_code.length < 2) {
//     addDoc(colRef, {
//         email: result.user.email,
//         user_code: genCode(),
//         vote_count: 0,
//     });
//     route.push('/dashboard');
//     console.log('pass');
// } else {
//     route.push('/dashboard');
//     console.log('not pass');
// }

            // onSnapshot(q, (snapshot) => {
            //     snapshot.docs.forEach((doc) => {
            //         var got_code = doc.data().user_code;

            //         if (got_code.length < 1) {
            //             newUser(user_email);
            //         } else {
            //             existUser();
            //         }
            //     });
            // });
        // }