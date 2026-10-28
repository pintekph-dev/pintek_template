const initUserObj = {
    id: null,
    email: '',
    password: '',
    lastName: '',
    firstName: '',
}
const initUser = {
    userArr: [],
    userErr: {
        email: '',
        password: '',
        lastName: '',
        firstName: '',
    },
    totalUsers: 0,
    userObj: initUserObj,
}

export {
    initUser
};