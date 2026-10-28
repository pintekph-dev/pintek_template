
import useAddRecord from '@controllers/useAddRecord';
import CustomContainer from '@components/reusables/CustomContainer';

interface PropsDefinition {
    scss: { [key: string]: string };
}

const AddRecord = ({ scss }: PropsDefinition) => {
    const {
        err,
        group,
        handleBlur,
        handleChange,
        handleAddUser,
        handleResubmit,
        handleRemoveUser,
        handleAddRecord,
    } = useAddRecord();
    console.log(err)
    return (
        <form
            onSubmit={handleAddRecord}
            className={scss.formWrapper}
        >
            <div className={scss.cards}>
                <CustomContainer
                    scss={scss}
                    width={100}
                    label="Batch"
                    required={true}
                    err={err.batch}
                >
                    <input
                        type="text"
                        name="batch"
                        autoComplete="off"
                        value={group.batch}
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                    />
                </CustomContainer>

                <div className={`${scss.card} ${scss.w100}`}>
                    <button
                        type="button"
                        className={`${scss.button} ${scss.btnblue}`}
                        onClick={handleAddUser}
                    >
                        Add User
                    </button>

                    <div className={scss.cards}>
                        {group.users.map((user, index) => (
                            <div
                                key={index}
                                className={scss.cards}
                            >
                                <CustomContainer
                                    scss={scss}
                                    width={33}
                                    label={`User ${index + 1} Email`}
                                    required={true}
                                    err={err.users[index].email}
                                >
                                    <input
                                        type="text"
                                        name="email"
                                        autoComplete="off"
                                        onChange={e =>
                                            handleChange(e, index)
                                        }
                                        onKeyUp={handleBlur}
                                        value={user.email}
                                    />
                                </CustomContainer>

                                <CustomContainer
                                    scss={scss}
                                    width={33}
                                    label={`User ${index + 1} First Name`}
                                    required={true}
                                    err={err.users[index].firstName}
                                >
                                    <input
                                        type="text"
                                        name="firstName"
                                        autoComplete="off"
                                        onChange={e =>
                                            handleChange(e, index)
                                        }
                                        onKeyUp={handleBlur}
                                        value={user.firstName}
                                    />
                                </CustomContainer>

                                <CustomContainer
                                    scss={scss}
                                    width={33}
                                    label={`User ${index + 1} Last Name`}
                                    required={true}
                                    err={err.users[index].lastName}
                                >
                                    <input
                                        type="text"
                                        name="lastName"
                                        autoComplete="off"
                                        onChange={e =>
                                            handleChange(e, index)
                                        }
                                        onKeyUp={handleBlur}
                                        value={user.lastName}
                                    />
                                </CustomContainer>

                                {group.users.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveUser(index)
                                        }
                                        className={scss.button}
                                    >
                                        Remove User
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <button
                type="submit"
                onKeyDown={handleResubmit}
                className={`${scss.button} ${scss.btngreen}`}
            >
                Submit
            </button>
        </form>
    );
};

export default AddRecord;