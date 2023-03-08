import Link from 'next/link';
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth} from '../utils/firebase';

export default function Nav() {

    const [user] = useAuthState(auth);

    return (
        <nav className="navbar navbar-default" role="navigation">
            <div className="container-fluid">
                <Link href="/">
                    <picture>
                        <source srcSet='/images/pcLogo.png'/>
                        <img src='/images/pcLogo.png' alt="Peterborough College" referrerPolicy='no-referrer' width={80}/>
                    </picture>
                </Link>
                
                <ul>
                    {!user && (
                    <Link href="/auth/login">
                        <a></a>
                    </Link>
                    )}
                    {user && (
                        <div className="row">
                            <div className="col-md-12">
                                {/* <p>Welcome {user.displayName}</p> */}
                                <Link href="/dashboard">
                                    <picture>
                                        <source srcSet={user.photoURL} type="image/webp" />
                                        <img src={user.photoURL} alt="User profile picture" className="w-50 rounded-circle display-pic" referrerPolicy='no-referrer'/>
                                    </picture>
                                </Link>
                            </div>
                        </div>
                    )}
                </ul>
            </div>
        </nav>
    );
}