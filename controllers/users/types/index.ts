interface UserObj{
  id: number | null
  email: string
  password: string
  lastName: string
  firstName: string
}

interface User{
  userObj: UserObj
  userArr: UserObj[]
  userErr: Record<string, string | { value: string; }>
}

export type {
    User,
    UserObj,
}