import { useState, useEffect, ChangeEvent, SyntheticEvent } from "react";
import useGlobal from '@controllers/global/useGlobal';
const useSampleForm = () => {
    const {
        handleBlur,
    } = useGlobal()
    const [status, setStatus] = useState({
        loader: false
    })
    const [user, setUser] = useState({
        userObj: {
            email: '',
            lastName: '',
            firstName: ''
        },
        userErr: {
            email: '',
            lastName: '',
            firstName: ''
        }
    });
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUser({
            ...user,
            userObj: {
                ...user.userObj,
                [name]: value
            }
        })     
    }
        
    const handleFormSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('test')
        setStatus({
            ...status,
            loader: true
        })
    }

    return {
        user,
        status,
        handleBlur,
        handleChange,

        handleFormSubmit
    };
};

export default useSampleForm;