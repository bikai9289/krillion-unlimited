import {homePage} from '../../../src/html.mjs';
export const metadata={title:'Krillion Unlimited — Play Free, No Daily Limit',alternates:{canonical:'/'},openGraph:{title:'Krillion Unlimited — Play Free, No Daily Limit',url:'/',images:['/assets/og.png']}};
export default function Home(){let html=homePage();let body=html.split('<body>')[1].split('</body>')[0];return <div dangerouslySetInnerHTML={{__html:body}}/>}
