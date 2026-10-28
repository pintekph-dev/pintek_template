import useLogin from '@controllers/users/useLogin';
import Loader from '@components/reusables/RotatingLoader';
import CustomContainer from '@components/reusables/CustomContainer';
interface PropsDefinition {
  scss: { [key: string]: string }
}
const LoginForm = ({scss}: PropsDefinition) => {
    const {
        user,
        status,
        handleBlur,
        handleChange,
        handleResubmit,
        handleUserLogin,
    } = useLogin();
    const { loader } = status

    return (
        <form onSubmit={handleUserLogin} className={scss.formWrapper}>
            { loader && <Loader scss={scss} position='absolute' />}
            <div className={scss.cards}>
                <CustomContainer
                    scss={scss}
                    width={100}
                    label='Email'
                    required={true}
                    err={user.userErr.email as string}
                >
                    <input
                        type='text'
                        name='email'
                        autoComplete='off'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        value={user.userObj.email}
                    />
                </CustomContainer>
                <CustomContainer
                    scss={scss}
                    width={100}
                    label='Password'
                    required={true}
                    err={user.userErr.password as string}
                >
                    <input
                        type='password'
                        name='password'
                        autoComplete='off'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                        value={user.userObj.password}
                    />
                </CustomContainer>
            </div>
            <button type='submit' className={scss.button+' '+scss.btnblue} onKeyDown={handleResubmit}>
                Submit
            </button>
        </form>
    );
}
export default LoginForm;