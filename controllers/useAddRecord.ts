import useGlobal from '@controllers/global/useGlobal';
import { useState, ChangeEvent, SyntheticEvent } from 'react';
import ValidatorV3 from '@components/reusables/validation/ValidatorV3';

interface UserRecord {
    email: string;
    firstName: string;
    lastName: string;
}

interface GroupRecord {
    batch: string;
    users: UserRecord[];
}

const createEmptyUser = (): UserRecord => ({
    email: '',
    firstName: '',
    lastName: '',
});

const useAddRecord = () => {
    const {
        handleBlur,
        handleResubmit,
        handleRemoveErr,
    } = useGlobal();

    const [group, setGroup] = useState<GroupRecord>({
        batch: '',
        users: [createEmptyUser()],
    });

    const [err, setErr] = useState<GroupRecord>({
        batch: '',
        users: [createEmptyUser()],
    });

    const fieldValidations = {
        batch: {
            usename: 'Batch',
            required: true,
        },
        users: group.users.map(() => 
            (
                {
                    email: {
                        usename: 'Email',
                        required: true,
                        email: true,
                    },
                    firstName: {
                        usename: 'First Name',
                        required: true,
                    },
                    lastName: {
                        usename: 'Last Name',
                        required: true,
                    },
                }
            )
        ),
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement>,
        index?: number
    ) => {
        const { name, value } = e.currentTarget;

        if (name === 'batch') {
            setGroup(prev => ({
                ...prev,
                batch: value,
            }));

            setErr(prev => ({
                ...prev,
                batch: '',
            }));

            return;
        }

        if (index === undefined) return;

        setGroup(prev => ({
            ...prev,
            users: prev.users.map((user, i) =>
                i === index
                    ? { ...user, [name]: value }
                    : user
            ),
        }));

        setErr(prev => ({
            ...prev,
            users: prev.users.map((userErr, i) =>
                i === index
                    ? { ...userErr, [name]: '' }
                    : userErr
            ),
        }));
    };

    const handleAddUser = () => {
        setGroup(prev => ({
            ...prev,
            users: [...prev.users, createEmptyUser()],
        }));

        setErr(prev => ({
            ...prev,
            users: [...prev.users, createEmptyUser()],
        }));
    };

    const handleRemoveUser = (index: number) => {
        setGroup(prev => ({
            ...prev,
            users: prev.users.filter((_, i) => i !== index),
        }));

        setErr(prev => ({
            ...prev,
            users: prev.users.filter((_, i) => i !== index),
        }));
    };

    const handleAddRecord = async (
        e: SyntheticEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        const {
            validation_errors,
            validation_has_error,
            validation_errors_array,
        } = ValidatorV3(fieldValidations, group);

        if (validation_has_error) {
            setErr({
                batch: validation_errors?.batch ?? '',
                users: group.users.map((_, index) => ({
                    ...createEmptyUser(),
                    ...(validation_errors_array?.[index] ?? {}),
                })),
            } as GroupRecord)
            return;
        }

        setErr({
            batch: '',
            users: group.users.map(() => createEmptyUser()),
        });

        console.log('Submitting record:', group);

        // Continue with your API submission here.
    };

    return {
        group,
        err,
        setErr,
        handleBlur,
        handleChange,
        handleAddUser,
        handleResubmit,
        handleRemoveUser,
        handleAddRecord,
    };
};

export default useAddRecord;