import Head from 'next/head';
import { useEffect, useState } from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';

import {auth} from '../../utils/firebase';
import {useAuthState} from 'react-firebase-hooks/auth';
import { getFirestore, collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';

export default function Voting() {
    const route = useRouter();

    const db = getFirestore();
    const colRef = collection(db, 'users');
    
    const [user, loading] = useAuthState(auth);

    const [values, setValues] = useState({
        EUC: '',
    });

    const onChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    // For vote button
    const [vote, setVote] = useState('Vote');
    
    // For teachers
    const [teacherYr, setTeachers] = useState([]);

    // For teacher year
    const [teacherYear, setTeacherYear] = useState('');

    // For teacher units
    const [teacherUnits, setTeacherUnits] = useState([]);

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

    const getTeacher = () => {
        var studentCode = document.getElementById('EUC').value;

        if (studentCode.startsWith('On') && user_codes.includes(studentCode)) {
            alert('You are a student of Year 1');
            var teacherGroup = 'teacher_yr1';
            getTeacherName(teacherGroup);
        } else if (studentCode.startsWith('Tw')) {
            var teacherGroup = 'teacher_yr2';
        } else if (studentCode.startsWith('Th')) {
            var teacherGroup = 'teacher_yr3';
        } else if (studentCode.startsWith('Fo')) {
            var teacherGroup = 'teacher_yr4';
        } else {
            alert('Invalid Student Code');
        }        
    }

    const getTeacherName = (group) => {
        const teachRef = collection(db, `${group}`);
        setTeacherYear(group);
        getDocs(teachRef).then((snapshot) => {
            let got_teachers = [];
            snapshot.docs.forEach((doc) => {
                var name = doc.data().name;
                got_teachers.push(name)
            });
            setTeachers(got_teachers);
        }).catch((err) => {
            console.log(err);
        });      
            
        var user_code = document.getElementById('EUC').value;
        document.getElementById('user-feed').innerHTML = `${user_code} is valid. Please select candidate from the list below.`;
        setVote(user_code);
        // console.log(code_key);

        document.getElementById('form').style.display = 'block';
        document.getElementById('EUC').remove();
        document.getElementById('check-btn').remove();
    }

    const getVote = () => {
        // prevent default
        event.preventDefault();
        var selected = document.getElementById('get').value;
        document.getElementById('get').remove();
        document.getElementById('vote').remove();
        document.getElementById('user-feed').innerHTML = `Here are ${selected}'s units.`

        document.getElementById('teacher_points').style.display = 'block';

        const teacherRef = collection(db, teacherYear);
        const q = query(teacherRef, where("name", "==", selected));
        onSnapshot(q, (snapshot) => {
            let teacher_unit = [];
            snapshot.docs.forEach((doc) => {
                var code = doc.data().unit;
                teacher_unit.push(code);
                // console.log(doc.data().unit);
                // console.log(doc.data(), doc.id);
            });
            // console.log(teacher_unit);
            setTeacherUnits(teacher_unit);
        });

        
    }

    // console.log(teacherUnits);

    if(loading) {
        return (
            <div className='shadow-lg p-4 mb-4 bg-white rounded m-5 text-center'>
                <Head>
                    <title>Voting</title>
                </Head>
                <h1>Loading...</h1>
                {/* refresh browser  */}
                <button onClick={() => window.location.reload()}>Refresh</button>
            </div>
        );
    }

    if(!user) {
        return (
            <div className="shadow-lg p-4 mb-4 bg-white rounded m-5 text-center">
                <Head>
                    <title>Voting</title>
                </Head>
                <h2>Please login to continue</h2>
                <Link href="/auth/login">
                    <a className="btn btn-secondary mt-2">Login</a>
                </Link>
            </div>
        )
    } else {
        return (
            <div className="shadow-lg p-4 mb-4 bg-white rounded m-5">
                <Head>
                    <title>Voting</title>
                </Head>
                {/* User entering code */}
                <p id='user-feed'>Hello {user.displayName}, please enter your code below.</p>

                <input type="text" id="EUC" name='EUC' placeholder="Enter Code" className="border border-success rounded p-1" onChange={onChange}></input>
                <button className="btn btn-success" id='check-btn' onClick={getTeacher}>Check My Code</button>

                {/* User choosing a teacher */}
                <form className='pandora' id='form'>
                    <select id="get" className='border border-success rounded p-1' name='vote'>
                        {
                            teacherYr.map((teacher, index) => {
                                return (
                                    <option value={teacher} id={`teach${index+1}`}>{teacher}</option>
                                )
                            })
                        }
                    </select>
                    <button className="btn btn-success" id='vote' value={vote} onClick={getVote}>Vote with {vote}</button>
                </form>    

                {/* FOR GIVING TEACHER POINTS */}
                {
                    teacherUnits.map((unit, index) => {
                        return (
                            <div className='' key={index}>
                                <p>{unit}</p>
                            </div>
                        )
                    })
                }
                <form method='POST' className='pandora' id='teacher_points'>
                    
                    <div className="teacher-details text-center">
                        <p>How supportive is the teacher?</p>
                        <input type="radio" className="pandora" name="support" value="0" defaultChecked></input>

                        <input type="radio" id="supportWeak" name="support" value="1"></input>
                        <label for="supportWeak">Weak</label>

                        <input type="radio" id="supportSolid" name="support" value="2"></input>
                        <label for="supportSolid">Solid</label>

                        <input type="radio" id="supportDivine" name="support" value="3"></input>
                        <label for="supportDivine">Divine</label>
                    </div>

                    <div class="teacher-details-2 text-center">
                    <p>How would you rate their teaching style?</p>
                        <input type="radio" className="pandora" name="style" value="0" defaultChecked></input>

                        <input type="radio" id="styleWeak" name="style" value="1"></input>
                        <label for="styleWeak">Weak</label>

                        <input type="radio" id="styleSolid" name="style" value="2"></input>
                        <label for="styleSolid">Solid</label>

                        <input type="radio" id="styleDivine" name="style" value="3"></input>
                        <label for="styleDivine">Divine</label>
                    </div>

                    <div class="teacher-details text-center">
                        <p>Does the teacher provide useful resources that help with your learning?</p>
                        <input type="radio" className="pandora" name="resources" value="0" defaultChecked></input>

                        <input type="radio" id="resourcesWeak" name="resources" value="1"></input>
                        <label for="resourcesWeak">Weak</label>

                        <input type="radio" id="resourcesSolid" name="resources" value="2"></input>
                        <label for="resourcesSolid">Solid</label>

                        <input type="radio" id="resourcesDivine" name="resources" value="3"></input>
                        <label for="resourcesDivine">Divine</label>
                    </div>
                </form>
                    
            </div>
        )
    };
};

{/* <form action="/vote/castVote" method="get" className='pandora' id='form'>
    <select name="vote" id="get" className='border border-success rounded p-1'>
        {
            teacherYr.map((teacher, index) => {
                return (
                    <option value={teacher} id={`teach${index+1}`}>{teacher}</option>
                )
            })
        }
    </select>
    <button className="btn btn-success" id='vote' value={vote} name='code'>Vote with {vote}</button>
</form>   */}