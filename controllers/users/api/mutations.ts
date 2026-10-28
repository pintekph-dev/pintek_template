import { User } from '../types'
import { useState } from 'react'
import { initUser } from '../states'
import { Status } from '@controllers/global/types'
import { initStatus } from '@controllers/global/states'
const useMutationUsers = () => {
    const [user, setUser] = useState<User>(initUser)
    const [status, setStatus] = useState<Status>(initStatus)

    return {
        //STATES
        user,
        status,
        initUser,

        // SET STATES
        setUser,
        setStatus,

        // HANDLES

        // MUTATIONS
    }
}
export default useMutationUsers;