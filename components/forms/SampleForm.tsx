import Loader from '@components/reusables/RotatingLoader';
import useSampleForm from "@controllers/sample/useSampleForm";
import CustomContainer from '@components/reusables/CustomContainer';
interface PropsDefinition {
  scss: { [key: string]: string }
}
const SampleForm = ({scss}: PropsDefinition) => {
    const {
        user,
        status,
        handleBlur,
        handleChange,
        handleFormSubmit
    } = useSampleForm()
    const { loader } = status
    return (
        <div className={scss.test}>
            <form onSubmit={handleFormSubmit} className={scss.formWrapper}>
                { loader && <Loader scss={scss} position='absolute' />}
                <div className={scss.cards}>
                    <CustomContainer
                        scss={scss}
                        width={50}
                        label='First Name'
                        required={true}
                        err={user.userErr.firstName as string}
                    >
                        <input
                            type='text'
                            name='firstName'
                            autoComplete='off'
                            onKeyUp={handleBlur}
                            onChange={handleChange}
                            value={user.userObj.firstName}
                        />
                    </CustomContainer>
                    <CustomContainer
                        scss={scss}
                        width={50}
                        label='Last Name'
                        required={true}
                        err={user.userErr.lastName as string}
                    >
                        <input
                            type='text'
                            name='lastName'
                            autoComplete='off'
                            onKeyUp={handleBlur}
                            onChange={handleChange}
                            value={user.userObj.lastName}
                        />
                    </CustomContainer>
                    <CustomContainer
                        scss={scss}
                        width={100}
                        label='Email Address'
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
                </div>
                
                <button type="submit" className={scss.button+' '+scss.btnblue}>
                    Submit Form {user.userObj.lastName}
                </button>
            </form>
        </div>
    );
}
export default SampleForm;