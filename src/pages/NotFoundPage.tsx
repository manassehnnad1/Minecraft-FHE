import { Link } from 'react-router-dom'

const NotFoundPage = () => {
    return(
        <div>
            <h1 className='text-white font-tektur text-2xl'>Doesn't exist boy!</h1>
        <Link to='/'><button className='text-white font-tektur cursor-pointer '>Go back</button></Link>
            
        </div>
    )
};

export default NotFoundPage