import './globals.css';
import {TokenProvider} from '../context/TokenContext';
import {ReactNode} from 'react';

const RootLayout = ({children}: {children: ReactNode}) => {
    return (
        <html lang='en'>
            <body>
                <TokenProvider>{children}</TokenProvider>
            </body>
        </html>
    );
};

export default RootLayout;
